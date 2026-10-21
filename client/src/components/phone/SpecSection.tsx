import React from 'react';
import { GlossaryTerm } from '../common/GlossaryTerm';

export interface SpecItem {
  label: string;
  value: string | null | undefined;
}

interface SpecSectionProps {
  title: string;
  icon?: React.ReactNode;
  items: SpecItem[];
}

export const SpecSection: React.FC<SpecSectionProps> = ({ title, icon, items }) => {
  // If no items at all, do not render empty box
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm mb-6 transition-colors">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        {icon && <div className="text-emerald-600 dark:text-emerald-400 w-5 h-5">{icon}</div>}
        <h2 id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
        {items.map((item, idx) => {
          const isMissing = !item.value || item.value.trim() === '' || item.value === 'Not available';
          return (
            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
              <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-0 sm:w-1/3">
                <GlossaryTerm term={item.label} />
              </dt>
              <dd className="text-sm font-medium sm:w-2/3 sm:text-right">
                {isMissing ? (
                  <span className="text-slate-400 dark:text-slate-500 italic">Not available</span>
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 break-words">{item.value}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
};
