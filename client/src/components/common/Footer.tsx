import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 pt-12 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Spec<span className="text-emerald-600 dark:text-emerald-400">Lens</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-4">
              SpecLens is an open smartphone discovery and side-by-side specification comparison platform built as a college capstone project.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Data provided by</span>
              <a
                href="https://mobileapi.dev"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-0.5"
              >
                MobileAPI.dev
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Discovery</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/brands" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Browse by Brand
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Compare Smartphones
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/search?q=iPhone" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Popular iPhones
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">About SpecLens</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Data Sources & Limitations
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">React + Vite + TanStack Query</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">Express TypeScript API Proxy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SpecLens Platform. Academic Project.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for smartphone enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};
