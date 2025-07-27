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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createDiscussion,
    onSuccess: () => {
      // Show success state
      setIsSuccess(true);
      
      // Reset form
      setName("");
      setDescription("");
      
      // Invalidate queries to refresh discussions list
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      
      // Navigate to discussions page after a brief delay to show success
      setTimeout(() => {
        navigate("/discussions");
      }, 1500);
    },
    onError: () => {
      setIsSuccess(false);
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSuccess(false);
    mutate({ name: name.trim(), description: description.trim() });
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border-2 border-emerald-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-emerald-700">
            Discussion Created Successfully!
          </h2>
          <p className="text-slate-600 text-lg mb-4">
            Your discussion has been created and you'll be redirected to the Discussions page shortly.
          </p>
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-600"></div>
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border-2 border-slate-300">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
        Create New Discussion
      </h2>
      
      <div>
        <label htmlFor="name" className="block mb-2 font-medium text-slate-800">
          Discussion Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className="w-full border-2 border-slate-300 bg-white text-slate-800 p-3 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder:text-slate-400"
          placeholder="Enter discussion topic..."
          required
          disabled={isPending}
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
          disabled={isPending}
        />
      </div>
      
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Creating Discussion...</span>
          </div>
        ) : (
          "Create Discussion"
        )}
      </button>
      
      {isError && (
        <div className="text-red-700 bg-red-100 p-4 rounded-lg border border-red-300">
          <p className="font-semibold mb-1">Error creating discussion</p>
          <p className="text-sm">{error?.message || "Please try again."}</p>
        </div>
      )}
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate("/discussions")}
          className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
          disabled={isPending}
        >
          ← Back to Discussions
        </button>
      </div>
    </form>
  );
};