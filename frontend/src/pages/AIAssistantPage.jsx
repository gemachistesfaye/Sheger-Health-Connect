import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  AlertCircle,
  RefreshCcw,
  Stethoscope,
  Activity,
  Zap,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AIAssistantPage = () => {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'hello_ai', isTranslationKey: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e, text = input) => {
    if (e) e.preventDefault();
    const query = text.trim();
    if (!query || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: query, language: i18n.language })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data }]);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am currently having trouble connecting to my knowledge base. Please try again or book a consultation with a human specialist.',
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI Health Command</h1>
            <p className="text-gray-500 mt-1 font-medium">Advanced symptom analysis and clinical insights.</p>
         </div>
         <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medical Grade AI v2.0</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
           <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-gray-50/30">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-6 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-110
                      ${msg.role === 'user' ? 'bg-primary text-white shadow-primary/20' : 'bg-white text-primary border border-gray-100 shadow-gray-900/5'}
                    `}>
                      {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                    </div>
                    <div className={`p-6 rounded-[32px] text-sm leading-relaxed shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}
                      ${msg.isError ? 'bg-red-50 border-red-100 text-red-600' : ''}
                    `}>
                      {msg.isTranslationKey ? t(msg.content) : msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-6 rounded-[32px] border border-gray-100 rounded-tl-none shadow-sm flex gap-2">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Input */}
           <form onSubmit={handleSend} className="p-8 border-t border-gray-50 bg-white">
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[24px] border border-gray-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms (e.g. 'I have a dry cough and fatigue for 3 days')..."
                  className="flex-1 bg-transparent border-none outline-none px-6 text-sm font-medium h-12"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50 hover:scale-105 transition-transform flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </div>
           </form>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
           <div className="bg-emerald-600 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Sparkles size={120} />
              </div>
              <h4 className="text-xl font-black mb-6">Quick Insights</h4>
              <div className="space-y-4">
                 {[
                   { icon: Stethoscope, title: "Symptom Checker", desc: "Scan 1000+ medical conditions." },
                   { icon: Activity, title: "Triage Guide", desc: "Urgent or routine? Find out." },
                   { icon: RefreshCcw, title: "Amharic Support", desc: "Full Ethiopian language AI." }
                 ].map((i, idx) => (
                   <div key={idx} className="flex gap-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                      <i.icon size={20} className="text-emerald-300" />
                      <div>
                        <p className="font-bold text-sm">{i.title}</p>
                        <p className="text-[10px] opacity-70 leading-relaxed">{i.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                <Info size={20} className="text-blue-500" />
                Medical Disclaimer
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">
                Sheger AI is an information tool and does not provide a definitive diagnosis. If you are experiencing a life-threatening emergency, please call <strong>8282</strong> immediately.
              </p>
              <button className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                Emergency Guide <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
