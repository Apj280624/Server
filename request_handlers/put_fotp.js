const nodemailer = require("nodemailer");

// my modules
const { User, FOTP } = require("../utilities/mongoose_models.js");
const {
  generateOTP,
  generateTimeStamp,
} = require("../utilities/server_utility");
const { statusText } = require("../utilities/server_vars_utility");

/* 
before sending otp and storing it on db check whether the email is already signed up or not
the email must be signed up to make a forgot password request
this means if we a fotp for an email, this means its already signed up
so we dont need to check for sign up in postForgotPassword we can just check for fotp
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////

async function putFOTP(req, res) {
  if (!req.body || !req.body.emailAddress) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  } else {
    // search whether this email address belongs to a user or not
    const recipientEmailAddress = req.body.emailAddress;

    await User.findOne(
      {
        emailAddress: recipientEmailAddress,
      },
      ["emailAddress"],
      null,
      (err, foundUser) => {
        if (err) {
          console.log(err);
          res.status(500).send(statusText.SOMETHING_WENT_WRONG);
        } else if (!foundUser) {
          res.status(400).send(statusText.EMAIL_NOT_FOUND);
        } else {
          // try to send a otp mail
          const OTP = generateOTP();
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.APP_PASSWORD, // app specific password
            },
          });

          var mailOptions = {
            from: `CodeX Authentication System <${process.env.EMAIL}>`,
            to: recipientEmailAddress,
            subject: "Forgot Password",
            text: `A Password Recovery request was issued for your Email Address. Here's your OTP: ${OTP}`,
          };

          try {
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
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
      }
    ).clone(); // .clone() for multiple requests
  }
}

async function storeOTPOnDB(recipientEmailAddress, OTP, res) {
  await FOTP.findOneAndUpdate(
    {
      emailAddress: recipientEmailAddress,
    },
    { OTP: OTP, timeStamp: generateTimeStamp() },
    { overwrite: false, upsert: true },
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.OTP_SEND_FAIL);
      } else {
        res.status(200).send(statusText.OTP_SEND_SUCCESS);
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  putFOTP,
};
