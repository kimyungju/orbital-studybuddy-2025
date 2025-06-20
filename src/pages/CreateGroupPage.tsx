import { CreateGroup } from "../components/CreateGroup";

export const CreateGroupPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Group
      </h2>
      <CreateGroup />
    </div>
  );
};