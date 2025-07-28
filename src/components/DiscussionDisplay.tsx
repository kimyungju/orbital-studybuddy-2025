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
    return <div className="text-center py-8">Invalid discussion ID.</div>;
  }

  if (postsLoading)
    return <div className="text-center py-8 text-slate-600">Loading discussion...</div>;

  if (postsError)
    return (
      <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg">
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
              <div key={post.id} className="bg-slate-100 p-3 rounded-lg shadow-sm">
                <div>{post.content}</div>
                <div className="text-xs text-slate-400 text-right">
                  {new Date(post.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-sky-200 rounded-lg bg-sky-50/50">
            <p className="text-slate-600 text-lg mb-2">No messages yet.</p>
            <p className="text-slate-500 text-sm">Be the first to send a message!</p>
          </div>
        )}
      </div>
    </div>
  );
};