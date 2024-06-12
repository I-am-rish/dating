const passport = require("passport");
const responseHandler = require("../helper/customResponse");

module.exports = async (req, res, next) => {
  let responseData = {};
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      responseData.message = "failed to process request!";
      return responseHandler.error(res, responseData);
    }

    if (!user) {
      responseData.message = "unAuthorized request!";
      return responseHandler.unauthorized(res, responseData);
    }

    req.user = user;
    sub = user.id
    next();
  })(req, res, next);
};
