// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Consultando from "./pages/Consultando";
import Processo from "./pages/Processo"; // <- NOVO
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consultando" element={<Consultando />} />
        <Route path="/processo" element={<Processo />} /> {/* <- NOVO */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
