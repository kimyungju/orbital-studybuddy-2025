import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LandingPage = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to home
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome back to StudyBuddy!
          </h1>
          <Link
            to="/home"
            className="bg-gradient-to-r from-sky-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
          StudyBuddy
        </h1>
        
        <p className="text-2xl text-slate-600 mb-8 leading-relaxed">
          Connect with fellow students, join study groups, and achieve your academic goals together.
        </p>
        
        <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Create or join study groups, track your progress, manage your tasks, and collaborate 
          with peers in a stress-free, supportive learning environment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-gradient-to-r from-sky-600 to-emerald-600 text-white px-8 py-4 rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all duration-200 font-medium text-lg shadow-md"
          >
            Get Started
          </Link>
          
          <Link
            to="/login"
            className="bg-white/70 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-lg hover:bg-white border border-sky-200 transition-all duration-200 font-medium text-lg shadow-sm"
          >
            Sign In
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-sky-100">
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Study Groups</h3>
            <p className="text-slate-600">Create and join study groups for collaborative learning</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-emerald-100">
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Discussions</h3>
            <p className="text-slate-600">Engage in topic-focused discussions with peers</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-amber-100">
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Productivity Tools</h3>
            <p className="text-slate-600">Track time, manage tasks, and plan your studies</p>
          </div>
        </div>
      </div>
    </div>
  );
};
