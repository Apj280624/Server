/*
first authenticate and then return back a jwt token for authorization
authentication: first check whether there's someone with the given email and then compare password using bcrypt
*/

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// my modules
const { User } = require("../utilities/mongoose_models");
const { generateTimeStamp } = require("../utilities/server_utility");
const { statusText } = require("../utilities/server_vars_utility");

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postSignIn(req, res) {
  if (!req.body) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG); // we did not receive the credentials
  }

  const emailAddress = req.body.emailAddress;
  const password = req.body.password; // password entered by user

  User.findOne({ emailAddress: emailAddress }, (err, foundUser) => {
    if (err) {
      res.status(400).send(statusText.SIGN_IN_FAIL);
    } else if (!foundUser) {
      res.status(400).send(statusText.USER_NOT_FOUND);
    } else {
      // user found with the given email, verify password using bcrypt
      bcrypt.compare(
        password,
        foundUser.password,
        async (bcryptError, bcryptResult) => {
          if (bcryptError) {
            console.log("bcrypt password comparision error");
            res.status(400).send(statusText.SIGN_IN_FAIL);
          } else if (!bcryptResult) {
            console.log("no user found with given password");
            res.status(400).send(statusText.USER_NOT_FOUND);
          } else {
            // finally sign in the user, create and return a jwt token
            jwt.sign(
              { emailAddress: emailAddress, timeStamp: generateTimeStamp() },
              process.env.ACCESS_TOKEN_SECRET,
              (jwtError, token) => {
                if (jwtError || !token) {
                  console.log(jwtError);
                  res.status(400).send(statusText.SIGN_IN_FAIL);
                } else {
                  res.status(200).send({
                    token: token,
                    statusText: statusText.SIGN_IN_SUCCESS,
                  });
                }
              }
            );
          }
        }
      );
    }
  }).clone(); // .clone() for multiple requests;
}

module.exports = {
  postSignIn,
};
