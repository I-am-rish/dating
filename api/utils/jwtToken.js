const jwt = require("jsonwebtoken");
const config = require("../config/index");

exports.createJWTAuthenticationToken = async (tokenData) => {
  return jwt.sign(tokenData, config.jwtTokenInfo.secretKey, {
    expiresIn: config.jwtTokenInfo.expiresIn,
    issuer: config.jwtTokenInfo.issuer,
    audience: config.jwtTokenInfo.audience,
    algorithm: config.jwtTokenInfo.algorithm,
  });
};
