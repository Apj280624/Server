// my modules

const { ContributionDetails } = require("../utilities/mongoose_models.js");
const { statusText } = require("../utilities/server_vars_utility.js");

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getContributions(req, res) {
  // just get all contributions from DB
  console.log(req);
  ContributionDetails.find((err, foundContributionDetails) => {
    if (err) {
      console.log(err);
      res.status(400).send(statusText.CONTRIBUTIONS_NOT_FOUND);
    } else if (!foundContributionDetails) {
      res.status(400).send(statusText.CONTRIBUTIONS_NOT_FOUND);
    } else {
      res.status(200).send({
        arrayOfContributionDetails: foundContributionDetails,
        statusText: statusText.CONTRIBUTIONS_FOUND,
      });
    }
  }).clone(); // .clone() for multiple requests;
}

module.exports = {
  getContributions,
};
