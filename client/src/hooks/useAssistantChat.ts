import { useCallback, useRef, useState } from 'react';
import { AssistantMessage } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export function useAssistantChat(phoneIds: string[], language: string) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const stop = useCallback(() => { controllerRef.current?.abort(); controllerRef.current = null; setStreaming(false); }, []);
  const clear = useCallback(() => { stop(); setMessages([]); setError(null); }, [stop]);
  const send = useCallback(async (content: string) => {
    if (!content.trim() || streaming) return;
    setError(null); setMessages((current) => [...current, { role: 'user', content: content.trim() }, { role: 'assistant', content: '' }]);
    setStreaming(true);
    const controller = new AbortController(); controllerRef.current = controller;
    try {
      const response = await fetch(`${BASE_URL}/assistant/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body: JSON.stringify({ phoneIds, message: content.trim(), language, history: messages.slice(-6).map(({ role, content: text }) => ({ role, content: text })) }), signal: controller.signal });
      if (!response.ok || !response.body) throw new Error('Assistant unavailable');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const events = buffer.split('\n\n'); buffer = events.pop() ?? '';
        events.forEach((event) => {
          const data = event.split('\n').find((line) => line.startsWith('data: '))?.slice(6); if (!data) return;
          const parsed = JSON.parse(data) as { text?: string; sources?: string[]; language?: string; estimate?: boolean };
          if (parsed.text) setMessages((current) => { const next = [...current]; const last = next.at(-1); if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: last.content + parsed.text }; return next; });
          if (parsed.sources) setMessages((current) => { const next = [...current]; const last = next.at(-1); if (last?.role === 'assistant') next[next.length - 1] = { ...last, sources: parsed.sources, language: parsed.language, estimate: parsed.estimate }; return next; });
        });
      }
    } catch (err) { if (!(err instanceof DOMException && err.name === 'AbortError')) setError(err instanceof Error ? err.message : 'Assistant unavailable'); }
    finally { setStreaming(false); controllerRef.current = null; }
  }, [language, messages, phoneIds, streaming]);
  return { messages, streaming, error, send, stop, clear };
}
