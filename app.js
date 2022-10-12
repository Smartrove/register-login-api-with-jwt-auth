const express = require("express");
const mongoose = require("mongoose");

const app = express();
// const PORT = 9000;

const dotEnv = require("dotenv/config");
const router = require("express").Router();

const connection = mongoose.connect(process.env.DATABASE_APP, () => {
  console.log("database connected successfully");
});

//import routes
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
//middleware
app.use(express.json());
// //routes middleware
app.use("/api/users", authRouter);
app.use("/api/post", postRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running.....");
});
