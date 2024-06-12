module.exports = {
  dbUri: "mongodb://localhost:27017/dating_coretta",

  //Add all the environment here
  //All tokens and sensitive information
  jwtTokenInfo: {
    secretKey:
      "9889D22341540031D3386132A7BDD38F4830474543C795D019561C0A308F502B",
    issuer: "Dating",
    audience: "localhost:8080",
    algorithm: "HS256",
    expiresIn: "1y",
  },

  mobileTokenInfo: {
    secretKey:
      "929FFGG453ERYUI456JKL00KIL42001926589GFGJKDHJJSBJ65568BBHHFSJS90",
    expiresIn: "1h",
    issuer: "dating",
    audience: "dating",
    algorithm: "HS256",
  },

  emailTokenInfo: {
    secretKey: "32j4h324hj3g4h3jghj3ghj32g4hj231g4",
    expiresIn: "1h",
    issuer: "dating",
    audience: "dating",
    algorithm: "HS256",
  },

  passwordResetTokenInfo: {
    secretKey: "j2h3hj24jh324",
    expiresIn: "1h",
    issuer: "dating",
    audience: "dating",
    algorithm: "HS256",
  },

  bcrypt: {
    saltValue: 8,
  },
  crypto: {
    secretKey: "YourSecretKeyForEncryption&Descryption",
  },
};
