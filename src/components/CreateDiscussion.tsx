import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

interface DiscussionInput {
  name: string;
  description: string;
}

const createDiscussion = async (discussion: DiscussionInput) => {
  const { data, error } = await supabase
    .from("discussions")
    .insert(discussion);

  if (error) throw new Error(error.message);
  return data;
};

export const CreateDiscussion = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      navigate("/discussions");
    },
  });
  
// Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border-2 border-slate-300">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
        Create New Discussion
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium text-slate-800">
          Discussion Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
          placeholder="Enter discussion topic..."
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium text-slate-800">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
          rows={4}
          placeholder="Describe what this discussion is about..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md"
      >
        {isPending ? "Creating..." : "Create Discussion"}
      </button>
      {isError && (
        <p className="text-red-700 bg-red-100 p-3 rounded-lg text-center border border-red-300">
          Error creating discussion. Please try again.
        </p>
      )}
    </form>
  );
};