const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("  ❌ JWT_SECRET is not set in environment variables!");
  process.exit(1);
}

/**
 * Middleware: Authenticate
 * Verifies JWT from Authorization header and attaches user to req.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/**
 * Middleware: Admin Only
 * Must be used AFTER authenticate middleware.
 */
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  next();
}

module.exports = { authenticate, adminOnly, JWT_SECRET };
