require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./database/dbConnection");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const dailyTrackingRoutes = require("./routes/dailyTracking.routes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/dailyTracking", dailyTrackingRoutes);

// Connect to DB
connectDB();

//cron
require('./cron/updateUserStatus');

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
