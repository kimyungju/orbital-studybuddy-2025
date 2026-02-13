import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/"); // Redirect to home if already logged in
      } else {
        setCheckingSession(false); // Show login options
      }
    });
  }, [navigate]);

  const handleLoginWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error("GitHub login error:", error.message);
  };

  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error("Google login error:", error.message);
  };

  const handleLoginWithEmail = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Email login error:", error.message);
        alert("Login failed. Please check your email and password.");
      } else {
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard
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
        <Link to="/" className="text-terracotta underline hover:text-terracotta-light">
          &larr; Back
        </Link>
      </div>
      <div className="bg-warm-white rounded-xl border border-border shadow-warm-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-display font-semibold text-ink mb-6 text-center">
          Log In
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleLoginWithGitHub}
            className="w-full py-3 bg-ink hover:bg-ink-light text-cream font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Continue with GitHub
          </button>
          <button
            onClick={handleLoginWithGoogle}
            className="w-full py-3 bg-warm-white border border-border text-ink hover:shadow-warm-md font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Continue with Google
          </button>
          <button
            onClick={handleLoginWithEmail}
            className="w-full py-3 bg-terracotta hover:bg-terracotta-light text-warm-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            Continue with Email
          </button>
        </div>
        <div className="mt-6 text-center text-ink-light">
          New user?{" "}
          <Link to="/signup" className="text-terracotta hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
