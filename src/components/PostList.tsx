import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { PostItem } from "./PostItem.tsx";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  // First try to get posts with counts, fallback to simple query
  try {
    const { data, error } = await supabase.rpc("get_posts_with_counts");
    if (!error && data) {
      return data as Post[];
    }
  } catch (rpcError) {
    console.log("RPC function not available, using fallback query");
  }

  // Fallback: Fetch posts directly from groups table
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Transform the data to match Post interface
  return (data || []).map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    created_at: post.created_at,
    user_id: post.user_id,
    image_url: post.image_url,
    avatar_url: post.avatar_url,
    like_count: 0, // Default for now
    comment_count: 0 // Default for now
  })) as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-600 text-lg">Loading study groups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          Error loading groups: {error.message}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-sky-200 rounded-lg bg-sky-50/50">
        <p className="text-slate-600 text-lg mb-2">
          No study groups available yet.
        </p>
        <p className="text-slate-500 text-sm">
          Be the first to create a study group!
        </p>
      </div>
    );
  }

  console.log("Loaded posts:", data);

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};