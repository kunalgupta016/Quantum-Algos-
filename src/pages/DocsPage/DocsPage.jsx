import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MathHTMLContainer from "../../components/MathHTMLContainer/MathHTMLContainer";
import { getDocs } from "../../services/api";
import "react-quill-new/dist/quill.snow.css";
import "./DocsPage.css";

const docsSidebar = [
  {
    section: "Getting Started",
    items: [
      { id: "intro", title: "Introduction to Quantum Computing" },
      { id: "classical-vs-quantum", title: "Classical vs Quantum" },
      { id: "why-quantum", title: "Why Quantum Computing?" },
    ],
  },
  {
    section: "Core Concepts",
    items: [
      { id: "qubits", title: "Qubits & Quantum States" },
      { id: "superposition", title: "Superposition" },
      { id: "entanglement", title: "Entanglement" },
      { id: "measurement", title: "Measurement" },
      { id: "decoherence", title: "Decoherence & Noise" },
    ],
  },
  {
    section: "Quantum Gates",
    items: [
      { id: "single-qubit-gates", title: "Single-Qubit Gates (X, Y, Z, H)" },
      { id: "multi-qubit-gates", title: "Multi-Qubit Gates (CNOT, Toffoli)" },
      { id: "universal-gates", title: "Universal Gate Sets" },
      { id: "rotation-gates", title: "Rotation Gates (Rx, Ry, Rz)" },
    ],
  },
  {
    section: "Quantum Circuits",
    items: [
      { id: "circuit-model", title: "Circuit Model of Computation" },
      { id: "circuit-notation", title: "Circuit Notation & Diagrams" },
      { id: "building-circuits", title: "Building Your First Circuit" },
    ],
  },
  {
    section: "Algorithms Overview",
    items: [
      { id: "algo-intro", title: "What Are Quantum Algorithms?" },
      { id: "quantum-advantage", title: "Quantum Advantage & Speedup" },
      { id: "nisq-algorithms", title: "NISQ-Era Algorithms" },
    ],
  },
];

const docsContent = {
  "intro": {
    title: "Introduction to Quantum Computing",
    content: `Quantum computing is a revolutionary paradigm of computation that leverages the principles of quantum mechanics — superposition, entanglement, and interference — to process information in fundamentally new ways.

Unlike classical computers that use bits (0 or 1), quantum computers use **qubits** that can exist in a superposition of both states simultaneously. This allows quantum computers to explore multiple solutions in parallel, providing exponential speedups for certain types of problems.

### Key Principles

1. **Superposition**: A qubit can be in a combination of |0⟩ and |1⟩ states
2. **Entanglement**: Qubits can be correlated in ways impossible classically
3. **Interference**: Quantum amplitudes can add constructively or destructively

### Historical Timeline

| Year | Milestone |
|------|-----------|
| 1980 | Feynman proposes quantum simulation |
| 1985 | Deutsch introduces quantum Turing machine |
| 1994 | Shor's factoring algorithm |
| 1996 | Grover's search algorithm |
| 2019 | Google claims quantum supremacy |
| 2023 | IBM releases 1000+ qubit processor |`,
    code: `# Your first quantum circuit in Qiskit
from qiskit import QuantumCircuit

# Create a circuit with 1 qubit
qc = QuantumCircuit(1, 1)

# Apply Hadamard gate (superposition)
qc.h(0)

# Measure the qubit
qc.measure(0, 0)

print(qc.draw())`,
  },
  "qubits": {
    title: "Qubits & Quantum States",
    content: `A **qubit** (quantum bit) is the fundamental unit of quantum information. Unlike a classical bit which must be either 0 or 1, a qubit can exist in a superposition of both states simultaneously.

### Mathematical Representation

A qubit state is represented as:

**|ψ⟩ = α|0⟩ + β|1⟩**

Where α and β are complex numbers called **probability amplitudes**, satisfying |α|² + |β|² = 1.

### The Bloch Sphere

The Bloch sphere is a geometric representation of a single qubit state. Any pure qubit state can be written as:

**|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩**

Where:
- **θ** (theta): polar angle from 0 to π
- **φ** (phi): azimuthal angle from 0 to 2π

### Common Qubit States

| State | Vector | Bloch Sphere |
|-------|--------|-------------|
| \|0⟩ | [1, 0] | North pole |
| \|1⟩ | [0, 1] | South pole |
| \|+⟩ | [1/√2, 1/√2] | Equator (x+) |
| \|−⟩ | [1/√2, −1/√2] | Equator (x−) |`,
    code: `from qiskit import QuantumCircuit
import numpy as np

# Create a qubit in state |0⟩
qc = QuantumCircuit(1)

# Apply Hadamard to create |+⟩ state
qc.h(0)  # Now: (|0⟩ + |1⟩)/√2

# Apply S gate for phase
qc.s(0)  # Now: (|0⟩ + i|1⟩)/√2

print(qc.draw())`,
  },
  "superposition": {
    title: "Superposition",
    content: `**Superposition** is the ability of a quantum system to exist in multiple states simultaneously until measured.

### Understanding Superposition

When a qubit is in superposition, it is not "partially 0 and partially 1." Instead, it exists in a fundamentally new state that has no classical analog. Only when we measure it does it "collapse" to either |0⟩ or |1⟩.

### Creating Superposition

The **Hadamard gate (H)** is the most common way to create superposition:

**H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩**
**H|1⟩ = (|0⟩ − |1⟩)/√2 = |−⟩**

### Why It Matters

With n qubits in superposition, a quantum computer can represent 2ⁿ states simultaneously. This is the source of quantum parallelism:

- 1 qubit → 2 states
- 10 qubits → 1,024 states
- 50 qubits → ~10¹⁵ states
- 300 qubits → more states than atoms in the observable universe!`,
    code: `from qiskit import QuantumCircuit

# Create 3-qubit superposition
qc = QuantumCircuit(3, 3)

# Apply H to all qubits
qc.h([0, 1, 2])  # Creates equal superposition of 8 states

# Measure all qubits
qc.measure([0, 1, 2], [0, 1, 2])

# Each measurement gives one of 8 outcomes
# with equal probability 1/8 = 12.5%`,
  },
};

