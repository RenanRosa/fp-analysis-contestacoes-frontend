import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { chatApi } from '../api/endpoints';
import type { ChatMessage } from '../api/endpoints';
import './Chat.css';

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([

    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            // we pass the current history minus the system intro if we want, but passing everything is fine.
            const response = await chatApi.sendMessage(userMsg.content, messages);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: response.data.reply }
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '_Desculpe, ocorreu um erro ao consultar o servidor ou o LLM. Tente novamente._' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // The message is now rendered natively through ReactMarkdown in the render method

    return (
        <div className="chat-page">
            <div className="chat-header">
                <div className="chat-title-group">
                    <div className="bot-icon-wrapper">
                        <Sparkles size={20} className="sparkle-icon" />
                    </div>
                    <div>
                        <h2>FP Legal AI</h2>
                        <span className="chat-subtitle">Assistente Jurídico</span>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-row ${msg.role}`}>
                        <div className="message-avatar">
                            {msg.role === 'assistant' ? <Bot size={18} /> : <UserIcon size={18} />}
                        </div>
                        <div className="message-bubble">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-row assistant">
                        <div className="message-avatar">
                            <Bot size={18} />
                        </div>
                        <div className="message-bubble loading">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <form onSubmit={handleSend} className="chat-input-box">
                    <input
                        type="text"
                        placeholder="Pergunte ao assistente especializado na sua base de dados"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={!input.trim() || loading} className="send-btn">
                        {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
