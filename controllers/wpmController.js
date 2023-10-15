const moment = require("moment");

const mongoose = require("mongoose");

//Models
const Passwords = require("../models/wpmTrans");
const Users = require("../models/wpmUsers");

const bcrypt = require("bcrypt");
const async = require("async");
const crypto = require("crypto");

const { sendMail } = require("../helpers/gaglib");

/**
 * -------------- OBSERVATION CONTROLLERS ----------------
 */

// get all password list
const getPasswords = async (req, res) => {
  const passwords = await Passwords.find({}).sort({ createdAt: -1 });
  console.log("server side: ", passwords);
  res.status(200).json(passwords);
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
  const { username, password, url, remarks } = req.body;

  // add to the database
  // encrypt password first before saving into the database
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const pwtrans = await Passwords.create({
      username,
      password: hashedPassword,
      url,
      remarks,
    });

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
  console.log("req.body: ", req.body);
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
  console.log(req.body);
  console.log(pwtrans);

  res.status(200).json(pwtrans);
};

// close-out an observation
const closeObservation = async (req, res) => {
  console.log("req.body: ", req.body);
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such observation" });
  }

  const observation = await Observation.findOneAndUpdate(
    { _id: id },
    {
      actionTaken: req.body.actionTaken,
      dateclosed: req.body.dateclosed,
      status: req.body.status,
      isResolved: true,
    },
    { new: true }
  );

  if (!observation) {
    return res.status(400).json({ error: "No such observation" });
  }
  req.body._id = id;
  console.log("close out req.body", req.body);
  console.log("after update: ", observation);

  res.status(200).json(observation);
};

/**
 * -------------- SHOW IMAGE CONTROLLER ----------------
 */
const showImage = (req, res) => {
  // console.log(mongoose.connection.db);
  let gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "sosdocs",
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
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      password: hashedPassword,
      lastname,
      firstname,
      admin: false,
    });
    console.log("new user:", user);

    var recvr = email,
      subject = "Welcome " + firstname,
      emailbody =
        "Registration successful. You may now access the app by going to this url: https://wpm.herokuapp.com and use your username: " +
        email +
        " and password. \n";

    sendMail(recvr, subject, emailbody); //send welcome email to user

    res.status(200).json({ message: "User created" });
  } catch (error) {
    res.redirect("/register");
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
      },
      { new: true }
    );
    const updateduser = {
      id: users.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
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
