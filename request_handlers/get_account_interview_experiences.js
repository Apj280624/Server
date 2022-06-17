require("dotenv").config();
const _ = require("lodash");
const jwt = require("jsonwebtoken");

// my modules

const {
  InterviewExperience,
  User,
} = require("../utilities/mongoose_models.js");
const { statusText, vars } = require("../utilities/server_vars_utility.js");
const {
  isExpired,
  generateTimeStamp,
} = require("../utilities/server_utility.js");

/*
const obj = { ...foundUser };
        console.log(obj); this gives unexpected result that's if we use object destructuring in personal
        details, solution to this problem:
        https://stackoverflow.com/questions/63897396/destructuring-of-the-object-returned-by-mongodb-query-result

        we can use toObject() method
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getAccountInterviewExperiences(req, res) {
  if (!req.headers || !req.headers.authorization) {
    // console.log("missing header and body");
    res.status(401).send(statusText.NOT_AUTHORIZED);
  } else {
    // console.log(req.headers);
    // read about Bearer schema in jwt docs
    const token = _.split(req.headers.authorization, " ", 2)[1]; // removing the string "Bearer "
    // console.log(token);

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          // console.log(err);
          res.status(400).send(statusText.TOKEN_INVALID_CANNOT_DISPLAY_ACCOUNT);
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
          // fetch acc details
          await User.findOne(
            { emailAddress: emailAddress },
            [
              "firstName",
              "lastName",
              "collegeName",
              "branchName",
              "graduationYear",
              "emailAddress",
              "timeStamp",
            ],
            (err, foundUser) => {
              if (err) {
                // console.log(err);
                res.status(500).send(statusText.ACCOUNT_FETCH_FAILED);
              } else if (!foundUser) {
                res.status(400).send(statusText.ACCOUNT_NOT_FOUND);
              } else {
                // fetch interview experiences
                // console.log(emailAddress);
                getExperiences(emailAddress, foundUser, res);
              }
            }
          ).clone(); // .clone() for multiple requests;
        }
      }
    );
  }
}
async function getExperiences(emailAddress, foundUser, res) {
  // just get all contributions of the account holder from DB

  // null is important in the below query
  await InterviewExperience.find(
    { emailAddress: emailAddress },
    null,
    { sort: { updationTimeStamp: -1, companyName: 1 } },
    (err, foundInterviewExperiences) => {
      if (err) {
        // console.log(err);
        res.status(500).send(statusText.UNABLE_TO_FIND_RESOURCE);
      } else if (!foundInterviewExperiences) {
        res.status(400).send(statusText.INTERVIEW_EXPERIENCES_NOT_FOUND);
      } else {
        // console.log(foundInterviewExperiences.length);
        // console.log(foundUser);

        // see comment on the top section to find out why toObject method was called

        // console.log(foundInterviewExperiences);

        res.status(200).send({
          personalDetails: {
            ...foundUser.toObject(),
            ...{ noOfContributions: foundInterviewExperiences.length },
          },
          arrayOfInterviewExperiences: foundInterviewExperiences,
          statusText: statusText.INTERVIEW_EXPERIENCES_FOUND,
        });
      }
    }
  ).clone(); // .clone() for multiple requests;
}

module.exports = {
  getAccountInterviewExperiences,
};
