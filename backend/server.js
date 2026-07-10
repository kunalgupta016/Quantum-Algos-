/**
 * QuantumLab — Express Backend
 *
 * Start with:
 *    cd backend
 *    npm run dev
 *
 * Runs on http://localhost:8000
 * API docs: just check routes/algorithmRoutes.js
 */

const express = require("express");
const cors = require("cors");
const algorithmRoutes = require("./routes/algorithmRoutes");
const sandboxRoutes = require("./routes/sandboxRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" })); // Increased for large code submissions

// ─── Routes ──────────────────────────────────────
app.use("/api", algorithmRoutes);
app.use("/api", sandboxRoutes);

// ─── Health check ────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "QuantumLab API is running" });
});

// ─── Start ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 QuantumLab API running at http://localhost:${PORT}`);
  console.log(`  📡 Endpoints:`);
  console.log(`     GET  /api/algorithms`);
  console.log(`     GET  /api/algorithms/:id`);
  console.log(`     POST /api/run`);
  console.log(`     POST /api/sandbox/run\n`);
});
