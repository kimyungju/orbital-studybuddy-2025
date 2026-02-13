import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 animate-fade-in">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-extrabold mb-4 text-ink">
            Welcome to StudyBuddy
          </h1>
          <p className="text-ink-light text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with fellow students, join study groups, and achieve your academic goals together.
          </p>
        </div>

        <div className="bg-warm-white rounded-xl shadow-warm-sm border border-border p-6 transition-all duration-300 hover:-translate-y-0.5">
          <h2 className="text-3xl font-display font-extrabold mb-6 text-ink text-center">
            Latest Study Groups
          </h2>
          <PostList />
        </div>
      </div>
    </div>
  );
};