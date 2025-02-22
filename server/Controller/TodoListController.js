const TodoService = require("../Service/TodoListService");
const asyncHandler = require("express-async-handler");

/**
 * @PostList
 */
const PostTodoList = asyncHandler(async (req, res) => {
    try {
        const { listName, description, completed } = req.body;

        // Check if listName already exists
        const existingTask = await TodoService.FindByListName(listName);
        if (existingTask) {
            return res.status(400).json({ message: "Task with this name already exists" });
        }

        // Create new task
        const newTask = await TodoService.CreateTodoList({ listName, description, completed });
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});

/**
 * @Getalldata
 */
const GetAllLists = asyncHandler(async (req, res) => {
    try {
        const TodoList = await TodoService.GetAllTask();
        res.json(TodoList);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch todo lists", error: error.message })
    }
});


/**
 * @Editdata
 */
const PutTodoList = asyncHandler(async (req, res) => {
    try {
        const todoId = req.params.id;

        const updatedData = {
            ...req.body
        }

        const TodoList = await TodoService.UpdateTodoList(todoId, updatedData);
        if (!TodoList) {
            return res.status(404).json({ message: "Todo list not found" });
        }

        res.status(200).json({ message: "Todo list updated successfully", TodoList });

    } catch (error) {
        throw new Error("error updating contactdata")
    }
})

/**
 * @Deletedata
 */
const DeleteTodoList = asyncHandler(async (req, res) => {
    try {
        const todoId = req.params.id;
        const TodoList = await TodoService.RemoveTodoList(todoId);
        res.status(200).json(TodoList)
    } catch (error) {
        throw new Error("error deleting contactdataaa")
    }
})

module.exports = { PostTodoList, GetAllLists, PutTodoList, DeleteTodoList }