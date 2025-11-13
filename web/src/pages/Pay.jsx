// Payment page: calculates payment and opens a 15-minute exit window
import React from 'react';
import { api } from '../api.js';

export default function Pay() {
    // Form and feedback state
    const [plate, setPlate] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [allowed, setAllowed] = React.useState(null);

    // Calls the payment endpoint and stores the allowed exit time
    const pay = async (e) => {
        e.preventDefault();
        setMsg(''); setErr(''); setAllowed(null);
        setLoading(true);
        try {
            const data = await api('/api/exit/payment', { method: 'POST', body: JSON.stringify({ plate }) });
            const amount = typeof data.amount === 'number' ? data.amount.toFixed(2) : data.amount;
            setMsg(`Pagamento efetuado: ${amount} €. Tem até ${new Date(data.allowedExitUntil).toLocaleTimeString()} para sair.`);
            setAllowed(data.allowedExitUntil);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Confirms the physical exit at the barrier
    const confirm = async () => {
        setErr(''); setMsg('');
        try {
            await api('/api/exit/confirm', { method: 'POST', body: JSON.stringify({ plate }) });
            setMsg('Saída confirmada. Obrigado!');
        } catch (e) {
            setErr(e.message);
        }
    };

    return (
        <section className="card bg-dark text-light border-secondary p-3">
            <h2 className="h5 fw-semibold">Pagar e Sair</h2>
            <p className="text-secondary small mb-0">Após o pagamento, terá 15 minutos para sair do parque.</p>

            {/* Payment form */}
            <form onSubmit={pay} className="row g-3 align-items-end mt-1">
                <div className="col-12 col-md-8">
                    <label className="form-label small">Matrícula</label>
                    <input className="form-control" placeholder="AA-00-BB" value={plate} onChange={(e) => setPlate(e.target.value)} required />
                </div>
                <div className="col-12 col-md-4">
                    <button className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'A processar…' : 'Pagar'}
                    </button>
                </div>
            </form>

            {/* Exit confirmation button appears only after payment */}
            {allowed && (
                <div className="mt-3">
                    <button className="btn btn-secondary" onClick={confirm}>Confirmar Saída</button>
                    <p className="mt-2 small text-secondary">Saída permitida até <strong className="text-light">{new Date(allowed).toLocaleTimeString()}</strong>.</p>
                </div>
            )}

            {/* Feedback messages */}
            {msg && <p className="mt-3 text-success">{msg}</p>}
            {err && <p className="mt-3 text-danger">{err}</p>}
        </section>
    );
}
