require("dotenv").config();
const nodemailer = require("nodemailer");

// my modules
const { VOTP } = require("../utilities/mongoose_models.js");
const { generateOTP } = require("../utilities/server_utility.js");

////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function putVOTP(req, res) {
  if (!req.body || !req.body.emailAddress) {
    res.status(400).send("Something went wrong. Please try again");
  }
  const recipientEmailAddress = req.body.emailAddress;
  // console.log(req.body);
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
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send("We were unable to send an Email");
      } else {
        storeOTPOnDB(res, recipientEmailAddress, OTP);
      }
    });
  } catch (error) {
    console.log(error);
    res.send("We were unable to send an Email");
  }
}

async function storeOTPOnDB(res, recipientEmailAddress, OTP) {
  await VOTP.findOneAndUpdate(
    { emailAddress: recipientEmailAddress },
    { OTP: OTP, timeStamp: new Date() },
    { overwrite: false, upsert: true },
    (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).send("We were unable to send OTP. Please try again");
      } else {
        // console.log(doc._id.toString());
        res.status(200).send("OTP has been sent successfully");
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  putVOTP,
};
