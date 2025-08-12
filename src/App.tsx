// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Consultando from "./pages/Consultando";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/consultando" element={<Consultando />} />
    </Routes>
  );
}
