import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-sky-400 to-emerald-400 blur-sm opacity-0 group-hover:opacity-30 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-[20px] text-slate-700 flex flex-col p-5 overflow-hidden transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover border-2 border-sky-200"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-sky-500 to-emerald-500" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2 text-slate-700">
                {post.title}
              </div>
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto border border-sky-100"
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[60px] px-1 flex items-center justify-center font-semibold rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
              ❤️ <span className="ml-2 text-slate-600">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-[60px] px-1 flex items-center justify-center font-semibold rounded-lg text-sky-600 hover:bg-sky-50 transition-colors">
              💬 <span className="ml-2 text-slate-600">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};