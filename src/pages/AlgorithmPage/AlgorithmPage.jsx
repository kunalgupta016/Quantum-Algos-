import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAlgorithmContext } from "../../context/AlgorithmContext";
import { useAlgorithm } from "../../hooks/useAlgorithm";
import FormulaCard from "../../components/FormulaCard/FormulaCard";
import ParameterInput from "../../components/ParameterInput/ParameterInput";
import Button from "../../components/Button/Button";
import GraphViewer from "../../components/GraphViewer/GraphViewer";
import QuantumCircuitViewer from "../../components/QuantumCircuitViewer/QuantumCircuitViewer";
import BlochSphereViewer from "../../components/BlochSphereViewer/BlochSphereViewer";
import OutputConsole from "../../components/OutputConsole/OutputConsole";
import MeasurementTable from "../../components/MeasurementTable/MeasurementTable";
import Loading from "../../components/Loading/Loading";

export default function AlgorithmPage() {
  const { id } = useParams();
  const {
    selectedAlgorithm,
    selectAlgorithm,
    parameters,
    updateParameter,
    result,
    loading,
    error,
  } = useAlgorithmContext();
  const { execute, isRunning } = useAlgorithm();

  const [showConfig, setShowConfig] = useState(false);
  const [showBlochSphere, setShowBlochSphere] = useState(false);

  useEffect(() => {
    if (id) selectAlgorithm(id);
  }, [id, selectAlgorithm]);

  if (!selectedAlgorithm) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-gray-500">Algorithm not found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white text-gray-800">
      <Loading visible={loading} />

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-2 inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
            {selectedAlgorithm.category}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedAlgorithm.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-3xl">
            {selectedAlgorithm.description}
          </p>
        </header>

        {/* Formula & Complexity */}
        <section className="mb-6">
          <FormulaCard
            formula={selectedAlgorithm.formula}
            timeComplexity={selectedAlgorithm.timeComplexity}
            spaceComplexity={selectedAlgorithm.spaceComplexity}
          />
        </section>

        {/* Applications */}
        {selectedAlgorithm.applications?.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Applications
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedAlgorithm.applications.map((app) => (
                <span
                  key={app}
                  className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                >
                  {app}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Reference */}
        {selectedAlgorithm.reference && (
          <section className="mb-6">
            <a
              href={selectedAlgorithm.reference}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Reference Paper
            </a>
          </section>
        )}

        <hr className="my-6 border-gray-200" />

        {!showConfig ? (
          <div className="flex justify-center my-8">
            <Button variant="primary" size="lg" onClick={() => setShowConfig(true)}>
              Configure & Run Algorithm
            </Button>
          </div>
        ) : (
          <div>
            {/* Parameters */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">
                  Parameters
                </h3>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Hide Configuration
                </button>
              </div>
              <ParameterInput
                parameters={selectedAlgorithm.parameters}
                values={parameters}
                onChange={updateParameter}
              />
            </section>

            {/* Run Button */}
            <section className="mb-8 border-b border-gray-200 pb-8">
              <Button
                variant="primary"
                size="md"
                loading={isRunning}
                onClick={execute}
              >
                {isRunning ? "Running..." : "Run Algorithm"}
              </Button>

              {error && (
                <p className="mt-2 text-xs text-red-600">{error}</p>
              )}
            </section>

            {/* Interactive Bloch Sphere Toggle */}
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Bloch Sphere Representation
                </h3>
                <button
                  onClick={() => setShowBlochSphere(!showBlochSphere)}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  {showBlochSphere ? "Hide Bloch Sphere" : "Show Bloch Sphere"}
                </button>
              </div>
              
              {showBlochSphere && (
                <div className="mt-4">
                  <BlochSphereViewer blochData={result?.blochSphere} />
                </div>
              )}
            </section>

            {/* Output Section */}
            {result && (
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-t border-gray-200 pt-6">Results</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <GraphViewer graphData={result.graph} />
                  <QuantumCircuitViewer circuitData={result.circuit} />
                </div>

                <OutputConsole output={result.console} />
                <MeasurementTable measurements={result.measurements} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
