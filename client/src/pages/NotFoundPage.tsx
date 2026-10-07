import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-10 md:p-14 text-center max-w-lg w-full shadow-sm">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-emerald-600" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3 inline-block">
          404 Not Found
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          The page or smartphone view you requested does not exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <span>Browse Brands</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
