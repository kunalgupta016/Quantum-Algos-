/**
 * Sandbox Controller
 *
 * Handles execution of user-provided Python code.
 * Creates a temporary Jupyter notebook, runs it via Papermill,
 * and extracts all outputs (images, text).
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const PYTHON_PATH = process.env.PYTHON_PATH || "python3";

function runSandboxCode(req, res) {
  const { code, cells } = req.body;
  let codeCells = [];

  if (cells && Array.isArray(cells)) {
    codeCells = cells;
  } else if (code && typeof code === "string") {
    codeCells = [code];
  } else {
    return res.status(400).json({ error: "code or cells array is required" });
  }

  const timestamp = Date.now();
  const inputNb = path.join(__dirname, `../notebooks/sandbox_input_${timestamp}.ipynb`);
  const outputNb = path.join(__dirname, `../notebooks/sandbox_output_${timestamp}.ipynb`);

  const notebook = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: {
        name: "python",
        version: "3.14.0",
      },
    },
    cells: [
      {
        cell_type: "code",
        metadata: {},
        source: [
          "%matplotlib inline\n",
          "import matplotlib\n",
          "matplotlib.use('agg')\n",
        ],
        outputs: [],
        execution_count: null,
      },
      ...codeCells.map(c => ({
        cell_type: "code",
        metadata: {},
        source: c.split("\n").map((line, i, arr) =>
          i < arr.length - 1 ? line + "\n" : line
        ),
        outputs: [],
        execution_count: null,
      }))
    ],
  };

  try {
    fs.writeFileSync(inputNb, JSON.stringify(notebook, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write sandbox notebook:", err);
    return res.status(500).json({ error: "Failed to create notebook" });
  }

  const command = `"${PYTHON_PATH}" -m papermill "${inputNb}" "${outputNb}" -k python3 -l python`;

  console.log("Sandbox: Running command:", command);

  exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
    try { fs.unlinkSync(inputNb); } catch (e) { /* ignore */ }

    if (error) {
      console.error("Sandbox execution error:", error.message);
      try {
        if (fs.existsSync(outputNb)) {
          const results = extractNotebookOutputs(outputNb);
          fs.unlinkSync(outputNb);
          
          if (cells) {
            return res.json({ results, error: "Execution completed with errors. Check output." });
          } else {
            return res.json({
              images: results[0]?.images || [],
              console: results[0]?.text || "",
              error: results[0]?.errorText || "Execution completed with errors. Check output.",
            });
          }
        }
      } catch (e) { /* ignore */ }

      return res.status(500).json({
        images: [],
        console: "",
        error: `Execution failed: ${stderr || error.message}`,
      });
    }

    try {
      const results = extractNotebookOutputs(outputNb);
      fs.unlinkSync(outputNb);

      if (cells) {
        res.json({ results });
      } else {
        res.json({
          images: results[0]?.images || [],
          console: results[0]?.text || "",
          error: results[0]?.errorText || null,
        });
      }
    } catch (err) {
      console.error("Error reading sandbox output:", err);
      try { fs.unlinkSync(outputNb); } catch (e) { /* ignore */ }
      res.status(500).json({ error: "Failed to parse notebook output" });
    }
  });
}

function extractNotebookOutputs(notebookPath) {
  const nbData = JSON.parse(fs.readFileSync(notebookPath, "utf8"));
  const results = [];

  for (let i = 1; i < nbData.cells.length; i++) {
    const cell = nbData.cells[i];
    const images = [];
    const textParts = [];
    let errorText = null;

    if (cell.outputs) {
      for (const output of cell.outputs) {
        if (output.data && output.data["image/png"]) {
          images.push(output.data["image/png"].trim());
        }
        if (output.output_type === "stream" && output.text) {
          const text = Array.isArray(output.text) ? output.text.join("") : output.text;
          textParts.push(text);
        }
        if (output.output_type === "execute_result" && output.data && output.data["text/plain"]) {
          const text = Array.isArray(output.data["text/plain"])
            ? output.data["text/plain"].join("")
            : output.data["text/plain"];
          textParts.push(text);
        }
        if (output.output_type === "error") {
          errorText = output.traceback
            ? output.traceback.map((line) => line.replace(/\x1b\[[0-9;]*m/g, "")).join("\n")
            : `${output.ename}: ${output.evalue}`;
        }
      }
    }
    results.push({ images, text: textParts.join(""), errorText });
  }

  return results;
}

module.exports = { runSandboxCode, extractNotebookOutputs };
