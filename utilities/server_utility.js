require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// my modules
const { statusCodes } = require("./status_codes.js");
const { VOTP, FOTP, User } = require("./mongoose_models.js");
const { vars } = require("./server_vars_utility.js");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function isVeryOld(
  oldTimeStamp,
  newTimeStamp,
  expirationDurationInSeconds,
  OTPOldDurationInSeconds
) {
  const timeDurationInSeconds = Math.floor(
    Math.abs(new Date(newTimeStamp) - new Date(oldTimeStamp)) / 1000
  );

  return (
    timeDurationInSeconds > expirationDurationInSeconds &&
    timeDurationInSeconds > OTPOldDurationInSeconds
  );
}

// here the time stamps are iso, so pass them into new Date to get the date and then apply calculations upon them
function isExpired(oldTimeStamp, newTimeStamp, expirationDurationInSeconds) {
  const timeDurationInSeconds = Math.floor(
    Math.abs(new Date(newTimeStamp) - new Date(oldTimeStamp)) / 1000
  );

  // console.log(
  //   new Date(newTimeStamp) +
  //     " " +
  //     new Date(oldTimeStamp) +
  //     " " +
  //     timeDurationInSeconds
  // );
  return timeDurationInSeconds > expirationDurationInSeconds;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// it generates a timestamp as an iso string
function generateTimeStamp() {
  return new Date().toISOString();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateOTP() {
  const OTPNumber = 100000 + Math.floor(Math.random() * 900000);
  let OTP = OTPNumber.toString();
  // OTP = "111111";
  return OTP;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  isExpired,
  generateOTP,
  generateTimeStamp,
  isVeryOld,
};
