import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * QudaQ-inspired Quantum Playground — login required.
 * Placeholder page that will be expanded with interactive features.
 */
export default function QuantumPlayground() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 items-center justify-center p-8" style={{ background: "var(--color-app-base)", minHeight: "60vh" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "3rem",
            borderRadius: "1.5rem",
            border: "1px solid var(--color-app-border)",
            background: "var(--color-app-glass)",
            maxWidth: 500,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-app-text-main)", marginBottom: "0.75rem" }}>
            Login Required
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--color-app-text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            The Quantum Playground requires authentication. Please sign in to access interactive quantum experiments.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, var(--color-app-primary), var(--color-app-primary-hover))",
              color: "white",
              fontWeight: 700,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Sign In →
          </Link>
        </motion.div>
      </div>
    );
  }

  const playgroundItems = [
    {
      icon: "🎯",
      title: "Qubit Visualizer",
      desc: "Interact with individual qubits on the Bloch sphere. Apply gates and see state changes in real-time.",
      status: "Available",
    },
    {
      icon: "🧩",
      title: "Gate Playground",
      desc: "Experiment with quantum gates — drag, drop, and combine gates to see their matrix representations.",
      status: "Available",
    },
    {
      icon: "🔗",
      title: "Entanglement Lab",
      desc: "Create and visualize entangled states. Explore Bell states and quantum correlations interactively.",
      status: "Coming Soon",
    },
    {
      icon: "📐",
      title: "Circuit Challenges",
      desc: "Solve quantum circuit puzzles — build circuits that produce target output states.",
      status: "Coming Soon",
    },
    {
      icon: "🎲",
      title: "Quantum Games",
      desc: "Play games powered by quantum mechanics — quantum coin flipping, quantum tic-tac-toe, and more.",
      status: "Coming Soon",
    },
    {
      icon: "🏆",
      title: "Algorithm Challenges",
      desc: "Implement quantum algorithms step-by-step and compare your solutions with optimal implementations.",
      status: "Coming Soon",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ background: "var(--color-app-base)" }} data-lenis-prevent="true">
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: 999,
            background: "var(--color-app-primary-glow)",
            border: "1px solid var(--color-app-border)",
            marginBottom: "1rem",
          }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-app-primary)" }}>
              🎮 Quantum Playground
            </span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-app-text-main)", marginBottom: "0.5rem" }}>
            Welcome, {user?.username}!
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--color-app-text-muted)" }}>
            Interactive quantum computing experiments and challenges
          </p>
        </motion.div>

        {/* Playground Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {playgroundItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}
              style={{
                padding: "2rem",
                borderRadius: "1rem",
                border: "1px solid var(--color-app-card-border)",
                background: "var(--color-app-card-bg)",
                cursor: item.status === "Available" ? "pointer" : "default",
                opacity: item.status === "Available" ? 1 : 0.6,
                transition: "all 0.3s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                <span style={{
                  padding: "0.15rem 0.6rem",
                  borderRadius: 999,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  background: item.status === "Available" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                  color: item.status === "Available" ? "#10b981" : "#f59e0b",
                }}>
                  {item.status}
                </span>
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-app-text-main)", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--color-app-text-muted)", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
