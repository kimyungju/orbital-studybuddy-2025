import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

interface DeleteButtonProps {
  postId: number;
  onDeleted?: () => void;
}

export const DeleteButton = ({ postId, onDeleted }: DeleteButtonProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("groups").delete().eq("id", postId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      if (onDeleted) onDeleted();
    },
  });

  return (
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this group?")) {
          mutate();
        }
      }}
      className="bg-transparent text-error border border-error/30 hover:bg-error-bg active:scale-[0.98] px-3 py-1 rounded mt-2 transition-colors"
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete Group"}
    </button>
  );
};