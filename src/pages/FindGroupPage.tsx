import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const fetchGroups = async () => {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const FindGroupPage = () => {
  const { data: groups, isLoading, isError } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Available Groups
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-7xl w-full mx-auto">
        {isLoading && <div className="text-black">Loading...</div>}
        {isError && <div className="text-red-500">Failed to load groups.</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groups && groups.map((group: any) => (
            <Link
              key={group.id}
              to={`/group/${group.id}`}
              className="border rounded-lg p-4 text-black shadow hover:shadow-lg transition block"
            >
              <div className="font-bold text-lg mb-2">{group.title}</div>
              <div className="text-sm text-gray-600 mb-1">{group.location}</div>
              <div className="text-xs text-gray-400 mb-2">{group.date}</div>
              <div className="text-sm">{group.content}</div>
            </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

//export default FindGroupPage;
// This component fetches and displays a list of available groups