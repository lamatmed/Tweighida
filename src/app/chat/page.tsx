'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBox() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = async () => {
        if (!prompt.trim() || loading) return;

        const userMessage = prompt.trim();
        setPrompt('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: userMessage }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) {
                setMessages(prev => [...prev, { role: 'ai', content: data.error || 'Ocorreu um erro inesperado.' }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
            }
        } catch (err) {
            console.error('Erro:', err);
            setMessages(prev => [...prev, { role: 'ai', content: "Erro de conexão com o servidor." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-gray-100 overflow-hidden mt-6 mb-10">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                        <Bot size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Assistente IA Tweighida</h1>
                        <p className="text-indigo-100 text-xs font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Online e pronto para ajudar
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex bg-white/10 px-4 py-2 rounded-xl text-white text-xs font-semibold backdrop-blur-sm items-center gap-2">
                    <Sparkles size={14} className="text-yellow-300" />
                    Inteligência Enterprise
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#fcfdfe]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                        <div className="p-5 bg-indigo-50 text-indigo-500 rounded-full animate-bounce">
                            <MessageCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Como posso ajudar?</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Tire dúvidas sobre gestão de stock, analise de vendas ou peça sugestões para o seu negócio.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-100 text-indigo-600'
                                }`}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                {loading && (
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm">
                            <Bot size={20} />
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
                <div className="relative flex items-center">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escreva a sua mensagem aqui..."
                        className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none transition-all outline-none"
                        rows={2}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !prompt.trim()}
                        className={`absolute right-3 p-3 rounded-xl shadow-lg transition-all ${
                            loading || !prompt.trim() 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5'
                        }`}
                        aria-label="Enviar mensagem"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
                <p className="mt-3 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                    Tweighida AI • Tecnologia angolana para o futuro
                </p>
            </div>
        </div>
    );
}