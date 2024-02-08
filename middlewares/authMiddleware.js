const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
function authenticate(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded.userId; // Extract the user ID from the decoded token

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authenticate;
