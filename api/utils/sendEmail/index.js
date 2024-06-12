"use strict";
// const sgMail = require('@sendgrid/mail');
// const config = require('../../config/environments');

// sgMail.setApiKey(config.emailServiceInfo.senderEmail);

// const AWS = require("aws-sdk");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // service gmail
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "bonding8789@gmail.com",
    pass: "rgln juuw xvvq xioi",
  },
});
module.exports = {
  sendEmail: async (emailBody) => {
    try {
      // send mail with defined transport object
      let emailInfo = {
        from: '"Dating" no-reply@vadore.com', // no-reply@vadore.com.sender address
        to: emailBody.recipientsAddress, // list of receivers
        subject: emailBody.subject, // Subject line
        html: emailBody.body,
      };
      await transporter.sendMail(emailInfo);
      return true;
    } catch (error) {
      console.log("Error in sending email=>", error);
    }
  },
  //   sendSignupEmail: async (emailBody) => {
  //     try {
  //       // send mail with defined transport object
  //       let emailInfo = {
  //         from: "support@vkind.com", // sender address
  //         to: "vkind.com@gmail.com", // list of receivers
  //         subject: emailBody.subject, // Subject line
  //         html: emailBody.body,
  //       };
  //       sgMail.send(emailInfo);
  //       return true;
  //     } catch (error) {
  //       return error;
  //     }
  //   },

  sendOtp: async (mobileNo, msg) => {
    return new AWS.SNS({ apiVersion: "2020-6-10" })
      .publish({
        Message: msg,
        PhoneNumber: "+91" + mobileNo,
      })
      .promise();
  },
};
