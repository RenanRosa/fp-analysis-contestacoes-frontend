import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquareText, X, Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { chatApi } from '../api/endpoints';
import type { ChatMessage } from '../api/endpoints';
import './MiniChat.css';

interface MiniChatProps {
    contestationId: number;
    reportText: string | null;
    /** When true, renders as an inline panel (no FAB, always visible) */
    inline?: boolean;
    // Lifted state
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    initialized: boolean;
    setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MiniChat({
    contestationId,
    reportText,
    inline = false,
    messages,
    setMessages,
    initialized,
    setInitialized
}: MiniChatProps) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with report text as assistant's first message
    useEffect(() => {
        if (!initialized && (inline || open)) {
            const initial: ChatMessage[] = [];
            if (reportText) {
                initial.push({
                    role: 'assistant',
                    content: reportText,
                });
            } else {
                initial.push({
                    role: 'assistant',
                    content: '📄 Olá! Estou pronto para responder suas perguntas sobre a contestação gerada. O que gostaria de saber?',
                });
            }
            setMessages(initial);
            setInitialized(true);
        }
    }, [initialized, reportText, inline, open, setMessages, setInitialized]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: ChatMessage = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatApi.sendContestationMessage(
                contestationId,
                userMsg.content,
                messages
            );
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: response.data.reply },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '_Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente._',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Shared chat panel content
    const chatPanel = (
        <div className={inline ? 'mini-chat-inline' : 'mini-chat-panel'}>
            {/* Header */}
            <div className="mini-chat-header">
                <div className="mini-chat-header-left">
                    <div className="mini-chat-icon">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h4>Assistente de Caso</h4>
                        <span>Resumo dos documentos apresentados</span>
                    </div>
                </div>
                {!inline && (
                    <button className="mini-chat-close" onClick={() => setOpen(false)}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="mini-chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`mini-msg-row ${msg.role}`}>
                        <div className="mini-msg-avatar">
                            {msg.role === 'assistant' ? <Bot size={14} /> : <UserIcon size={14} />}
                        </div>
                        <div className="mini-msg-bubble">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="mini-msg-row assistant">
                        <div className="mini-msg-avatar">
                            <Bot size={14} />
                        </div>
                        <div className="mini-msg-bubble loading">
                            <span className="mini-dot" />
                            <span className="mini-dot" />
                            <span className="mini-dot" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mini-chat-input-area">
                <form onSubmit={handleSend} className="mini-chat-input-box">
                    <input
                        type="text"
                        placeholder="Pergunte sobre a contestação..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="mini-chat-send"
                    >
                        {loading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
                    </button>
                </form>
            </div>
        </div>
    );

    // Inline mode: just render the panel directly
    if (inline) return chatPanel;

    // Floating mode: FAB button + popup panel
    return (
        <>
            <button
                className="mini-chat-fab"
                onClick={() => setOpen(!open)}
                title="Pergunte sobre esta contestação"
            >
                {open ? <X size={22} /> : <MessageSquareText size={22} />}
                {!open && <span className="fab-badge" />}
            </button>
            {open && chatPanel}
        </>
    );
}
