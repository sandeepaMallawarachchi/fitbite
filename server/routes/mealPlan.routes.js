const express = require("express");
const router = express.Router();
const {
  getMealPlan,
  createMealPlan,
  updateMealPlan
} = require("../controllers/mealPlan.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

// GET
router.get("/get/:userId", verifyToken, getMealPlan);

// CREATE
router.post("/create", verifyToken, createMealPlan);

// UPDATE
router.put("/update/:id", verifyToken, updateMealPlan);

module.exports = router;
