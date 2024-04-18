import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import Sidebar from "./Sidebar.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>,
);
