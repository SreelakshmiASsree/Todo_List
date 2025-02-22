const express = require("express");
const {PostTodoList,GetAllLists, PutTodoList, DeleteTodoList}=require("../Controller/TodoListController");

const router = express.Router();

router.post('/todolist',PostTodoList);
router.get("/todolist", GetAllLists);
router.put("/todolist/:id",PutTodoList)
router.delete("/todolist/:id",DeleteTodoList)


module.exports = router;