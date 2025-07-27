import { useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";


interface DiscussionPostInput {
  title: string;
  content: string;
  image_url: string | null;
  avatar_url: string | null;
  user_id?: string | null;
  discussion_id: number;
}

const createDiscussionPost = async (post: DiscussionPostInput, imageFile: File | null) => {
  let imageUrl = null;

  if (imageFile) {
    const filePath = `discussion-posts/${post.title}-${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    imageUrl = publicURLData.publicUrl;
  }

  const { data, error } = await supabase
    .from("groups")
    .insert({ ...post, image_url: imageUrl });

  if (error) throw new Error(error.message);

  return data;
};

interface DiscussionPostCreateProps {
  discussionId: number;
  discussionName: string;
  onPostCreated?: () => void;
}

export const DiscussionPostCreate = ({ discussionId, discussionName, onPostCreated }: DiscussionPostCreateProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { post: DiscussionPostInput; imageFile: File | null }) => {
      return createDiscussionPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      // Invalidate discussion posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["discussionPost", discussionId] });
      // Reset form
      setTitle("");
      setContent("");
      setSelectedFile(null);
      setIsFormOpen(false);
      // Call optional callback
      onPostCreated?.();
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    mutate({
      post: {
        title,
        content,
        image_url: null,
        avatar_url: user?.user_metadata.avatar_url || null,
        user_id: user?.id,
        discussion_id: discussionId,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6 border border-amber-300 rounded-lg bg-amber-50">
        <p className="text-slate-700 font-medium">Please log in to create posts in this discussion.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md"
        >
          + Create New Post in "{discussionName}"
        </button>
      ) : (
        <div className="border-2 border-slate-300 p-6 rounded-lg bg-white shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-slate-800">
            Add Post to "{discussionName}"
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-2 font-medium text-slate-800">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
                placeholder="Enter your post title..."
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block mb-2 font-medium text-slate-800">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
                rows={4}
                placeholder="Share your thoughts about this discussion..."
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block mb-2 font-medium text-slate-800">
                Image (optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg file:bg-emerald-500 file:text-white file:border-none file:rounded file:px-4 file:py-2 file:mr-4 file:hover:bg-emerald-600 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending || !title.trim() || !content.trim()}
                className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isPending ? "Creating..." : "Create Post"}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setTitle("");
                  setContent("");
                  setSelectedFile(null);
                }}
                className="bg-slate-500 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            {isError && (
              <div className="text-red-700 text-sm mt-2 bg-red-100 p-3 rounded-lg border border-red-300">
                Error creating post: {error?.message}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}; 