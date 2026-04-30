// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ChatHelpWidget from "./components/ChatHelpWidget";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EmpresaPage from "./pages/EmpresaPage";
import ProdutoPage from "./pages/ProdutoPage";
import AplicacaoPage from "./pages/AplicacaoPage";
import ClientePage from "./pages/ClientePage";
import ParceriaPage from "./pages/ParceriaPage";

// ── Auth guard ────────────────────────────────────────────────
function RequireAuth({ children }) {
  const auth = localStorage.getItem("auth");
  return auth ? children : <Navigate to="/login" replace />;
}

// ── Layout with sidebar ───────────────────────────────────────
function AppLayout({ theme, toggleTheme }) {
  return (
    <div className="layout-wrapper">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div className="main-content">
        <Topbar theme={theme} toggleTheme={toggleTheme} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empresa" element={<EmpresaPage />} />
            <Route path="/produto" element={<ProdutoPage />} />
            <Route path="/aplicacao" element={<AplicacaoPage />} />
            <Route path="/cliente" element={<ClientePage />} />
            <Route path="/parceria" element={<ParceriaPage />} />
          </Routes>
        </main>
      </div>
      <ChatHelpWidget /> 
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage theme={theme} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppLayout theme={theme} toggleTheme={toggleTheme} />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
