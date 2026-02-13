import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LandingPage = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to home
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center">
          <h1 className="text-5xl font-display font-extrabold mb-6 text-ink">
            Welcome back to StudyBuddy!
          </h1>
          <Link
            to="/home"
            className="bg-terracotta text-warm-white px-8 py-3 rounded-lg hover:bg-terracotta-light active:scale-[0.98] transition-all duration-200 font-medium shadow-warm-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-display font-extrabold mb-6 text-ink">
          StudyBuddy
        </h1>

        <p className="text-2xl text-ink-light mb-8 leading-relaxed">
          Connect with fellow students, join study groups, and achieve your academic goals together.
        </p>

        <p className="text-lg text-ink-muted mb-12 max-w-2xl mx-auto leading-relaxed">
          Create or join study groups, track your progress, manage your tasks, and collaborate
          with peers in a stress-free, supportive learning environment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-terracotta hover:bg-terracotta-light text-warm-white px-8 py-4 rounded-lg active:scale-[0.98] transition-all duration-200 font-medium text-lg shadow-warm-md"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="bg-warm-white border border-border text-ink px-8 py-4 rounded-lg hover:shadow-warm-md transition-all duration-200 font-medium text-lg shadow-warm-sm"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-warm-white p-6 rounded-xl border border-border shadow-warm-sm animate-slide-up transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="text-xl font-semibold text-ink mb-3">Study Groups</h3>
            <p className="text-ink-light">Create and join study groups for collaborative learning</p>
          </div>

          <div className="bg-warm-white p-6 rounded-xl border border-border shadow-warm-sm animate-slide-up [animation-delay:100ms] transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="text-xl font-semibold text-ink mb-3">Discussions</h3>
            <p className="text-ink-light">Engage in topic-focused discussions with peers</p>
          </div>

          <div className="bg-warm-white p-6 rounded-xl border border-border shadow-warm-sm animate-slide-up [animation-delay:200ms] transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="text-xl font-semibold text-ink mb-3">Productivity Tools</h3>
            <p className="text-ink-light">Track time, manage tasks, and plan your studies</p>
          </div>
        </div>
      </div>
    </div>
  );
};
