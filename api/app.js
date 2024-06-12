const express = require("express");
const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/user/user.routes");
const adminRoutes = require("./routes/admin/admin.routes");
const passport = require("passport");
const passportService = require("./utils/passport");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const userAuthentication = require("./middlewares/userAuthentication")
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(passport.initialize());
passportService();
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PUT,PATCH,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,token"
  );
  next();
});

/***
 * DB CONNECTION
 **/
connectDB();


/**
 * USER AUTHENTICATION
 */

// app.use("/", userAuthentication)

/**
 * USER ROUTES
 **/
app.use("/api/v1/user", userRoutes);
// app.use("/admin", adminRoutes);

module.exports = app;
