const express = require("express");
const router = express.Router();
const { authenticate, adminOnly } = require("../middleware/auth");
const { 
  runChallengeCircuit,
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge
} = require("../controllers/challengeController");

// Public (authenticated users can run and get)
router.post("/challenge/run", runChallengeCircuit);
router.get("/challenges", getChallenges);

// Admin only (CRUD)
router.post("/admin/challenges", authenticate, adminOnly, createChallenge);
router.put("/admin/challenges/:id", authenticate, adminOnly, updateChallenge);
router.delete("/admin/challenges/:id", authenticate, adminOnly, deleteChallenge);

module.exports = router;
