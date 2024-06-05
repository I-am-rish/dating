const userService = require("../../services/user.service");
const responseHandler = require("../../helper/customResponse");
const catchAsyncError = require("../../middlewares/catchAsyncError");
const UserModel = require("../../models/user");
const jwtToken = require("../../utils/jwtToken");

module.exports = {
  signup: async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};
    try {
      const newUser = await userService.createUser(reqObj);
      if (!newUser.success) {
        responseData.message = newUser.message;
        responseData.data = [];
        return responseHandler.error(res, responseData);
      }
      //jwt token

      responseData.message = "user created successfully!";
      responseData.data = newUser.user;
      responseHandler.success(res, responseData, 201);
    } catch (error) {
      responseData.message = error.message;
      return responseHandler.error(res, responseData);
    }
  },

  //LOGIN BY SOCIAL
  login: catchAsyncError(async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};

    const user = await userService.loginByEmail(reqObj);
    console.log("login ==> ", user);
    if (!user.success) {
      responseData.message = "User not found!";
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    // responseData.message = "User loggedIn successfully!";
    responseData.data = user.user
    return responseHandler.success(res, responseData, 200);
  }),

  //LOGIN BY PHONE
  loginByPhone: catchAsyncError(async (req, res, next) => {
    console.log("login by phone ==> ", req.body);
    const reqObj = req.body;
    let responseData = {};

    const user = await userService.loginByPhone(reqObj);
    if (!user.success) {
      responseData.message = user.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = user.message;
    responseData.data = user.template;
    console.log("login by phone res ==> ", responseData);

    responseHandler.success(res, responseData, 200);
  }),

  //OTP VERIFICATION
  otpVerification: catchAsyncError(async (req, res) => {
    const reqObj = req.body;
    let responseData = {};

    const verification = await userService.otpVerification(reqObj);
    console.log("otp verification controller ==> ", verification);
    if (!verification.success) {
      responseData.message = verification.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    //mobile token
    const mobileToken = await jwtToken.createJWTAuthenticationToken("ak");
    console.log("mobile token ==> ", mobileToken);

    responseData.message = verification.message;
    // responseData.data = user;

    responseHandler.success(res, responseData, 200);
  }),

  //FORGET PASSWORD
  forgetPassword: catchAsyncError(async (req, res) => {
    const reqObj = req.body;
    let responseData = {};

    const forgetPassword = await userService.forgetPassword(reqObj);
    console.log("forget password ==> ", forgetPassword);
    if (!forgetPassword.success) {
      responseData.message = forgetPassword.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = forgetPassword.message;
    // responseData.data = user;

    responseHandler.success(res, responseData, 200);
  }),

  //RESET PASSWORD
};
