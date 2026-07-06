/**
 * Quantum Algorithm Data Store
 *
 * Each algorithm entry contains:
 * - id: unique slug used in URL routing
 * - name: display name
 * - shortDescription: one-liner for cards
 * - description: detailed explanation
 * - formula: LaTeX or plain-text math formula
 * - timeComplexity: Big-O notation
 * - spaceComplexity: Big-O notation
 * - applications: list of real-world uses
 * - reference: link to paper or resource
 * - category: grouping tag
 * - parameters: dynamic input fields (drives ParameterInput)
 * - mockOutput: sample output for UI development
 */

export const CATEGORIES = {
  SEARCH: "Search",
  FACTORING: "Factoring",
  SIMULATION: "Simulation",
  CRYPTOGRAPHY: "Cryptography",
  TRANSFORM: "Transform",
  ERROR_CORRECTION: "Error Correction",
};

const algorithms = [
  {
    id: "grover-search",
    name: "Grover's Search",
    shortDescription:
      "Quadratic speedup for unstructured search problems.",
    description:
      "Grover's algorithm provides a quadratic speedup for searching an unsorted database of N items. It uses amplitude amplification to boost the probability of measuring the correct answer, requiring only O(√N) oracle queries instead of the classical O(N).",
    formula: "O(√N) oracle queries",
    timeComplexity: "O(√N)",
    spaceComplexity: "O(log N)",
    applications: [
      "Database search",
      "Cryptanalysis",
      "Optimization problems",
      "SAT solving",
    ],
    reference: "https://arxiv.org/abs/quant-ph/9605043",
    category: CATEGORIES.SEARCH,
    parameters: [
      { name: "Number of Qubits", type: "number", default: 3, min: 1, max: 20 },
      { name: "Iterations", type: "number", default: 2, min: 1, max: 100 },
      { name: "Target State", type: "text", default: "101", placeholder: "e.g. 101" },
    ],
    mockOutput: {
      graph: { type: "probability", labels: ["000", "001", "010", "011", "100", "101", "110", "111"], values: [0.02, 0.02, 0.02, 0.02, 0.02, 0.85, 0.02, 0.03] },
      circuit: { gates: ["H", "Oracle", "Diffuser"], qubits: 3, depth: 6 },
      blochSphere: { theta: 0.3, phi: 1.2 },
      console: "Grover's algorithm executed successfully.\nTarget state |101⟩ found with probability 0.85 after 2 iterations.",
      measurements: [
        { state: "|101⟩", probability: 0.85, count: 850 },
        { state: "|000⟩", probability: 0.02, count: 20 },
        { state: "|001⟩", probability: 0.02, count: 20 },
        { state: "|010⟩", probability: 0.02, count: 20 },
        { state: "|011⟩", probability: 0.02, count: 20 },
        { state: "|100⟩", probability: 0.02, count: 20 },
        { state: "|110⟩", probability: 0.02, count: 20 },
        { state: "|111⟩", probability: 0.03, count: 30 },
      ],
    },
  },
  {
    id: "deutsch",
    name: "Deutsch's Algorithm",
    shortDescription:
      "Determines if a single-bit function is constant or balanced.",
    description:
      "Deutsch's algorithm is the simplest quantum algorithm that demonstrates quantum advantage. It determines whether a Boolean function f:{0,1}→{0,1} is constant or balanced using a single query, whereas classically two queries are required.",
    formula: "f(0) ⊕ f(1) with 1 query",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    applications: [
      "Foundational quantum computing",
      "Quantum oracle analysis",
      "Teaching quantum mechanics",
    ],
    reference: "https://doi.org/10.1098/rspa.1985.0070",
    category: CATEGORIES.SEARCH,
    parameters: [
      { name: "Function Type", type: "select", options: ["Constant-0", "Constant-1", "Balanced-Identity", "Balanced-Negation"], default: "Balanced-Identity" },
    ],
    mockOutput: {
      graph: { type: "bar", labels: ["Constant", "Balanced"], values: [0, 1] },
      circuit: { gates: ["H", "Uf", "H"], qubits: 2, depth: 3 },
      blochSphere: { theta: Math.PI / 2, phi: 0 },
      console: "Deutsch's algorithm result: Function is BALANCED.",
      measurements: [
        { state: "|1⟩", probability: 1.0, count: 1000 },
      ],
    },
  },
  {
    id: "deutsch-jozsa",
    name: "Deutsch-Jozsa Algorithm",
    shortDescription:
      "Determines if an n-bit function is constant or balanced in one query.",
    description:
      "The Deutsch-Jozsa algorithm generalizes Deutsch's algorithm to n-bit functions. It determines with certainty whether a function f:{0,1}ⁿ→{0,1} is constant (same output for all inputs) or balanced (outputs 0 for half and 1 for the other half) using a single quantum query.",
    formula: "1 query vs 2^(n-1)+1 classical",
    timeComplexity: "O(1) quantum queries",
    spaceComplexity: "O(n)",
    applications: [
      "Function classification",
      "Quantum advantage demonstration",
      "Algorithm education",
    ],
    reference: "https://doi.org/10.1098/rspa.1992.0167",
    category: CATEGORIES.SEARCH,
    parameters: [
      { name: "Number of Qubits", type: "number", default: 3, min: 1, max: 10 },
      { name: "Function Type", type: "select", options: ["Constant", "Balanced"], default: "Balanced" },
    ],
    mockOutput: {
      graph: { type: "probability", labels: ["000", "001", "010", "011", "100", "101", "110", "111"], values: [0, 0, 0, 0, 0, 0, 0, 1] },
      circuit: { gates: ["H⊗n", "Uf", "H⊗n", "Measure"], qubits: 4, depth: 4 },
      blochSphere: null,
      console: "Deutsch-Jozsa result: The function is BALANCED.\nMeasured state: |111⟩ (non-zero → balanced).",
      measurements: [
        { state: "|111⟩", probability: 1.0, count: 1000 },
      ],
    },
  },
  {
    id: "quantum-teleportation",
    name: "Quantum Teleportation",
    shortDescription:
      "Transfers a quantum state using entanglement and classical bits.",
    description:
      "Quantum teleportation transmits the exact quantum state of a qubit from one location to another, using a shared entangled pair and two classical bits of communication. The original qubit's state is destroyed in the process (no-cloning theorem).",
    formula: "|ψ⟩ = α|0⟩ + β|1⟩ → teleported via Bell measurement",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    applications: [
      "Quantum communication",
      "Quantum internet",
      "Distributed quantum computing",
      "Quantum key distribution",
    ],
    reference: "https://doi.org/10.1103/PhysRevLett.70.1895",
    category: CATEGORIES.CRYPTOGRAPHY,
    parameters: [
      { name: "Alpha (real)", type: "number", default: 0.6, min: 0, max: 1, step: 0.1 },
      { name: "Beta (real)", type: "number", default: 0.8, min: 0, max: 1, step: 0.1 },
    ],
    mockOutput: {
      graph: { type: "bar", labels: ["|0⟩", "|1⟩"], values: [0.36, 0.64] },
      circuit: { gates: ["H", "CNOT", "CNOT", "H", "Measure", "X", "Z"], qubits: 3, depth: 6 },
      blochSphere: { theta: 0.9273, phi: 0 },
      console: "Teleportation successful!\nOriginal state: 0.6|0⟩ + 0.8|1⟩\nBell measurement: |Φ+⟩\nBob's qubit reconstructed to original state.",
      measurements: [
        { state: "|0⟩", probability: 0.36, count: 360 },
        { state: "|1⟩", probability: 0.64, count: 640 },
      ],
    },
  },
  {
    id: "qft",
    name: "Quantum Fourier Transform",
    shortDescription:
      "Quantum analog of the discrete Fourier transform.",
    description:
      "The Quantum Fourier Transform (QFT) maps computational basis states to their frequency-domain representation. It is a key subroutine in Shor's algorithm, quantum phase estimation, and many other quantum algorithms. QFT achieves exponential speedup over the classical FFT.",
    formula: "QFT|j⟩ = (1/√N) Σₖ e^(2πijk/N) |k⟩",
    timeComplexity: "O(n²) vs O(n·2ⁿ) classical",
    spaceComplexity: "O(n)",
    applications: [
      "Shor's algorithm subroutine",
      "Phase estimation",
      "Quantum signal processing",
      "Period finding",
    ],
    reference: "https://arxiv.org/abs/quant-ph/0201067",
    category: CATEGORIES.TRANSFORM,
    parameters: [
      { name: "Number of Qubits", type: "number", default: 4, min: 1, max: 15 },
      { name: "Input State", type: "text", default: "0101", placeholder: "e.g. 0101" },
    ],
    mockOutput: {
      graph: { type: "probability", labels: ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"], values: [0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625, 0.0625] },
      circuit: { gates: ["H", "R2", "R3", "R4", "SWAP"], qubits: 4, depth: 10 },
      blochSphere: null,
      console: "QFT applied to |0101⟩.\nOutput is uniform superposition in Fourier basis.\n16 basis states with equal probability 0.0625.",
      measurements: [
        { state: "|0000⟩", probability: 0.0625, count: 62 },
        { state: "|0101⟩", probability: 0.0625, count: 63 },
        { state: "|1010⟩", probability: 0.0625, count: 63 },
        { state: "|1111⟩", probability: 0.0625, count: 62 },
      ],
    },
  },
  {
    id: "shor",
    name: "Shor's Algorithm",
    shortDescription:
      "Factors integers in polynomial time on a quantum computer.",
    description:
      "Shor's algorithm efficiently factors large integers, threatening RSA encryption. It uses quantum period-finding (via QFT) to determine the period of modular exponentiation, then applies classical post-processing to extract prime factors.",
    formula: "O((log N)³) with quantum period finding",
    timeComplexity: "O((log N)³)",
    spaceComplexity: "O(log N)",
    applications: [
      "Cryptanalysis (RSA breaking)",
      "Number theory",
      "Post-quantum cryptography motivation",
    ],
    reference: "https://arxiv.org/abs/quant-ph/9508027",
    category: CATEGORIES.FACTORING,
    parameters: [
      { name: "Number to Factor", type: "number", default: 15, min: 2, max: 10000 },
      { name: "Attempts", type: "number", default: 5, min: 1, max: 50 },
    ],
    mockOutput: {
      graph: { type: "probability", labels: ["0", "4", "8", "12"], values: [0.25, 0.25, 0.25, 0.25] },
      circuit: { gates: ["H⊗n", "Modular Exp", "QFT†", "Measure"], qubits: 8, depth: 20 },
      blochSphere: null,
      console: "Shor's Algorithm — Factoring N = 15\nChose a = 7\nPeriod r = 4 found via QFT\ngcd(7² - 1, 15) = 3\ngcd(7² + 1, 15) = 5\nFactors: 3 × 5 = 15 ✓",
      measurements: [
        { state: "|0⟩", probability: 0.25, count: 250 },
        { state: "|4⟩", probability: 0.25, count: 250 },
        { state: "|8⟩", probability: 0.25, count: 250 },
        { state: "|12⟩", probability: 0.25, count: 250 },
      ],
    },
  },
  {
    id: "simon",
    name: "Simon's Algorithm",
    shortDescription:
      "Finds hidden period of a function with exponential speedup.",
    description:
      "Simon's algorithm solves Simon's problem: given a 2-to-1 function f with a hidden period s such that f(x) = f(x ⊕ s), find s. It provides an exponential speedup over classical algorithms and was the inspiration for Shor's algorithm.",
    formula: "O(n) quantum queries vs O(2^(n/2)) classical",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    applications: [
      "Cryptanalysis",
      "Period finding",
      "Foundation for Shor's algorithm",
    ],
    reference: "https://doi.org/10.1137/S0097539796298637",
    category: CATEGORIES.CRYPTOGRAPHY,
    parameters: [
      { name: "Number of Qubits", type: "number", default: 3, min: 2, max: 10 },
      { name: "Secret String", type: "text", default: "110", placeholder: "e.g. 110" },
    ],
    mockOutput: {
      graph: { type: "bar", labels: ["y₁", "y₂", "y₃"], values: [1, 1, 1] },
      circuit: { gates: ["H⊗n", "Uf", "H⊗n", "Measure"], qubits: 6, depth: 5 },
      blochSphere: null,
      console: "Simon's Algorithm\nSecret string s = 110\nCollected linearly independent equations:\ny₁ · s = 0, y₂ · s = 0, y₃ · s = 0\nSolved: s = 110 ✓",
      measurements: [
        { state: "|001⟩", probability: 0.33, count: 330 },
        { state: "|010⟩", probability: 0.33, count: 330 },
        { state: "|011⟩", probability: 0.34, count: 340 },
      ],
    },
  },
  {
    id: "bernstein-vazirani",
    name: "Bernstein-Vazirani Algorithm",
    shortDescription:
      "Finds hidden string in a linear function with one query.",
    description:
      "The Bernstein-Vazirani algorithm determines the hidden string s in a function f(x) = s·x (mod 2) using a single quantum query, compared to n classical queries. It is a generalization of the Deutsch-Jozsa problem.",
    formula: "f(x) = s·x mod 2 → find s in 1 query",
    timeComplexity: "O(1) quantum queries",
    spaceComplexity: "O(n)",
    applications: [
      "Quantum query complexity",
      "Learning theory",
      "Quantum advantage demonstration",
    ],
    reference: "https://doi.org/10.1137/S0097539796300921",
    category: CATEGORIES.CRYPTOGRAPHY,
    parameters: [
      { name: "Number of Qubits", type: "number", default: 4, min: 1, max: 12 },
      { name: "Secret String", type: "text", default: "1011", placeholder: "e.g. 1011" },
    ],
    mockOutput: {
      graph: { type: "bar", labels: ["|1011⟩"], values: [1.0] },
      circuit: { gates: ["H⊗n", "Uf", "H⊗n", "Measure"], qubits: 5, depth: 3 },
      blochSphere: null,
      console: "Bernstein-Vazirani Algorithm\nHidden string found: s = 1011\nMeasured with probability 1.0 in a single query.",
      measurements: [
        { state: "|1011⟩", probability: 1.0, count: 1000 },
      ],
    },
  },
  {
    id: "quantum-phase-estimation",
    name: "Quantum Phase Estimation",
    shortDescription:
      "Estimates the eigenvalue phase of a unitary operator.",
    description:
      "Quantum Phase Estimation (QPE) estimates the phase θ in U|ψ⟩ = e^(2πiθ)|ψ⟩ for a unitary operator U and its eigenstate |ψ⟩. It is a fundamental subroutine in many quantum algorithms including Shor's algorithm and quantum chemistry simulations.",
    formula: "U|ψ⟩ = e^(2πiθ)|ψ⟩ → estimate θ to n bits",
    timeComplexity: "O(n²) for n-bit precision",
    spaceComplexity: "O(n)",
    applications: [
      "Shor's algorithm",
      "Quantum chemistry",
      "Hamiltonian simulation",
      "Eigenvalue problems",
    ],
    reference: "https://arxiv.org/abs/quant-ph/9511026",
    category: CATEGORIES.TRANSFORM,
    parameters: [
      { name: "Precision Qubits", type: "number", default: 4, min: 1, max: 12 },
      { name: "Phase (θ)", type: "number", default: 0.25, min: 0, max: 1, step: 0.01 },
    ],
    mockOutput: {
      graph: { type: "probability", labels: ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111"], values: [0.01, 0.01, 0.01, 0.01, 0.92, 0.02, 0.01, 0.01] },
      circuit: { gates: ["H⊗n", "Controlled-U", "QFT†", "Measure"], qubits: 5, depth: 12 },
      blochSphere: { theta: Math.PI / 2, phi: Math.PI / 2 },
      console: "Phase Estimation Result\nEstimated phase θ = 0.25 (4/16)\nBinary: 0.0100\nMeasured |0100⟩ with probability 0.92\nPrecision: 4 qubits → ±0.0625",
      measurements: [
        { state: "|0100⟩", probability: 0.92, count: 920 },
        { state: "|0011⟩", probability: 0.03, count: 30 },
        { state: "|0101⟩", probability: 0.03, count: 30 },
        { state: "|0010⟩", probability: 0.02, count: 20 },
      ],
    },
  },
];

export default algorithms;
