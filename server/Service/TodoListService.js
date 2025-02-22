const TodoModel = require("../Model/TodoListModel");


//created data for list
const CreateTodoList = async (data) => {
    const { listName, description, completed } = data; 
    return await TodoModel.create({
        listName, description, completed
    })
}

//checking unique name
const FindByListName = async (listName) => {
    return await TodoModel.findOne({ listName }); 
};

//Getalldata
const GetAllTask = async () => {
    try {
        return await TodoModel.find();
    }
    catch (error) {
        console.error("Error fetching tasks:", error.message);
        throw new Error("Failed to fetch tasks");
    }
}


//Updating
const UpdateTodoList = async (todoId, updatedData) => {
    try {
        const TodoList = await TodoModel.findByIdAndUpdate(todoId, updatedData, { new: true });
        if (!TodoList) {
            throw new Error("contact not found")
        }
        console.log("todo error")
        return TodoList;
    } catch (error) {
        console.error("error updating todolist");
        throw error
    }
}

//Removing data from list
const RemoveTodoList = async (todoId) => {
    try {
        const TodoList = await TodoModel.findByIdAndDelete(todoId);
        if (!TodoList) {
            throw new Error("List not Delete");
        }
        return TodoList;
    } catch (error) {
        throw new Error("Error in delete list")
    }
}



module.exports = { CreateTodoList, UpdateTodoList, GetAllTask, RemoveTodoList, FindByListName }