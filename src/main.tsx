import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New version available. Reload now?")) {
            updateSW();
        }
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
