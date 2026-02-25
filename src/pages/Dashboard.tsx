import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
    FileText, TrendingUp, Users, Activity, Clock, AlertTriangle, AlertOctagon, UserX, BookOpen
} from 'lucide-react';
import { dashboardApi } from '../api/endpoints';
import type { PCADatapoint } from '../api/endpoints';
import './Dashboard.css';

interface Metrics {
    total_petitions: number;
    pending: number;
    processing: number;
    completed: number;
    error: number;
    total_contestations: number;
    monthly_petitions: { month: string; count: number }[];
    risk_distribution: { risk: string; count: number }[];
    average_similarity: number;
    ratio_petitions_lawyers: number;
    high_risk_percentage: number;
    top_offender_name: string | null;
    top_offender_count: number;
    average_pages: number;
}

interface LawyerStats {
    by_lawyer: { lawyer: string; count: number }[];
    monthly_by_lawyer: Record<string, any>[];
    all_lawyers: string[];
}

// ── Colour palette for lawyers ────────────────────────────────────────────────
const COLORS = [
    '#818cf8', '#34d399', '#f472b6', '#fb923c', '#60a5fa',
    '#a78bfa', '#4ade80', '#facc15', '#e879f9', '#38bdf8',
];

// ── Shared tooltip ────────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
        }}>
            {label && <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>}
            {payload.map((p: any, i: number) => (
                <div key={i} style={{ color: p.color || 'var(--accent-light)', fontWeight: 600 }}>
                    {p.name !== 'count' ? `${p.name}: ` : ''}{p.value} petição(ões)
                </div>
            ))}
        </div>
    );
};

// ── KPI card ──────────────────────────────────────────────────────────────────
const KPICard = ({ label, value, icon: Icon, color, sub, explanation }: {
    label: string; value: number | string; icon: any; color: string; sub?: string; explanation?: string;
}) => (
    <div className="kpi-card" title={explanation} style={{ cursor: explanation ? 'help' : 'default' }}>
        <div className="kpi-icon" style={{ background: color }}>
            <Icon size={20} color="#fff" />
        </div>
        <div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-label">{label}</div>
            {sub && <div className="kpi-sub">{sub}</div>}
        </div>
    </div>
);

