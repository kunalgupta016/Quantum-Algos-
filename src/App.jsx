import { BrowserRouter } from "react-router-dom";
import { AlgorithmProvider } from "./context/AlgorithmContext";
import AppRoutes from "./routes/AppRoutes";

/**
 * Root application component.
 * Wraps everything with BrowserRouter and AlgorithmProvider.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AlgorithmProvider>
        <AppRoutes />
      </AlgorithmProvider>
    </BrowserRouter>
  );
}
