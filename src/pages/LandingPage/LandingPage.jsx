import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import QuantumAtom3D from "../../components/QuantumAtom3D/QuantumAtom3D";
import "./LandingPage.css";

/* ─── Animation Helpers ───────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ─── Section wrapper with scroll animation ───────── */
function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Data ────────────────────────────────────────── */
const stats = [
  { value: "16+", label: "Algorithms" },
  { value: "6", label: "Tools" },
  { value: "20+", label: "Max Qubits" },
  { value: "∞", label: "Simulations" },
];

const features = [
  {
    icon: "⚛️",
    title: "Algorithm Library",
    description: "16+ pre-loaded quantum algorithms from Deutsch to Shor's, each with detailed theory, proofs, and interactive simulation.",
  },
  {
    icon: "🔬",
    title: "Real-Time Simulation",
    description: "Execute actual Qiskit circuits on IBM's Aer Simulator. Visualize circuit diagrams, probability histograms, and Bloch spheres.",
  },
  {
    icon: "💻",
    title: "Quantum Sandbox",
    description: "Write and run custom Python/Qiskit code in a Colab-like environment with multi-cell support and live output.",
  },
  {
    icon: "🔧",
    title: "Circuit Builder",
    description: "Drag-and-drop quantum gates to build circuits visually. See the generated Qiskit code in real time.",
  },
  {
    icon: "📚",
    title: "Quantum Docs",
    description: "Learn quantum computing from scratch with W3Schools-style interactive documentation covering qubits, gates, and algorithms.",
  },
  {
    icon: "🎮",
    title: "Quantum Playground",
    description: "Interactive QudaQ-inspired platform for hands-on quantum experiments. Build, test, and visualize quantum circuits.",
  },
];

const quantumImages = [
  { title: "Bloch Sphere Visualization", desc: "3D representation of qubit states on the Bloch sphere", gradient: "from-blue-500/20 to-purple-500/20", icon: "🌐" },
  { title: "Quantum Circuit Diagram", desc: "Multi-qubit quantum circuit with gates and measurements", gradient: "from-cyan-500/20 to-blue-500/20", icon: "⚡" },
  { title: "Probability Distribution", desc: "Measurement outcomes showing quantum superposition collapse", gradient: "from-violet-500/20 to-pink-500/20", icon: "📊" },
  { title: "Entanglement Network", desc: "Visualization of quantum entanglement between qubits", gradient: "from-emerald-500/20 to-teal-500/20", icon: "🔗" },
  { title: "Quantum Error Correction", desc: "Surface codes and error syndrome detection patterns", gradient: "from-amber-500/20 to-orange-500/20", icon: "🛡️" },
  { title: "Quantum Phase Space", desc: "Wigner function representation of quantum states", gradient: "from-rose-500/20 to-red-500/20", icon: "🌀" },
];

const newsItems = [
  { title: "IBM Unveils 1000+ Qubit Processor", source: "Nature", date: "2026", tag: "Hardware" },
  { title: "Google Achieves Quantum Error Correction Milestone", source: "Science", date: "2026", tag: "Research" },
  { title: "India Launches National Quantum Mission Phase II", source: "DST", date: "2026", tag: "Policy" },
  { title: "Quantum Computing Market to Reach $125B by 2030", source: "McKinsey", date: "2026", tag: "Industry" },
  { title: "New Quantum Algorithm Breaks Optimization Records", source: "arXiv", date: "2026", tag: "Algorithm" },
  { title: "DRDO Deploys Quantum Key Distribution Network", source: "DRDO", date: "2026", tag: "Defence" },
];

const blogPosts = [
  { title: "Understanding Quantum Superposition", excerpt: "A deep dive into one of the most fundamental concepts in quantum mechanics and how it enables quantum computing.", readTime: "8 min", category: "Fundamentals" },
  { title: "Grover's Algorithm Explained", excerpt: "How Grover's search algorithm achieves quadratic speedup and its practical applications in database search.", readTime: "12 min", category: "Algorithms" },
  { title: "The Future of Quantum Cryptography", excerpt: "How quantum key distribution protocols like BB84 are reshaping the landscape of secure communications.", readTime: "10 min", category: "Cryptography" },
  { title: "NISQ Era: What Can We Do Today?", excerpt: "Exploring the capabilities and limitations of Noisy Intermediate-Scale Quantum computers in the current era.", readTime: "15 min", category: "Industry" },
  { title: "Variational Quantum Algorithms", excerpt: "VQE, VQC, and QAOA — hybrid quantum-classical algorithms pushing the boundaries of quantum advantage.", readTime: "11 min", category: "Research" },
  { title: "Quantum Machine Learning", excerpt: "How quantum computing is transforming machine learning with exponential speedups in specific problem domains.", readTime: "9 min", category: "ML" },
];

