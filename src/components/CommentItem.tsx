import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "./CommentSection";
import { supabase } from "../supabaseClient";
import { DeleteButton } from "./DeleteButton";

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
): Promise<Comment> => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      ...newComment,
      post_id: postId,
      user_id: userId,
      author: author,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Comment;
};

interface Props {
  comment: Comment & { replies?: Comment[] };
  postId: number;
  depth: number;
}

export const CommentItem = ({ comment, postId, depth }: Props) => {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addReply, isPending } = useMutation({
    mutationFn: (reply: NewComment) =>
      createComment(
        reply,
        postId,
        user?.id,
        user?.user_metadata.user_name || user?.email || "Anonymous"
      ),
    onSuccess: () => {
      setReplyText("");
      setShowReplyForm(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addReply({ content: replyText, parent_comment_id: comment.id });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = diffInMs / (1000 * 60);
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = diffInHours / 24;
      return `${Math.floor(diffInDays)}d ago`;
    }
  };

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : "";

  return (
    <div className={`${indentClass} space-y-3`}>
      <div className="bg-warm-white backdrop-blur-sm border border-border rounded-lg p-4 shadow-warm-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-terracotta rounded-full flex items-center justify-center">
              <span className="text-warm-white text-sm font-semibold">
                {comment.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-display font-semibold text-ink">{comment.author}</span>
              <span className="text-ink-muted text-sm ml-2">
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>
          </div>
          
          {user?.id === comment.user_id && (
            <DeleteButton 
              postId={comment.id} 
              onDeleted={() => queryClient.invalidateQueries({ queryKey: ["comments", postId] })}
            />
          )}
        </div>
        
        <p className="text-ink leading-relaxed whitespace-pre-wrap mb-3">
          {comment.content}
        </p>
        
        {user && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-terracotta hover:text-terracotta-light text-sm font-medium transition-colors"
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>
        )}
        
        {showReplyForm && (
          <form onSubmit={handleReply} className="mt-4 space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border-2 border-border bg-cream text-ink p-3 rounded-lg focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors placeholder:text-ink-faint"
              placeholder="Write a reply..."
              rows={3}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending || !replyText.trim()}
                className="bg-terracotta text-warm-white px-4 py-2 rounded-lg hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {isPending ? "Replying..." : "Reply"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
                className="bg-ink-muted text-warm-white px-4 py-2 rounded-lg hover:bg-ink-light transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              postId={postId} 
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};