const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wpmSchema = new Schema(
  {
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
