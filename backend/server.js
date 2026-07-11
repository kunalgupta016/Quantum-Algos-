/**
 * Quantum Simulation Lab — Express Backend
 *
 * Start with:
 *    cd backend
 *    npm run dev
 *
 * Runs on http://localhost:8000
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const algorithmRoutes = require("./routes/algorithmRoutes");
const sandboxRoutes = require("./routes/sandboxRoutes");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 8000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ─── Security: Helmet (HTTP security headers) ────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load cross-origin
}));

// ─── Security: CORS ──────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ─── Security: Rate Limiting ─────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per window
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // max 15 login/register attempts per 15 min
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Body Parsing ────────────────────────────────
app.use(express.json({ limit: "10mb" }));

// ─── Security: NoSQL Injection Prevention ────────
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// ─── Static Files ─────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ──────────────────────────────────────
app.use("/api", algorithmRoutes);
app.use("/api", sandboxRoutes);
app.use("/api/auth", authLimiter); // Apply strict rate limit to auth
app.use("/api", authRoutes);
app.use("/api", contentRoutes);
app.use("/api/upload", uploadRoutes);

// ─── Health check ────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Quantum Simulation Lab API is running" });
});

// ─── Global Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);

  // Multer errors (file upload)
  if (err.name === 'MulterError' || (err.message && err.message.includes('Only image files'))) {
    return res.status(400).json({ error: err.message });
  }

  // CORS errors
  if (err.message && err.message.includes("Not allowed by CORS")) {
    return res.status(403).json({ error: "CORS: Origin not allowed." });
  }

  // In production, never leak internal error details
  if (IS_PRODUCTION) {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ─── Start Server with DB Connection ─────────────
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n  🚀 Quantum Simulation Lab API running at http://localhost:${PORT}`);
    console.log(`  🔒 Security: Helmet, Rate Limiting, Mongo Sanitize enabled`);
    console.log(`  🌐 CORS Origins: ${allowedOrigins.join(", ")}`);
    console.log(`  📡 Endpoints:`);
    console.log(`     GET  /api/algorithms`);
    console.log(`     GET  /api/algorithms/:id`);
    console.log(`     POST /api/algorithms       (admin)`);
    console.log(`     PUT  /api/algorithms/:id   (admin)`);
    console.log(`     DELETE /api/algorithms/:id (admin)`);
    console.log(`     POST /api/run`);
    console.log(`     POST /api/sandbox/run`);
    console.log(`     POST /api/auth/login`);
    console.log(`     POST /api/auth/register`);
    console.log(`     GET  /api/auth/me\n`);
  });
}

startServer();
