import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ErrorBoundary } from "react-error-boundary";
import { useAuth } from "../context/AuthContext";

const ErrorFallback = ({ error }: { error: Error }) => (
  <div
    role="alert"
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
  >
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline">{error.message}</span>
  </div>
);

export const CalendarPage = () => {
  const { user } = useAuth();
  const [dailyTimes, setDailyTimes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchStudyTimes = async () => {
      if (!user) {
        setDailyTimes({});
        return;
      }
      try {
        const { data, error } = await supabase
          .from("study_times")
          .select("date, time_spent")
          .eq("user_id", user.id);

        if (error) {
          console.error("Supabase error:", error.message, error.details);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No study times found in Supabase.");
          console.log("Supabase response:", data); // Log response for debugging
          return;
        }

        console.log("Fetched study times:", data);

        const times = data.reduce(
          (
            acc: { [key: string]: number },
            { date, time_spent }: { date: string; time_spent: number }
          ) => {
            acc[date] = (acc[date] || 0) + time_spent;
            return acc;
          },
          {}
        );

        setDailyTimes(times);
      } catch (err) {
        console.error("Error fetching study times:", err);
      }
    };

    fetchStudyTimes();
  }, [user]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // Formats date as YYYY-MM-DD
  };

  const formatStudyTime = (seconds: number) => {
    if (seconds >= 60) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-600 to-purple-500 flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold text-white mb-12">Study Calendar</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Calendar
            locale="en"
            tileClassName={({ date, view }) => {
              const currentDate = formatDate(new Date());
              if (view === "month" && formatDate(date) === currentDate) {
                return "bg-yellow-500 text-black font-bold rounded-lg";
              }
              return "text-gray-900"; // Make other dates darker
            }}
            className="text-gray-900" // Make year and days of the week darker
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formattedDate = formatDate(date);
                const studyTime = dailyTimes[formattedDate] || 0;
                return studyTime > 0 ? (
                  <div className="text-xs text-center text-blue-700 font-bold">
                    {formatStudyTime(studyTime)}
                  </div>
                ) : null;
              }
              return null;
            }}
          />
        </ErrorBoundary>
      </div>
      <div className="mt-12">
        <Link
          to="/timer"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center"
        >
          <span className="mr-2">
            <i className="fas fa-clock"></i>
          </span>
          Go to Timer
        </Link>
      </div>
    </div>
  );
};
