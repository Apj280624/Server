/*
verify otp from db and then sign up
*/

const bcrypt = require("bcrypt");

// my modules
const { VOTP, User } = require("../utilities/mongoose_models.js");
const {
  isExpired,
  generateTimeStamp,
} = require("../utilities/server_utility.js");
const { vars, statusText } = require("../utilities/server_vars_utility.js");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

async function postSignUp(req, res) {
  if (!req.body) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  }
  // console.log(req.body);
  const userCredentials = req.body;

  // first verify otp from db
  await VOTP.findOne(
    { emailAddress: userCredentials.emailAddress },
    async (err, foundOTPDoc) => {
      if (err) {
        console.log(err);
        res.status(400).send(statusText.OTP_VERIFICATION_FAIL);
      } else if (!foundOTPDoc) {
        // db has no otp associated with this email
        res.status(400).send(statusText.OTP_NOT_OURS);
      } else if (
        isExpired(
          foundOTPDoc.timeStamp,
          new Date(),
          vars.OTPExpirationDurationInSeconds
        )
      ) {
        res.status(400).send(statusText.OTP_EXPIRED);
      } else if (foundOTPDoc.OTP !== userCredentials.OTP) {
        res.status(400).send(statusText.OTP_WRONG);
      } else {
        // console.log("OTP verified");
        // otp verified, try to sign up
        signUserUp(userCredentials, res);
      }
    }
  ).clone(); // .clone() for multiple requests
}

async function signUserUp(userCredentials, res) {
  await User.findOne(
    { emailAddress: userCredentials.emailAddress },
    (err, foundUser) => {
      if (err) {
        console.log(err);
        res.status(400).send(statusText.SIGN_UP_FAIL);
      } else if (foundUser) {
        res.status(400).send(statusText.USER_EMAIL_EXISTS);
      } else {
        // finally sign up, add timeStamp, remove otp field and  update password field by hashed password in userCredentials
        delete userCredentials.OTP; // otp field is not required now
        // console.log(userCredentials.password);
        // console.log(vars.saltRounds);
        bcrypt.hash(
          userCredentials.password,
          vars.saltRounds,
          (err, hashedPassword) => {
            if (err) {
              // console.log(err);
              res.status(400).send(statusText.SIGN_UP_FAIL);
            } else {
              const newUser = new User({
                ...userCredentials,
                password: hashedPassword,
                timeStamp: generateTimeStamp(),
              });

              // console.log(newUser);

              newUser.save((err) => {
                if (err) {
                  console.log(err);
                  res.status(400).send(statusText.SIGN_UP_FAIL);
                } else {
                  res.status(200).send(statusText.SIGN_UP_SUCCESS);
                }
              });
            }
          }
        );
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  postSignUp,
};
