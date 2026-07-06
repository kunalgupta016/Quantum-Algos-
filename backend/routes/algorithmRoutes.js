/**
 * Algorithm API Routes
 *
 * GET  /api/algorithms      → list all algorithms
 * GET  /api/algorithms/:id  → get single algorithm
 * POST /api/run             → run algorithm simulation
 */

const express = require("express");
const router = express.Router();
const {
  getAlgorithms,
  getAlgorithmById,
  runAlgorithm,
} = require("../controllers/algorithmController");

router.get("/algorithms", getAlgorithms);
router.get("/algorithms/:id", getAlgorithmById);
router.post("/run", runAlgorithm);

module.exports = router;
