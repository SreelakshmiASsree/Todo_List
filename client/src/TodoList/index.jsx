import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { MdDelete, MdEdit, MdCancel } from "react-icons/md";
import { MdOutlineKeyboardReturn } from "react-icons/md";

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTaskName, setEditTaskName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [error, setError] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/todolist");
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    // Add a new task
    const addTask = async () => {
        if (!taskName.trim() || !description.trim()) return;
        const isDuplicate = tasks.some(task => task.listName.toLowerCase() === taskName.toLowerCase());
        if (isDuplicate) {
            setError("Task with this name already exists");
            setTimeout(() => setError(""), 5000);
            return;
        }

        try {
            const { data } = await axios.post("http://localhost:5000/todolist", {
                listName: taskName,
                description: description,
                completed: false,
            });

            setTasks([...tasks, data]);
            setTaskName("");
            setDescription("");
            setError("");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("Task with this name already exists");

            } else {
                console.error("Error adding task:", error);
            }
        }
    };

    // Toggle task completion
    const toggleTask = async (id, completed) => {
        try {
            await axios.put(`http://localhost:5000/todolist/${id}`, { completed: !completed });
            setTasks(tasks.map(task => task._id === id ? { ...task, completed: !completed } : task));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/todolist/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Enable edit mode
    const startEditing = (task) => {
        setEditingId(task._id);
        setEditTaskName(task.listName);
        setEditDescription(task.description);
    };

    // Save edited task
    const saveEdit = async (id) => {
        try {
            await axios.put(`http://localhost:5000/todolist/${id}`, {
                listName: editTaskName,
                description: editDescription,
            });

            setTasks(tasks.map(task =>
                task._id === id ? { ...task, listName: editTaskName, description: editDescription } : task
            ));
            setEditingId(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Separate active and completed tasks
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (


        <div className="max-w-full lg:h-screen mx-auto p-6 bg-[#cdd0d5] text-white">
            {/* Centered Heading */}
            <div className="text-center w-full mb-4">
                <h1 className="text-2xl font-bold text-[#000] ">To-Do List</h1>
                {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="flex gap-8 md:flex-row flex-col">
                {/* Add Todo Section */}
                <div className="md:w-1/4 w-full bg-[#fff] p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-[#000]">Add Todo</h2>
                    <input
                        type="text"
                        className="w-full p-2 rounded bg-[#e8d6b5c7] text-[#000] border border-gray-600 focus:outline-none mb-2"
                        placeholder="Task Name..."
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <textarea
                        className="w-full p-2 rounded bg-[#e8d6b5c7] text-[#000] border border-gray-600 focus:outline-none mb-2"
                        placeholder="Task Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        className="w-full bg-[#99691ebf] px-4 py-2 rounded text-[#fff] font-semibold hover:bg-[#99691ebf]"
                        onClick={addTask}
                    >
                        Add
                    </button>
                </div>

                {/* Todo List Section */}
                <div className="  md:w-2/4 w-full bg-[#fff] p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-[#000]">Todo List</h2>
                    <ul>
                        {activeTasks.map((task) => (
                            <li key={task._id} className="flex justify-between items-center p-3 rounded mb-2 bg-[#e8d6b5c7] text-white">
                                {/* Edit */}
                                {editingId === task._id ? (
                                    <div className="flex flex-col w-full">
                                        <input
                                            type="text"
                                            className="w-full p-2 mb-2 rounded bg-[#e1eaf8] text-[#000] border border-gray-600 focus:outline-none"
                                            value={editTaskName}
                                            onChange={(e) => setEditTaskName(e.target.value)}
                                        />
                                        <textarea
                                            className="w-full p-2 mb-2 rounded bg-[#e1eaf8] text-[#000] border border-gray-600 focus:outline-none"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                        <div className="flex justify-between">
                                            <button className="text-green-400 hover:text-green-500 text-2xl" onClick={() => saveEdit(task._id)}>
                                                <FaCheck />
                                            </button>
                                            <button className="text-red-400 hover:text-red-500 text-2xl" onClick={() => setEditingId(null)}>
                                                <MdCancel />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                  {/* left side */}
                                        <div className="flex flex-col">
                                            <span className={`font-bold ${task.completed ? "line-through text-[#000]" : "text-[#000]"}`}>
                                                {task.listName}
                                            </span>
                                            <p className="text-sm text-[#000]">{task.description}</p>
                                        </div>

                                        {/* Right side (Action buttons) */}
                                        <div className="flex gap-3">
                                            <button className="text-yellow-400 hover:text-yellow-500 text-2xl" onClick={() => startEditing(task)}>
                                                <MdEdit />
                                            </button>
                                            <button className="text-green-400 hover:text-green-500 text-2xl" onClick={() => toggleTask(task._id, task.completed)}>
                                                <FaCheck />
                                            </button>
                                            <button className="text-red-400 hover:text-red-500 text-2xl" onClick={() => deleteTask(task._id)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Completed Tasks Section */}
                <div className="md:w-2/4 w-full bg-[#fff] p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-[#000]">Completed</h2>
                    <ul>
                        {completedTasks.map((task) => (
                            <li key={task._id} className="flex flex-col p-3 rounded mb-2 bg-[#e8d6b5c7]">
                                <div className="flex justify-between">
                                    <span className="line-through text-[#000]">{task.listName}</span>
                                    <div className="flex gap-2">
                                        <button className="text-green-400 hover:text-green-500 text-2xl" onClick={() => toggleTask(task._id, task.completed)}>
                                            <MdOutlineKeyboardReturn />
                                        </button>
                                        <button className="text-red-400 hover:text-red-500 text-2xl" onClick={() => deleteTask(task._id)}>
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[#000] text-sm mt-1">{task.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>




    );
};

export default TodoList;






