import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/home");              // Redirect to home if session exists
      } else {
        setCheckingSession(false);  // No session found, show landing page
      }
    });
  }, [navigate]);

  if (checkingSession) {        // Don’t render Home’s UI until we know whether a session exists
        return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Checking authentication…</p> // While checking session, show a loading state
      </div>
    );
  }

  // Only rendered if no session found
  // This is the landing page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 text-center">
          Study<span className="text-indigo-600"> Buddy</span>
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your one-stop place to organize, review, and collaborate on study materials.
        </p>
          <div className="branding-container mb-6">
            <img
              src="/logo.jpg"
            alt="Study Buddy Branding"
            className="w-32 md:w-40 lg:w-48 h-auto mx-auto rounded-xl shadow-md"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="w-64 py-3 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white font-semibold rounded-lg transition"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};
