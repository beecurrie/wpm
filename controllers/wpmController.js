const moment = require("moment");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

//Models
const Passwords = require("../models/wpmTrans");
const Users = require("../models/wpmUsers");

const bcrypt = require("bcrypt");
const async = require("async");

const { sendMail } = require("../helpers/gaglib");

//JWT - create JSON Web Token
const createToken = (_id, email, lastname, firstname) => {
  return jwt.sign(
    { _id, email, lastname, firstname },
    process.env.SESSION_SECRET,
    { expiresIn: "1d" }
  );
};

/**
 * -------------- OBSERVATION CONTROLLERS ----------------
 */

// get all password list

const getPasswords = async (req, res) => {
  const { id } = req.params;
  const passwords = await Passwords.find({ owner: id }).sort({ createdAt: -1 });

  const decryptedList = passwords.map((pw) => {
    // encryption key
    const key = req.user.password;

    // encryption algorithm
    const algorithm = "aes-256-cbc";

    // create a decipher object
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(pw.password, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return {
      _id: pw._id,
      owner: pw.owner,
      username: pw.username,
      password: decrypted,
      url: pw.url,
      remarks: pw.remarks,
    };
  });
  // console.log("server side: ", decryptedList);
  res.status(200).json(decryptedList);
};

// get a single observation
const getPassword = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such password" });
  }

  const password = await Passwords.findById(id);

  if (!password) {
    return res.status(404).json({ error: "No such password" });
  }

  res.status(200).json(password);
};

// create a new password record
const createPWTrans = async (req, res) => {
  // console.log("req.body", req.body);
  const { username, password, url, remarks } = req.body;
  // console.log("from middleware: ", req.user);

  //TO DO: Use crypto module to encrypt and decrypt password. Do not use hashing as this is only one way.
  // 'crypto' module will require a 'secret key' to encrypt and decrypt. Use the stored encrypted login password of the user as the secret key for all
  // password entries - DONE! - 19-Oct-2023

  // add to the database
  // encrypt password first before saving into the database

  // plain text
  const plainText = password; //from client taken from req.body.password
  // console.log(plainText);

  // encryption key
  const key = req.user.password;
  console.log("key: ", key);

  // encryption algorithm
  const algorithm = "aes-256-cbc";

  // create a cipher object
  const cipher = crypto.createCipher(algorithm, key);

  // encrypt the plain text
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  // console.log(encrypted);

  try {
    let pwtrans = await Passwords.create({
      owner: req.user.email,
      username,
      password: encrypted,
      url,
      remarks,
    });
    pwtrans.password = plainText; //return the plain text to client similar to the getPasswords() code
    // pwtrans.id = _id;
    console.log("pwtrans: ", pwtrans);
    res.status(200).json(pwtrans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a password transaction
const deletePwTrans = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such password transction" });
  }

  const pwtrans = await Passwords.findOneAndDelete({ _id: id });

  if (!pwtrans) {
    return res.status(400).json({ error: "No such password transaction" });
  }

  res.status(200).json(pwtrans);
};

// update a password tranaction
const updatePWTrans = async (req, res) => {
  // console.log("req.body: ", req.body);
  const { id } = req.params;
  const { username, password, url, remarks } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such password transaction" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const pwtrans = await Passwords.findOneAndUpdate(
    {
      _id: id,
      password: hashedPassword,
      url,
      remarks,
    },
    { new: true }
  );

  if (!pwtrans) {
    return res.status(400).json({ error: "No such password transaction" });
  }
  req.body._id = id;
  // console.log(req.body);
  // console.log(pwtrans);

  res.status(200).json(pwtrans);
};

/**
 * -------------- SHOW IMAGE CONTROLLER ----------------
 */
const showImage = (req, res) => {
  // console.log(mongoose.connection.db);
  let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "wpmdocs",
  });

  const readstream = gridFSBucket.openDownloadStreamByName(req.params.filename);
  readstream.pipe(res);
};

// const showImage = (req, res) => {
//   res.redirect(`/images/${req.params.filename}`); //well done mate! re-routed the API call! now using static file instead of saving into mongodb: 13-May-23
// };

/**
 * -------------- USER CONTROLLERS ----------------
 */

// get all users
const getUsers = async (req, res) => {
  const users = await Users.find({}).sort({ lastname: -1 });
  console.log("server side users: ", users);
  res.status(200).json(users);
};

