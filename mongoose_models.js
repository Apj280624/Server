const mongoose = require("mongoose");

///////////////////////////////////////////////// VOTP ////////////////////////////////////////////////////

// Schema

const VOTPSchema = new mongoose.Schema(
  {
    emailAddress: String,
    VOTP: String,
  },
  { timestamps: true }
);

// Model

const VOTP = mongoose.model("VOTP", VOTPSchema);

///////////////////////////////////////////////// FOTP ////////////////////////////////////////////////////

// Schema

const FOTPSchema = new mongoose.Schema(
  {
    emailAddress: String,
    FOTP: String,
  },
  { timestamps: true }
);

// Model

const FOTP = mongoose.model("FOTP", FOTPSchema);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  VOTP,
  FOTP,
};
