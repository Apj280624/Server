const bcrypt = require("bcrypt");

const { FOTP, User } = require("../utilities/mongoose_models.js");
const {
  isExpired,
  generateTimeStamp,
} = require("../utilities/server_utility.js");
const { statusText, vars } = require("../utilities/server_vars_utility.js");

/* 
we store a fotp only if the email is already signed up, this means if we just verify fotp then we know
that the user is already signed up, so we don't need to start with check about sign up
we can directly start with fotp verification, if there's no fotp associated with the email we dont go further
*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////

async function postForgotPassword(req, res) {
  // console.log(req);
  if (!req.body) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  } else {
    // console.log(req.body);
    const userCredentials = req.body;

    console.log("good1");
    // first verify fotp from db
    await FOTP.findOne(
      { emailAddress: userCredentials.emailAddress },
      (err, foundDoc) => {
        if (err) {
          console.log(err);
          res.status(400).send(statusText.OTP_VERIFICATION_FAIL);
        } else if (!foundDoc) {
          console.log("good2");
          // db has no otp associated with this email
          res.status(400).send(statusText.EMAIL_NOT_FOUND); // could have also send otp not ours, but this is better
        } else if (
          isExpired(
            foundDoc.timeStamp,
            generateTimeStamp(),
            vars.OTPExpirationDurationInSeconds
          )
        ) {
          console.log("good3");
          res.status(400).send(statusText.OTP_EXPIRED);
        } else if (foundDoc.OTP !== userCredentials.OTP) {
          console.log("good4");
          res.status(400).send(statusText.OTP_WRONG);
        } else {
          console.log("good5");
          // console.log("OTP verified");
          hashPassword(userCredentials, res);
        }
      }
    ).clone(); // .clone() for multiple requests
  }
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
        console.log("good6");
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

  console.log("good7");
  await User.findOneAndUpdate(
    { emailAddress: userCredentials.emailAddress },
    { password: hashedPassword, ...timeStampObject },
    { overwrite: false, upsert: false },
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.EMAIL_NOT_FOUND);
      } else {
        console.log("good8");
        res.status(200).send(statusText.PASSWORD_UPDATE_SUCCESS);
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  postForgotPassword,
};
