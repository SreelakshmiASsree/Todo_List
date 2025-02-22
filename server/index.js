const express = require("express");
const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();
connectDb();
const cors = require('cors');

const app = express();
app.use(express.json())
const port = process.env.PORT || 5001;
app.use(cors())
app.use('/', require("./Route/TodoListRoute"))
app.listen(port, () => {
    console.log(`server is running ${port}`)
})