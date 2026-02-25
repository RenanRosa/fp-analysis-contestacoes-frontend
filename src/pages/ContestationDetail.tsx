import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, FileBarChart, Columns2, FileText } from 'lucide-react';
import { petitionsApi, contestationsApi } from '../api/endpoints';
import type { ChatMessage } from '../api/endpoints';
import MiniChat from '../components/MiniChat';
import './ContestationDetail.css';

interface Contestation {
    id: number;
    petition_id: number;
    content_text: string | null;
    report_text: string | null;
    docx_path: string | null;
    report_docx_path: string | null;
    model_used: string | null;
    created_at: string;
}

interface PetitionDetail {
    id: number;
    title: string;
    status: string;
    contestations: Contestation[];
}

export default function ContestationDetail() {
    const { id } = useParams<{ id: string }>();
    const [petition, setPetition] = useState<PetitionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [splitView, setSplitView] = useState(true);

    // Lifted Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInitialized, setChatInitialized] = useState(false);

    const navigate = useNavigate();

    const load = () => {
        setLoading(true);
        petitionsApi.get(Number(id))
            .then((res) => setPetition(res.data))
            .catch(() => setError('Petição não encontrada'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [id]);

    const handleDownload = async (contestationId: number) => {
        setDownloading(true);
        try {
            await contestationsApi.download(contestationId);
        } catch {
            setError('Erro ao baixar o arquivo DOCX');
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadReport = async (contestationId: number) => {
        setDownloadingReport(true);
        try {
            await contestationsApi.downloadReport(contestationId);
        } catch {
            setError('Relatório ainda não disponível');
        } finally {
            setDownloadingReport(false);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

    // Basic Markdown parser for both Contestation and Report texts
    const renderMarkdown = (text: string | null) => {
        if (!text) return <p className="text-muted">Conteúdo não disponível.</p>;

        return text.split('\n').map((line, i) => {
            // Keep empty lines as spacers
            if (line.trim() === '') return <br key={i} />;

            // Remove # headers hash
            let processedLine = line.replace(/^#{1,5}\s+/, '');

            // Convert **bold** or *bold* to <strong>
            const parts = processedLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);
            return (
                <p key={i}>
                    {parts.map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('*') && part.endsWith('*')) {
                            return <strong key={index}>{part.slice(1, -1)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    if (loading) return (
        <div className="loading-center">
            <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
    );

    if (error) return (
        <div style={{ padding: 32 }}>
            <div className="alert alert-error">{error}</div>
            <button className="btn btn-secondary" onClick={() => navigate('/history')}>Voltar</button>
        </div>
    );

    const latest = petition?.contestations?.[0];

    return (
        <div className="detail-page">
            <div className="detail-header">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/history')}>
                    <ArrowLeft size={15} /> Voltar
                </button>
                <div style={{ flex: 1 }}>
                    <h1 className="page-title">{petition?.title}</h1>
                    <p className="page-subtitle">
                        {petition?.contestations.length} contestação(ões) gerada(s)
                    </p>
                </div>
                {latest && (
                    <div className="layout-toggle">
                        <button
                            className={`layout-toggle-btn ${splitView ? 'active' : ''}`}
                            onClick={() => setSplitView(true)}
                            title="Lado a lado"
                        >
                            <Columns2 size={16} />
                        </button>
                        <button
                            className={`layout-toggle-btn ${!splitView ? 'active' : ''}`}
                            onClick={() => setSplitView(false)}
                            title="Apenas contestação"
                        >
                            <FileText size={16} />
                        </button>
                    </div>
                )}
            </div>

            {!latest ? (
                <div className="empty-state">
                    <FileText size={48} className="text-muted" />
                    <h3>Ainda não há contestações</h3>
                    <p>Clique em "Gerar Nova" para criar a primeira contestação com IA.</p>
                </div>
            ) : (
                <>
                    {/* Sidebar: only when multiple versions */}
                    {petition!.contestations.length > 1 && (
                        <div className="contestation-list card" style={{ marginBottom: 16 }}>
                            <h4 className="list-title">Versões</h4>
                            {petition!.contestations.map((c, i) => (
                                <div key={c.id} className="contestation-item">
                                    <div className="ci-number">v{petition!.contestations.length - i}</div>
                                    <div>
                                        <div className="ci-date">{formatDate(c.created_at)}</div>
                                        <div className="ci-model">{c.model_used}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {splitView ? (
                        /* Side-by-side: Contestation + Chat */
                        <div className="detail-split">
                            <div className="card content-card">
                                <div className="content-header">
                                    <div>
                                        <div className="content-date">{formatDate(latest!.created_at)}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleDownload(latest!.id)}
                                            disabled={downloading}
                                        >
                                            {downloading
                                                ? <Loader2 size={14} className="spin-icon" />
                                                : <Download size={14} />}
                                            {downloading ? 'Baixando...' : 'Download Contestação'}
                                        </button>
                                        {latest!.report_docx_path && (
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleDownloadReport(latest!.id)}
                                                disabled={downloadingReport}
                                                style={{ borderColor: 'var(--accent-light)', color: 'var(--accent-light)' }}
                                            >
                                                {downloadingReport
                                                    ? <Loader2 size={14} className="spin-icon" />
                                                    : <FileBarChart size={14} />}
                                                {downloadingReport ? 'Baixando...' : 'Download Relatório'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="contestation-text">
                                    {renderMarkdown(latest!.content_text)}
                                </div>
                            </div>
                            <MiniChat
                                contestationId={latest.id}
                                reportText={latest.report_text}
                                inline
                                messages={chatMessages}
                                setMessages={setChatMessages}
                                initialized={chatInitialized}
                                setInitialized={setChatInitialized}
                            />
                        </div>
                    ) : (
                        /* Full-width contestation + floating chat */
                        <>
                            <div className="card content-card">
                                <div className="content-header">
                                    <div>
                                        <div className="content-date">{formatDate(latest!.created_at)}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleDownload(latest!.id)}
                                            disabled={downloading}
                                        >
                                            {downloading
                                                ? <Loader2 size={14} className="spin-icon" />
                                                : <Download size={14} />}
                                            {downloading ? 'Baixando...' : 'Download Contestação'}
                                        </button>
                                        {latest!.report_docx_path && (
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleDownloadReport(latest!.id)}
                                                disabled={downloadingReport}
                                                style={{ borderColor: 'var(--accent-light)', color: 'var(--accent-light)' }}
                                            >
                                                {downloadingReport
                                                    ? <Loader2 size={14} className="spin-icon" />
                                                    : <FileBarChart size={14} />}
                                                {downloadingReport ? 'Baixando...' : 'Download Relatório'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="contestation-text">
                                    {renderMarkdown(latest!.content_text)}
                                </div>
                            </div>
                            <MiniChat
                                contestationId={latest.id}
                                reportText={latest.report_text}
                                messages={chatMessages}
                                setMessages={setChatMessages}
                                initialized={chatInitialized}
                                setInitialized={setChatInitialized}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

