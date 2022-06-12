require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { ContributionDetails, User } = require("../utilities/mongoose_models");

// my modules
const { isExpired, generateTimeStamp } = require("../utilities/server_utility");
const { statusText, vars } = require("../utilities/server_vars_utility");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postContribute(req, res) {
  if (!req.headers || !req.headers.authorization || !req.body) {
    console.log("missing header or body");
    // res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  }

  // console.log(req.headers);
  // console.log(req.body); // read about Bearer schema in jwt docs
  const token = _.split(req.headers.authorization, " ", 2)[1]; // removing the string "Bearer "
  const contributionDetails = req.body;
  // console.log(token);
  // console.log(contributionDetails);

  // first verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      // console.log(err);
      res.status(400).send(statusText.TOKEN_INVALID);
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
            console.log(err);
            res.status(500).send(statusText.CONTRIBUTION_FAILED);
          } else if (!foundDoc) {
            res.status(500).send(statusText.CONTRIBUTION_FAILED);
          } else {
            /* object destructuring was not working with foundDoc maye be because of _id field in foundDoc, so i created
            an object */

            const foundUser = {
              firstName: foundDoc.firstName,
              lastName: foundDoc.lastName,
              collegeName: foundDoc.collegeName,
              branchName: foundDoc.branchName,
              graduationYear: foundDoc.graduationYear,
            };

            const newContributionDetails = new ContributionDetails({
              ...foundUser,
              ...contributionDetails,
            });

            console.log(newContributionDetails);
            newContributionDetails.save((err) => {
              if (err) {
                res.status(500).send(statusText.CONTRIBUTION_FAILED);
              } else {
                res.status(200).send(statusText.CONTRIBUTION_SUCCESS);
              }
            });
          }
        }
      );
      // add contribution to DB
    }
  });
}

module.exports = {
  postContribute,
};
