import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getLinkClasses = (path: string) =>
    isActive(path)
      ? "whitespace-nowrap text-terracotta font-semibold font-body"
      : "whitespace-nowrap text-ink-light hover:text-terracotta transition-colors font-body";

  const getDesktopLinkClasses = (path: string) => {
    const base =
      "relative h-full flex items-center " +
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px]";
    const underline = isActive(path)
      ? "after:bg-terracotta"
      : "after:bg-transparent hover:after:bg-terracotta-light";
    return `${base} ${getLinkClasses(path)} ${underline}`;
  };

  return (
    <nav className="bg-warm-white/90 backdrop-blur-sm shadow-warm-md fixed top-0 left-0 right-0 z-50 border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
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
          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-x-4 text-sm flex-nowrap h-full">
            <Link to="/home" className={getDesktopLinkClasses("/home")}>
              Dashboard
            </Link>
            <Link
              to="/create-group"
              className={getDesktopLinkClasses("/create-group")}
            >
              Create Group
            </Link>
            <Link to="/find-group" className={getDesktopLinkClasses("/find-group")}>
              Groups
            </Link>
            <Link
              to="/discussion/create"
              className={getDesktopLinkClasses("/discussion/create")}
            >
              Create Discussion
            </Link>
            <Link to="/discussions" className={getDesktopLinkClasses("/discussions")}>
              Discussions
            </Link>
            <Link to="/todo" className={getDesktopLinkClasses("/todo")}>
              ToDo
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4 shrink-0">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-ink-light font-medium font-body max-w-[150px] truncate">{user.email}</span>
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
        <div className="lg:hidden mt-4 flex flex-wrap gap-2">
          <Link
            to="/home"
            className={`${getLinkClasses("/home")} text-sm px-2 py-1 ${isActive("/home") ? "border-b-2 border-terracotta" : "border-b-2 border-transparent"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/create-group"
            className={`${getLinkClasses("/create-group")} text-sm px-2 py-1 ${isActive("/create-group") ? "border-b-2 border-terracotta" : "border-b-2 border-transparent"}`}
          >
            Create
          </Link>
          <Link
            to="/find-group"
            className={`${getLinkClasses("/find-group")} text-sm px-2 py-1 ${isActive("/find-group") ? "border-b-2 border-terracotta" : "border-b-2 border-transparent"}`}
          >
            Groups
          </Link>
          <Link
            to="/discussion/create"
            className={`${getLinkClasses("/discussion/create")} text-sm px-2 py-1 ${isActive("/discussion/create") ? "border-b-2 border-terracotta" : "border-b-2 border-transparent"}`}
          >
            Create Discussion
          </Link>
          <Link
            to="/discussions"
            className={`${getLinkClasses("/discussions")} text-sm px-2 py-1 ${isActive("/discussions") ? "border-b-2 border-terracotta" : "border-b-2 border-transparent"}`}
          >
            Discuss
          </Link>
          <Link
            to="/todo"
            className={`${getLinkClasses("/todo")} text-sm px-2 py-1 ${isActive("/todo") ? "border-b-2 border-terracotta" : "border-b-2 border-transparent"}`}
          >
            ToDo
          </Link>
        </div>
      </div>
    </nav>
  );
};
