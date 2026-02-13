import { useParams } from "react-router-dom";
import { DiscussionCommentSection } from "../components/DiscussionCommentSection";

export const DiscussionPage = () => {
  const { id } = useParams<{ id: string }>();

  const discussionId = id ? parseInt(id) : NaN;

  if (isNaN(discussionId)) {
    return <div className="text-ink-muted">Invalid discussion ID</div>;
  }

  return (
    <div className="pt-20 animate-fade-in">
      <DiscussionCommentSection discussionId={discussionId} />
    </div>
  );
};
