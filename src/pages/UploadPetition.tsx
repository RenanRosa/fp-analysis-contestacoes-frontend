import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { petitionsApi } from '../api/endpoints';
import './UploadPetition.css';

interface FileItem {
    file: File;
    description: string;
}

export default function UploadPetition() {
    const [title, setTitle] = useState('');
    const [petitionFile, setPetitionFile] = useState<File | null>(null);
    const [subsidies, setSubsidies] = useState<FileItem[]>([]);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const mainInputRef = useRef<HTMLInputElement>(null);
    const subInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const setMainFile = (file: File) => {
        setPetitionFile(file);
        // Auto-fill title from filename (without extension)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
    };

    const handleMainDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file?.type === 'application/pdf') setMainFile(file);
        else setError('Somente arquivos PDF são aceitos para a petição.');
    }, []);

    const handleSubsidyAdd = (files: FileList | null) => {
        if (!files) return;
        const newItems: FileItem[] = Array.from(files).map((f) => ({ file: f, description: '' }));
        setSubsidies((prev) => [...prev, ...newItems]);
    };

    const removeSubsidy = (idx: number) => {
        setSubsidies((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateDesc = (idx: number, desc: string) => {
        setSubsidies((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, description: desc } : item))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!petitionFile) { setError('Selecione a petição inicial em PDF.'); return; }
        if (!title.trim()) { setError('Informe um título para a petição.'); return; }

        setLoading(true);
        setError('');
        const fd = new FormData();
        fd.append('title', title);
        fd.append('petition_pdf', petitionFile);
        subsidies.forEach((s) => fd.append('subsidies', s.file));
        fd.append('subsidy_descriptions', subsidies.map((s) => s.description).join(','));

        try {
            await petitionsApi.upload(fd);
            setSuccess(true);
            setTimeout(() => navigate('/history'), 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao enviar petição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="page-header">
                <h1 className="page-title">Nova Petição</h1>
                <p className="page-subtitle">Faça o upload da petição inicial e subsídios para geração da contestação</p>
            </div>

            {success && (
                <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} /> Petição enviada com sucesso! Redirecionando...
                </div>
            )}
            {error && (
                <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="upload-form">
                {/* Main PDF drop zone */}
                <div className="card">
                    <div className="form-label" style={{ marginBottom: 12 }}>Petição Inicial (PDF) *</div>
                    {petitionFile ? (
                        <div className="file-selected">
                            <FileText size={20} className="text-accent" />
                            <span className="file-name">{petitionFile.name}</span>
                            <span className="file-size">({(petitionFile.size / 1024).toFixed(0)} KB)</span>
                            <button
                                type="button"
                                className="btn btn-icon btn-danger btn-sm"
                                onClick={() => setPetitionFile(null)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className={`drop-zone ${dragging ? 'drop-zone-active' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleMainDrop}
                            onClick={() => mainInputRef.current?.click()}
                        >
                            <Upload size={32} className="text-accent" />
                            <div className="drop-title">Arraste o PDF aqui ou clique para selecionar</div>
                            <div className="drop-sub">Apenas arquivos PDF</div>
                            <input
                                ref={mainInputRef}
                                type="file"
                                accept=".pdf"
                                hidden
                                onChange={(e) => e.target.files?.[0] && setMainFile(e.target.files[0])}
                            />
                        </div>
                    )}
                </div>

                {/* Subsidies */}
                <div className="card">
                    <div className="form-label" style={{ marginBottom: 12 }}>
                        Subsídios / Documentos de Apoio <span className="text-muted">(opcional)</span>
                    </div>
                    {subsidies.map((item, idx) => (
                        <div key={idx} className="subsidy-item">
                            <FileText size={16} className="text-secondary" />
                            <span className="file-name" style={{ flex: 1 }}>{item.file.name}</span>
                            <input
                                type="text"
                                className="form-input subsidy-desc"
                                value={item.description}
                                onChange={(e) => updateDesc(idx, e.target.value)}
                                placeholder="Descrição (opcional)"
                            />
                            <button
                                type="button"
                                className="btn btn-icon btn-danger btn-sm"
                                onClick={() => removeSubsidy(idx)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 12 }}
                        onClick={() => subInputRef.current?.click()}
                    >
                        <Plus size={14} /> Adicionar Subsídio
                    </button>
                    <input
                        ref={subInputRef}
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        multiple
                        hidden
                        onChange={(e) => handleSubsidyAdd(e.target.files)}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/history')}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading || success}>
                        {loading ? <Loader2 size={16} className="spin-icon" /> : <Upload size={16} />}
                        {loading ? 'Enviando...' : 'Enviar Petição'}
                    </button>
                </div>
            </form>
        </div>
    );
}
