const UserService = require("../../services/userService");
const responseHandler = require("../../helper/customResponse");

module.exports = {
  signup: async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};
    try {
      const newUser = await UserService.createUser(reqObj);
    //   console.log("signup ==> ", newUser)
      
    } catch (error) {
      next(error);
    }
  },
};
