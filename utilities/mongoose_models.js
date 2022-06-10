const mongoose = require("mongoose");

///////////////////////////////////////////////// VOTP ////////////////////////////////////////////////////

// Schema

const VOTPSchema = new mongoose.Schema({
  emailAddress: String,
  OTP: String,
  timeStamp: Date,
});

VOTPSchema.index({ emailAddress: 1 }); // schema level index

// Model

const VOTP = mongoose.model("VOTP", VOTPSchema);
VOTP.on("index", (err) => {
  if (err) {
    // console.log(err);
  } else {
    // console.log("VOTP Index created successfully");
  }
});

///////////////////////////////////////////////// FOTP ////////////////////////////////////////////////////

// Schema

const FOTPSchema = new mongoose.Schema({
  emailAddress: String,
  OTP: String,
  timeStamp: Date,
});

FOTPSchema.index({ emailAddress: 1 }); // schema level index

// Model

const FOTP = mongoose.model("FOTP", FOTPSchema);
FOTP.on("index", (err) => {
  if (err) {
    // console.log(err);
  } else {
    // console.log("FOTP Index created successfully");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Schema

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  collegeName: String,
  emailAddress: String,
  password: String,
  timeStamp: Date,
});

userSchema.index({ emailAddress: 1 }); // schema level index

const User = mongoose.model("User", userSchema);
User.on("index", (err) => {
  if (err) {
    // console.log(err);
  } else {
    // console.log("User Index created successfully");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  VOTP,
  FOTP,
  User,
};
