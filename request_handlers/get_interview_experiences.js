// my modules

const { InterviewExperience } = require("../utilities/mongoose_models.js");
const { statusText } = require("../utilities/server_vars_utility.js");

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getInterviewExperiences(req, res) {
  // just get all contributions from DB
  // console.log(req);
  InterviewExperience.find(
    null,
    null,
    { sort: { updationTimeStamp: -1, companyName: 1 } },
    (err, foundInterviewExperiences) => {
      if (err) {
        // console.log(err);
        res.status(500).send(statusText.UNABLE_TO_FIND_RESOURCE);
      } else if (!foundInterviewExperiences) {
        res.status(404).send(statusText.INTERVIEW_EXPERIENCES_NOT_FOUND);
      } else {
        res.status(200).send({
          arrayOfInterviewExperiences: foundInterviewExperiences,
          statusText: statusText.INTERVIEW_EXPERIENCES_FOUND,
        });
      }
    }
  ).clone(); // .clone() for multiple requests;
}

module.exports = {
  getInterviewExperiences,
};