// ── Custom pie label ──────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.06) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// ── PCA Tooltip ───────────────────────────────────────────────────────────────
const PCATooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            maxWidth: 300
        }}>
            <div style={{ color: 'var(--accent-light)', fontWeight: 600, marginBottom: 4 }}>
                {data.title}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
                Advogado(a): {data.lawyer_name}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 11 }}>
                X: {data.x} | Y: {data.y}
            </div>
        </div>
    );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [lawyerStats, setLawyerStats] = useState<LawyerStats | null>(null);
    const [pcaData, setPcaData] = useState<PCADatapoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            dashboardApi.metrics(),
            dashboardApi.lawyerStats(),
            dashboardApi.pca()
        ])
            .then(([metricsRes, lawyerRes, pcaRes]) => {
                setMetrics(metricsRes.data);
                setLawyerStats(lawyerRes.data);
                setPcaData(pcaRes.data);
            })
            .catch((e) => {
                console.error(e);
                setError('Erro ao carregar métricas');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="loading-center">
            <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
    );

    if (error) return <div className="alert alert-error">{error}</div>;
    if (!metrics) return null;

    const hoursSaved = (metrics.completed * 1.5).toFixed(0);

    const kpis = [
        { label: 'Total de Petições', value: metrics.total_petitions, icon: FileText, color: 'linear-gradient(135deg,#6366f1,#7c3aed)', sub: 'processadas pela IA', explanation: 'Soma total de petições iniciais recebidas e analisadas pelo sistema.' },
        { label: 'Tempo Econ. (Horas)', value: hoursSaved, icon: Clock, color: 'linear-gradient(135deg,#f59e0b,#ea580c)', sub: 'estimativa (1.5h / defesa)', explanation: 'Horas de trabalho manual poupadas pela geração automatizada.' },
        { label: 'Petições / Advogado', value: metrics.ratio_petitions_lawyers, icon: Activity, color: 'linear-gradient(135deg,#3b82f6,#2563eb)', sub: 'indicador de massa litigiosa', explanation: 'Média de processos por advogado. Valores altos apontam advocacia predatória em massa.' },
        { label: 'Casos de Alto Risco', value: `${metrics.high_risk_percentage || 0}%`, icon: AlertOctagon, color: 'linear-gradient(135deg,#dc2626,#991b1b)', sub: 'percentual do passivo', explanation: 'Porcentagem de casos classificados como perigo iminente de condenação.' },
        { label: 'Ofensor Frequente', value: metrics.top_offender_name ? `${metrics.top_offender_count} casos` : 0, icon: UserX, color: 'linear-gradient(135deg,#eab308,#a16207)', sub: metrics.top_offender_name || 'Nenhum identificado', explanation: 'Nome do advogado ou escritório com o maior número de processos ativos.' },
        { label: 'Volume Médio (Págs)', value: metrics.average_pages || 0, icon: BookOpen, color: 'linear-gradient(135deg,#f472b6,#be185d)', sub: 'esforço de leitura por petição', explanation: 'Média de páginas por petição.' },
    ];

    const getRiskColor = (risk: string) => {
        if (risk === "Alto") return '#ef4444'; // error
        if (risk === "Médio") return '#f59e0b'; // warning
        if (risk === "Baixo") return '#10b981'; // success
        return '#64748b'; // muted/neutral
    };


    const lawyers = lawyerStats?.all_lawyers ?? [];

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Visão geral petições</p>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                {kpis.map((k) => <KPICard key={k.label} {...k} />)}
            </div>

            {/* Row 1: Dashboard Primary Charts */}
            <div className="dashboard-lawyers" style={{ marginBottom: '16px', marginTop: 0 }}>
                {/* Volume Bar chart */}
                <div className="card chart-card">
                    <div className="card-header">
                        <TrendingUp size={18} />
                        <h3>Petições por Mês</h3>
                        <span className="text-muted" style={{ fontSize: 13 }}>últimos 6 meses</span>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={metrics.monthly_petitions} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: '#8b9bb4', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8b9bb4', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                            <Bar dataKey="count" name="Petições" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Distribution Pie Chart */}
                <div className="card chart-card">
                    <div className="card-header">
                        <AlertTriangle size={18} />
                        <h3>Distribuição de Risco</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={metrics.risk_distribution}
                                dataKey="count"
                                nameKey="risk"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={50}
                                labelLine={false}
                                label={<PieLabel />}
                            >
                                {metrics.risk_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any, name: any) => [value, name]}
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-accent)',
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                                labelStyle={{ color: 'var(--text-secondary)' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2: Lawyer charts — only show when data exists */}
            {lawyerStats && lawyerStats.by_lawyer.length > 0 && (
                <div className="dashboard-lawyers">
                    {/* Pie chart */}
                    <div className="card chart-card">
                        <div className="card-header">
                            <Users size={18} />
                            <h3>Distribuição por Advogado do Autor</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={lawyerStats.by_lawyer}
                                    dataKey="count"
                                    nameKey="lawyer"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    labelLine={false}
                                    label={<PieLabel />}
                                >
                                    {lawyerStats.by_lawyer.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: any) => [value, name]}
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-accent)',
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }}
                                    labelStyle={{ color: 'var(--text-secondary)' }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                            {value.length > 28 ? value.slice(0, 28) + '…' : value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Line chart — petitions per lawyer over time */}
                    <div className="card chart-card">
                        <div className="card-header">
                            <TrendingUp size={18} />
                            <h3>Petições por Advogado / Mês</h3>
                            <span className="text-muted" style={{ fontSize: 13 }}>últimos 6 meses</span>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart
                                data={lawyerStats.monthly_by_lawyer}
                                margin={{ top: 8, right: 16, bottom: 0, left: -20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fill: '#8b9bb4', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#8b9bb4', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<DarkTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.2)' }} />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                            {value.length > 22 ? value.slice(0, 22) + '…' : value}
                                        </span>
                                    )}
                                />
                                {lawyers.map((lawyer, i) => (
                                    <Line
                                        key={lawyer}
                                        type="monotone"
                                        dataKey={lawyer}
                                        stroke={COLORS[i % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: COLORS[i % COLORS.length] }}
                                        activeDot={{ r: 6 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Row 3: PCA Clustering */}
            {pcaData && pcaData.length > 0 && (
                <div className="card chart-card" style={{ marginTop: '16px' }}>
                    <div className="card-header">
                        <Activity size={18} />
                        <div>
                            <h3 style={{ margin: 0 }}>Mapa de Similaridade (Análise PCA)</h3>
                            <span className="text-muted" style={{ fontSize: 13, display: 'block', marginTop: 2 }}>
                                Petições próximas entre si possuem vocabulário e estrutura similares.
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis type="number" dataKey="x" name="PCA X" tick={false} axisLine={false} tickLine={false} />
                            <YAxis type="number" dataKey="y" name="PCA Y" tick={false} axisLine={false} tickLine={false} />
                            <ZAxis type="number" range={[50, 50]} />
                            <Tooltip content={<PCATooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Petições" data={pcaData} fill="#818cf8" fillOpacity={0.8} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    );
}

