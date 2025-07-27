import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const ToDoPage = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string; link?: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newLink, setNewLink] = useState("");
  const [groups, setGroups] = useState<{ id: number; title: string; subtasks: { id: number; text: string; link?: string; isDone?: boolean }[]; isVisible?: boolean }[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newSubtaskLink, setNewSubtaskLink] = useState("");

  useEffect(() => {
    (async () => {
      // load Todos
      const { data: allTodos, error: todosError } = await supabase
        .from("todos")
        .select("*");
      if (todosError) return console.error(todosError);
      const todosArr = allTodos ?? [];
      setTasks(
        todosArr
          .filter((t) => t.group_id === null)
          .map(({ id, text, link }) => ({ id, text, link }))
      );

      // load Groups
      const { data: allGroups, error: groupsError } = await supabase
        .from("todo-groups")
        .select("*");
      if (groupsError) return console.error(groupsError);
      const groupsArr = allGroups ?? [];
      const groupsWithSub = await Promise.all(
        groupsArr.map(async (g) => {
          const { data: subs } = await supabase
            .from("todos")
            .select("*")
            .eq("group_id", g.id);
          const subsArr = subs ?? [];
          return {
            id: g.id,
            title: g.title,
            subtasks: subsArr.map((s) => ({ id: s.id, text: s.text, link: s.link, isDone: s.is_done })),
            isVisible: false,
          };
        })
      );
      setGroups(groupsWithSub);
    })();
  }, []);

  const handleToggleGroupVisibility = (groupId: number) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, isVisible: !group.isVisible } : group
      )
    );
  };

  const handleDeleteGroup = async (groupId: number) => {
    const { error } = await supabase.from("todo-groups").delete().eq("id", groupId);
    if (error) return console.error(error);
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  const handleDeleteSubtask = async (groupId: number, subtaskId: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", subtaskId);
    if (error) return console.error(error);
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, subtasks: g.subtasks.filter((s) => s.id !== subtaskId) }
          : g
      )
    );
  };

  const handleToggleSubtaskDone = async (groupId: number, subtaskId: number) => {
    const grp = groups.find((g) => g.id === groupId);
    const sub = grp?.subtasks.find((s) => s.id === subtaskId);
    const newDone = !sub?.isDone;
    const { error } = await supabase
      .from("todos")
      .update({ is_done: newDone })
      .eq("id", subtaskId);
    if (error) return console.error(error);
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              subtasks: g.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, isDone: newDone } : s
              ),
            }
          : g
      )
    );
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: newTask, link: newLink || null }])
      .select();
    if (error) return console.error(error);
    const inserted = data![0];
    setTasks([...tasks, { id: inserted.id, text: inserted.text, link: inserted.link }]);
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

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim() || selectedTasks.length === 0) return;
    // insert group
    const { data: grp, error: ge } = await supabase
      .from("todo-groups")
      .insert([{ title: newGroupTitle }])
      .select();
    if (ge) return console.error(ge);
    const newGroupId = grp![0].id;
    // assign selected tasks
    const { error: ue } = await supabase
      .from("todos")
      .update({ group_id: newGroupId })
      .in("id", selectedTasks);
    if (ue) return console.error(ue);
    // update state
    const subtasks = tasks.filter((t) => selectedTasks.includes(t.id));
    setGroups([...groups, { id: newGroupId, title: newGroupTitle, subtasks, isVisible: false }]);
    setTasks(tasks.filter((t) => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);
    setNewGroupTitle("");
  };

  const handleAddSubtaskToGroup = async (groupId: number) => {
    if (!newSubtask.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([
        { text: newSubtask, link: newSubtaskLink || null, group_id: groupId },
      ])
      .select();
    if (error) return console.error(error);
    const inserted = data![0];
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, subtasks: [...g.subtasks, { id: inserted.id, text: inserted.text, link: inserted.link, isDone: inserted.is_done }] }
          : g
      )
    );
    setNewSubtask("");
    setNewSubtaskLink("");
  };

  const handleDeleteTask = async (taskId: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", taskId);
    if (error) return console.error(error);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 flex flex-col items-center pt-20 overflow-y-auto">
      <h1 className="text-4xl font-bold text-white mb-12">To-Do List</h1>
      <div className="flex justify-between items-start w-full max-w-5xl gap-8">
        {/* Add a Task Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Add a Task</h2>
          <input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4 text-gray-800"
          />
          <input
            type="text"
            placeholder="Enter link (optional)"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4 text-gray-800"
          />
          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md w-full"
          >
            Add Task
          </button>
        </div>

        {/* Your Tasks Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Your Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="text-lg mb-4 flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleToggleTaskSelection(task.id)}
                    className="mr-2"
                  />
                  {task.link ? (
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {task.text}
                    </a>
                  ) : (
                    <span className="text-gray-900">{task.text}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {/* Removed: Create a Group section */}
        </div>
      </div>

      {/* Removed: Groups Section */}

      <div className="mt-12">
        <Link
          to="/record-study-time"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center"
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