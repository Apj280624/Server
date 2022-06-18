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

/* 
first check whether the email is already signed up, we should not verify the otp in that case
if email is not signed up then verify otp and then sign up the user

we store otp only when user is not signed up already, but this doesnot mean we should not check for already
signed up user here, we need to check here too, because for an already signed up user there's still his old otp
in the db, existence of otp cannot ensure that the user has not signed up already

*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
could'nt use findOneAndUpdate here because we have a callback for bcrypt inside which we get the hashed password
then we can save user 
*/

async function postSignUp(req, res) {
  if (!req.body) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  } else {
    // console.log(req.body);
    const userCredentials = req.body;

    await User.findOne(
      { emailAddress: userCredentials.emailAddress },
      (err, foundUser) => {
        if (err) {
          console.log(err);
          res.status(400).send(statusText.SIGN_UP_FAIL);
        } else if (foundUser) {
          res.status(400).send(statusText.EMAIL_ALREADY_EXISTS);
        } else {
          verifyOTP(userCredentials, res);
        }
      }
    ).clone(); // .clone() for multiple requests
  }
}

async function verifyOTP(userCredentials, res) {
  // first verify votp from db
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
          generateTimeStamp(),
          vars.OTPExpirationDurationInSeconds
        )
      ) {
        res.status(400).send(statusText.OTP_EXPIRED);
      } else if (foundOTPDoc.OTP !== userCredentials.OTP) {
        res.status(400).send(statusText.OTP_WRONG);
      } else {
        signUserUp(userCredentials, res);
      }
    }
  ).clone(); // .clone() for multiple requests
}

async function signUserUp(userCredentials, res) {
  // finally sign up, add timeStamp, remove otp field and  update password field by hashed password in userCredentials
  delete userCredentials.OTP; // otp field is not required now
  // console.log(userCredentials.password);
  // console.log(vars.saltRounds);
  await bcrypt.hash(
    userCredentials.password,
    vars.saltRounds,
    (err, hashedPassword) => {
      if (err) {
        // console.log(err);
        res.status(500).send(statusText.SIGN_UP_FAIL);
      } else {
        const currentTimeStamp = generateTimeStamp();
        const timeStampObject = {
          creationTimeStamp: currentTimeStamp,
          updationTimeStamp: currentTimeStamp,
        };

        const newUser = new User({
          ...userCredentials,
          password: hashedPassword,
          ...timeStampObject,
        });

        // console.log(newUser);

        newUser.save((err) => {
          if (err) {
            console.log(err);
            res.status(500).send(statusText.SIGN_UP_FAIL);
          } else {
            res.status(200).send(statusText.SIGN_UP_SUCCESS);
          }
        });
      }
    }
  );
}

module.exports = {
  postSignUp,
};