// create a new user
const createUser = async (req, res) => {
  const { email, password, lastname, firstname } = req.body;

  // add to the database
  // try {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = await Users.create({
  //     email,
  //     password: hashedPassword,
  //     lastname,
  //     firstname,
  //     admin: false,
  //     attachment: req.fname, //this req.fname was added from the previous middleware
  //   });
  //   console.log("new user:", user);

  //   var recvr = email,
  //     subject = "Welcome " + firstname,
  //     emailbody =
  //       "Registration successful. You may now access the app by going to this url: https://wpm.herokuapp.com and use your username: " +
  //       email +
  //       " and password. \n";

  //   // sendMail(recvr, subject, emailbody); //send welcome email to user --> re-activate later when the email address is setup

  //   res.status(200).json({ message: "User created" });
  // } catch (error) {
  //   console.log(error.message);
  //   res.status(400).json({ error: error.message });
  //   // res.redirect("/register");
  // }

  // Changes 21-Oct-2023:
  // 1. Used Mongoose Static functions. Modified Users model to include static functions for creating a user and logging-in a user
  // 2. Used JSON Web Token (JWT) to return the created user. We'll be using this moving forward as part of the authentication process

  try {
    const user = await Users.signup(
      email,
      password,
      lastname,
      firstname,
      req.fname //attachment field
    );

    //create token
    const token = createToken(user._id, email, lastname, firstname);
    console.log(token);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { lastname, firstname } = req.body;

  // update the database
  try {
    const user = await Users.findOneAndUpdate(
      { email: req.params.id },
      {
        lastname,
        firstname,
        attachment: req.fname, //added: 04-Nov-2023. Before this fix, the image's filename was not being saved thus resulting from displaying the previous image not the updated one
      },
      { new: true }
    );
    const updateduser = {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
      attachment: req.fname, //attachment field
      auth: true,
    };
    console.log("updated user:", updateduser);
    res.status(200).json(updateduser);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }

  const user = await Users.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

const changePassword = async (req, res) => {
  const { email, password, oldpassword } = req.body;

  // update the database with new user password
  try {
    const userpassword = await Users.findOne({ email }); //get user information first including password
    const isValid = bcrypt.compareSync(oldpassword, userpassword.password); //compare stored password with the hashed password passed from the client side
    if (isValid) {
      console.log("Valid password");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        },
        { new: true }
      );
      console.log("password updated for users:", user);
      res.status(200).json({ valid: true, message: "password updated" });
    } else {
      console.log("Invalid password");
      res.status(200).json({ valid: false, message: "wrong password entered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// forgot password

const forgot_post = (req, res, next) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(4, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        Users.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash("error", "User not found!");
            return res
              .status(200)
              .json({ message: "User does not exist", valid: false });

            //res.render('forgot',{errmsg: "User not found!"})
          }

          user.resetPasswordToken = token.toUpperCase();
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          //save token and expiry into database (User)
          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var recvr = user.email,
          subject = "Web-based Password Manager Password Reset",
          emailbody =
            "You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n" +
            "Please enter the following code in the verification box: " +
            token.toUpperCase() +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n";

        sendMail(recvr, subject, emailbody);
        res.status(200).json({ message: "Reset email sent", valid: true });
      },
    ],
    function (err) {
      if (err) return next(err);
      // res.redirect("/api/sos/forgot");
    }
  );
};

const reset_token_get = (req, res) => {
  // console.log(req.params.token);
  Users.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      // console.log("user: ", user);
      if (user === null) {
        req.flash("error", "Password reset token is invalid or has expired.");
        // return res.redirect("/api/sos/forgot");
        res.status(200).json({ token: "not found" });
      } else {
        res.status(200).json({ token: user.resetPasswordToken });
      }
    }
  );
};

const reset_token_post = (req, res) => {
  async.waterfall(
    [
      function (done) {
        Users.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              bcrypt.genSalt(10, function (err, salt) {
                if (err) return next(err);
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                  if (err) return next(err);
                  req.body.password = hash;
                  var userData = new User({
                    password: req.body.password,
                    //passwordConf: req.body.confirm,
                    _id: user._id,
                  });
                  Users.findByIdAndUpdate(
                    user._id,
                    userData,
                    {},
                    function (err, theuser) {
                      if (err) {
                        return next(err);
                      }
                    }
                  );
                });
              });
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              var recvr = user.email,
                subject = "Web-based Password Manager - Password changed",
                emailbody =
                  "Hello,\n\n" +
                  "This is a confirmation that the password for your account " +
                  user.email +
                  " has just been changed.\n";
              sendMail(recvr, subject, emailbody); //located at the top of this file

              req.flash("success", "Success! Your password has been changed.");
              res.redirect("/");
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
    ],
    function (err) {
      res.redirect("/");
    }
  );
};
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  // update the database with new user password
  try {
    // const userpassword = await Users.findOne({ email }); //get user information first including password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    console.log("password updated for user:", user);
    res.status(200).json({ valid: true, message: "password updated" });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

module.exports = {
  getPasswords,
  getPassword,
  createPWTrans,
  deletePwTrans,
  updatePWTrans,
  showImage,
  createUser,
  updateUser,
  changePassword,
  forgot_post,
  reset_token_get,
  reset_token_post,
  resetPassword,
  getUsers,
  deleteUser,
};
