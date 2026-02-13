import { CreateGroup } from "../components/CreateGroup";

export const CreateGroupPage = () => {
  return (
    <div className="pt-20 animate-fade-in">
      <h2 className="text-5xl font-display font-extrabold mb-6 text-center text-ink">
        Create Study Group
      </h2>
      <CreateGroup />
    </div>
  );
};