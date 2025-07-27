import { PostList } from "../components/PostList";

export const FindGroupPage = () => {
  return (
    <div className="pt-20">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
          Study Groups
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Discover and join study groups that match your interests and goals.
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <PostList />
      </div>
    </div>
  );
};

//export default FindGroupPage;
// This component fetches and displays a list of available groups