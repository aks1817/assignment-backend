const mongoose = require("mongoose");
const connectionUrl = process.env.MONGO_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(connectionUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
