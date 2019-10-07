const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
// const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");

// async function run() {
//   const salt = await bcrypt.genSalt();
//   const hashed = await bcrypt.hash("1234", salt);
//   console.log(salt, hashed);
// }

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body.user);
  if (error) return res.status(400).send(error.detail[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user email already exists");

  //   user = new User({ //replaced by _.pick method
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password
  //   });
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  // const salt = await bcrypt.genSalt();
  // user.password = await bcrypt.hash(user.password, salt);
  user.password = "1234";
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token) // adds new entry to response header
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
