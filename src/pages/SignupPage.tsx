import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/"); // Redirect to home if already logged in
      } else {
        setCheckingSession(false); // Show sign up options
      }
    });
  }, [navigate]);

  const handleSignUpWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
    if (error) console.error("GitHub sign up error:", error.message);
  };

  const handleSignUpWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) console.error("Google sign up error:", error.message);
  };

  const handleSignUpWithEmail = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (email && password) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Sign-up error:", error.message);
        alert("Sign-up failed. Please try again.");
      } else {
        alert("Sign-up successful! You can now log in.");
        navigate("/login");
      }
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-light">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute top-8 left-8">
        <Link to="/login" className="text-terracotta underline hover:text-terracotta-light">
          &larr; Back to Log In
        </Link>
      </div>
      <div className="bg-warm-white rounded-xl border border-border shadow-warm-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-display font-semibold text-ink mb-6 text-center">
          Sign Up
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSignUpWithGitHub}
            className="w-full py-3 bg-ink hover:bg-ink-light text-cream font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Sign Up with GitHub
          </button>
          <button
            onClick={handleSignUpWithGoogle}
            className="w-full py-3 bg-warm-white border border-border text-ink hover:shadow-warm-md font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Sign Up with Google
          </button>
          <button
            onClick={handleSignUpWithEmail}
            className="w-full py-3 bg-terracotta hover:bg-terracotta-light text-warm-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Sign Up with Email
          </button>
        </div>
        <div className="mt-6 text-center text-ink-light">
          Already have an account?{" "}
          <Link to="/login" className="text-terracotta hover:underline font-semibold">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