// Default content for topics not yet written
const defaultContent = {
  title: "Coming Soon",
  content: `This section is currently being developed. Check back soon for comprehensive quantum computing documentation.

### What to Expect

This section will cover the topic in detail with:
- Clear explanations with visual diagrams
- Mathematical formulations
- Practical code examples in Qiskit
- Interactive exercises

In the meantime, explore the other available topics in the sidebar.`,
  code: `# Example code will appear here
# when this section is completed`,
};

export default function DocsPage() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const data = await getDocs();
        setDocs(data);
        if (data.length > 0) {
          setActiveTopic(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load docs", err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const [expandedSubsections, setExpandedSubsections] = useState(new Set());

  useEffect(() => {
    if (activeTopic) {
      const activeDoc = docs.find(d => d._id === activeTopic);
      if (activeDoc && activeDoc.subsection) {
        setExpandedSubsections(prev => {
          const newSet = new Set(prev);
          newSet.add(activeDoc.subsection);
          return newSet;
        });
      }
    }
  }, [activeTopic, docs]);

  const toggleSubsection = (subName) => {
    setExpandedSubsections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subName)) {
        newSet.delete(subName);
      } else {
        newSet.add(subName);
      }
      return newSet;
    });
  };

  // Group docs by section
  const docsSidebar = [];
  const flatDocs = [];
  
  const sortedDocs = [...docs].sort((a, b) => {
    if (a.sectionOrder !== b.sectionOrder) return (a.sectionOrder || 0) - (b.sectionOrder || 0);
    if ((a.subsectionOrder || 0) !== (b.subsectionOrder || 0)) return (a.subsectionOrder || 0) - (b.subsectionOrder || 0);
    return (a.order || 0) - (b.order || 0);
  });
  
  sortedDocs.forEach(doc => {
    let section = docsSidebar.find(s => s.section === doc.section);
    if (!section) {
      section = { section: doc.section, items: [], subsections: [] };
      docsSidebar.push(section);
    }
    
    const item = { id: doc._id, title: doc.title, subsection: doc.subsection };
    
    if (doc.subsection && doc.subsection.trim() !== "") {
      let subsection = section.subsections.find(s => s.name === doc.subsection);
      if (!subsection) {
        subsection = { name: doc.subsection, items: [] };
        section.subsections.push(subsection);
      }
      subsection.items.push(item);
    } else {
      section.items.push(item);
    }
    
    flatDocs.push(item);
  });

  const activeDoc = docs.find(d => d._id === activeTopic);
  const currentContent = activeDoc ? {
    title: activeDoc.title,
    content: activeDoc.content,
    code: "" // Optional: can add code field to DB later if needed
  } : defaultContent;

  const currentIndex = flatDocs.findIndex(item => item.id === activeTopic);
  const prevDoc = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex !== -1 && currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="docs-page bg-[var(--color-app-base)] min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh] text-[var(--color-app-text-main)]">Loading docs...</div>
      </div>
    );
  }

  return (
    <div className="docs-page">
      <Navbar />

      <div className="docs-layout">
        {/* Sidebar */}
        <motion.aside
          className={`docs-sidebar ${sidebarOpen ? "open" : "collapsed"}`}
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="docs-sidebar-header">
            <h3 className="docs-sidebar-title">📚 Quantum Docs</h3>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="docs-sidebar-toggle">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <nav className="docs-sidebar-nav" data-lenis-prevent="true">
            {docsSidebar.map((section) => (
              <div key={section.section} className="docs-sidebar-section">
                <h4 className="docs-sidebar-section-title">{section.section}</h4>
                
                {/* Top-level items in this section */}
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={`docs-sidebar-item ${activeTopic === item.id ? "active" : ""}`}
                    onClick={() => setActiveTopic(item.id)}
                  >
                    {item.title}
                  </button>
                ))}

                {/* Subsections */}
                {section.subsections && section.subsections.map((sub) => (
                  <div key={sub.name} className="docs-sidebar-subsection">
                    <button 
                      className={`docs-sidebar-subsection-title docs-sidebar-item flex justify-between items-center w-full ${sub.items.some(i => i.id === activeTopic) ? "text-white" : ""}`}
                      onClick={() => toggleSubsection(sub.name)}
                    >
                      <span>{sub.name}</span>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expandedSubsections.has(sub.name) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div 
                      className="docs-sidebar-subsection-items-container"
                      style={{ 
                        display: 'grid', 
                        gridTemplateRows: expandedSubsections.has(sub.name) ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.2s ease-out'
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="pl-3 border-l border-[var(--color-app-border)] ml-3 mt-1 mb-1 flex flex-col gap-1">
                          {sub.items.map((item) => (
                            <button
                              key={item.id}
                              className={`docs-sidebar-item sub-item ${activeTopic === item.id ? "active" : ""}`}
                              onClick={() => setActiveTopic(item.id)}
                            >
                              {item.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </motion.aside>

        {/* Toggle button when collapsed */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="docs-sidebar-open-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main Content */}
        <main className="docs-content" data-lenis-prevent="true">
          <motion.article
            key={activeTopic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="docs-article"
          >
            <h1 className="docs-article-title">{currentContent.title}</h1>

            <div className="docs-article-body ql-snow">
              <div className="ql-editor p-0 text-[var(--color-app-text-main)]" style={{ minHeight: 'auto', fontSize: '1.05rem', lineHeight: '1.7' }}>
                <MathHTMLContainer html={currentContent.content} />
              </div>
            </div>

            {/* Code Example (Legacy support) */}
            {currentContent.code && (
              <div className="docs-code-block">
                <div className="docs-code-header">
                  <span>💻 Example Code (Qiskit)</span>
                  <span className="docs-code-lang">Python</span>
                </div>
                <pre className="docs-code-pre">
                  <code>{currentContent.code}</code>
                </pre>
              </div>
            )}

            {/* Navigation */}
            <div className="docs-nav-bottom">
              {prevDoc ? (
                <button onClick={() => setActiveTopic(prevDoc.id)} className="docs-nav-btn prev">
                  <span className="docs-nav-label">Previous</span>
                  <span className="docs-nav-title">« {prevDoc.title}</span>
                </button>
              ) : <div className="docs-nav-placeholder flex-1" />}

              {nextDoc ? (
                <button onClick={() => setActiveTopic(nextDoc.id)} className="docs-nav-btn next">
                  <span className="docs-nav-label">Next</span>
                  <span className="docs-nav-title">{nextDoc.title} »</span>
                </button>
              ) : <div className="docs-nav-placeholder flex-1" />}
            </div>
          </motion.article>
        </main>
      </div>

      <Footer />
    </div>
  );
}
