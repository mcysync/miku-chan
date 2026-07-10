import React from "react";
import ReactDOM from "react-dom/client";
import MikuChat from "./components/MikuChat";
import "./styles.css";

const apiUrl = (import.meta as any).env?.VITE_API_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MikuChat apiUrl={apiUrl} />
  </React.StrictMode>
);
