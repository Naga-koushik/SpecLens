import React from 'react';
import { Info, ShieldCheck, Database, Layers, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 md:p-10 shadow-sm text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Info className="w-7 h-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          About SpecLens
        </h1>
        <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
          A dedicated smartphone discovery and comparison platform engineered as a college capstone project.
        </p>
      </div>

      {/* Grid of Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Source */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Data Provider</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Smartphone specification data is powered by{' '}
            <a
              href="https://mobileapi.dev"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 font-semibold underline inline-flex items-center gap-0.5"
            >
              MobileAPI.dev
              <ExternalLink className="w-3 h-3" />
            </a>
            , a comprehensive REST API covering tens of thousands of mobile devices.
          </p>
        </div>

        {/* Security & API Key Privacy */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Secure Architecture</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            All upstream communication is handled strictly through our dedicated Node.js Express proxy. Upstream API tokens and keys never reach the client browser or bundle.
          </p>
        </div>

        {/* Quota & Caching */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Smart In-Memory Caching</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Because external free tier quotas are strictly constrained, the server implements an in-memory LRU cache with stale-on-error fallback to ensure fast response times and conserve quota.
          </p>
        </div>

        {/* Known Limitations */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
            <Info className="w-5 h-5 text-emerald-600" />
            <span>Data Limitations</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            External manufacturer data can have varying degrees of missing fields or unverified specs. Missing attributes are explicitly marked as <span className="font-semibold text-slate-800">Not available</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
