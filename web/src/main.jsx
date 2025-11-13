// Entry file for the React application
// - Imports Bootstrap CSS (mobile-first)
// - Sets up router and layout with a responsive navigation bar

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
// Bootstrap CSS and JS (optional JS for components like collapse)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import route pages
import Home from './pages/Home.jsx';
import Reserve from './pages/Reserve.jsx';
import Pay from './pages/Pay.jsx';
import Status from './pages/Status.jsx';
import Login from './pages/Login.jsx';

// Small helper component to render a navigation link with active state
function TopNavLink({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}>
      {children}
    </NavLink>
  );
}

// Responsive layout with mobile menu
function Layout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top navigation bar */}
      <header className="sticky-top border-bottom bg-dark">
        <nav className="navbar navbar-expand-md navbar-dark container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <span className="rounded bg-primary d-inline-block" style={{ width: 28, height: 28 }} />
            <span>Parque</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navMain">
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
              <li className="nav-item"><TopNavLink to="/">Início</TopNavLink></li>
              <li className="nav-item"><TopNavLink to="/reservar">Reservar</TopNavLink></li>
              <li className="nav-item"><TopNavLink to="/pagar">Pagar Saída</TopNavLink></li>
              <li className="nav-item"><TopNavLink to="/estado">Estado</TopNavLink></li>
              <li className="nav-item"><TopNavLink to="/login">Login</TopNavLink></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main application container */}
      <main className="container flex-fill py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Reserve />} />
          <Route path="/pagar" element={<Pay />} />
          <Route path="/estado" element={<Status />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-top bg-dark text-secondary">
        <div className="container py-4 text-center small">
          © {new Date().getFullYear()} Parque. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

// Mount the app into the #root element
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);
