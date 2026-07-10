/**
 * Algorithm Simulation Controller
 *
 * Contains the logic for running quantum algorithm simulations.
 * Uses Papermill to execute Qiskit Jupyter notebooks and extracts
 * the resulting circuit diagrams, histograms, and console outputs.
 */

const algorithms = require("../data/algorithms");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { extractNotebookOutputs } = require("./sandboxController");

const PYTHON_PATH = "c:\\users\\pc\\appdata\\local\\python\\pythoncore-3.14-64\\python.exe";

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

  // ─── Real Papermill Execution ───
  const inputNb = path.join(__dirname, `../notebooks/${algorithmId}.ipynb`);
  
  if (!fs.existsSync(inputNb)) {
      return res.status(500).json({ error: `Notebook for ${algorithmId} not found on server.` });
  }

  const outputNb = path.join(__dirname, `../notebooks/output_${Date.now()}.ipynb`);
  
  // Build parameter arguments for Papermill
  let paramArgs = "";
  if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
          // Map frontend parameter names to notebook variable names
          let varName = key.toLowerCase().replace(/[^a-z0-9]/g, "_");
          if (key === "Number of Qubits") varName = "num_qubits";
          if (key === "Iterations") varName = "iterations";
          if (key === "Target State") varName = "target_state";
          if (key === "Function Type") varName = "function_type";
          if (key === "Alpha (real)") varName = "alpha_real";
          if (key === "Beta (real)") varName = "beta_real";
          if (key === "Input State") varName = "input_state";
          if (key === "Number to Factor") varName = "number_to_factor";
          if (key === "Attempts") varName = "attempts";
          if (key === "Secret String") varName = "secret_string";
          if (key === "Precision Qubits") varName = "precision_qubits";
          if (key === "Phase (θ)") varName = "phase_theta";
          
          if (typeof value === 'string') {
              paramArgs += ` -p ${varName} "${value}"`;
          } else {
              paramArgs += ` -p ${varName} ${value}`;
          }
      }
  }

  const command = `"${PYTHON_PATH}" -m papermill "${inputNb}" "${outputNb}" ${paramArgs} -k python3 -l python`;

  console.log("Running command:", command);

  exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("Papermill execution error:", error.message);
      // Try to read output even if it failed, as Papermill fails on cell errors
      if (!fs.existsSync(outputNb)) {
          return res.status(500).json({ error: "Execution failed completely", console: stderr || error.message });
      }
    }

    try {
      const resultsArray = extractNotebookOutputs(outputNb);
      fs.unlinkSync(outputNb);

      let allImages = [];
      let allText = "";
      let allErrors = "";

      for (const res of resultsArray) {
        if (res.images && res.images.length > 0) allImages.push(...res.images);
        if (res.text) allText += res.text + "\n";
        if (res.errorText) allErrors += res.errorText + "\n";
      }

      let circuitImg = null;
      let graphImg = null;
      let blochImg = null;

      if (allImages.length > 0) circuitImg = allImages[0];
      if (allImages.length > 1) graphImg = allImages[1];
      if (allImages.length > 2) blochImg = allImages[2];

      // Parse text output for Bloch sphere and measurements
      let theta = Math.PI / 4;
      let phi = Math.PI / 3;
      let measurements = [];
      let consoleOut = allText || "";

      // Parse Bloch Sphere Angles
      const thetaMatch = consoleOut.match(/BLOCH_THETA=([\d.]+)/);
      if (thetaMatch) theta = parseFloat(thetaMatch[1]);
      const phiMatch = consoleOut.match(/BLOCH_PHI=([\d.]+)/);
      if (phiMatch) phi = parseFloat(phiMatch[1]);

      // Remove the BLOCH_ variables from the console output to hide them from the user
      consoleOut = consoleOut.replace(/BLOCH_THETA=[\d.]+\n?/g, "");
      consoleOut = consoleOut.replace(/BLOCH_PHI=[\d.]+\n?/g, "");

      // Parse Measurements Dictionary
      // Looking for: {'010': 120, '101': 880}
      const countsMatch = consoleOut.match(/\{('[01]+': \d+(?:,\s*)?)+\}/);
      if (countsMatch) {
          try {
              // Convert python dict string to JSON: {'010': 120} -> {"010": 120}
              const jsonStr = countsMatch[0].replace(/'/g, '"');
              const countsObj = JSON.parse(jsonStr);
              
              let totalShots = 0;
              for (const count of Object.values(countsObj)) {
                  totalShots += count;
              }

              for (const [state, count] of Object.entries(countsObj)) {
                  measurements.push({
                      state: `|${state}⟩`,
                      probability: count / totalShots,
                      count: count
                  });
              }
              // Sort by highest probability
              measurements.sort((a, b) => b.probability - a.probability);
          } catch (e) {
              console.error("Failed to parse measurements:", e);
          }
      }

      // Add a nice header to the console
      consoleOut = `═══ ${algo.name} ═══\nExecuted successfully via Qiskit Aer Simulator.\n\n${consoleOut}`;

      if (allErrors.trim()) {
          consoleOut += `\n\nERRORS:\n${allErrors.trim()}`;
      }

      res.json({
        circuit: circuitImg,
        graph: graphImg,
        blochImage: blochImg,
        console: consoleOut.trim(),
        measurements: measurements.length > 0 ? measurements : null,
        blochSphere: { theta, phi },
      });

    } catch (err) {
      console.error("Error parsing notebook output:", err);
      try { fs.unlinkSync(outputNb); } catch (e) {}
      res.status(500).json({ error: "Failed to parse notebook output" });
    }
  });
}

module.exports = { getAlgorithms, getAlgorithmById, runAlgorithm };
