// Home page: shows a hero section and the current occupancy grid (Bootstrap styles)
import React from 'react';
import Occupancy from './Occupancy.jsx';

export default function Home() {
  return (
    <div className="d-flex flex-column gap-3">
      {/* Hero / intro section */}
      <section className="card bg-dark text-light border-secondary p-3">
        <div className="row align-items-center g-3">
          <div className="col-md">
            <h1 className="h3 fw-bold mb-1">Parque de Estacionamento</h1>
            <p className="text-secondary mb-0">Reserve um lugar, pague a saída, e acompanhe o estado do parque em tempo real.</p>
          </div>
          <div className="col-md-auto">
            {/* Occupancy legend */}
            <div className="d-flex flex-wrap gap-2 small">
              <span className="badge rounded-pill text-bg-success">Livre</span>
              <span className="badge rounded-pill text-bg-warning">Reservado</span>
              <span className="badge rounded-pill text-bg-danger">Ocupado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live occupancy grid */}
      <Occupancy />
    </div>
  );
}
