const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect("mongodb://localhost:27017/dating_coretta").then((data) => {
    console.log("Database connected");
  });
};

module.exports = connectDB;
