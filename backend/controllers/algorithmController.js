/**
 * Algorithm Simulation Controller
 *
 * Contains the logic for running quantum algorithm simulations.
 * Currently returns mock results — replace with real simulation
 * libraries (e.g., calling a Python Qiskit microservice) later.
 */

const algorithms = require("../data/algorithms");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * GET /api/algorithms
 * Returns all available algorithms.
 */
function getAlgorithms(req, res) {
  res.json(algorithms);
}

/**
 * GET /api/algorithms/:id
 * Returns a single algorithm by ID.
 */
function getAlgorithmById(req, res) {
  const algo = algorithms.find((a) => a.id === req.params.id);
  if (!algo) {
    return res.status(404).json({ error: "Algorithm not found" });
  }
  res.json(algo);
}

/**
 * POST /api/run
 * Runs a quantum algorithm simulation.
 *
 * Request body: { algorithmId: string, parameters: object }
 * Response:     { graph, circuit, blochSphere, console, measurements }
 */
function runAlgorithm(req, res) {
  const { algorithmId, parameters } = req.body;

  if (!algorithmId) {
    return res.status(400).json({ error: "algorithmId is required" });
  }

  const algo = algorithms.find((a) => a.id === algorithmId);
  if (!algo) {
    return res.status(404).json({ error: `Algorithm '${algorithmId}' not found` });
  }

  if (algorithmId === "grover-search") {
    // ─── Real Papermill Execution ───
    const numQubits = parameters["Number of Qubits"] || 3;
    const iterations = parameters["Iterations"] || 2;
    const targetState = parameters["Target State"] || "101";

    const inputNb = path.join(__dirname, "../notebooks/grover-search.ipynb");
    const outputNb = path.join(__dirname, `../notebooks/output_${Date.now()}.ipynb`);
    
    // Command string using python module approach to avoid path issues
    const command = `c:\\users\\pc\\appdata\\local\\python\\pythoncore-3.14-64\\python.exe -m papermill "${inputNb}" "${outputNb}" -p num_qubits ${numQubits} -p iterations ${iterations} -p target_state "${targetState}" -k python3 -l python`;

    console.log("Running command:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Papermill execution error:", error);
        return res.status(500).json({ error: "Execution failed", console: stderr });
      }

      // Read output notebook
      try {
        const nbData = JSON.parse(fs.readFileSync(outputNb, "utf8"));
        
        let circuitImg = null;
        let graphImg = null;

        let imageOutputs = [];
        for (const cell of nbData.cells) {
          if (cell.outputs) {
            for (const output of cell.outputs) {
              if (output.data && output.data["image/png"]) {
                imageOutputs.push(output.data["image/png"]);
              }
            }
          }
        }

        if (imageOutputs.length >= 2) {
            circuitImg = imageOutputs[0].trim();
            graphImg = imageOutputs[1].trim();
        } else if (imageOutputs.length === 1) {
            circuitImg = imageOutputs[0].trim();
        }

        // Clean up output notebook
        fs.unlinkSync(outputNb);

        res.json({
          circuit: circuitImg,
          graph: graphImg,
          console: `═══ ${algo.name} ═══\nExecuted successfully via Papermill and Qiskit.\n\nParameters: ${JSON.stringify(parameters)}`,
          measurements: null,
          blochSphere: null,
        });

      } catch (err) {
        console.error("Error reading notebook:", err);
        res.status(500).json({ error: "Failed to parse notebook output" });
      }
    });

  } else {
    // ─── Generate mock results based on algorithm type ───
    const result = generateMockResult(algo, parameters);
    res.json(result);
  }
}

/**
 * Generates mock simulation results.
 * Replace this function with real quantum simulation logic.
 */
function generateMockResult(algo, params) {
  if (algo.id === "grover-search") {
    const numQubits = params["Number of Qubits"] || params["Precision Qubits"] || 3;
    const numStates = Math.pow(2, Math.min(numQubits, 4));

    // Generate random-ish probability distribution
    const values = Array.from({ length: numStates }, () => Math.random());
    const sum = values.reduce((a, b) => a + b, 0);
    const normalized = values.map((v) => parseFloat((v / sum).toFixed(4)));

    // Generate state labels
    const labels = Array.from({ length: numStates }, (_, i) =>
      i.toString(2).padStart(Math.min(numQubits, 4), "0")
    );

    // Find max probability state
    const maxIdx = normalized.indexOf(Math.max(...normalized));

    return {
      graph: {
        type: "probability",
        labels,
        values: normalized,
      },
      circuit: {
        gates: algo.parameters
          .map((p) => p.name.substring(0, 3).toUpperCase())
          .concat(["H", "CNOT", "Measure"]),
        qubits: numQubits,
        depth: numQubits * 2 + 2,
      },
      blochSphere: {
        theta: Math.random() * Math.PI,
        phi: Math.random() * 2 * Math.PI,
      },
      console: [
        `═══ ${algo.name} ═══`,
        `Parameters: ${JSON.stringify(params)}`,
        `Qubits: ${numQubits}`,
        `Simulation completed successfully ✓`,
        `Most probable state: |${labels[maxIdx]}⟩ (${(normalized[maxIdx] * 100).toFixed(1)}%)`,
        `Total shots: 1000`,
      ].join("\n"),
      measurements: labels.map((label, i) => ({
        state: `|${label}⟩`,
        probability: normalized[i],
        count: Math.round(normalized[i] * 1000),
      })),
    };
  }

  // Basic fallback structure for all other algorithms without mock simulation data
  return {
    name: algo.name,
    description: algo.description,
    formula: algo.formula,
    graph: null,
    circuit: null,
    blochSphere: null, // Bloch sphere removed for everything except Grover's
    console: `═══ ${algo.name} ═══\nReal simulation logic not yet implemented.\n\nDescription: ${algo.description}\nFormula: ${algo.formula}\n\nAdd your custom logic here later.`,
    measurements: null,
  };
}

module.exports = { getAlgorithms, getAlgorithmById, runAlgorithm };
