require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// my modules
const { sendEmail, generateOTPText } = require("./utilities/server-utility.js");
// const statusCodes = require("./node_modules/status-code");

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.json()); // app.use(bodyParser.json()) // to parse json request from axios to js object

//////////////////////////////////////////////////////////////////////////////////////////////////////////

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

app.put("/votp", (req, res) => {
  // console.log(req.body.email);
  // send an otp to the provided email and store the otp with time stamp and email as votp
  // console.log(statusCodes.OK_200);
  sendEmail(req, res, req.body.email, generateOTPText(), 1);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/sign-up", (req, res) => {
  console.log(req.body);
  // first verify otp value and expiration from db then register user
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
