require("dotenv").config();

const connectDB = require("./config/db");

connectDB(); // ✅ MUST be called

const express = require("express");
//const cors = require("cors");

const app = express(); // ✅ MUST be defined BEFORE using app

//app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});