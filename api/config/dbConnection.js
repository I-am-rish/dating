const mongoose = require("mongoose");
const db = require("./index");
const connectDB = () => {
  //
  mongoose.connect(db.dbUri).then((data) => {
    console.log(
      `Database connected on ${data.connection.host} with port ${data.connection.port}`
    );
  });
};

module.exports = connectDB;
