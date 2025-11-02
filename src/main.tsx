import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { UserProvider } from "@/context/UserContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { registerServiceWorker } from "@/pwa/register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <WorkoutProvider>
            <App />
          </WorkoutProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

registerServiceWorker();
