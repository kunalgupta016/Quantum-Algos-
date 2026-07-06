import { useState, useCallback } from "react";
import { runAlgorithm } from "../services/api";
import { useAlgorithmContext } from "../context/AlgorithmContext";

/**
 * Custom hook that encapsulates algorithm execution logic.
 *
 * Manages:
 * - Running algorithms via the API
 * - Falling back to mock data when backend is unavailable
 * - Loading and error states
 *
 * Usage:
 *   const { execute, isRunning, runError } = useAlgorithm();
 *   await execute();
 */
export function useAlgorithm() {
  const {
    selectedAlgorithm,
    parameters,
    setRunResult,
    setLoading,
    setError,
  } = useAlgorithmContext();

  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState(null);

  const execute = useCallback(async () => {
    if (!selectedAlgorithm) return;

    setIsRunning(true);
    setLoading(true);
    setRunError(null);
    setError(null);

    try {
      const data = await runAlgorithm(selectedAlgorithm.id, parameters);
      setRunResult(data);
    } catch (err) {
      console.warn(
        "Backend unavailable, using mock data:",
        err.message
      );

      if (selectedAlgorithm.mockOutput) {
        setRunResult(selectedAlgorithm.mockOutput);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          "Backend unavailable. Connect a FastAPI server to see live results.";
        setRunError(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsRunning(false);
      setLoading(false);
    }
  }, [selectedAlgorithm, parameters, setRunResult, setLoading, setError]);

  return { execute, isRunning, runError };
}
