require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("../database/dbConnection");

const app = express();
const allowedOrigins = [
  "https://fitbite-three.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const chatRoutes = require("../routes/chat.routes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

// Connect to DB
connectDB();

//cron
// require('../cron/updateUserStatus');

// Start server
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server running on port ${port}`));

//export app for vercel
module.exports = app;