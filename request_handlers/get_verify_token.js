require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// my modules
const { isExpired, generateTimeStamp } = require("../utilities/server_utility");
const { statusText, vars } = require("../utilities/server_vars_utility");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getVerifyToken(req, res) {
  // console.log(req);

  if (!req.headers || !req.headers.authorization) {
    res.status(400).send(statusText.SOMETHING_WENT_WRONG);
  }

  console.log(req.headers); // read about Bearer schema in jwt docs
  const token = _.split(req.headers.authorization, " ", 2)[1]; // removing the string "Bearer "
  // console.log(token);

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
      res.status(200).send(statusText.TOKEN_VERIFIED);
    }
  });
}

module.exports = {
  getVerifyToken,
};
