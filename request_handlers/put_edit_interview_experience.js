require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// my modules
const { statusText, vars } = require("../utilities/server_vars_utility.js");
const { isExpired } = require("../utilities/server_utility.js");
const { InterviewExperience } = require("../utilities/mongoose_models");
const { generateTimeStamp } = require("../utilities/server_utility");

/*
important case: lets say a user signs in with an email add 'X' and then visits this page and edits, logs out from
other tab and then signs in with an email 'Y' and then make an edit request then also there's no problem
because at the server side the search condition is {email,id} so it will ensure whether the interview
experience belongs to the email or not

*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function putEditInterviewExperience(req, res) {
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
        res.status(400).send(statusText.TOKEN_INVALID_CANNOT_DELETE);
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
        const id = req.params.id;
        const editedInterviewExperience = req.body;
        // console.log(emailAddress);
        // console.log(id);
        // console.log(editedInterviewExperience);
        editInterviewExperience(
          emailAddress,
          id,
          editedInterviewExperience,
          res
        );
      }
    });
  }
}

async function editInterviewExperience(
  emailAddress,
  id,
  editedInterviewExperience,
  res
) {
  // its very imp that the search condition is {email,id}, see top note to know the reason
  await InterviewExperience.findOneAndUpdate(
    {
      emailAddress: emailAddress,
      _id: id,
    },
    {
      ...editedInterviewExperience,
      ...{ updationTimeStamp: generateTimeStamp() },
    },
    { overwrite: false },
    (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.INTERVIEW_EXPERIENCE_EDIT_FAILED);
      } else {
        res.status(200).send(statusText.INTERVIEW_EXPERIENCE_EDIT_SUCCESS);
      }
    }
  ).clone(); // .clone() for multiple requests
}

module.exports = {
  putEditInterviewExperience,
};
