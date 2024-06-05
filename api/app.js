const express = require("express");
const connectDB = require("./config/dbConnection");

const app = express();


// MIDDLEWARES
app.use(express.json());

// DB CONNECTION
connectDB();

// USER ROUTES
const userRoutes = require("./routes/user.routes");

app.use("/api/v1/user", userRoutes);

// app.get("/", (req, res) => {
//     res.send("hello");
// })

module.exports = app;
