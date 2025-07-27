import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabaseClient";
import { PostItem } from "./PostItem";
import { DiscussionPostCreate } from "./DiscussionPostCreate";

interface Props {
  discussionId: number;
}

interface PostWithDiscussion extends Post {
  discussions: {
    name: string;
  };
}

interface Discussion {
  id: number;
  name: string;
  description: string;
}

export const fetchDiscussionPost = async (
  discussionId: number
): Promise<PostWithDiscussion[]> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*, discussions(name)")
    .eq("discussion_id", discussionId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithDiscussion[];
};

const fetchDiscussion = async (discussionId: number): Promise<Discussion> => {
  const { data, error } = await supabase
    .from("discussions")
    .select("*")
    .eq("id", discussionId)
    .single();

  if (error) throw new Error(error.message);
  return data as Discussion;
};

export const DiscussionDisplay = ({ discussionId }: Props) => {
  const { data: posts, error: postsError, isLoading: postsLoading } = useQuery<PostWithDiscussion[], Error>({
    queryKey: ["discussionPost", discussionId],
    queryFn: () => fetchDiscussionPost(discussionId),
  });

  const { data: discussion, error: discussionError, isLoading: discussionLoading } = useQuery<Discussion, Error>({
    queryKey: ["discussion", discussionId],
    queryFn: () => fetchDiscussion(discussionId),
  });

  if (postsLoading || discussionLoading)
    return <div className="text-center py-8 text-slate-600">Loading discussion...</div>;
  
  if (postsError || discussionError)
    return (
      <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg">
        Error: {postsError?.message || discussionError?.message}
      </div>
    );

  const discussionName = discussion?.name || (posts && posts[0]?.discussions?.name) || "Discussion";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
          {discussionName}
        </h2>
        {discussion?.description && (
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {discussion.description}
          </p>
        )}
      </div>

      {/* Post Creation Component */}
      <DiscussionPostCreate 
        discussionId={discussionId} 
        discussionName={discussionName}
      />

      {/* Posts List */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-slate-700">
          Discussion Posts ({posts?.length || 0})
        </h3>

        {posts && posts.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-sky-200 rounded-lg bg-sky-50/50">
            <p className="text-slate-600 text-lg mb-2">
              No posts in this discussion yet.
            </p>
            <p className="text-slate-500 text-sm">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};