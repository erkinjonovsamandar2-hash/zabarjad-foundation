import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from "@/components/ErrorBoundary"; // <-- 1. Import it

createRoot(document.getElementById("root")!).render(
  // 2. Wrap the App component
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);