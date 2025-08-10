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
      queryClient.invalidateQueries({ queryKey: ["discussion_posts", discussionId] });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`discussion_posts:discussion_id=eq.${discussionId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "discussion_posts" }, () => {
        queryClient.invalidateQueries({ queryKey: ["discussion_posts", discussionId] });
      })
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
      <h3 className="text-2xl font-semibold text-slate-800">
        Posts ({posts.length})
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
          rows={3}
          placeholder="Share your thoughts..."
          required
        />
        <button
          type="submit"
          disabled={isPending || !newComment.trim()}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending ? "Adding..." : "Add Post"}
        </button>
      </form>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border-b border-slate-200 pb-2">
              <div className="text-slate-700">{post.content}</div>
              <div className="text-xs text-slate-500">{new Date(post.created_at).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            No posts yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};
