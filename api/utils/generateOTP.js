const generateOTP = (digits) => {
  let OTP = "";
  for (let i = 0; i < digits; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return Number(OTP);
};

module.exports = generateOTP;
