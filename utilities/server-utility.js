require("dotenv").config();
const nodemailer = require("nodemailer");

// modules

const { VOTP } = require("../mongoose_models.js");
// const statusCodes = require("./status-codes.js"); // by Chetan
// const statusCodes = require("../node_modules/status-code");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateOTPText() {
  const OTP = 100000 + Math.floor(Math.random() * 900000);
  const OTPText = OTP.toString();

  return OTPText;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// search doc by email address, if doc already exists update it, else create one

async function storeVOTPOnDB(req, res, emailAddress, OTPText) {
  // options: overwrite = false only updates the specified field, upsert = true creates the doc if it doesn't exist
  // if doc doesnot exist, it creates a doc combined with finding fields(ie email add) and update fields
  await VOTP.findOneAndUpdate(
    { emailAddress: emailAddress },
    { VOTP: OTPText },
    { overwrite: false, upsert: true },
    (err, doc) => {
      if (err) {
        res.status(500).send("We were unable to send OTP. Please try again");
      } else {
        // console.log(statusCodes.OK_200);
        res.status(200).send("OTP has been sent successfully");
      }
    }
  ).clone(); // .clone() for multiple requests
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

async function sendEmail(
  req,
  res,
  recipientEmailAddress,
  OTPText,
  SYSTEM_CODE
) {
  console.log(recipientEmailAddress);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD, // app specific password
    },
  });

  var mailOptions = {
    from: `${
      SYSTEM_CODE === 1
        ? "CodeX Verification System"
        : "CodeX Authentication System"
    } <${process.env.EMAIL}>`,
    to: recipientEmailAddress,
    subject: `${
      SYSTEM_CODE === 1 ? "Email Verification" : "Password Recovery"
    }`,
    text: `${
      SYSTEM_CODE === 1
        ? "An Email verification request was issued for your Email Address."
        : "Looks like you have forgotten your password. We are here to help you"
    } Here's your OTP: ${OTPText}`,
  };

  try {
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send("Email send failed");
      } else {
        storeVOTPOnDB(req, res, recipientEmailAddress, OTPText);
      }
    });
  } catch (error) {}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  generateOTPText,
  storeVOTPOnDB,
  sendEmail,
};
