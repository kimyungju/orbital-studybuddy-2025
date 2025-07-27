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
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {comment.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-800">{comment.author}</span>
              <span className="text-slate-500 text-sm ml-2">
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>
          </div>
          
          {user?.id === comment.user_id && (
            <DeleteButton 
              postId={comment.id} 
              onDeleted={() => queryClient.invalidateQueries({ queryKey: ["comments", postId] })}
              isComment={true}
            />
          )}
        </div>
        
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-3">
          {comment.content}
        </p>
        
        {user && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>
        )}
        
        {showReplyForm && (
          <form onSubmit={handleReply} className="mt-4 space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
              placeholder="Write a reply..."
              rows={3}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending || !replyText.trim()}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {isPending ? "Replying..." : "Reply"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
                className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
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