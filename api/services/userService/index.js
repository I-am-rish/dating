const userModel = require("../../models/userModel");

class Users {
  constructor() {
    this.userModel = userModel;
  }

  async createUser(reqObj) {
    try {
      const { phone } = reqObj;
      //   console.log("create user ==> ", this.userModel);
      const duplicate = await this.userModel.find();
      if (duplicate) {
        throw new Error("User already exists");
      }
      const user = await this.userModel.create(reqObj);
      return user;
    } catch (error) {
    //   console.log("create user error ==> ", error);
      //   return error;
    }
  }
}

module.exports = new Users();
