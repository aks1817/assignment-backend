const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
}

module.exports = { generateToken };
