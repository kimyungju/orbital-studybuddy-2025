import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { CommentItem } from "./CommentItem.tsx";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
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

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data as Comment[];
};

const buildCommentTree = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<number, Comment & { replies: Comment[] }>();
  const topLevelComments: (Comment & { replies: Comment[] })[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies.push(commentWithReplies);
      }
    } else {
      topLevelComments.push(commentWithReplies);
    }
  });

  return topLevelComments;
};

export const CommentSection = ({ postId }: Props) => {
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (comment: NewComment) =>
      createComment(
        comment,
        postId,
        user?.id,
        user?.user_metadata.user_name || user?.email || "Anonymous"
      ),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment({ content: newComment });
  };

  const commentTree = buildCommentTree(comments);

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="text-ink-light">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-display font-bold text-ink">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="comment" className="block mb-2 font-medium text-ink">
              Add a comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border-2 border-border bg-cream text-ink p-3 rounded-lg focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors placeholder:text-ink-faint"
              rows={3}
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !newComment.trim()}
            className="bg-terracotta text-warm-white px-6 py-2 rounded-lg hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? "Adding..." : "Add Comment"}
          </button>
        </form>
      ) : (
        <div className="text-center p-6 border border-amber-300 rounded-lg bg-amber-50">
          <p className="text-ink font-medium">Please log in to leave a comment.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              depth={0}
            />
          ))
        ) : (
          <div className="text-center py-8 text-ink-muted">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};