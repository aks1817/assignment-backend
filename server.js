require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const apiRoutes = require("./routes/api");
require("./schedulers/priorityUpdate");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
