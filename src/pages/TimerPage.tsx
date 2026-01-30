import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export const TimerPage = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("en-CA");

  const storageKeyPrefix = user?.id ? `user-${user.id}` : "anon";
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState("");
  const [activeSubject, setActiveSubject] = useState("");
  const [subjectTimes, setSubjectTimes] = useState<{ [key: string]: number }>(
    JSON.parse(
      localStorage.getItem(`subjectTimes-${storageKeyPrefix}-${currentDate}`) || "{}"
    )
  );
  const [dailyTimes, setDailyTimes] = useState<{ [key: string]: number }>(
    JSON.parse(
      localStorage.getItem(`dailyTimes-${storageKeyPrefix}-${currentDate}`) || "{}"
    )
  );

  const handleStart = () => {
    if (activeSubject) {
      setIsRunning(true);
    }
  };

  const handleStop = async () => {
    setIsRunning(false);

    if (activeSubject && time > 0) {
      if (!user) return;
      console.log("Stopping timer for:", currentDate, "Subject:", activeSubject, "Time:", time);

      try {
        const { data: existingData, error: fetchError } = await supabase
          .from("study_times")
          .select("id, time_spent")
          .eq("date", currentDate)
          .eq("subject", activeSubject)
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Fetch error:", fetchError.message);
          return;
        }

        const existingTime = existingData?.time_spent || 0;
        const totalTime = existingTime + time;

        if (existingData) {
          const { error: updateError } = await supabase
            .from("study_times")
            .update({ time_spent: totalTime })
            .eq("id", existingData.id)
            .eq("user_id", user.id);

          if (updateError) {
            console.error("Update failed:", updateError.message);
          } else {
            console.log("Updated", activeSubject, "→", totalTime);
          }
        } else {
          const { error: insertError } = await supabase
            .from("study_times")
            .insert([
              {
                date: currentDate,
                subject: activeSubject,
                time_spent: time,
                user_id: user.id,
              },
            ]);

          if (insertError) {
            console.error("Insert failed:", insertError.message);
          } else {
            console.log("Inserted new subject:", activeSubject, "→", time);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  };

  const handleReset = () => {
    if (activeSubject) {
      const updatedSubjectTimes = { ...subjectTimes, [activeSubject]: 0 };
      setSubjectTimes(updatedSubjectTimes);
      localStorage.setItem(
        `subjectTimes-${storageKeyPrefix}-${currentDate}`,
        JSON.stringify(updatedSubjectTimes)
      );
    }
    setTime(0);
    setIsRunning(false);
  };

  const handleSubjectKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subject.trim()) {
      if (!subjectTimes[subject]) {
        const updatedSubjectTimes = { ...subjectTimes, [subject]: 0 };
        setSubjectTimes(updatedSubjectTimes);
        localStorage.setItem(
          `subjectTimes-${storageKeyPrefix}-${currentDate}`,
          JSON.stringify(updatedSubjectTimes)
        );
      }
      setSubject(""); // Clear the input field after pressing Enter
    }
  };

  const handleDeleteSubject = (subjectToDelete: string) => {
    const updatedSubjectTimes = { ...subjectTimes };
    delete updatedSubjectTimes[subjectToDelete];
    setSubjectTimes(updatedSubjectTimes);
    localStorage.setItem(
      `subjectTimes-${storageKeyPrefix}-${currentDate}`,
      JSON.stringify(updatedSubjectTimes)
    );
    if (activeSubject === subjectToDelete) {
      setActiveSubject("");
      setTime(0);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const localSubjects = localStorage.getItem(
      `subjectTimes-${storageKeyPrefix}-${currentDate}`
    );
    const localDaily = localStorage.getItem(
      `dailyTimes-${storageKeyPrefix}-${currentDate}`
    );

    // Only fetch if no localStorage for today
    if (!localSubjects || !localDaily) {
      supabase
        .from("study_times")
        .select("subject, time_spent")
        .eq("date", currentDate)
        .eq("user_id", user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching subjects from Supabase:", error.message);
            return;
          }

          if (data && data.length > 0) {
            const restoredSubjects = data.reduce((acc: { [key: string]: number }, entry) => {
              acc[entry.subject] = entry.time_spent;
              return acc;
            }, {});

            setSubjectTimes(restoredSubjects);
            localStorage.setItem(
              `subjectTimes-${storageKeyPrefix}-${currentDate}`,
              JSON.stringify(restoredSubjects)
            );

            const totalDailyTime = data.reduce((acc: number, entry) => acc + entry.time_spent, 0);
            const updatedDailyTimes = { [currentDate]: totalDailyTime };
            setDailyTimes(updatedDailyTimes);
            localStorage.setItem(
              `dailyTimes-${storageKeyPrefix}-${currentDate}`,
              JSON.stringify(updatedDailyTimes)
            );
          }
        });
    }
  }, [currentDate, storageKeyPrefix, user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && activeSubject) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, activeSubject]);

  useEffect(() => {
    if (!isRunning && activeSubject && time > 0) {
      const updatedSubjectTimes = {
        ...subjectTimes,
        [activeSubject]: (subjectTimes[activeSubject] || 0) + time,
      };
      setSubjectTimes(updatedSubjectTimes);
      localStorage.setItem(
        `subjectTimes-${storageKeyPrefix}-${currentDate}`,
        JSON.stringify(updatedSubjectTimes)
      );

      const updatedDailyTimes = {
        ...dailyTimes,
        [currentDate]: (dailyTimes[currentDate] || 0) + time,
      };
      setDailyTimes(updatedDailyTimes);
      localStorage.setItem(
        `dailyTimes-${storageKeyPrefix}-${currentDate}`,
        JSON.stringify(updatedDailyTimes)
      );

      setTime(0);
    }
  }, [isRunning, activeSubject, time]);

  const totalStudyTime = Object.values(subjectTimes).reduce((acc, curr) => acc + curr, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Record Study Time</h1>
      <div className="flex justify-between items-start w-full max-w-5xl gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Enter Subject</h2>
          <input
            type="text"
            placeholder="Enter subject and press Enter"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyPress={handleSubjectKeyPress}
            className="px-4 py-2 rounded-lg shadow-md text-gray-900 w-full mb-6"
          />
          <div className="text-center mb-6">
            <div className="text-2xl font-bold mb-4 text-gray-900">
              Active Subject: <span className="text-blue-700">{activeSubject || "None"}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              Time: <span className="text-green-700">{formatTime(time)}</span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Timer Controls</h2>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleStart}
                disabled={!activeSubject || isRunning}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md"
              >
                Start
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md"
              >
                Stop
              </button>
              <button
                onClick={handleReset}
                disabled={!activeSubject}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Time Spent Per Subject</h2>
          <ul>
            {Object.entries(subjectTimes).map(([subject, time]) => (
              <li key={subject} className="text-lg mb-2 flex justify-between items-center">
                <span>
                  <span className="font-bold text-gray-900">{subject}:</span> <span className="text-gray-900">{formatTime(time)}</span>
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveSubject(subject)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md text-sm"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-lg font-bold text-center text-gray-900">
            Total Study Time: <span className="text-blue-700">{formatTime(totalStudyTime)}</span>
          </div>
        </div>
      </div>
      <div className="mt-12 flex space-x-4">
        <Link
          to="/calendar"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center"
        >
          <span className="mr-2">
            <i className="fas fa-calendar-alt"></i>
          </span>
          Go to Calendar
        </Link>
        <Link
          to="/todo"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md flex items-center"
        >
          <span className="mr-2">
            <i className="fas fa-tasks"></i>
          </span>
          Go to To-Do List
        </Link>
      </div>
    </div>
  );
};