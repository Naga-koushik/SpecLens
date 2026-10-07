import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
};

export const PhoneCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col h-full animate-pulse">
      <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
      <div className="h-4 w-1/3 bg-slate-200 rounded mb-2" />
      <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />
      <div className="space-y-2 mb-4 flex-1">
        <div className="h-3.5 w-full bg-slate-100 rounded" />
        <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
        <div className="h-3.5 w-4/6 bg-slate-100 rounded" />
      </div>
      <div className="h-10 w-full bg-slate-200 rounded-xl mt-auto" />
    </div>
  );
};

export const SpecSectionSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6 animate-pulse">
      <div className="h-6 w-40 bg-slate-200 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ComparisonTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm animate-pulse overflow-hidden">
      <div className="flex gap-4 mb-6">
        <div className="w-48 h-12 bg-slate-200 rounded-xl" />
        <div className="flex-1 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-36 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
};
