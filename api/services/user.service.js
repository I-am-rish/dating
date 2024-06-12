"use strict";
//Business logic for user controller
const getLocationInfo = require("../utils/locationInfo");
const generateOTP = require("../utils/generateOTP");
const VerificationService = require("../services/verification.service");
const userModel = require("../models/user");

class Users {
  constructor() {
    this.userModel = userModel;
  }

  async getUserById(id) {
    try {
      const user = await this.userModel.findById(id);
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUserByPhone(phone) {
    try {
      const user = await this.userModel.findOne({ phone });
      if (user) return { success: true, user };

      return { success: false, user: [] };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createUser(reqObj) {
    try {
      const { email } = reqObj;
      const duplicate = await this.userModel.findOne({ email });
      if (duplicate) {
        return { success: false, message: "user already exist!" };
      }
      // console.log("create user ==> ", duplicate)
      //update address from lat and long
      // let loc = {
      //   type: "point",
      //   coordinates: [reqObj.latitude, reqObj.longitude],
      // };

      //Calling a function to get state, city and other info from lat and long
      const locationInfo = await getLocationInfo(
        reqObj.latitude,
        reqObj.longitude
      );
      reqObj.state = locationInfo.state;
      reqObj.country = locationInfo.country;
      console.log("create user => ", locationInfo);

      const user = await this.userModel.create(reqObj);
      if (user) return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  async loginByEmail(reqObj) {
    const { email } = reqObj;
    try {
      const user = await this.userModel.findOne({ email }).select("-password");
      // console.log("login by email ==> ", user);
      if (!user) return { success: false, message: "user not found!" };

      return { success: true, user };
    } catch (error) {
      console.log("login user error ==> ", error);
      return { success: false, message: error.message };
    }
  }

  async loginByPhone(reqObj) {
    const { phone } = reqObj;
    try {
      let getUser = await this.userModel.findOne({ phone });

      //handle lat and long input and update in db
      let loc = {
        type: "point",
        coordinates: [reqObj.latitude, reqObj.longitude],
      };

      //Calling a function to get state, city and other info from lat and long
      const locationInfo = await getLocationInfo(
        reqObj.latitude,
        reqObj.longitude
      );

      reqObj.state = locationInfo.state;
      reqObj.country = locationInfo.country;

      //if not user then create user
      if (!getUser) {
        getUser = await this.userModel.create(reqObj);
        // return { success: true, newUser };
      }
      await getUser.set(reqObj).save();

      //send otp and verify otp
      const otp = generateOTP(4);
      let verificationType = "phone";

      const oldVerification = await VerificationService.getVerificationByQuery({
        user_id: getUser._id,
        verification_type: verificationType,
      });

      if (!oldVerification.verification.length) {
        await VerificationService.createVerification({
          user_id: getUser._id,
          phone: getUser.phone,
          verification_type: verificationType,
          otp,
        });
      } else {
        let updateVerification = {
          user_id: getUser._id,
          phone: getUser.phone,
          verification_type: verificationType,
          // attempts: oldVerification.verification.attempts + 1,
          otp,
        };

        const updatedVerification =
          await VerificationService.updateVerificationById(
            oldVerification.verification[0]._id,
            updateVerification
          );
        // console.log("else verification ==> ", updatedVerification);
        if (!updatedVerification) {
          return { success: false, message: "failed to update verification!" };
        }
      }

      //twilio to send app
      // let message = "Your OTP to verify mobile on Bonding is " + otp;
      // //twilio.service.sendOTP(getUser.phone, message);
      return {
        success: true,
        message: "An OTP has been sent to your registered phone number",
        template: {
          verification_type: verificationType,
          phone: getUser.phone,
          otp,
        },
      };
    } catch (err) {
      console.log("login user error ==> ", err);
      return { success: false, message: err.message };
    }
  }

  async otpVerification(reqObj) {
    //user
    try {
      const { otp, phone, email, verification_type } = reqObj;
      let getUser;
      if (verification_type === "phone") {
        getUser = await this.userModel.findOne({ phone });
      } else {
        getUser = await this.userModel.findOne({ email });
      }
      if (!getUser) return { success: false, message: "invalid user!" };
      const oldVerification = await VerificationService.getVerificationByQuery({
        user_id: getUser._id,
        verification_type,
        otp,
      });

      if (!oldVerification.verification.length)
        return { success: false, message: "OTP expired or invalid OTP" };

      // if (oldVerification.verification.attempts >= 3) {
      //   return {
      //     success: false,
      //     message: "You have exceeded the maximum number of attempts",
      //   };
      // }

      if (verification_type === "email") {
        await this.userModel.updateOne(
          { _id: getUser._id },
          {
            $set: {
              email_verified: true,
            },
          }
        );
      } else {
        await this.userModel.updateOne(
          { _id: getUser._id },
          {
            $set: {
              phone_verified: true,
            },
          }
        );
      }

      return { success: true, getUser };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async forgetPassword(reqObj) {
    const { email, verification_type } = reqObj;
    let verificationDataExist = false;
    try {
      const getUser = await this.userModel.findOne({ email });
      if (!getUser) return { success: false, message: "User not found!" };

      //send otp to email and verify otp
      const otp = generateOTP(4);
      let verificationType = verification_type;

      const oldVerification = await VerificationService.getVerificationByQuery({
        user_id: getUser._id,
        verification_type: verificationType,
      });

      // console.log("forgot pass oldVerification ==> ", oldVerification);

      if (!oldVerification.verification.length) {
        const newVerification = await VerificationService.createVerification({
          user_id: getUser._id,
          email: getUser.email,
          verification_type,
          otp,
        });
        if (newVerification) return { success: true, newVerification };
      } else {
        let updateVerification = {
          email: getUser.email,
          verification_type,
          // attempts: oldVerification.verification.attempts + 1,
          otp,
        };

        const { updatedVerification } =
          await VerificationService.updateVerificationById(
            oldVerification.verification[0]._id,
            updateVerification
          );

        if (!updatedVerification)
          return { success: false, message: "failed to updated verification!" };

        // console.log("updatedVerification ==> ", updatedVerification);

        // const newData = await VerificationService.getVerificationById(
        //   oldVerification.verification[0]._id
        // );
        // console.log("new data ==> ", newData);

        return { success: true, updateVerification };
      }
      //twilio to send app
    } catch (error) {
      console.log("errorrrrr");
      return { success: false, message: error.message };
    }
  }

  async resetPassword(reqObj) {
    const { password, confirmPassword, email } = reqObj;
    try {
      const getUser = await this.userModel.findOne({ email });
      console.log("id", getUser);
      if (!getUser) return { success: false, message: "Invalid user!" };

      getUser.password = password;
      const passwordUpdated = await getUser.save();

      if (passwordUpdated)
        return { success: true, message: "Password updated successfully!" };
    } catch (error) {
      return { success: false, message: "failed to update password!" };
    }
  }

  async profile(user_id) {
    try {
      const user = await this.userModel.findById(user_id);
      if (!user) return { success: false, message: "user not found!" };
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateProfile(reqObj) {
    const { user_id } = reqObj;
    try {
      const user = await this.userModel.findById(user_id);
      if (!user) return { success: false, message: "user not found!" };
      user.set(reqObj).save();
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new Users();
