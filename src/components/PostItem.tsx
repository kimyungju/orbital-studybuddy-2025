import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group cursor-pointer animate-slide-up">
      <Link to={`/post/${post.id}`} className="block relative z-10 focus:outline-none focus:ring-4 focus:ring-terracotta/30 rounded-xl">
        <div className="w-80 h-76 bg-warm-white border border-border rounded-xl text-ink flex flex-col p-5 overflow-hidden transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-terracotta text-warm-white" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2 text-ink">
                {post.title}
              </div>
            </div>
            {/* Right arrow icon for clarity */}
            <span className="ml-auto text-terracotta group-hover:text-terracotta-dark transition-colors">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>

          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-xl object-cover max-h-[150px] mx-auto border border-border-light"
            />
          </div>
          <div className="flex justify-around items-center mt-2">
            <span className="cursor-pointer h-10 w-[60px] px-1 flex items-center justify-center font-semibold rounded-lg text-dusty-rose hover:bg-dusty-rose/10 transition-colors">
              ❤️ <span className="ml-2 text-ink-light">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-[60px] px-1 flex items-center justify-center font-semibold rounded-lg text-caramel hover:bg-caramel/10 transition-colors">
              💬 <span className="ml-2 text-ink-light">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
