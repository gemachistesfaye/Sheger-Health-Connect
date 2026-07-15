import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

const useAIChat = ({ initialMessages = [], autoScroll = true } = {}) => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'hello_ai', isTranslationKey: true },
    ...initialMessages
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(async (text) => {
    const query = text.trim();
    if (!query || isLoading) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const data = await api.post('/api/ai/chat', {
        message: query,
        language: i18n.language
      });

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data }]);
      } else {
        throw new Error(data.message || 'AI_UNAVAILABLE');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error("AI Error:", err);
      setError(true);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'AI assistant temporarily unavailable. Please try again shortly.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, i18n.language]);

  const clearMessages = useCallback(() => {
    setMessages([{ role: 'assistant', content: 'hello_ai', isTranslationKey: true }]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    clearMessages
  };
};

export default useAIChat;
