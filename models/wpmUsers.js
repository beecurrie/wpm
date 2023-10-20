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
    admin: { type: Boolean },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

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

  //i'll activate this validator once all the testing done - GAG: 21-Oct-2023
  // if (!validator.isStrongPassword(password)) {
  //   throw Error("Password not strong enough");
  // }

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
    admin: false,
  });

  return user;
};

//static login method
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
