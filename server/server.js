require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/dbConnection");

const app = express();
app.use(cors());
app.use(express.json());

// const authRoutes = require("./routes/authRoutes");

// app.use("/auth", authRoutes);

// Connect to DB
connectDB();

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));