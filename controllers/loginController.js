const User = require("../models/user");
const { generateToken } = require("../utility/authUtility");

exports.login = async (req, res) => {
  try {
    const { phone_number } = req.query;

    // Find the user by phone number
    const user = await User.findOne({ phone_number });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