/* ═══════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleGetStarted = () => {
    navigate(isLoggedIn ? "/dashboard" : "/login");
  };

  return (
    <div className="landing-page">
      {/* ─── NAVBAR ────────────────────────────────────── */}
      <Navbar />

      {/* ─── HERO SECTION ─────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />

        <div className="landing-hero-content">
          <div className="landing-hero-text">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="landing-badge">
              <span className="landing-badge-dot" />
              DRDO — Defence R&D Organisation
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="landing-title">
              Quantum<br />
              <span className="landing-title-gradient">Simulation Lab</span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="landing-description">
              An interactive platform for quantum algorithm research,
              simulation, and experimentation. Powered by IBM Qiskit and built
              for Scientific Analysis Group (SAG).
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="landing-hero-actions">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="landing-btn-primary"
              >
                Get Started →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/docs")}
                className="landing-btn-secondary"
              >
                Read Docs
              </motion.button>
            </motion.div>
          </div>

          {/* 3D Atom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="landing-hero-3d"
          >
            <QuantumAtom3D className="w-full h-full" />
          </motion.div>
        </div>
      </section>

      {/* ─── STATS SECTION ────────────────────────────── */}
      <AnimatedSection className="landing-stats">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="landing-stat-card"
          >
            <div className="landing-stat-value">{stat.value}</div>
            <div className="landing-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </AnimatedSection>

      {/* ─── FEATURES SECTION ─────────────────────────── */}
      <AnimatedSection className="landing-features">
        <h2 className="landing-section-title">
          Platform <span className="landing-title-gradient">Features</span>
        </h2>
        <p className="landing-section-subtitle">
          Everything you need to explore, learn, and experiment with quantum computing
        </p>
        <motion.div
          className="landing-features-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeIn} className="landing-feature-card">
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* ─── QUANTUM GALLERY ──────────────────────────── */}
      <AnimatedSection className="landing-gallery">
        <h2 className="landing-section-title">
          Quantum <span className="landing-title-gradient">World</span>
        </h2>
        <p className="landing-section-subtitle">
          Explore the visual beauty of quantum computing — circuits, Bloch spheres, and probability distributions
        </p>
        <div className="landing-gallery-grid">
          {quantumImages.map((img, i) => (
            <motion.div
              key={img.title}
              className={`landing-gallery-card bg-gradient-to-br ${img.gradient}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="landing-gallery-icon">{img.icon}</div>
              <h4 className="landing-gallery-title">{img.title}</h4>
              <p className="landing-gallery-desc">{img.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── NEWS SECTION ─────────────────────────────── */}
      <AnimatedSection className="landing-news">
        <h2 className="landing-section-title">
          Quantum <span className="landing-title-gradient">News</span>
        </h2>
        <p className="landing-section-subtitle">
          Latest developments in the global quantum computing landscape
        </p>
        <div className="landing-news-scroll">
          {newsItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="landing-news-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <span className="landing-news-tag">{item.tag}</span>
              <h4 className="landing-news-title">{item.title}</h4>
              <div className="landing-news-meta">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── BLOG SECTION ─────────────────────────────── */}
      <AnimatedSection className="landing-blogs">
        <h2 className="landing-section-title">
          Quantum <span className="landing-title-gradient">Blogs</span>
        </h2>
        <p className="landing-section-subtitle">
          In-depth articles about quantum computing concepts and algorithms
        </p>
        <div className="landing-blogs-grid">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.title}
              className="landing-blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              onClick={() => navigate("/blogs")}
              style={{ cursor: "pointer" }}
            >
              <div className="landing-blog-category">{post.category}</div>
              <h4 className="landing-blog-title">{post.title}</h4>
              <p className="landing-blog-excerpt">{post.excerpt}</p>
              <div className="landing-blog-meta">
                <span>📖 {post.readTime} read</span>
                <span className="landing-blog-arrow">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── CTA SECTION ──────────────────────────────── */}
      <AnimatedSection className="landing-cta">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="landing-cta-content"
        >
          <h2 className="landing-cta-title">Ready to Explore Quantum Computing?</h2>
          <p className="landing-cta-desc">
            Start running quantum algorithms, visualize results, and experiment
            with your own Qiskit code. Join the quantum revolution today.
          </p>
          <div className="landing-cta-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="landing-btn-primary"
            >
              Get Started →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/docs")}
              className="landing-btn-secondary"
            >
              Browse Documentation
            </motion.button>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <Footer />
    </div>
  );
}
