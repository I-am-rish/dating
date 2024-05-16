const express = require("express");
const connectDB = require("./config/dbConnection");

const app = express();

app.use(express.json());

// DB CONNECTION
connectDB();

// USER ROUTES
const userRoutes = require("./routes/user/index");

app.use("/api/v1/user", userRoutes);

module.exports = app;
