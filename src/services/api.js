import axios from "axios";

/**
 * API Configuration
 *
 * Base URL defaults to localhost:8000 for local FastAPI development.
 * Override via VITE_API_BASE_URL environment variable.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 2 minutes — Papermill + Qiskit execution can take time
});

/**
 * Fetches the list of available algorithms from the backend.
 * Falls back to local data if backend is unavailable.
 */
export async function getAlgorithms() {
  const response = await apiClient.get("/algorithms");
  return response.data;
}

/**
 * Submits algorithm parameters and runs the quantum simulation.
 *
 * @param {string} algorithmId — algorithm slug
 * @param {Object} parameters — user-entered parameter values
 * @returns {Object} — { graph, circuit, blochSphere, console, measurements }
 */
export async function runAlgorithm(algorithmId, parameters) {
  const response = await apiClient.post("/run", {
    algorithmId,
    parameters,

  });
  console.log(response.data);
  return response.data;
}

export default apiClient;
