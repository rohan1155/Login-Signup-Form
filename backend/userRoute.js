const express = require("express");
const router = express.Router();
const User = require("./userModel");
const { hash, compare } = require("bcryptjs");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User signed up successfully!", userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    res
      .status(201)
      .json({ message: "User logged in successfully!", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
