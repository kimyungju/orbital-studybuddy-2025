import { useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  title: string;
  date: string;
  location: string;
  content: string;
  image_url: string | null;
  avatar_url: string | null;
  user_id?: string | null;
}

const createGroup = async (post: PostInput, imageFile: File | null) => {
  let imageUrl = null;

  if (imageFile) {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
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

export const CreateGroup = () => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File | null }) => {
      return createGroup(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate({
      post: {
        title,
        date,
        location,
        content,
        image_url: null,
        avatar_url: user?.user_metadata.avatar_url || null,
        user_id: user?.id,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ink-light text-lg">Creating your group...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-warm-white p-8 rounded-xl shadow-warm-md border border-border">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium text-ink">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-border bg-cream text-ink p-3 rounded-xl focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors placeholder:text-ink-faint"
          placeholder="Enter group title..."
          required
        />
      </div>
      <div>
        <label htmlFor="date" className="block mb-2 font-medium text-ink">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-border bg-cream text-ink p-3 rounded-xl focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block mb-2 font-medium text-ink">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-border bg-cream text-ink p-3 rounded-xl focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors placeholder:text-ink-faint"
          placeholder="Where will you meet?"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium text-ink">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-border bg-cream text-ink p-3 rounded-xl focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors placeholder:text-ink-faint"
          rows={5}
          placeholder="Describe your study group..."
          required
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2 font-medium text-ink">
          Image (optional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border border-border bg-cream text-ink p-3 rounded-xl file:bg-terracotta file:text-warm-white file:border-none file:rounded file:px-4 file:py-2 file:mr-4 file:hover:bg-terracotta-light transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-terracotta text-warm-white px-6 py-3 rounded-xl hover:bg-terracotta-light active:scale-[0.98] transition-all duration-200 font-medium shadow-warm-md"
      >
        Create Group
      </button>
      {isError && (
        <div className="text-error text-sm mt-2 bg-error-bg p-3 rounded-xl border border-error/30">
          Error: {error?.message}
        </div>
      )}
    </form>
  );
};
