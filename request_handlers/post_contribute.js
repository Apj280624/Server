require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// my modules
const {
  InterviewExperience,
  User,
} = require("../utilities/mongoose_models.js");
const {
  isExpired,
  generateTimeStamp,
} = require("../utilities/server_utility.js");
const { statusText, vars } = require("../utilities/server_vars_utility.js");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postContribute(req, res) {
  if (!req.headers || !req.headers.authorization || !req.body) {
    // console.log("missing header or body");
    res.status(401).send(statusText.NOT_AUTHORIZED);
  } else {
    // console.log(req.headers);
    // console.log(req.body); // read about Bearer schema in jwt docs
    const token = _.split(req.headers.authorization, " ", 2)[1]; // removing the string "Bearer "
    const interviewExperience = req.body;
    // console.log(token);
    // console.log(interviewExperience);

    // first verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err);
        res.status(400).send(statusText.TOKEN_INVALID_CANNOT_CONTRIBUTE);
      } else if (
        isExpired(
          decodedToken.timeStamp,
          generateTimeStamp(),
          vars.TokenExpirationDurationInSeconds
        )
      ) {
        // console.log(decodedToken.timeStamp);
        res.status(400).send(statusText.TOKEN_EXPIRED);
      } else {
        // console.log(decodedToken);
        const emailAddress = decodedToken.emailAddress;
        User.findOne(
          { emailAddress: emailAddress },
          [
            "firstName",
            "lastName",
            "collegeName",
            "branchName",
            "graduationYear",
          ],
          (err, foundDoc) => {
            if (err) {
              // console.log(err);
              res.status(500).send(statusText.CONTRIBUTION_FAILED);
            } else if (!foundDoc) {
              res.status(500).send(statusText.CONTRIBUTION_FAILED);
            } else {
              // add contribution to DB

              /* object destructuring was not working with foundDoc maye be because of _id field in foundDoc, so i created
            an object */

              const foundUser = {
                firstName: foundDoc.firstName,
                lastName: foundDoc.lastName,
                collegeName: foundDoc.collegeName,
                branchName: foundDoc.branchName,
                graduationYear: foundDoc.graduationYear,
                emailAddress: emailAddress,
              };

              const currentTimeStamp = generateTimeStamp();
              const timeStampObject = {
                creationTimeStamp: currentTimeStamp,
                updationTimeStamp: currentTimeStamp,
              };

              const newInterviewExperience = new InterviewExperience({
                ...foundUser,
                ...interviewExperience,
                ...timeStampObject,
              });

              // console.log(newInterviewExperience);
              newInterviewExperience.save((err) => {
                if (err) {
                  res.status(500).send(statusText.CONTRIBUTION_FAILED);
                } else {
                  res.status(200).send(statusText.CONTRIBUTION_SUCCESS);
                }
              });
            }
          }
        ).clone(); // .clone() for multiple requests;
      }
    });
  }
}

module.exports = {
  postContribute,
};
