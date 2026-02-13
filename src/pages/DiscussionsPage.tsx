import { DiscussionList } from "../components/DiscussionList";

export const DiscussionsPage = () => {
  return (
    <div className="pt-20 animate-fade-in">
      <h2 className="text-5xl font-display font-extrabold mb-6 text-center text-ink">
        Discussions
      </h2>
      <DiscussionList />
    </div>
  );
};
