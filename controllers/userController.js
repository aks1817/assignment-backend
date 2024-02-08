const User = require("../models/user");

exports.createUser = async (req, res) => {
  try {
    const { phone_number, priority } = req.body;

    // Check if the phone number already exists
    const existingUser = await User.findOne({ phone_number });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // Create the user if the phone number is unique
    const user = await User.create({ phone_number, priority });
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
