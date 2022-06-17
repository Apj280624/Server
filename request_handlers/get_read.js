const { InterviewExperience } = require("../utilities/mongoose_models.js");
const { statusText } = require("../utilities/server_vars_utility.js");

function getRead(req, res) {
  // console.log(req.params);
  InterviewExperience.findById(
    req.params.id,
    (err, foundInterviewExperience) => {
      if (err) {
        console.log(err);
        res.status(500).send(statusText.UNABLE_TO_FIND_RESOURCE);
      } else if (!foundInterviewExperience) {
        res.status(404).send(statusText.INTERVIEW_EXPERIENCE_NOT_FOUND);
      } else {
        res.status(200).send({
          interviewExperience: foundInterviewExperience,
          statusText: statusText.INTERVIEW_EXPERIENCE_FOUND,
        });
      }
    }
  );
}

module.exports = {
  getRead,
};
