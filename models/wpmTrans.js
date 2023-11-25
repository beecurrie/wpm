//This is the database model for recording the various password accounts of the user

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wpmSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wpmTrans", wpmSchema);
