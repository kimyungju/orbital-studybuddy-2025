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
        <div className="text-slate-600 text-lg">Creating your group...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border-2 border-slate-300">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium text-slate-800">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
          placeholder="Enter group title..."
          required
        />
      </div>
      <div>
        <label htmlFor="date" className="block mb-2 font-medium text-slate-800">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block mb-2 font-medium text-slate-800">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
          placeholder="Where will you meet?"
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
          rows={5}
          placeholder="Describe your study group..."
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
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md"
      >
        Create Group
      </button>
      {isError && (
        <div className="text-red-700 text-sm mt-2 bg-red-100 p-3 rounded-lg border border-red-300">
          Error: {error?.message}
        </div>
      )}
    </form>
  );
};