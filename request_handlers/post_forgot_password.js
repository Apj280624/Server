const bcrypt = require("bcrypt");

const { FOTP, User } = require("../utilities/mongoose_models.js");
const {
  isExpired,
  generateTimeStamp,
  isVeryOld,
} = require("../utilities/server_utility.js");
const { statusText, vars } = require("../utilities/server_vars_utility.js");

/////////////////////////////////////////////////////////////////////////////////////////////////////////

async function postForgotPassword(req, res) {
  if (!req.body) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  } else {
    // console.log(req.body);
    const userCredentials = req.body;

    await User.findOne(
      { emailAddress: userCredentials.emailAddress },
      (err, foundUser) => {
        if (err) {
          // console.log(err);
          res.status(400).send(statusText.OTP_VERIFICATION_FAIL);
        } else if (!foundUser) {
          res.status(400).send(statusText.EMAIL_NOT_FOUND);
        } else {
          verifyOTP(userCredentials, res);
        }
      }
    ).clone(); // .clone() for multiple requests
  }
}

async function verifyOTP(userCredentials, res) {
  // first verify fotp from db
  await FOTP.findOne(
    { emailAddress: userCredentials.emailAddress },
    (err, foundOTPDoc) => {
      if (err) {
        // console.log(err);
        res.status(400).send(statusText.OTP_VERIFICATION_FAIL);
      } else if (!foundOTPDoc) {
        // db has no otp associated with this email
        res.status(400).send(statusText.OTP_NOT_OURS); // could have also send otp not ours, but this is better
      } else if (
        isVeryOld(
          foundOTPDoc.timeStamp,
          generateTimeStamp(),
          vars.OTPExpirationDurationInSeconds,
          vars.OTPOldDurationInSeconds
        )
      ) {
        res.status(400).send(statusText.OTP_NOT_OURS);
      } else if (
        isExpired(
          foundOTPDoc.timeStamp,
          generateTimeStamp(),
          vars.OTPExpirationDurationInSeconds
        )
      ) {
        res.status(400).send(statusText.OTP_EXPIRED);
      } else if (foundOTPDoc.OTP !== userCredentials.OTP) {
        res.status(400).send(statusText.OTP_WRONG);
      } else {
        // console.log("OTP verified");
        hashPassword(userCredentials, res);
      }
    }
  ).clone(); // .clone() for multiple requests
}

async function hashPassword(userCredentials, res) {
  await bcrypt.hash(
    userCredentials.password,
    vars.saltRounds,
    (err, hashedPassword) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.PASSWORD_UPDATE_FAIL);
      } else {
        updatePassword(userCredentials, hashedPassword, res);
      }
    }
  );
}

async function updatePassword(userCredentials, hashedPassword, res) {
  const currentTimeStamp = generateTimeStamp();
  const timeStampObject = {
    updationTimeStamp: currentTimeStamp,
  };

  await User.findOneAndUpdate(
    { emailAddress: userCredentials.emailAddress },
    { password: hashedPassword, ...timeStampObject },
    { overwrite: false, upsert: false },
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.EMAIL_NOT_FOUND);
      } else {
        res.status(200).send(statusText.PASSWORD_UPDATE_SUCCESS);
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  postForgotPassword,
};
