// Status page: lets the user check the current status of their vehicle
import React from 'react';
import { api } from '../api.js';
import Occupancy from './Occupancy.jsx';

export default function Status() {
    // Form and response state
    const [plate, setPlate] = React.useState('');
    const [info, setInfo] = React.useState(null);
    const [err, setErr] = React.useState('');

    // Fetch the current session for a given plate
    const load = async (e) => {
        e.preventDefault();
        setErr(''); setInfo(null);
        try {
            const data = await api(`/api/session/${encodeURIComponent(plate)}`);
            setInfo(data);
            if (!data.active) setErr('Não há sessão ativa para esta matrícula.');
        } catch (e) {
            setErr(e.message);
        }
    };

    return (
        <div className="d-flex flex-column gap-3">
            <section className="card bg-dark text-light border-secondary p-3">
                <h2 className="h5 fw-semibold">Estado do Veículo</h2>
                <p className="text-secondary small mb-0">Insira a matrícula para consultar o lugar e o estado atual.</p>

                {/* Search form */}
                <form onSubmit={load} className="row g-3 align-items-end mt-1">
                    <div className="col-12 col-md-8">
                        <label className="form-label small">Matrícula</label>
                        <input className="form-control" placeholder="AA-00-BB" value={plate} onChange={(e) => setPlate(e.target.value)} required />
                    </div>
                    <div className="col-12 col-md-4">
                        <button className="btn btn-primary w-100">Ver estado</button>
                    </div>
                </form>

                {/* Results panel */}
                {info && info.active && (
                    <div className="mt-3 row g-3">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="border border-secondary rounded p-3 bg-black">
                                <h3 className="h6">Informação</h3>
                                <dl className="row small mb-0">
                                    <dt className="col-5">Matrícula</dt><dd className="col-7"><code>{info.plate}</code></dd>
                                    <dt className="col-5">Estado</dt><dd className="col-7 text-capitalize">{info.status}</dd>
                                    {info.spot && (<>
                                        <dt className="col-5">Lugar</dt><dd className="col-7 fw-semibold">{info.spot.label}</dd>
                                    </>)}
                                    {info.allowedExitUntil && (<>
                                        <dt className="col-5">Saída até</dt><dd className="col-7">{new Date(info.allowedExitUntil).toLocaleString()}</dd>
                                    </>)}
                                </dl>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error feedback */}
                {err && <p className="mt-3 text-danger">{err}</p>}
            </section>

            {/* Also show occupancy below for convenience */}
            <Occupancy />
        </div>
    );
}
