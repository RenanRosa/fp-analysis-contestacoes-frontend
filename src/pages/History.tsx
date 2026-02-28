import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Zap, Trash2, Eye, RefreshCw, Plus,
    Loader2, AlertCircle, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import { petitionsApi, contestationsApi } from '../api/endpoints';
import './History.css';

interface Petition {
    id: number;
    title: string;
    status: string;
    created_at: string;
    subsidy_count: number;
    contestation_count: number;
    author_name?: string;
    lawyer_name?: string;
    similarity_score?: number;
    document_analysis?: string;
}

const truncateText = (text?: string, limit: number = 20) => {
    if (!text) return '-';
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
};

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { cls: string; icon: any; label: string }> = {
        pending: { cls: 'badge-pending', icon: Clock, label: 'Pendente' },
        processing: { cls: 'badge-processing', icon: Loader2, label: 'Gerando...' },
        completed: { cls: 'badge-completed', icon: CheckCircle, label: 'Processada' },
        error: { cls: 'badge-error', icon: AlertTriangle, label: 'Erro' },
    };
    const info = map[status] || map.pending;
    const Icon = info.icon;
    return (
        <span className={`badge ${info.cls}`}>
            <Icon size={11} />
            {info.label}
        </span>
    );
};

export default function History() {
    const [petitions, setPetitions] = useState<Petition[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const silentLoad = () =>
        petitionsApi.list()
            .then((res) => setPetitions(res.data))
            .catch(() => { });

    const load = () => {
        setLoading(true);
        petitionsApi.list()
            .then((res) => setPetitions(res.data))
            .catch(() => setError('Erro ao carregar histórico'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    // Auto-poll every 3s while any petition is processing
    const hasProcessing = petitions.some((p) => p.status === 'processing');
    useEffect(() => {
        if (!hasProcessing) return;
        const interval = setInterval(silentLoad, 3000);
        return () => clearInterval(interval);
    }, [hasProcessing]);

    const handleGenerate = async (id: number) => {
        setGeneratingId(id);
        try {
            await contestationsApi.generate(id);
            setPetitions((prev) =>
                prev.map((p) => p.id === id ? { ...p, status: 'processing' } : p)
            );
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao iniciar geração');
        } finally {
            setGeneratingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir esta petição e todos os seus dados?')) return;
        try {
            await petitionsApi.delete(id);
            setPetitions((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setError('Erro ao excluir petição');
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    return (
        <div className="history-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Histórico</h1>
                    <p className="page-subtitle">Todas as petições enviadas</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={load}>
                        <RefreshCw size={14} /> Atualizar
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/upload')}>
                        <Plus size={14} /> Nova Petição
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {loading ? (
                <div className="loading-center">
                    <div className="spinner" style={{ width: 32, height: 32 }} />
                </div>
            ) : petitions.length === 0 ? (
                <div className="empty-state">
                    <FileText size={48} className="text-muted" />
                    <h3>Nenhuma petição encontrada</h3>
                    <p>Faça o upload da primeira petição.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                        <Plus size={16} /> Nova Petição
                    </button>
                </div>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Petição</th>
                                <th>Status</th>
                                <th>Autor(a)</th>
                                <th>Advogado(a)</th>
                                <th>Score</th>
                                <th>Enviada em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {petitions.map((p) => (
                                <tr key={p.id}>

                                    <td>
                                        <div className="petition-title">{p.title}</div>
                                    </td>
                                    <td>
                                        <StatusBadge status={p.status} />
                                    </td>
                                    <td>
                                        <span
                                            className={!p.author_name ? 'text-muted' : ''}
                                            title={p.author_name}
                                        >
                                            {truncateText(p.author_name)}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={!p.lawyer_name ? 'text-muted' : ''}
                                            title={p.lawyer_name}
                                        >
                                            {truncateText(p.lawyer_name)}
                                        </span>
                                    </td>
                                    <td>
                                        {p.similarity_score !== null && p.similarity_score !== undefined ? (
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                backgroundColor: p.similarity_score >= 75 ? 'rgba(239, 68, 68, 0.15)' : p.similarity_score >= 40 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: p.similarity_score >= 75 ? '#ef4444' : p.similarity_score >= 40 ? '#f59e0b' : '#10b981'
                                            }}>
                                                {p.similarity_score}%
                                            </span>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>
                                    <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                                        {formatDate(p.created_at)}
                                    </td>
                                    <td>
                                        <div className="action-row">
                                            {/* Generate contestation */}
                                            {(p.status === 'pending' || p.status === 'error') && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleGenerate(p.id)}
                                                    disabled={generatingId === p.id}
                                                    title="Gerar Contestação"
                                                >
                                                    {generatingId === p.id
                                                        ? <Loader2 size={13} className="spin-icon" />
                                                        : <Zap size={13} />}
                                                    Gerar
                                                </button>
                                            )}

                                            {/* View contestation */}
                                            {p.contestation_count > 0 && (
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => navigate(`/contestations/${p.id}`)}
                                                    title="Analisar Contestação"
                                                >
                                                    <Eye size={13} /> Analisar
                                                </button>
                                            )}

                                            {/* Delete */}
                                            <button
                                                className="btn btn-danger btn-sm btn-icon"
                                                onClick={() => handleDelete(p.id)}
                                                title="Excluir"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
