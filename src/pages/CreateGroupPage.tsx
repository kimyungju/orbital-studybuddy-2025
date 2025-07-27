import { CreateGroup } from "../components/CreateGroup";

export const CreateGroupPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
        Create Study Group
      </h2>
      <CreateGroup />
    </div>
  );
};