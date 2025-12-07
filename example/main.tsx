
import React from "react";
import ReactDOM from "react-dom/client"; // Make sure this is React 18+
import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found. Make sure your index.html has a div with id='root'.");
}

// Create a root and render the React app
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);