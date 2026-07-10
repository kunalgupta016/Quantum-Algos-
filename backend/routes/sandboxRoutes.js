/**
 * Sandbox API Routes
 *
 * POST /api/sandbox/run → execute user Python code
 */

const express = require("express");
const router = express.Router();
const { runSandboxCode } = require("../controllers/sandboxController");

router.post("/sandbox/run", runSandboxCode);

module.exports = router;
