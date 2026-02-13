import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

// Define the Discussion type
export interface Discussion {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
export const fetchDiscussions = async (): Promise<Discussion[]> => {
  const { data, error } = await supabase
    .from("discussions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Discussion[];
};

export const DiscussionList = () => {
  const { data, error, isLoading } = useQuery<Discussion[], Error>({
    queryKey: ["discussions"],
    queryFn: fetchDiscussions,
  });

  if (isLoading)
    return <div className="text-center py-4 text-ink-muted">Loading discussions...</div>;
  if (error)
    return (
      <div className="text-center text-error py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((discussion) => (
        <div
          key={discussion.id}
          className="bg-warm-white border border-border rounded-xl p-4 hover:shadow-warm-md transition-all duration-300 hover:-translate-y-0.5"
        >
          <Link
            to={`/discussion/${discussion.id}`}
            className="text-2xl font-bold text-terracotta hover:underline"
          >
            {discussion.name}
          </Link>
          <p className="text-ink-muted mt-2">{discussion.description}</p>
        </div>
      ))}
    </div>
  );
};
