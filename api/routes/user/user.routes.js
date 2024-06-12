const router = require("express").Router();
const user = require("../../controllers/userControllers/user");
const userAuthentication = require("../../middlewares/userAuthentication");

/**
 * AUTH ROUTES
 */
router.route("/signup").post(user.signup);
router.route("/login-email").post(user.loginByEmail);
router.route("/login-phone").post(user.loginByPhone);
router.route("/verification").post(user.otpVerification);
router.route("/forgot-password").post(user.forgetPassword);
router.route("/reset-password").post(user.resetPassword);

/**
 * USER ROUTES
 */
// router.route("/").all(userAuthentication);
router.route("/profile").get(userAuthentication, user.profile);
router.route("/update-profile").patch(userAuthentication, user.updateProfile);

module.exports = router;
