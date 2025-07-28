import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

export const DiscussionPostCreate = ({ discussionId }: { discussionId: number }) => {
  const [content, setContent] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (message: string) => {
      const { data, error } = await supabase
        .from("discussion_posts")
        .insert({
          content: message,
          discussion_id: discussionId,
          created_at: new Date().toISOString(),
        });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussionPost", discussionId] });
      setContent("");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    mutate(content);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (content.trim()) mutate(content);
          }
        }}
        className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
        rows={4}
        placeholder="Type your message..."
        required
      />
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
      {isError && (
        <div className="text-red-700 text-sm mt-2 bg-red-100 p-3 rounded-lg border border-red-300">
          Error sending message: {error?.message}
        </div>
      )}
    </form>
  );
};