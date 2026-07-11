const express = require("express");
const { authenticate, adminOnly } = require("../middleware/auth");
const {
  getDocs, addDoc, updateDoc, deleteDoc,
  getBlogs, addBlog, updateBlog, deleteBlog, likeBlog, commentBlog,
  getNews, addNews, updateNews, deleteNews,
} = require("../controllers/contentController");

const router = express.Router();

// --- Docs ---
router.get("/docs", getDocs);
router.post("/docs", authenticate, adminOnly, addDoc);
router.put("/docs/:id", authenticate, adminOnly, updateDoc);
router.delete("/docs/:id", authenticate, adminOnly, deleteDoc);

// --- Blogs ---
router.get("/blogs", getBlogs);
router.post("/blogs", authenticate, adminOnly, addBlog);
router.put("/blogs/:id", authenticate, adminOnly, updateBlog);
router.delete("/blogs/:id", authenticate, adminOnly, deleteBlog);

// Blog Interactions (Logged-in users)
router.post("/blogs/:id/like", authenticate, likeBlog);
router.post("/blogs/:id/comment", authenticate, commentBlog);

// --- News ---
router.get("/news", getNews);
router.post("/news", authenticate, adminOnly, addNews);
router.put("/news/:id", authenticate, adminOnly, updateNews);
router.delete("/news/:id", authenticate, adminOnly, deleteNews);

module.exports = router;
