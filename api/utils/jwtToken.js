const jwt = require("jsonwebtoken");
const config = require("../config/index");

module.exports = {
  createJWTAuthenticationToken: async (tokenData) => {
    // console.log("config data ==> ", tokenData)
    return jwt.sign(tokenData, config.jwtTokenInfo.secretKey, {
      issuer: config.jwtTokenInfo.issuer,
      audience: config.jwtTokenInfo.audience,
      algorithm: config.jwtTokenInfo.algorithm,
      expiresIn: config.jwtTokenInfo.expiresIn,
    });
  },

  createJwtVerificationToken(tokenData, verificationType) {
    switch (verificationType) {
      case "email":
        return jwt.sign(tokenData, config.emailTokenInfo.secretKey, {
          algorithm: config.emailTokenInfo.algorithm,
          expiresIn: config.emailTokenInfo.expiresIn,
          issuer: config.emailTokenInfo.issuer,
          audience: config.emailTokenInfo.audience,
        });
      case "password":
        return jwt.sign(tokenData, config.passwordResetTokenInfo.secretKey, {
          algorithm: config.passwordResetTokenInfo.algorithm,
          expiresIn: config.passwordResetTokenInfo.expiresIn,
          issuer: config.passwordResetTokenInfo.issuer,
          audience: config.passwordResetTokenInfo.audience,
        });
      case "phone":
        return jwt.sign(tokenData, config.mobileTokenInfo.secretKey, {
          algorithm: config.passwordResetTokenInfo.algorithm,
          expiresIn: config.passwordResetTokenInfo.expiresIn,
          issuer: config.passwordResetTokenInfo.issuer,
          audience: config.passwordResetTokenInfo.audience,
        });
      default:
        return "Invalid jwt verification type";
    }
  },
};
