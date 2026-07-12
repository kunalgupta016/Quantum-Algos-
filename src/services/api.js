import axios from "axios";

/**
 * API Configuration
 * Base URL defaults to localhost:8000 for local development.
 * VITE_API_BASE_URL should be set in .env.production for deployment.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Server root URL (without /api) — used for image URLs, etc.
export const API_SERVER_URL =
  import.meta.env.VITE_API_SERVER_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

// ─── Axios Interceptor: Attach JWT token to every request ───
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("qsl_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ═══════════════════════════════════════════════════════
// AUTH APIs
// ═══════════════════════════════════════════════════════

export async function loginUser(username, password) {
  const response = await apiClient.post("/auth/login", { username, password });
  return response.data;
}

export async function registerUser(username, password) {
  const response = await apiClient.post("/auth/register", { username, password });
  return response.data;
}

export async function getCurrentUser(token) {
  const response = await apiClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// ═══════════════════════════════════════════════════════
// ALGORITHM APIs
// ═══════════════════════════════════════════════════════

export async function getAlgorithms() {
  const response = await apiClient.get("/algorithms");
  return response.data;
}

export async function getAlgorithmById(id) {
  const response = await apiClient.get(`/algorithms/${id}`);
  return response.data;
}

export async function runAlgorithm(algorithmId, parameters) {
  const response = await apiClient.post("/run", { algorithmId, parameters });
  return response.data;
}

// ─── Admin CRUD ─────────────────────────────────────

export async function createAlgorithm(data) {
  const response = await apiClient.post("/algorithms", data);
  return response.data;
}

export async function updateAlgorithm(id, data) {
  const response = await apiClient.put(`/algorithms/${id}`, data);
  return response.data;
}

export async function deleteAlgorithm(id) {
  const response = await apiClient.delete(`/algorithms/${id}`);
  return response.data;
}

// ═══════════════════════════════════════════════════════
// EDUCATIONAL CONTENT APIs
// ═══════════════════════════════════════════════════════

export async function getEducationalContent(algorithmId) {
  const response = await apiClient.get(`/educational/${algorithmId}`);
  return response.data;
}

export async function updateEducationalContent(algorithmId, data) {
  const response = await apiClient.put(`/educational/${algorithmId}`, data);
  return response.data;
}

// ═══════════════════════════════════════════════════════
// SANDBOX APIs
// ═══════════════════════════════════════════════════════

export async function runSandboxCode(payload) {
  const body = typeof payload === "string" ? { code: payload } : payload;
  const response = await apiClient.post("/sandbox/run", body);
  return response.data;
}

export async function installSandboxPackages(packages) {
  const response = await apiClient.post("/sandbox/install", { packages });
  return response.data;
}

// ═══════════════════════════════════════════════════════
// CMS (Content Management) APIs
// ═══════════════════════════════════════════════════════

// --- Docs ---
export async function getDocs() {
  const res = await apiClient.get("/docs");
  return res.data;
}
export async function createDoc(data) {
  const res = await apiClient.post("/docs", data);
  return res.data;
}
export async function updateDoc(id, data) {
  const res = await apiClient.put(`/docs/${id}`, data);
  return res.data;
}
export async function deleteDoc(id) {
  const res = await apiClient.delete(`/docs/${id}`);
  return res.data;
}

// --- Blogs ---
export async function getBlogs() {
  const res = await apiClient.get("/blogs");
  return res.data;
}
export async function createBlog(data) {
  const res = await apiClient.post("/blogs", data);
  return res.data;
}
export async function updateBlog(id, data) {
  const res = await apiClient.put(`/blogs/${id}`, data);
  return res.data;
}
export async function deleteBlog(id) {
  const res = await apiClient.delete(`/blogs/${id}`);
  return res.data;
}

export async function likeBlog(id) {
  const res = await apiClient.post(`/blogs/${id}/like`);
  return res.data;
}

export async function commentBlog(id, text) {
  const res = await apiClient.post(`/blogs/${id}/comment`, { text });
  return res.data;
}

// --- News ---
export async function getNews() {
  const res = await apiClient.get("/news");
  return res.data;
}
export async function createNews(data) {
  const res = await apiClient.post("/news", data);
  return res.data;
}
export async function updateNews(id, data) {
  const res = await apiClient.put(`/news/${id}`, data);
  return res.data;
}
export async function deleteNews(id) {
  const res = await apiClient.delete(`/news/${id}`);
  return res.data;
}

// ═══════════════════════════════════════════════════════
// UPLOAD APIs
// ═══════════════════════════════════════════════════════

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// ═══════════════════════════════════════════════════════
// CHALLENGES APIs
// ═══════════════════════════════════════════════════════

export async function runChallengeCircuit(numQubits, gates, targetState) {
  const response = await apiClient.post("/challenge/run", { numQubits, gates, targetState });
  return response.data;
}

export async function getChallenges() {
  const response = await apiClient.get("/challenges");
  return response.data;
}

export async function createChallenge(data) {
  const response = await apiClient.post("/admin/challenges", data);
  return response.data;
}

export async function updateChallenge(id, data) {
  const response = await apiClient.put(`/admin/challenges/${id}`, data);
  return response.data;
}

export async function deleteChallenge(id) {
  const response = await apiClient.delete(`/admin/challenges/${id}`);
  return response.data;
}

export default apiClient;
