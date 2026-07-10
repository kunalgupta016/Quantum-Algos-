/**
 * Application-wide constants
 */
export const APP_NAME = "QuantumLab";
export const APP_TAGLINE = "Quantum Algorithm Research Platform";
export const APP_DESCRIPTION =
  "An interactive platform for quantum algorithm research, simulation, and experimentation using Qiskit.";

export const APP_ORG = "Quantum Platform";
export const APP_ORG_SHORT = "QP";

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Bloch Sphere", path: "/blochsphere" },
  { label: "Circuit Simulator", path: "/circuit-simulator" },
  { label: "Sandbox", path: "/sandbox" },
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
