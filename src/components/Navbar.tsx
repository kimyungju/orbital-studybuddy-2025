import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getLinkClasses = (path: string) =>
    isActive(path)
      ? "text-sky-700 hover:text-sky-800 border-b-4 border-sky-600 pb-1 font-semibold"
      : "text-slate-600 hover:text-sky-700 hover:border-b-4 hover:border-sky-500 border-b-4 border-transparent pb-1 transition-colors";

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-sky-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="StudyBuddy Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-slate-700">
              Study<span className="text-sky-600">Buddy</span>
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
                <span className="text-slate-600 font-medium">{user.email}</span>
                <button
                  onClick={signOut}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/signup"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-sky-700 px-4 py-2 font-medium transition-colors"
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
