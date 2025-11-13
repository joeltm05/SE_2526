// Reservation page (Bootstrap styles)
import React from 'react';
import { api } from '../api.js';

export default function Reserve() {
    // Form state
    const [plate, setPlate] = React.useState('');
    const [minutes, setMinutes] = React.useState(30);
    const [msg, setMsg] = React.useState('');
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Submit handler: calls the reserve API and shows feedback
    const submit = async (e) => {
        e.preventDefault();
        setMsg('');
        setErr('');
        setLoading(true);
        try {
            const data = await api('/api/reserve', {
                method: 'POST',
                body: JSON.stringify({ plate, minutes: Number(minutes) }),
            });
            setMsg(`Reserva confirmada: lugar ${data.spot.label} até ${new Date(data.expiresAt).toLocaleString()}`);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="card bg-dark text-light border-secondary p-3">
            <h2 className="h5 fw-semibold">Reservar lugar</h2>
            <p className="text-secondary small mb-0">Indique a matrícula e a duração da reserva.</p>

            {/* Bootstrap grid form */}
            <form onSubmit={submit} className="row g-3 align-items-end mt-1">
                <div className="col-12 col-sm-6 col-lg-5">
                    <label className="form-label small">Matrícula</label>
                    <input className="form-control" placeholder="AA-00-BB" value={plate} onChange={(e) => setPlate(e.target.value)} required />
                </div>

                <div className="col-6 col-lg-3">
                    <label className="form-label small">Duração</label>
                    <select className="form-select" value={minutes} onChange={(e) => setMinutes(e.target.value)}>
                        {[15, 30, 45, 60, 90, 120].map((m) => (
                            <option key={m} value={m}>{m} min</option>
                        ))}
                    </select>
                </div>

                <div className="col-6 col-lg-2">
                    <button className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'A reservar…' : 'Reservar'}
                    </button>
                </div>
            </form>

            {/* Feedback messages */}
            {msg && <p className="mt-3 text-success">{msg}</p>}
            {err && <p className="mt-3 text-danger">{err}</p>}
        </section>
    );
}
