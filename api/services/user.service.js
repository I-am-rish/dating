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
      return {success:false, message: error.message};
    }
  }

  async loginByPhone(reqObj) {
    const { phone } = reqObj;
    try {
      const getUser = await this.userModel.findOne({ phone });
      // if (!getUser) return { success: false, message: "user not found!" };

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
        const newUser = await this.userModel.create(reqObj);
        return { success: true, newUser };
      }
      await getUser.set(reqObj).save();

      //send otp and verify otp
      const otp = generateOTP(4);
      let verificationType = "phone";

      const oldVerification = await VerificationService.getVerificationByQuery({
        user_id: getUser._id,
        verification_type: verificationType,
      });

      console.log("login by phone old verification ==> ", oldVerification);

      if (!oldVerification.length) {
        await VerificationService.createVerification({
          user_id: getUser._id,
          phone: getUser.phone,
          verification_type: verificationType,
          otp,
        });
      }

      let updateVerification = {
        user_id: getUser._id,
        phone: getUser.phone,
        verification_type: verificationType,
        attempts: oldVerification.verification.attempts + 1,
        otp,
      };

      const updatedVerification = await VerificationService.createVerification(
        updateVerification
      );
      // if(!updatedVerification.success) return ..............

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
      const { otp, phone } = reqObj;
      //get user by id from token info
      const getUser = await this.userModel.findOne({ phone });
      // console.log("otp veri. user ==> ", getUser);
      if (!getUser) return { success: false, message: "invalid user!" };
      const oldVerification = await VerificationService.getVerificationByQuery({
        user_id: getUser._id,
        verification_type: reqObj.verification_type,
        otp: reqObj.otp,
      });

      // console.log("otp verification service ==> ", oldVerification);

      if (!oldVerification.verification.length)
        return { success: false, message: "OTP expired or invalid OTP" };

      // if (oldVerification.verification.attempts >= 3) {
      //   return {
      //     success: false,
      //     message: "You have exceeded the maximum number of attempts",
      //   };
      // }

      let loginBy = "phone";
      //update data

      return { success: true, message: "otp verified" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

module.exports = new Users();
