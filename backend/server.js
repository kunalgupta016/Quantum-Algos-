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

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────
app.use("/api", algorithmRoutes);

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
  console.log(`     POST /api/run\n`);
});
