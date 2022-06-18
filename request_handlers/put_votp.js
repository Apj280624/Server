require("dotenv").config();
const nodemailer = require("nodemailer");

// my modules
const { VOTP, User } = require("../utilities/mongoose_models.js");
const {
  generateOTP,
  generateTimeStamp,
} = require("../utilities/server_utility.js");
const { statusText } = require("../utilities/server_vars_utility");

/* 
check if the email is already signed up, we won't send an otp in such a case,
if email is not already signed up then send otp and store it on db
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function putVOTP(req, res) {
  if (!req.body || !req.body.emailAddress) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  } else {
    const recipientEmailAddress = req.body.emailAddress;
    // console.log(req.body);

    await User.findOne(
      { emailAddress: recipientEmailAddress },
      (err, foundUser) => {
        if (err) {
          console.log(err);
          res.status(400).send(statusText.SIGN_UP_FAIL);
        } else if (foundUser) {
          res.status(400).send(statusText.EMAIL_ALREADY_EXISTS);
        } else {
          sendOTP(recipientEmailAddress, res);
        }
      }
    ).clone(); // .clone() for multiple requests
  }
}

/*
 cannot name it as sendMail because a function with this name is already being used by the transporter
*/
async function sendOTP(recipientEmailAddress, res) {
  const OTP = generateOTP();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD, // app specific password
    },
  });

  var mailOptions = {
    from: `CodeX Verification System <${process.env.EMAIL}>`,
    to: recipientEmailAddress,
    subject: "Email Verification",
    text: `An Email verification request was issued for your Email Address. Here's your OTP: ${OTP}`,
  };

  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log(error);
        res.status(500).send(statusText.EMAIL_SEND_FAIL);
      } else {
        storeOTPOnDB(recipientEmailAddress, OTP, res);
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send(statusText.EMAIL_SEND_FAIL);
  }
}

/* upsert: bool - creates the object if it doesn't exist. defaults to false.
overwrite: bool - if true, replace the entire document. */
async function storeOTPOnDB(recipientEmailAddress, OTP, res) {
  await VOTP.findOneAndUpdate(
    { emailAddress: recipientEmailAddress },
    { OTP: OTP, timeStamp: generateTimeStamp() },
    { overwrite: false, upsert: true },
    (err) => {
      if (err) {
        // console.log(err);
        res.status(500).send(statusText.OTP_SEND_FAIL);
      } else {
        res.status(200).send(statusText.OTP_SEND_SUCCESS);
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  putVOTP,
};
