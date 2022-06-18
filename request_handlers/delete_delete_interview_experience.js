require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");


// my modules
const { statusText, vars } = require("../utilities/server_vars_utility.js");
const { isExpired } = require("../utilities/server_utility.js");
const { InterviewExperience } = require("../utilities/mongoose_models");
const { generateTimeStamp } = require("../utilities/server_utility");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

async function deleteDeleteInterviewExperience(req, res) {
  if (!req.headers || !req.headers.authorization || !req.body) {
    // console.log("missing header or body");
    res.status(401).send(statusText.NOT_AUTHORIZED);
  } else if (!req.params || !req.params.id) {
    res.status(401).send(statusText.SOMETHING_WENT_WRONG);
  } else {
    // read about Bearer schema in jwt docs
    const token = _.split(req.headers.authorization, " ", 2)[1]; // removing the string "Bearer "
    // console.log(token);

    // first verify token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err);
        res.status(400).send(statusText.TOKEN_INVALID_CANNOT_EDIT);
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
        const emailAddress = decodedToken.emailAddress;
        const id = req.params.id;
        deleteInterviewExperience(emailAddress, id, res);
      }
    });
  }
}

async function deleteInterviewExperience(emailAddress, id, res) {
  await InterviewExperience.findOneAndUpdate(
    {
      emailAddress: emailAddress,
      _id: id,
    },
    { isDeleted: true },
    { overwrite: false },
    (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.INTERVIEW_EXPERIENCE_DELETE_FAILED);
      } else {
        res.status(200).send(statusText.INTERVIEW_EXPERIENCE_DELETE_SUCCESS);
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  deleteDeleteInterviewExperience,
};
