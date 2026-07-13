const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Doc = require("../models/Doc");

const docsData = [
  {
    title: "Introduction to Qiskit",
    section: "Documentation",
    content: `<p>Welcome to the documentation for <strong>Qiskit</strong>, its related packages, and IBM Quantum Platform. This documentation includes how-to guides to get you started on our tools, specific use-case tutorials that include end-to-end examples, and a collection of API references.</p>
<p>Qiskit provides a modular and extensible framework for quantum research and development across algorithms, high-performance computing, and quantum information science. With it, researchers can build, optimize, and execute quantum workflows with specialized addons, software tools, and extensive resources. Through IBM Quantum Platform, users can access quantum compute services, such as Qiskit Runtime and the Qiskit Functions Catalog, to run workloads efficiently on the IBM fleet of quantum computers.</p>
<h3>What is Qiskit?</h3>
<p>Qiskit is an open-source SDK for working with quantum computers at the level of pulses, circuits, and application modules. It accelerates the development of quantum applications by providing the complete set of tools needed for interacting with quantum systems and simulators.</p>`
  },
  {
    title: "Installation",
    section: "Documentation",
    content: `<p>For a more detailed introduction to installing the Qiskit SDK, check out the installation page. If you're ready to install it now, simply run:</p>
<pre><code class="language-bash">pip install qiskit</code></pre>
<h3>Benchmarking and the Benchpress package</h3>
<p>Benchmarking is important for comparing the relative performance of quantum software across different stages of a development workflow. Benchmarking tests for quantum software might, for example, look at the speed and quality of building, manipulating, and transpiling circuits.</p> 
<p>IBM Quantum is committed to delivering the most performant SDK possible, and to that end, the Qiskit SDK is benchmarked using over 1,000 tests developed by leading universities, national labs, and researchers at IBM. The benchmarking suite used for these tests, named Benchpress, is now available as an open-source package. You can now use the Benchpress package to perform your own analysis of quantum SDK performance.</p>`
  },
  {
    title: "Quickstart",
    section: "Documentation",
    content: `<p>Get started with Qiskit in just a few minutes. This guide will walk you through creating your first quantum circuit, simulating it, and plotting the results.</p>
<h3>1. Build a Quantum Circuit</h3>
<p>A quantum circuit is the primary unit of computation in Qiskit. It represents a sequence of quantum gates, measurements, and other operations.</p>
<pre><code class="language-python">from qiskit import QuantumCircuit

# Create a circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)
qc.h(0)           # Add a Hadamard gate to qubit 0
qc.cx(0, 1)       # Add a CNOT gate on control qubit 0 and target qubit 1
qc.measure([0,1], [0,1]) # Measure both qubits</code></pre>
<h3>2. Simulate the Circuit</h3>
<p>To see the results of our circuit without using a real quantum computer, we use a simulator provided by <code>qiskit-aer</code>.</p>
<pre><code class="language-python">from qiskit_aer import AerSimulator
from qiskit import transpile

sim = AerSimulator()
compiled_circuit = transpile(qc, sim)
result = sim.run(compiled_circuit, shots=1000).result()
counts = result.get_counts()
print(counts)</code></pre>
<p>You will see output approximately like <code>{'00': 500, '11': 500}</code>, which is the famous Bell State (entanglement).</p>`
  },
  {
    title: "Circuits and Operators",
    section: "Qiskit",
    content: `<p>The <code>qiskit.circuit</code> module provides the foundational classes for constructing quantum circuits and defining quantum operators.</p>
<h3>Quantum Gates</h3>
<p>A quantum gate is a basic quantum circuit operating on a small number of qubits. They are the building blocks of quantum circuits, analogous to classical logic gates.</p>
<table>
<thead><tr><th>Gate</th><th>Description</th><th>Matrix Size</th></tr></thead>
<tbody>
<tr><td>X (Pauli-X)</td><td>Bit-flip (Quantum NOT)</td><td>2x2</td></tr>
<tr><td>Y (Pauli-Y)</td><td>Bit and Phase flip</td><td>2x2</td></tr>
<tr><td>Z (Pauli-Z)</td><td>Phase flip</td><td>2x2</td></tr>
<tr><td>H (Hadamard)</td><td>Creates Superposition</td><td>2x2</td></tr>
<tr><td>CX (CNOT)</td><td>Controlled-NOT</td><td>4x4</td></tr>
</tbody>
</table>
<h3>Creating Custom Operators</h3>
<p>You can also define your own unitary operators using numpy matrices and apply them to circuits:</p>
<pre><code class="language-python">from qiskit.quantum_info import Operator
import numpy as np

# Define a custom X gate
custom_x = Operator([
    [0, 1],
    [1, 0]
])</code></pre>`
  },
  {
    title: "Transpilation",
    section: "Qiskit",
    content: `<p>Transpilation is the process of rewriting a given input circuit to match the topology of a specific quantum device, and/or to optimize the circuit for execution on noisy quantum systems.</p>
<h3>Why Transpile?</h3>
<p>Real quantum computers have physical constraints:</p>
<ol>
<li><strong>Limited Connectivity:</strong> Not all qubits are physically connected to each other. If you want to apply a 2-qubit gate between unconnected qubits, the transpiler must insert SWAP gates.</li>
<li><strong>Basis Gates:</strong> Hardware only natively supports a small set of gates (e.g. <code>RZ</code>, <code>SX</code>, <code>X</code>, <code>CX</code>). Any other gate must be decomposed into these basis gates.</li>
</ol>
<h3>The Transpile Function</h3>
<pre><code class="language-python">from qiskit import transpile
from qiskit.providers.fake_provider import GenericBackendV2

# Create a fake 5-qubit backend
backend = GenericBackendV2(num_qubits=5)

# Transpile the circuit for this specific backend
transpiled_qc = transpile(qc, backend=backend, optimization_level=3)</code></pre>
<p>Higher optimization levels take more time but usually result in shorter circuits with fewer errors.</p>`
  }
];

async function seedDocs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    await Doc.deleteMany({});
    console.log("Cleared existing docs.");

    await Doc.insertMany(docsData);
    console.log("Successfully seeded documentation!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding docs:", error);
    process.exit(1);
  }
}

seedDocs();
