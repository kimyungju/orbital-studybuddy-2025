import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex flex-col items-center pt-20">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome to StudyBuddy
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with fellow students, join study groups, and achieve your academic goals together.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-sky-200 p-6">
          <h2 className="text-3xl font-semibold mb-6 text-slate-700 text-center">
            Latest Study Groups
          </h2>
          <PostList />
        </div>
      </div>
    </div>
  );
};