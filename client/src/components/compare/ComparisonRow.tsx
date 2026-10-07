import React from 'react';
import { Phone, ComparisonRowItem } from '../../types';
import { NOT_AVAILABLE } from '../../utils/comparison';

interface ComparisonRowProps {
  row: ComparisonRowItem;
  phones: Phone[];
  showDifferencesOnly: boolean;
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  row,
  phones,
  showDifferencesOnly
}) => {
  if (showDifferencesOnly && !row.isDifferent) {
    return null;
  }

  return (
    <tr
      className={`border-b border-slate-100 transition-colors ${
        row.isDifferent ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50/70'
      }`}
    >
      {/* Sticky Spec Label Header */}
      <th
        scope="row"
        className="sticky left-0 z-10 bg-inherit py-3.5 px-4 text-left text-xs font-semibold text-slate-700 min-w-[160px] max-w-[200px] border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
      >
        <div className="flex flex-col gap-1">
          <span>{row.label}</span>
          {row.isDifferent && (
            <span
              className="inline-flex items-center w-fit text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded"
              title="Values differ between compared smartphones"
            >
              Different
            </span>
          )}
        </div>
      </th>

      {/* Values for each phone */}
      {phones.map((phone) => {
        const val = row.values[phone.id] || NOT_AVAILABLE;
        const isMissing = val === NOT_AVAILABLE;

        return (
          <td
            key={phone.id}
            className="py-3.5 px-4 text-xs md:text-sm text-slate-800 align-top min-w-[200px]"
          >
            {isMissing ? (
              <span className="text-slate-400 italic">Not available</span>
            ) : (
              <span className="break-words">{val}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
};
