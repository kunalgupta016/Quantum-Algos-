import { createContext, useContext, useState, useCallback } from "react";
import algorithms from "../data/algorithms";

const AlgorithmContext = createContext(null);

/**
 * Provides global algorithm state to the component tree.
 *
 * Stores:
 * - algorithmList: all algorithms from data store
 * - selectedAlgorithm: currently selected algorithm object
 * - parameters: user-entered input values
 * - result: API response (graph, circuit, bloch, console, measurements)
 * - loading: whether an API call is in progress
 * - error: any error message
 */
export function AlgorithmProvider({ children }) {
  const [algorithmList] = useState(algorithms);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [parameters, setParameters] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectAlgorithm = useCallback((algorithmId) => {
    const algo = algorithmList.find((a) => a.id === algorithmId);
    if (algo) {
      setSelectedAlgorithm(algo);
      setResult(null);
      setError(null);
      // Initialize parameters with defaults
      const defaults = {};
      algo.parameters.forEach((param) => {
        defaults[param.name] = param.default ?? "";
      });
      setParameters(defaults);
    }
  }, [algorithmList]);

  const updateParameter = useCallback((name, value) => {
    setParameters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setRunResult = useCallback((data) => {
    setResult(data);
    setError(null);
  }, []);

  const value = {
    algorithmList,
    selectedAlgorithm,
    selectAlgorithm,
    parameters,
    updateParameter,
    setParameters,
    result,
    setRunResult,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <AlgorithmContext.Provider value={value}>
      {children}
    </AlgorithmContext.Provider>
  );
}

/**
 * Custom hook for consuming algorithm context.
 * Throws if used outside of AlgorithmProvider.
 */
export function useAlgorithmContext() {
  const context = useContext(AlgorithmContext);
  if (!context) {
    throw new Error(
      "useAlgorithmContext must be used within an AlgorithmProvider"
    );
  }
  return context;
}

export default AlgorithmContext;
