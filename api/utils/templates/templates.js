"use strict";
const config = require("../../config");
module.exports = {
  emailVerification: ({ otp, name, uid, email }) => {
    let templateBody = `<h5>Hey ${name},</h5>
            <h4>Welcome to Bonding,</h4>
            <br>Click the link below to verify you email address!
            <br><a style="text-decoration:none;line-height:100%;background:#7289DA;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;" target="_blank" href='${config.BaseUrl}/email/verification?uid=${uid}&email=${email}'>Verify Your Email</a>
            <br><p>This link will expire in 1 hour, so be sure to use it right away. Once you verify your email address, continue to log in.
            If you did not make this request, please ignore this email.</p>
            <br>Regards</br>
            <br>Team Bonding</br>`;
    return templateBody;
  },
  otpVerification: (data) => {
    let templateBody = `<h2>Hey ${data.name},</h2><br>Use the Otp below to verify yourself!
            <br>Your OTP: ${data.otp}</br>
            <br><p>If you did not make this request, please ignore this email.</p></br>
            <br>Regards</br>
            <br>Team Bonding</br>`;
    return templateBody;
  },
  passwordReset: (data) => {
    let templateBody = `<h2>Hey there,</h2><br>Click the link below to change your password!
            <br><a style="text-decoration:none;line-height:100%;background:#7289DA;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;" target="_blank" href='${config.BaseUrl}/api/v1/reset/password/${data.token}'>Change Password</a>
            <br><p>This link will expire in 1 hour, so be sure to use it right away. Once you change your password, remember to log in again with your new password to continue using your account.
            If you did not make this request, please ignore this email.</p>
            <br>Regards</br>
            <br>Team Bonding</br>`;
    return templateBody;
  },
  contactUs: (data) => {
    let templateBody = `<h4>Hey Admin,</h4>you have got mail from one of your user!
            <br>from,
            <br>name:${data.name},
            <br>email:${data.email},
            <br>phone:${data.phone},
            <br>Message:<p>${data.message}</p>`;
    return templateBody;
  },
  newLike: (data) => {
    let templateBody = `<h4>Hey  ${data.receiver},</h4>
            <br><p>${data.message}</p>`;
    return templateBody;
  },
  uploadArt: (data) => {
    let templateBody = `<p>Dear ${data.name},</p>
            <h4 style="text-align: center">“Tamper-Proof Authenticity Proof”</h4>
            <br>
            <br>Title: ${data.title},
            <br>Name: ${data.name},
            <br>Proof of Ownership/Blockchain Proof: <a href="${data.proof}">${data.proof}</a>,
            <br>Art Type: ${data.type}
            <br>Issued By
            <br>Team Bonding</p>`;
    return templateBody;
  },
  buyArt: (data) => {
    let templateBody = `<p>Dear ${data.name},</p>
            <h4 style="text-align: center">“Tamper-Proof Ownership Proof”</h4>
            <br>
            <br>Title: ${data.title},
            <br>Name: ${data.name},
            <br>Proof of Ownership/Blockchain Proof: <a href="${data.proof}">${data.proof}</a>,
            <br>Art Type: ${data.type}
            <br>Issued By
            <br>Team Bonding</p>`;
    return templateBody;
  },
  restoreAccount: (obj) => {
    let templateBody = `<h5>Hey ${obj.username},</h5>
            <h4>Welcome back to Bonding,</h4>
            <br>Your account details are listed below.
            <br><p>
            Email: ${obj.email}
            <br>
            Phone: ${obj.phone}
            <br>
            <br>
            If you did not make this request, please ignore this email.</p>
            <br>Regards</br>
            <br>Team Bonding</br>`;
    return templateBody;
  },
};
