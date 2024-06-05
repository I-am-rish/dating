const router = require("express").Router();
const user = require("../controllers/userControllers/user");

router.route("/signup").post(user.signup);
router.route("/login").post(user.login)
router.route("/login-phone").post(user.loginByPhone);
router.route("/verification").post(user.otpVerification)

module.exports = router;
