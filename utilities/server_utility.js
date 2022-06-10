require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// my modules
const { statusCodes } = require("./status_codes.js");
const { VOTP, FOTP, User } = require("./mongoose_models.js");
const { vars } = require("./server_vars_utility.js");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function isExpired(oldTimeStamp, newTimeStamp) {
  const timeDurationInSeconds = Math.floor(
    Math.abs(newTimeStamp - oldTimeStamp) / 1000
  );
  return timeDurationInSeconds > vars.OTPExpirationDurationInSeconds;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateOTP() {
  const OTPNumber = 100000 + Math.floor(Math.random() * 900000);
  // const OTP = OTPNumber.toString();
  const OTP = "111111";
  return OTP;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  isExpired,
  generateOTP,
};
