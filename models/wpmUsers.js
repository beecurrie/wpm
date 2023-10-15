const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wpmUserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
    admin: { type: Boolean },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WpmUser", wpmUserSchema);
