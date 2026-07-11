import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlgorithmProvider } from "./context/AlgorithmContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import useSmoothScroll from "./hooks/useSmoothScroll";

/**
 * Inner app component that uses the smooth scroll hook.
 * Must be inside BrowserRouter for hooks to work.
 */
function AppInner() {
  useSmoothScroll();
  return <AppRoutes />;
}

/**
 * Root Application Component
 * Wraps the app in ThemeProvider, Router, AuthProvider, and AlgorithmProvider.
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AlgorithmProvider>
            <AppInner />
          </AlgorithmProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
