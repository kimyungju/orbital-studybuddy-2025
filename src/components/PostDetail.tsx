import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Post } from "./PostList";
import { supabase } from "../supabaseClient";
import { LikeButton } from "./LikeButton.tsx";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { DeleteButton } from "./DeleteButton";

const fetchPostById = async (id: number): Promise<Post> => {
  console.log("Fetching post with ID:", id);

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    throw new Error(`Failed to load post: ${error.message}`);
  }

  if (!data) {
    throw new Error("Post not found");
  }

  console.log("Fetched post data:", data);
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
    enabled: !!postId && !isNaN(postId),
    retry: (failureCount, error) => {
      // Don't retry if it's a "not found" error
      if (error.message.includes("not found")) return false;
      return failureCount < 2;
    },
  });

  // Handle invalid post ID
  if (!postId || isNaN(postId)) {
    return (
      <div className="text-center py-12">
        <div className="text-error bg-error-bg p-6 rounded-xl max-w-md mx-auto">
          Invalid post ID. Please check the URL and try again.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-ink-light text-lg">Loading post...</div>
        <div className="text-ink-muted text-sm mt-2">Post ID: {postId}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error bg-error-bg p-6 rounded-xl max-w-md mx-auto">
          <p className="font-semibold mb-2">Error loading post</p>
          <p className="text-sm">{error.message}</p>
          <p className="text-xs text-ink-muted mt-2">Post ID: {postId}</p>
          <button
            onClick={() => navigate("/find-group")}
            className="mt-4 bg-terracotta text-warm-white px-4 py-2 rounded-xl hover:bg-terracotta-light active:scale-[0.98] transition-all duration-200"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-ink-light bg-cream-dark p-6 rounded-xl max-w-md mx-auto">
          <p className="font-semibold mb-2">Post not found</p>
          <p className="text-sm">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/find-group")}
            className="mt-4 bg-terracotta text-warm-white px-4 py-2 rounded-xl hover:bg-terracotta-light active:scale-[0.98] transition-all duration-200"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  // Note: This component is for group posts, not discussion posts
  // Discussion posts are handled separately in DiscussionCommentSection

  return (
    <div className="max-w-4xl mx-auto bg-warm-white rounded-xl shadow-warm-md border border-border p-8 space-y-6 animate-fade-in">
      <h2 className="text-5xl font-display font-bold mb-6 text-center text-ink">
        {data.title}
      </h2>
      {/* Note: This component is for group posts, not discussion posts */}

      {data.image_url && (
        <div className="text-center">
          <img
            src={data.image_url}
            alt={data.title}
            className="mt-4 rounded-xl object-cover w-full max-w-2xl mx-auto border border-border-light shadow-warm-sm"
            onError={(e) => {
              console.log("Image failed to load:", data.image_url);
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="prose prose-slate max-w-none">
        <p className="text-ink text-lg leading-relaxed whitespace-pre-wrap">
          {data.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-ink-muted text-sm">
          Posted on: {new Date(data.created_at).toLocaleDateString()}
        </p>

        {user?.id === data.user_id && (
          <DeleteButton
            postId={postId}
            onDeleted={() => navigate("/find-group")}
          />
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <LikeButton postId={postId} />
      </div>

      <div className="pt-6 border-t border-border">
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};
