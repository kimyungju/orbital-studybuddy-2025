import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Post } from "./PostList";
import { supabase } from "../supabaseClient";
import { LikeButton } from "./LikeButton.tsx";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { DeleteButton } from "./DeleteButton";

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

interface PostDetailProps {
  postId: number;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-600 text-lg">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-sky-200 p-8 space-y-6">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      
      {data?.image_url && (
        <div className="text-center">
          <img
            src={data.image_url}
            alt={data?.title}
            className="mt-4 rounded-lg object-cover w-full max-w-2xl mx-auto border border-sky-100 shadow-sm"
          />
        </div>
      )}
      
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
          {data?.content}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-sky-200">
        <p className="text-slate-500 text-sm">
          Posted on: {new Date(data!.created_at).toLocaleDateString()}
        </p>
        
        {user?.id === data?.user_id && (
          <DeleteButton postId={postId} onDeleted={() => navigate("/find-group")} />
        )}
      </div>
      
      <div className="flex gap-4 pt-4">
        <LikeButton postId={postId} />
      </div>
      
      <div className="pt-6 border-t border-sky-200">
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};