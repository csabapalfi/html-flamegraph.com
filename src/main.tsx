import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initAnalytics } from "./utils/analytics";
import { App } from "./app";

initAnalytics();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
