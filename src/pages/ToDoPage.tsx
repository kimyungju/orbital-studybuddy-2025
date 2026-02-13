import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export const ToDoPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<
    { id: number; text: string; link?: string }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  const [newLink, setNewLink] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) {
        setTasks([]);
        return;
      }
      // load Todos
      const { data: allTodos, error: todosError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);
      if (todosError) return console.error(todosError);
      const todosArr = allTodos ?? [];
      setTasks(
        todosArr
          .filter((t) => t.group_id === null)
          .map(({ id, text, link }) => ({ id, text, link }))
      );

      // load Groups
      const { error: groupsError } = await supabase
        .from("todo-groups")
        .select("*")
        .eq("user_id", user.id);
      if (groupsError) return console.error(groupsError);
    })();
  }, [user]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    if (!user) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTask, link: newLink || null, user_id: user.id }])
      .select();
    if (error) return console.error(error);
    const inserted = data![0];
    setTasks([
      ...tasks,
      { id: inserted.id, text: inserted.text, link: inserted.link },
    ]);
    setNewTask("");
    setNewLink("");
  };

  const handleToggleTaskSelection = (id: number) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id);
    if (error) return console.error(error);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 overflow-y-auto animate-fade-in">
      <h1 className="text-4xl font-display font-extrabold text-ink mb-12">To-Do List</h1>
      <div className="flex justify-between items-start w-full max-w-5xl gap-8">
        {/* Add a Task Section */}
        <div className="bg-warm-white rounded-xl border border-border shadow-warm-md p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4 text-ink">Add a Task</h2>
          <input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-warm-sm text-lg w-full mb-4 text-ink border-border bg-cream focus:ring-terracotta/30 focus:border-terracotta placeholder:text-ink-faint"
          />
          <input
            type="text"
            placeholder="Enter link (optional)"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-warm-sm text-lg w-full mb-4 text-ink border-border bg-cream focus:ring-terracotta/30 focus:border-terracotta placeholder:text-ink-faint"
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-sage hover:bg-sage-dark text-warm-white font-bold rounded-lg shadow-warm-sm w-full active:scale-[0.98]"
          >
            Add Task
          </button>
        </div>

        {/* Your Tasks Section */}
        <div className="bg-warm-white rounded-xl border border-border shadow-warm-md p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4 text-ink">Your Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="text-lg mb-4 flex justify-between items-center"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleToggleTaskSelection(task.id)}
                    className="mr-2 accent-terracotta"
                  />
                  {task.link ? (
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta hover:text-terracotta-light underline"
                    >
                      {task.text}
                    </a>
                  ) : (
                    <span className="text-ink">{task.text}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-2 py-1 bg-transparent text-error border border-error/30 hover:bg-error-bg font-bold rounded-lg shadow-warm-sm text-sm active:scale-[0.98]"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <Link
          to="/timer"
          className="px-6 py-3 bg-terracotta hover:bg-terracotta-light text-warm-white font-bold rounded-lg shadow-warm-md flex items-center active:scale-[0.98]"
        >
          <span className="mr-2">
            <i className="fas fa-clock"></i>
          </span>
          Go to Timer
        </Link>
      </div>
    </div>
  );
};
