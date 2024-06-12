const userService = require("../../services/user.service");
const responseHandler = require("../../helper/customResponse");
const catchAsyncError = require("../../middlewares/catchAsyncError");
const UserModel = require("../../models/user");
const jwtToken = require("../../utils/jwtToken");
const config = require("../../config/index");
const sendEmailService = require("../../utils/sendEmail");

module.exports = {
  signup: async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};
    try {
      const newUser = await userService.createUser(reqObj);
      if (!newUser.success) {
        responseData.message = newUser.message;
        responseData.data = [];
        return responseHandler.error(res, responseData, 409);
      }
      //jwt token
      const token = await jwtToken.createJWTAuthenticationToken({
        id: newUser.user._id,
      });

      responseData.message = "user created successfully!";
      // responseData.data = newUser.user;
      responseData.data = { token, user: newUser.user };
      responseHandler.success(res, responseData, 201);
    } catch (error) {
      responseData.message = error.message;
      return responseHandler.error(res, responseData);
    }
  },

  //LOGIN
  loginByEmail: catchAsyncError(async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};

    const user = await userService.loginByEmail(reqObj);
    // console.log("login ==> ", user);
    if (!user.success) {
      responseData.message = "User not found!";
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = "User loggedIn successfully!";
    responseData.data = user.user;
    return responseHandler.success(res, responseData, 200);
  }),

  //LOGIN BY PHONE
  loginByPhone: catchAsyncError(async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};

    const user = await userService.loginByPhone(reqObj);
    // console.log("login by phone ==> ", user);
    if (!user.success) {
      responseData.message = user.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = user.message;
    responseData.data = user.template;
    // console.log("login by phone res ==> ", user);

    responseHandler.success(res, responseData, 200);
  }),

  //OTP VERIFICATION
  otpVerification: catchAsyncError(async (req, res) => {
    const reqObj = req.body;
    let responseData = {};

    const verification = await userService.otpVerification(reqObj);
    if (!verification.success) {
      responseData.message = verification.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    // jwt token
    let tokenData = verification.getUser._id;
    const token = await jwtToken.createJWTAuthenticationToken({
      id: tokenData,
    });

    let user = verification.getUser;

    responseData.message = "otp verified!";
    responseData.data = { token, user };
    responseHandler.success(res, responseData, 200);
  }),

  //FORGET PASSWORD
  forgetPassword: catchAsyncError(async (req, res) => {
    const reqObj = req.body;
    let responseData = {};

    const forgetPassword = await userService.forgetPassword(reqObj);
    console.log("forget password ===> ", forgetPassword);
    if (!forgetPassword.success) {
      responseData.message = forgetPassword.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    //send otp on email
    //use email template to improve email format
    const { user_id, email, otp, verification_type } =
      forgetPassword.newVerification || forgetPassword.updateVerification;

    let emailBody = {
      subject: "Forget Password",
      body: `<h3>Your OTP is ${otp}</h3>`,
      recipientsAddress: reqObj.email,
    };
    const sentEmail = await sendEmailService.sendEmail(emailBody);

    // const token = jwtToken.createJwtVerificationToken(
    //   { id: user_id },
    //   "password"
    // );
    // console.log("token ==> ", token);

    responseData.message =
      "An email has been sent to your register email successfully!";
    // responseData.data = token;

    responseHandler.success(res, responseData, 200);
  }),

  //RESET PASSWORD
  resetPassword: catchAsyncError(async (req, res, next) => {
    const reqObj = req.body;
    let responseData = {};
    //check otp_verified
    const resetPassword = await userService.resetPassword(reqObj);
    if (!resetPassword.success) {
      responseData.message = resetPassword.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = resetPassword.message;
    responseHandler.success(res, responseData, 200);
  }),

  profile: catchAsyncError(async (req, res, next) => {
    const reqObj = req.body;
    const user_id = sub;
    let responseData = {};

    const profile = await userService.profile(user_id);
    if (!profile.success) {
      responseData.message = profile.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = profile.message;
    responseData.data = profile.user;
    responseHandler.success(res, responseData, 200);
  }),

  updateProfile: catchAsyncError(async (req, res, next) => {
    const reqObj = req.body;
    reqObj.user_id = sub;
    let responseData = {};

    const updateProfile = await userService.updateProfile(reqObj);
    if (!updateProfile.success) {
      responseData.message = updateProfile.message;
      responseData.data = [];
      return responseHandler.error(res, responseData, 404);
    }

    responseData.message = "profile updated successfully!";
    responseData.data = updateProfile.user;
    responseHandler.success(res, responseData, 200);
  }),
};
