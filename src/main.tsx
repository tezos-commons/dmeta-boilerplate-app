import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Assuming "root" is the ID of your root DOM element
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <App />
  );
}
