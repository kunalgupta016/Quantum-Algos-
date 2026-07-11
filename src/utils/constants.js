/**
 * Application-wide constants
 */
export const APP_NAME = "Quantum Simulation Lab";
export const APP_TAGLINE = "Quantum Algorithm Research Platform";
export const APP_DESCRIPTION =
  "An interactive platform for quantum algorithm research, simulation, and experimentation using Qiskit.";

export const APP_ORG = "Scientific Analysis Group (SAG)";
export const APP_ORG_SHORT = "DRDO";

/**
 * Public navigation links (shown in main navbar)
 */
export const PUBLIC_NAV_LINKS = [
  { label: "Blogs", path: "/blogs" },
  { label: "News", path: "/news" },
  { label: "Docs", path: "/docs" },
];

/**
 * Sidebar links (shown after login in sidebar)
 */
export const SIDEBAR_LINKS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    label: "Bloch Sphere",
    path: "/blochsphere",
    icon: "bloch",
  },
  {
    label: "Circuit Simulator",
    path: "/circuit-simulator",
    icon: "circuit",
  },
  {
    label: "Sandbox",
    path: "/sandbox",
    icon: "sandbox",
  },
];

/**
 * Algorithm series order.
 * Algorithms are displayed in this exact order (not by category).
 * The id must match the algorithm's id field.
 */
export const ALGORITHM_SERIES_ORDER = [
  "deutsch",
  "deutsch-jozsa",
  "bernstein-vazirani",
  "simon",
  "grover-search",
  "shor",
  "hhl",
  "vqc",
  "vqe",
  "qaoa",
  "qubo",
  "quantum-teleportation",
  "superdense-coding",
  // Remaining algorithms go after these
  "qft",
  "quantum-phase-estimation",
  "bb84",
];

export const COMPLEXITY_LABELS = {
  time: "Time Complexity",
  space: "Space Complexity",
};

export const OUTPUT_SECTIONS = {
  GRAPH: "graph",
  CIRCUIT: "circuit",
  BLOCH: "blochSphere",
  CONSOLE: "console",
  MEASUREMENTS: "measurements",
};
