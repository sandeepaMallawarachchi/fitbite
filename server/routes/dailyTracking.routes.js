const express = require("express");
const router = express.Router();
const { getDailyTracking, saveDailyTracking } = require("../controllers/dailyTracking.controller");
const { verifyToken } = require('../middlewares/auth.middleware');

router.get("/getDailyTracking/:userId/:date", verifyToken, getDailyTracking);

router.post("/saveDailyTracking", verifyToken, saveDailyTracking);

module.exports = router;
