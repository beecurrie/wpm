//This is the database model for recording the users of the application

const mongoose = require("mongoose");
const brcrypt = require("bcrypt");
const validator = require("validator");

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
    userkey: { type: String },
    admin: { type: Boolean },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

//Static method for signing up a user
wpmUserSchema.statics.signup = async function (
  email,
  password,
  lastname,
  firstname,
  attachment
) {
  if (!email || !password || !lastname || !firstname || !attachment) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }
  const salt = await brcrypt.genSalt(10);
  const hash = await brcrypt.hash(password, salt); //hashed password with the salt

  const user = await this.create({
    email,
    password: hash,
    lastname,
    firstname,
    attachment,
    userkey: hash,
    admin: false,
  });

  return user;
};

//Static method to login
wpmUserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }
  const match = await brcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

module.exports = mongoose.model("WpmUser", wpmUserSchema);
