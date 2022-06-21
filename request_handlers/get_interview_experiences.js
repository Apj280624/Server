// my modules

const { InterviewExperience } = require("../utilities/mongoose_models.js");
const { statusText } = require("../utilities/server_vars_utility.js");

/* 
article for searching by starting string:

https://stackoverflow.com/questions/29809887/mongoose-query-for-starts-with

google: mongoose start with

*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getInterviewExperiences(req, res) {
  // just get all contributions from DB

  /* to know about searching and regex see the comments above */

  //  console.log(req.params.keyword);

  const conditions =
    !req.params || !req.params.keyword || req.params.keyword === "all"
      ? null
      : { companyName: { $regex: "^" + req.params.keyword } };

  // console.log(conditions);

  InterviewExperience.find(
    { ...conditions, isDeleted: false },
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
