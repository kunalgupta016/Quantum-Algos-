import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNews } from "../../services/api";

const tagColors = {
  Hardware: "#3b82f6",
  Research: "#8b5cf6",
  Policy: "#f59e0b",
  Industry: "#10b981",
  Algorithm: "#06b6d4",
  Defence: "#ef4444",
  Space: "#6366f1",
  Healthcare: "#ec4899",
};

export default function NewsPage() {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 13; // 1 for featured + 12 for grid

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await getNews(page, limit);
        if (data.data) {
          setNewsItems(data.data);
          setTotalPages(data.totalPages);
        } else {
          setNewsItems(data);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to load news", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [page]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-app-base)", color: "white" }}>
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">Loading news...</div>
      </div>
    );
  }

  const featuredNews = page === 1 ? (newsItems.find(n => n.isFeatured) || newsItems[0]) : null;
  const otherNews = newsItems.filter(n => n._id !== (featuredNews ? featuredNews._id : null));
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-app-base)", color: "var(--color-app-text-main)" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Quantum <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>News</span>
          </h1>
          <p style={{ color: "var(--color-app-text-muted)", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto" }}>
            Stay updated with the latest developments in the global quantum computing landscape
          </p>
        </motion.div>

        {/* Featured News */}
        {featuredNews && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            style={{
              padding: "2.5rem",
              borderRadius: "1.25rem",
              border: "1px solid var(--color-app-card-border)",
              background: "linear-gradient(135deg, var(--color-app-primary-glow), rgba(139,92,246,0.05))",
              marginBottom: "2.5rem",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/news/${featuredNews._id}`)}
          >
            <span style={{
              display: "inline-block",
              padding: "0.2rem 0.75rem",
              borderRadius: 999,
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              background: `${tagColors[featuredNews.tag] || "#f59e0b"}20`,
              color: tagColors[featuredNews.tag] || "#f59e0b",
              marginBottom: "0.75rem",
            }}>
              🔥 Featured — {featuredNews.tag}
            </span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-app-text-main)", marginBottom: "0.75rem" }}>
              {featuredNews.title}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-app-text-muted)", lineHeight: 1.7, marginBottom: "1rem", maxWidth: 700 }}>
              {featuredNews.excerpt}
            </p>
            <div style={{ fontSize: "0.75rem", color: "var(--color-app-text-light)", display: "flex", gap: "0.75rem" }}>
              <span>{featuredNews.source}</span>
              <span>•</span>
              <span>{featuredNews.date}</span>
            </div>
          </motion.div>
        )}

        {/* News Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {otherNews.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{
                padding: "1.75rem",
                borderRadius: "1rem",
                border: "1px solid var(--color-app-card-border)",
                background: "var(--color-app-card-bg)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => navigate(`/news/${item._id}`)}
            >
              <span style={{
                display: "inline-block",
                padding: "0.2rem 0.75rem",
                borderRadius: 999,
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: `${tagColors[item.tag] || "#3b82f6"}15`,
                color: tagColors[item.tag] || "#3b82f6",
                marginBottom: "0.75rem",
              }}>
                {item.tag}
              </span>

              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-app-text-main)", marginBottom: "0.5rem", lineHeight: 1.4 }}>
                {item.title}
              </h3>

              <p style={{ fontSize: "0.8rem", color: "var(--color-app-text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
                {item.excerpt}
              </p>

              <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.7rem", color: "var(--color-app-text-light)" }}>
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>
            </motion.div>
          ))}
        </div>


        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
            <button 
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo(0, 0); }} 
              disabled={page === 1} 
              style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1px solid var(--color-app-border)", background: "var(--color-app-base)", color: "var(--color-app-text-main)", opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <span style={{ fontSize: "0.9rem", color: "var(--color-app-text-muted)" }}>Page {page} of {totalPages}</span>
            <button 
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }} 
              disabled={page === totalPages} 
              style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1px solid var(--color-app-border)", background: "var(--color-app-base)", color: "var(--color-app-text-main)", opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
