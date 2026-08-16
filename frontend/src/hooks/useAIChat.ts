import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { AiChatMessage } from '../types';

interface UseAIChatOptions {
  initialMessages?: AiChatMessage[];
  autoScroll?: boolean;
}

interface UseAIChatReturn {
  messages: AiChatMessage[];
  isLoading: boolean;
  error: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const useAIChat = ({ initialMessages = [], autoScroll = true }: UseAIChatOptions = {}): UseAIChatReturn => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    { role: 'assistant', content: 'hello_ai', isTranslationKey: true },
    ...initialMessages,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      const query = text.trim();
      if (!query || isLoading) return;

      const userMessage: AiChatMessage = { role: 'user', content: query };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(false);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const data = await api.post('/api/ai/chat', {
          message: query,
          language: i18n.language,
        });

        if (data.success) {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.data as string }]);
        } else {
          throw new Error(data.message || 'AI_UNAVAILABLE');
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'AI assistant temporarily unavailable. Please try again shortly.',
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, i18n.language]
  );

  const clearMessages = useCallback(() => {
    setMessages([{ role: 'assistant', content: 'hello_ai', isTranslationKey: true }]);
    setError(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    clearMessages,
  };
};

export default useAIChat;
