const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

const User = require("../models/user.model");
const authenticate = require("../middlewares/authenticate");
const authorise = require("../middlewares/authorise");


const newToken = (user) => {
  return jwt.sign({ user: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};




router.post("/register", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec();
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Please provide correct email and password" });
    }
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Please provide correct email and password" });
    }
    const token = newToken(user);
    const { email, _id, name } = user;
    return res.status(200).json({ _id, email, name, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/all", authenticate, authorise(["admin"]), async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authenticate, authorise(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", authenticate, authorise(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
