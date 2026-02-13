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
    className="bg-error-bg border border-error/30 text-error rounded-xl p-4"
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
    <div className="min-h-screen flex flex-col items-center pt-20 animate-fade-in">
      <h1 className="text-4xl font-display font-extrabold text-ink mb-12">Study Calendar</h1>
      <div className="bg-warm-white rounded-xl border border-border shadow-warm-md p-6 max-w-lg mx-auto">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Calendar
            locale="en"
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formattedDate = formatDate(date);
                const studyTime = dailyTimes[formattedDate] || 0;
                return studyTime > 0 ? (
                  <div className="text-xs text-center text-terracotta font-mono font-bold">
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
          className="px-6 py-3 bg-terracotta hover:bg-terracotta-light text-warm-white font-bold rounded-lg shadow-warm-md flex items-center active:scale-[0.98]"
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
