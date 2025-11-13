// Login & Registration Page
// - Allows creating an account and logging in
// - Stores JWT in localStorage via setAuthToken
// - Uses Bootstrap form styling

import React from 'react';
import { api, setAuthToken } from '../api.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = React.useState('login'); // or 'register'
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    async function submit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await api(path, { method: 'POST', body: JSON.stringify({ email, password }) });
            setAuthToken(res.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mx-auto" style={{ maxWidth: 420 }}>
            <h2 className="h4 mb-3">{mode === 'login' ? 'Iniciar Sessão' : 'Registar'}</h2>
            <p className="small text-secondary">{mode === 'login' ? 'Entre para gerir entradas, reservas e pagamentos.' : 'Crie uma conta para aceder às funcionalidades protegidas.'}</p>
            <div className="card p-3">
                <form onSubmit={submit} className="d-grid gap-3">
                    <div>
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
                    <button disabled={loading} className="btn btn-primary">
                        {loading ? 'Aguarde…' : (mode === 'login' ? 'Entrar' : 'Registar')}
                    </button>
                </form>
                <div className="mt-3 text-center small">
                    {mode === 'login' ? (
                        <button type="button" className="btn btn-link p-0" onClick={() => setMode('register')}>Criar conta</button>
                    ) : (
                        <button type="button" className="btn btn-link p-0" onClick={() => setMode('login')}>Já tenho conta</button>
                    )}
                </div>
            </div>
        </section>
    );
}
