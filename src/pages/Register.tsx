import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Loader2, AlertCircle } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [form, setForm] = useState({
        company_name: '',
        user_name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authApi.register(form);
            login(res.data.access_token, {
                user_name: res.data.user_name,
                company_name: res.data.company_name,
                role: res.data.role,
            });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-glow" />
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <Scale size={28} />
                    </div>
                    <h1 className="auth-title">Criar Conta</h1>
                    <p className="auth-subtitle">Cadastre sua empresa e comece agora</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Nome da Empresa</label>
                        <input
                            name="company_name"
                            type="text"
                            className="form-input"
                            value={form.company_name}
                            onChange={handleChange}
                            placeholder="Ex.: Escritório Silva & Associados"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Seu Nome</label>
                        <input
                            name="user_name"
                            type="text"
                            className="form-input"
                            value={form.user_name}
                            onChange={handleChange}
                            placeholder="Dr. João Silva"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input
                            name="email"
                            type="email"
                            className="form-input"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="joao@escritorio.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Senha</label>
                        <input
                            name="password"
                            type="password"
                            className="form-input"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 size={16} className="spin-icon" /> : null}
                        {loading ? 'Criando...' : 'Criar Conta'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
}
