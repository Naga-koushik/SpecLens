import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, Square, Trash2, X, Mic, Volume2 } from 'lucide-react';
import { AssistantMessage } from '../../types';
import { assistantStrings } from '../../constants/assistantStrings';
import { useAssistantChat } from '../../hooks/useAssistantChat';

const languages = [['auto', 'Auto-detect'], ['en', 'English'], ['hi', 'हिन्दी'], ['te', 'తెలుగు'], ['ta', 'தமிழ்'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'], ['bn', 'বাংলা'], ['mr', 'मराठी'], ['gu', 'ગુજરાતી'], ['pa', 'ਪੰਜਾਬੀ'], ['or', 'ଓଡ଼ିଆ'], ['ur', 'اردو']];
interface Props { phoneIds: string[]; compare?: boolean; onSummary?: () => void; }
export const AssistantPanel: React.FC<Props> = ({ phoneIds, compare = false, onSummary }) => {
  const [open, setOpen] = useState(false); const [language, setLanguage] = useState('auto'); const [input, setInput] = useState(''); const [connection, setConnection] = useState<'checking' | 'ready' | 'degraded'>('checking'); const panelRef = useRef<HTMLDivElement>(null);
  const { messages, streaming, error, send, stop, clear } = useAssistantChat(phoneIds, language);
  const strings = assistantStrings[language] ?? assistantStrings.en;
  useEffect(() => { if (open) panelRef.current?.focus(); }, [open]);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/health`, { signal: controller.signal })
      .then((response) => response.json() as Promise<{ status?: string }>)
      .then((health) => setConnection(health.status === 'ok' ? 'ready' : 'degraded'))
      .catch(() => setConnection('degraded'));
    return () => controller.abort();
  }, []);
  useEffect(() => { clear(); }, [phoneIds.join(','), clear]);
  const submit = () => { if (!input.trim()) return; void send(input); setInput(''); };
  const starters = ['Can this phone last 2 days on battery?', 'Is it good for gaming?', 'Explain the display in simple words'];
  const speak = (message: AssistantMessage) => { if ('speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(message.content)); };
  return <>
    {!open && <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-emerald-600 px-5 font-bold text-white shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-300"><Bot className="h-5 w-5" />{strings.ask}</button>}
    {open && <div ref={panelRef} tabIndex={-1} role="dialog" aria-label="SpecLens Assistant" className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none dark:border-slate-700 dark:bg-slate-900 md:inset-y-4 md:left-auto md:right-4 md:w-[420px]">
      <header className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700"><div><h2 className="font-bold dark:text-white">SpecLens Assistant</h2><p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${connection === 'ready' ? 'bg-emerald-500' : connection === 'degraded' ? 'bg-red-500' : 'bg-amber-400'}`} />{connection === 'ready' ? 'Connected' : connection === 'degraded' ? 'Unavailable' : 'Checking connection'} · {strings.estimate}</p></div><button type="button" onClick={() => { stop(); setOpen(false); }} aria-label="Close assistant" className="rounded-lg p-2 focus-visible:ring-2 focus-visible:ring-emerald-500"><X /></button></header>
      <div className="space-y-3 border-b border-slate-200 p-3 dark:border-slate-700"><select aria-label="Assistant language" value={language} onChange={(event) => setLanguage(event.target.value)} className="min-h-[44px] w-full rounded-xl border bg-white p-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white">{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>{compare && onSummary && <button type="button" onClick={onSummary} className="min-h-[44px] w-full rounded-xl bg-emerald-600 px-3 font-semibold text-white">Which should I choose?</button>}<div className="flex flex-wrap gap-2">{starters.map((starter) => <button key={starter} type="button" onClick={() => void send(starter)} className="rounded-full border px-2 py-1 text-xs dark:border-slate-600 dark:text-slate-100">{starter}</button>)}</div></div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} lang={language === 'auto' ? 'en' : language} className={`rounded-2xl p-3 text-sm ${message.role === 'user' ? 'ml-8 bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100' : 'mr-4 bg-slate-100 dark:bg-slate-800 dark:text-slate-100'}`}><p className="whitespace-pre-wrap break-words">{message.content || '…'}</p>{message.sources && <div className="mt-2 flex flex-wrap gap-1">{message.sources.map((source) => <span key={source} className="rounded-full bg-white px-2 py-1 text-[10px] dark:bg-slate-700">Specs used: {source}</span>)}</div>}{message.role === 'assistant' && message.content && <button type="button" onClick={() => speak(message)} aria-label="Read answer aloud" className="mt-2 text-slate-500"><Volume2 className="h-4 w-4" /></button>}</div>)}{error && <p className="text-sm text-red-600">{error}</p>}</div>
      <footer className="border-t border-slate-200 p-3 dark:border-slate-700"><p className="mb-2 text-[11px] text-slate-500 dark:text-slate-300">{strings.privacy}</p><div className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); if (event.key === 'Escape') setOpen(false); }} placeholder={strings.placeholder} aria-label="Ask a question" className="min-h-[44px] min-w-0 flex-1 rounded-xl border bg-white px-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /><button type="button" onClick={streaming ? stop : submit} aria-label={streaming ? strings.stop : 'Send'} className="min-h-[44px] rounded-xl bg-emerald-600 px-3 text-white">{streaming ? <Square /> : <Send />}</button><button type="button" onClick={clear} aria-label={strings.clear} className="min-h-[44px] rounded-xl border px-3 dark:border-slate-600 dark:text-white"><Trash2 /></button></div></footer>
    </div>}
  </>;
};
