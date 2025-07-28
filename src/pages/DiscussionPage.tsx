import { useParams } from "react-router-dom";
import { DiscussionCommentSection } from "../components/DiscussionCommentSection";

export const DiscussionPage = () => {
  const { id } = useParams<{ id: string }>();

  const discussionId = id ? parseInt(id) : NaN;

  if (isNaN(discussionId)) {
    return <div>Invalid discussion ID</div>;
  }

  return (
    <div className="pt-20">
      <DiscussionCommentSection discussionId={discussionId} />
    </div>
  );
};