const Router = require("express").Router();

const UserController = require("../../controllers/userControllers");

Router.get("/", (req, res, next) => {
  res.send("hello");
});

Router.post("/signup", UserController.signup);

module.exports = Router;
