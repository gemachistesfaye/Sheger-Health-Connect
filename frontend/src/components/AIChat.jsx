import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const AIChat = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('ai.greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(1)
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 text-white font-medium flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>{t('dashboard.aiAssistant')}</span>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{t('ai.powered')}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🤖</span>
            )}
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-none'
                : 'bg-white border text-foreground rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm flex-shrink-0">🤖</span>
            <div className="bg-white border text-muted-foreground p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ai.placeholder')}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {t('ai.send')}
        </button>
      </form>
    </div>
  );
};

export default AIChat;
