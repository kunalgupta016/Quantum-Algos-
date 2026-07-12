/**
 * Sandbox API Routes
 *
 * POST /api/sandbox/run → execute user Python code
 */

const express = require("express");
const router = express.Router();
const { runSandboxCode, installPackages } = require("../controllers/sandboxController");

router.post("/sandbox/run", runSandboxCode);
router.post("/sandbox/install", installPackages);

module.exports = router;
