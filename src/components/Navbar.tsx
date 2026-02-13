import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getLinkClasses = (path: string) =>
    isActive(path)
      ? "text-terracotta border-b-4 border-terracotta pb-1 font-semibold font-body"
      : "text-ink-light hover:text-terracotta hover:border-b-4 hover:border-terracotta-light border-b-4 border-transparent pb-1 transition-colors font-body";

  return (
    <nav className="bg-warm-white/90 backdrop-blur-sm shadow-warm-md fixed top-0 left-0 right-0 z-50 border-b border-border-light">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="StudyBuddy Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-2xl font-bold font-display text-ink">
              Study<span className="text-terracotta">Buddy</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/home" className={getLinkClasses("/home")}>
              Dashboard
            </Link>
            <Link
              to="/create-group"
              className={getLinkClasses("/create-group")}
            >
              Create Group
            </Link>
            <Link to="/find-group" className={getLinkClasses("/find-group")}>
              Groups
            </Link>
            <Link
              to="/discussion/create"
              className={getLinkClasses("/discussion/create")}
            >
              Create Discussion
            </Link>
            <Link to="/discussions" className={getLinkClasses("/discussions")}>
              Discussions
            </Link>
            <Link to="/todo" className={getLinkClasses("/todo")}>
              ToDo
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-ink-light font-medium font-body">{user.email}</span>
                <button
                  onClick={signOut}
                  className="bg-ink hover:bg-ink-light text-cream px-4 py-2 rounded-lg transition-colors font-medium active:scale-[0.98]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/signup"
                  className="bg-terracotta hover:bg-terracotta-light text-warm-white px-4 py-2 rounded-lg transition-colors font-medium active:scale-[0.98]"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-ink-light hover:text-terracotta px-4 py-2 font-medium transition-colors"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-wrap gap-2">
          <Link
            to="/home"
            className={`${getLinkClasses("/home")} text-sm px-2 py-1`}
          >
            Dashboard
          </Link>
          <Link
            to="/create-group"
            className={`${getLinkClasses("/create-group")} text-sm px-2 py-1`}
          >
            Create
          </Link>
          <Link
            to="/find-group"
            className={`${getLinkClasses("/find-group")} text-sm px-2 py-1`}
          >
            Groups
          </Link>
          <Link
            to="/discussion/create"
            className={`${getLinkClasses(
              "/discussion/create"
            )} text-sm px-2 py-1`}
          >
            Create Discussion
          </Link>
          <Link
            to="/discussions"
            className={`${getLinkClasses("/discussions")} text-sm px-2 py-1`}
          >
            Discuss
          </Link>
          <Link
            to="/todo"
            className={`${getLinkClasses("/todo")} text-sm px-2 py-1`}
          >
            ToDo
          </Link>
        </div>
      </div>
    </nav>
  );
};
