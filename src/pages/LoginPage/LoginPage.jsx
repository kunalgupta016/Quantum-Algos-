import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login, register, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--color-app-base)" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "var(--color-app-primary-glow)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(139,92,246,0.05)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ border: "1px solid var(--color-app-border)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full" style={{ border: "1px solid var(--color-app-border)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <img src="/logo.png" alt="Logo" className="h-20 w-20 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-app-text-main)" }}>
            Quantum Simulation Lab
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-app-text-muted)" }}>
            Scientific Analysis Group (SAG)
          </p>
        </motion.div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{
          border: "1px solid var(--color-app-border)",
          background: "var(--color-app-glass)",
          backdropFilter: "blur(20px)",
        }}>
          <h2 className="text-lg font-bold mb-6 text-center" style={{ color: "var(--color-app-text-main)" }}>
            {isRegisterMode ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-app-text-muted)" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                style={{
                  border: "1px solid var(--color-app-border)",
                  background: "var(--color-app-base)",
                  color: "var(--color-app-text-main)",
                }}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--color-app-text-muted)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                style={{
                  border: "1px solid var(--color-app-border)",
                  background: "var(--color-app-base)",
                  color: "var(--color-app-text-main)",
                }}
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--color-app-primary), var(--color-app-primary-hover))",
                boxShadow: "0 4px 15px var(--color-app-primary-glow)",
              }}
            >
              {loading
                ? "Please wait..."
                : isRegisterMode
                ? "Create Account"
                : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError("");
              }}
              className="text-xs transition-colors"
              style={{ color: "var(--color-app-text-muted)" }}
            >
              {isRegisterMode
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--color-app-text-light)" }}>
          Defence Research & Development Organisation
        </p>
      </motion.div>
    </div>
  );
}
