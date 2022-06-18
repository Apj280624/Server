require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// my modules

const { routes } = require("./utilities/server_vars_utility.js");
const { putVOTP } = require("./request_handlers/put_votp.js");
const { postSignUp } = require("./request_handlers/post_sign_up.js");
const { postSignIn } = require("./request_handlers/post_sign_in.js");
const { getVerifyToken } = require("./request_handlers/get_verify_token.js");
const { postContribute } = require("./request_handlers/post_contribute.js");
const {
  getInterviewExperiences,
} = require("./request_handlers/get_interview_experiences.js");
const {
  getParticularInterviewExperience,
} = require("./request_handlers/get_particular_interview_experience.js");

const { getAccount } = require("./request_handlers/get_account.js");
const {
  putEditInterviewExperience,
} = require("./request_handlers/put_edit_interview_experience.js");
const {
  deleteDeleteInterviewExperience,
} = require("./request_handlers/delete_delete_interview_experience.js");
const { putFOTP } = require("./request_handlers/put_fotp.js");
const {
  postForgotPassword,
} = require("./request_handlers/post_forgot_password.js");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// VOTP GENERATION ///////////////////////////////////////////////////

app.put(routes.VOTP, (req, res) => {
  // console.log(req.body);
  // send an otp to the provided email and store the otp on db with time stamp and email as votp
  putVOTP(req, res);
});

/////////////////////////////////////////////// SIGN UP ///////////////////////////////////////////////////

app.post(routes.SIGN_UP, (req, res) => {
  // console.log(req.body);
  // first verify otp value and expiration from db then register user if not already registered
  postSignUp(req, res);
});

/////////////////////////////////////////// SIGN IN ///////////////////////////////////////////////////////

app.post(routes.SIGN_IN, (req, res) => {
  // console.log(req.body);
  postSignIn(req, res);
});

//////////////////////////////////////// FOTP GENERATION ///////////////////////////////////////////////////

app.put(routes.FOTP, (req, res) => {
  // console.log(req.body);
  // send an otp to the provided email and store the otp on db with time stamp and email as votp
  putFOTP(req, res);
});

/////////////////////////////////////////// UPDATE PASSWORD ///////////////////////////////////////////////////////

app.post(routes.FORGOT_PASSWORD, (req, res) => {
  // console.log(req.body);
  postForgotPassword(req, res);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// VERIFY TOKEN ////////////////////////////////////////////////

app.get(routes.VERIFY_TOKEN, (req, res) => {
  getVerifyToken(req, res);
});

///////////////////////////////////////////// CONTRIBUTE //////////////////////////////////////////////////

app.post(routes.CONTRIBUTE, (req, res) => {
  // console.log(req);
  postContribute(req, res);
});

/////////////////////////////////////////// ALL INTERVIEW EXPERIENCES //////////////////////////////////////////

app.get(routes.INTERVIEW_EXPERIENCES, (req, res) => {
  // console.log(req);
  getInterviewExperiences(req, res);
});

/////////////////////////////////////////// READ AN INTERVIEW EXPERIENCE ///////////////////////////////////

// app.get("/interview-experience/read/:id", (req, res) => {
// app.get(`${routes.READ}/:id`, (req, res) => {
//   // console.log(req.params);
//   getRead(req, res);
// });

/*
read and edit operation both need different fields to be returned and if you don't wish to create two routes  
for read and edit interview experience create a single route named as 

/interview-experience/:{operation}/:id

operation could be read or edit
based upon the values of value of operation you can return the fields

for now all the fields are being returned
*/

app.get(`${routes.PARTICULAR_INTERVIEW_EXPERIENCE}/:id`, (req, res) => {
  // console.log(req.params);
  getParticularInterviewExperience(req, res);
});

/////////////////////////////////////////// ACCOUNT DETAILS ///////////////////////////////////

app.get(routes.ACCOUNT, (req, res) => {
  // console.log(req);
  getAccount(req, res);
});

/////////////////////////////////////////// EDIT INTERVIEW EXPERIENCE ///////////////////////////////////

app.put(`${routes.INTERVIEW_EXPERIENCE_EDIT}/:id`, (req, res) => {
  // console.log(req.params);
  putEditInterviewExperience(req, res);
});

/////////////////////////////////////////// EDIT INTERVIEW EXPERIENCE ///////////////////////////////////

app.delete(`${routes.INTERVIEW_EXPERIENCE_DELETE}/:id`, (req, res) => {
  // console.log(req.params);
  deleteDeleteInterviewExperience(req, res);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
