import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authApi.login({ email, password });
            login(res.data.access_token, {
                user_name: res.data.user_name,
                company_name: res.data.company_name,
                role: res.data.role,
            });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-glow" />
            <div className="auth-card">
                <div className="auth-brand-custom">
                    <img src="/logo_fundo_preto.png" alt="FP Analysis Logo" className="brand-logo-full" />
                    <div className="brand-sub">CONTESTAÇÕES JURÍDICAS</div>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 size={16} className="spin-icon" /> : null}
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>


            </div>
        </div>
    );
}
