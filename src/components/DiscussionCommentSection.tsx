import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

interface Props {
  discussionId: number;
}

interface Post {
  id: number;
  discussion_id: number;
  content: string;
  created_at: string;
}

const fetchPosts = async (discussionId: number): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("discussion_posts")
    .select("*")
    .eq("discussion_id", discussionId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

const addPost = async (content: string, discussionId: number) => {
  const { error } = await supabase
    .from("discussion_posts")
    .insert({ content, discussion_id: discussionId });
  if (error) throw new Error(error.message);
};

export const DiscussionCommentSection = ({ discussionId }: Props) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["discussion_posts", discussionId],
    queryFn: () => fetchPosts(discussionId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (content: string) => addPost(content, discussionId),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({
        queryKey: ["discussion_posts", discussionId],
      });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`discussion_posts:discussion_id=eq.${discussionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "discussion_posts" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["discussion_posts", discussionId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [discussionId, queryClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    mutate(newComment);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-display font-semibold text-ink">
        Posts ({posts.length})
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border-2 border-border bg-cream text-ink p-3 rounded-xl focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors placeholder:text-ink-faint"
          rows={3}
          placeholder="Share your thoughts..."
          required
        />
        <button
          type="submit"
          disabled={isPending || !newComment.trim()}
          className="bg-terracotta text-warm-white px-6 py-2 rounded-xl hover:bg-terracotta-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium active:scale-[0.98]"
        >
          {isPending ? "Adding..." : "Add Post"}
        </button>
      </form>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border-b border-border pb-2">
              <div className="text-ink">{post.content}</div>
              <div className="text-xs text-ink-muted">
                {new Date(post.created_at).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-ink-muted">
            No posts yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};
