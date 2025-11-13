// Occupancy grid component (Bootstrap styles)
// - Fetches the list of spots from the API every 5 seconds
// - Renders a responsive grid with colors based on status

import React from 'react';
import { api } from '../api.js';

export default function Occupancy() {
  // React state for spots, loading, and errors
  const [spots, setSpots] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Helper to fetch data from the API
  const load = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await api('/api/spots');
      setSpots(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Load once and then poll every 5 seconds
  React.useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <div className="card p-3">A carregar estado…</div>;
  if (error) return <div className="card p-3 text-danger">Erro: {error}</div>;

  return (
    <section className="card p-3 bg-dark text-light border-secondary">
      <div className="d-flex justify-content-between align-items-baseline mb-2">
        <h3 className="h5 fw-semibold mb-0">Ocupação</h3>
        <span className="small text-secondary">Atualiza a cada 5s</span>
      </div>

      {/* Responsive grid: 3 cols mobile, up to 8 cols on xl */}
      <div className="row g-2 row-cols-3 row-cols-sm-4 row-cols-md-6 row-cols-xl-8">
        {spots.map((s) => {
          // Map status to Bootstrap color classes
          const statusClass = s.status === 'free'
            ? 'bg-success-subtle text-success-emphasis border border-success-subtle'
            : s.status === 'reserved'
              ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
              : 'bg-danger-subtle text-danger-emphasis border border-danger-subtle';
          return (
            <div className="col" key={s.id}>
              <div className={`d-flex align-items-center justify-content-center rounded-3 fw-bold py-2 ${statusClass}`} title={s.currentPlate || ''} aria-label={`Lugar ${s.label} - ${s.status}`}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
