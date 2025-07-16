require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./database/dbConnection");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Connect to DB
connectDB();

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));