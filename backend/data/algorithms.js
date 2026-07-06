/**
 * Quantum Algorithm Data
 *
 * This is the same data as the frontend's algorithms.js,
 * but kept server-side so the backend can serve it via API.
 *
 * In production, replace this with MongoDB / PostgreSQL.
 */

const algorithms = [
  {
    id: "grover-search",
    name: "Grover's Search",
    shortDescription: "Quadratic speedup for unstructured search problems.",
    description:
      "Grover's algorithm provides a quadratic speedup for searching an unsorted database of N items. It uses amplitude amplification to boost the probability of measuring the correct answer, requiring only O(√N) oracle queries instead of the classical O(N).",
    formula: "O(√N) oracle queries",
    timeComplexity: "O(√N)",
    spaceComplexity: "O(log N)",
    applications: ["Database search", "Cryptanalysis", "Optimization problems", "SAT solving"],
    reference: "https://arxiv.org/abs/quant-ph/9605043",
    category: "Search",
    parameters: [
      { name: "Number of Qubits", type: "number", default: 3, min: 1, max: 20 },
      { name: "Iterations", type: "number", default: 2, min: 1, max: 100 },
      { name: "Target State", type: "text", default: "101", placeholder: "e.g. 101" },
    ],
  },
  {
    id: "deutsch",
    name: "Deutsch's Algorithm",
    shortDescription: "Determines if a single-bit function is constant or balanced.",
    description:
      "Deutsch's algorithm is the simplest quantum algorithm that demonstrates quantum advantage. It determines whether a Boolean function f:{0,1}→{0,1} is constant or balanced using a single query.",
    formula: "f(0) ⊕ f(1) with 1 query",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    applications: ["Foundational quantum computing", "Quantum oracle analysis"],
    reference: "https://doi.org/10.1098/rspa.1985.0070",
    category: "Search",
    parameters: [
      { name: "Function Type", type: "select", options: ["Constant-0", "Constant-1", "Balanced-Identity", "Balanced-Negation"], default: "Balanced-Identity" },
    ],
  },
  {
    id: "deutsch-jozsa",
    name: "Deutsch-Jozsa Algorithm",
    shortDescription: "Determines if an n-bit function is constant or balanced in one query.",
    description:
      "The Deutsch-Jozsa algorithm generalizes Deutsch's algorithm to n-bit functions. It determines with certainty whether a function is constant or balanced using a single quantum query.",
    formula: "1 query vs 2^(n-1)+1 classical",
    timeComplexity: "O(1) quantum queries",
    spaceComplexity: "O(n)",
    applications: ["Function classification", "Quantum advantage demonstration"],
    reference: "https://doi.org/10.1098/rspa.1992.0167",
    category: "Search",
    parameters: [
      { name: "Number of Qubits", type: "number", default: 3, min: 1, max: 10 },
      { name: "Function Type", type: "select", options: ["Constant", "Balanced"], default: "Balanced" },
    ],
  },
  {
    id: "quantum-teleportation",
    name: "Quantum Teleportation",
    shortDescription: "Transfers a quantum state using entanglement and classical bits.",
    description:
      "Quantum teleportation transmits the exact quantum state of a qubit from one location to another, using a shared entangled pair and two classical bits of communication.",
    formula: "|ψ⟩ = α|0⟩ + β|1⟩ → teleported via Bell measurement",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    applications: ["Quantum communication", "Quantum internet", "Distributed quantum computing"],
    reference: "https://doi.org/10.1103/PhysRevLett.70.1895",
    category: "Cryptography",
    parameters: [
      { name: "Alpha (real)", type: "number", default: 0.6, min: 0, max: 1, step: 0.1 },
      { name: "Beta (real)", type: "number", default: 0.8, min: 0, max: 1, step: 0.1 },
    ],
  },
  {
    id: "qft",
    name: "Quantum Fourier Transform",
    shortDescription: "Quantum analog of the discrete Fourier transform.",
    description:
      "The QFT maps computational basis states to their frequency-domain representation. It is a key subroutine in Shor's algorithm and quantum phase estimation.",
    formula: "QFT|j⟩ = (1/√N) Σₖ e^(2πijk/N) |k⟩",
    timeComplexity: "O(n²) vs O(n·2ⁿ) classical",
    spaceComplexity: "O(n)",
    applications: ["Shor's algorithm subroutine", "Phase estimation", "Quantum signal processing"],
    reference: "https://arxiv.org/abs/quant-ph/0201067",
    category: "Transform",
    parameters: [
      { name: "Number of Qubits", type: "number", default: 4, min: 1, max: 15 },
      { name: "Input State", type: "text", default: "0101", placeholder: "e.g. 0101" },
    ],
  },
  {
    id: "shor",
    name: "Shor's Algorithm",
    shortDescription: "Factors integers in polynomial time on a quantum computer.",
    description:
      "Shor's algorithm efficiently factors large integers, threatening RSA encryption. It uses quantum period-finding via QFT.",
    formula: "O((log N)³) with quantum period finding",
    timeComplexity: "O((log N)³)",
    spaceComplexity: "O(log N)",
    applications: ["Cryptanalysis (RSA breaking)", "Number theory", "Post-quantum cryptography motivation"],
    reference: "https://arxiv.org/abs/quant-ph/9508027",
    category: "Factoring",
    parameters: [
      { name: "Number to Factor", type: "number", default: 15, min: 2, max: 10000 },
      { name: "Attempts", type: "number", default: 5, min: 1, max: 50 },
    ],
  },
  {
    id: "simon",
    name: "Simon's Algorithm",
    shortDescription: "Finds hidden period of a function with exponential speedup.",
    description:
      "Simon's algorithm finds a hidden period s in a 2-to-1 function with exponential speedup over classical algorithms.",
    formula: "O(n) quantum queries vs O(2^(n/2)) classical",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    applications: ["Cryptanalysis", "Period finding", "Foundation for Shor's algorithm"],
    reference: "https://doi.org/10.1137/S0097539796298637",
    category: "Cryptography",
    parameters: [
      { name: "Number of Qubits", type: "number", default: 3, min: 2, max: 10 },
      { name: "Secret String", type: "text", default: "110", placeholder: "e.g. 110" },
    ],
  },
  {
    id: "bernstein-vazirani",
    name: "Bernstein-Vazirani Algorithm",
    shortDescription: "Finds hidden string in a linear function with one query.",
    description:
      "The Bernstein-Vazirani algorithm determines the hidden string s in f(x) = s·x mod 2 using a single quantum query.",
    formula: "f(x) = s·x mod 2 → find s in 1 query",
    timeComplexity: "O(1) quantum queries",
    spaceComplexity: "O(n)",
    applications: ["Quantum query complexity", "Learning theory"],
    reference: "https://doi.org/10.1137/S0097539796300921",
    category: "Cryptography",
    parameters: [
      { name: "Number of Qubits", type: "number", default: 4, min: 1, max: 12 },
      { name: "Secret String", type: "text", default: "1011", placeholder: "e.g. 1011" },
    ],
  },
  {
    id: "quantum-phase-estimation",
    name: "Quantum Phase Estimation",
    shortDescription: "Estimates the eigenvalue phase of a unitary operator.",
    description:
      "QPE estimates the phase θ in U|ψ⟩ = e^(2πiθ)|ψ⟩. It is fundamental to Shor's algorithm and quantum chemistry simulations.",
    formula: "U|ψ⟩ = e^(2πiθ)|ψ⟩ → estimate θ to n bits",
    timeComplexity: "O(n²) for n-bit precision",
    spaceComplexity: "O(n)",
    applications: ["Shor's algorithm", "Quantum chemistry", "Hamiltonian simulation"],
    reference: "https://arxiv.org/abs/quant-ph/9511026",
    category: "Transform",
    parameters: [
      { name: "Precision Qubits", type: "number", default: 4, min: 1, max: 12 },
      { name: "Phase (θ)", type: "number", default: 0.25, min: 0, max: 1, step: 0.01 },
    ],
  },
];

module.exports = algorithms;
