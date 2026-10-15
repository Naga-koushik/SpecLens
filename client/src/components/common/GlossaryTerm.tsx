import React, { useState, useRef, useEffect, useId } from 'react';
import { HelpCircle } from 'lucide-react';
import { findGlossaryTerm, GlossaryEntry } from '../../constants/glossary';

interface GlossaryTermProps {
  term: string;
  entry?: GlossaryEntry | null;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({
  term,
  entry: explicitEntry,
  children,
  showIcon = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const entry = explicitEntry !== undefined ? explicitEntry : findGlossaryTerm(term);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // If term has no glossary definition, render plain children or term
  if (!entry) {
    return <>{children || term}</>;
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center gap-1 group align-baseline"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        className="inline-flex items-center gap-1 text-inherit font-inherit text-left underline decoration-dotted decoration-emerald-500/70 underline-offset-2 hover:decoration-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-0.5 -mx-0.5 transition-colors cursor-help"
      >
        <span>{children || term}</span>
        {showIcon && (
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600/80 shrink-0" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl ring-1 ring-white/10 pointer-events-auto leading-relaxed animate-in fade-in zoom-in-95 duration-150"
        >
          <span className="block font-bold text-emerald-400 mb-1 flex items-center justify-between">
            <span>{entry.term}</span>
            <span className="text-[10px] text-slate-400 font-normal">Glossary</span>
          </span>
          <span className="block text-slate-200">{entry.definition}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
};
