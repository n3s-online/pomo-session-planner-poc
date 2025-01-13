import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <div className="text-blue-500 font-bold">Tailwind Test</div>
  </StrictMode>
);
