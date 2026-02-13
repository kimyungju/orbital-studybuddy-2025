import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { DiscussionPostCreate } from "./DiscussionPostCreate";

interface Props {
  discussionId: number;
}

export const DiscussionDisplay = ({ discussionId }: Props) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime:discussion_posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "discussion_posts", filter: `discussion_id=eq.${discussionId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["discussionPost", discussionId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [discussionId]);

  const { data: posts, error: postsError, isLoading: postsLoading } = useQuery({
    queryKey: ["discussionPost", discussionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_posts")
        .select("*")
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (!discussionId) {
    return <div className="text-center py-8 text-ink-muted">Invalid discussion ID.</div>;
  }

  if (postsLoading)
    return <div className="text-center py-8 text-ink-light">Loading discussion...</div>;

  if (postsError)
    return (
      <div className="text-center text-error py-8 bg-error-bg rounded-xl">
        Error: {postsError.message}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Creation Component */}
      <DiscussionPostCreate discussionId={discussionId} />

      {/* Posts List */}
      <div>
        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-warm-white p-3 rounded-xl border border-border shadow-warm-sm">
                <div className="text-ink">{post.content}</div>
                <div className="text-xs text-ink-muted text-right">
                  {new Date(post.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-cream">
            <p className="text-ink-light text-lg mb-2">No messages yet.</p>
            <p className="text-ink-muted text-sm">Be the first to send a message!</p>
          </div>
        )}
      </div>
    </div>
  );
};
