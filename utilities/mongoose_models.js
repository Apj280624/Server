const mongoose = require("mongoose");

///////////////////////////////////////////////// VOTP ////////////////////////////////////////////////////

// Schema

const VOTPSchema = new mongoose.Schema({
  emailAddress: String,
  OTP: String,
  timeStamp: String,
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
  timeStamp: String,
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

//////////////////////////////////////////////// USER ///////////////////////////////////////////////////

// Schema

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  collegeName: String,
  branchName: String,
  graduationYear: String,
  emailAddress: String,
  password: String,
  creationTimeStamp: String,
  updationTimeStamp: String,
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

////////////////////////////////////////// CONTRIBUTION ///////////////////////////////////////////////////

// Schema

const interviewExperienceSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  collegeName: String,
  branchName: String,
  graduationYear: String,
  emailAddress: String,
  companyName: String,
  roleName: String,
  monthName: String,
  year: String,
  difficulty: String,
  opportunity: String,
  experience: String,
  tip: String,
  isDeleted: Boolean,
  creationTimeStamp: String,
  updationTimeStamp: String,
});

interviewExperienceSchema.index({ emailAddress: 1 }); // schema level index

// Model

const InterviewExperience = mongoose.model(
  "InterviewExperience",
  interviewExperienceSchema
);

InterviewExperience.on("index", (err) => {
  if (err) {
    // console.log(err);
  } else {
    // console.log("InterviewExperience Index created successfully");
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  VOTP,
  FOTP,
  User,
  InterviewExperience,
};
