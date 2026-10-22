import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Layers, Menu, X, Smartphone, Scale, Info, Heart, Sun, Moon, Sparkles } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../hooks/useTheme';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { favoritesCount } = useFavorites();
  const { isDark, toggleTheme } = useTheme();

  // Extract comparison count from URL if present
  const params = new URLSearchParams(location.search);
  const compareIds = (params.get('ids') || '')
    .split(',')
    .filter(Boolean);
  const compareCount = compareIds.length;

  const compareUrl = compareCount > 0 ? `/compare?ids=${compareIds.join(',')}` : '/compare';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Spec<span className="text-emerald-600 dark:text-emerald-400">Lens</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
                Smartphone Discovery
              </span>
            </div>
          </Link>

          {/* Compact Search in Navbar (hidden on mobile, visible on desktop/tablet) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar variant="compact" placeholder="Search smartphones..." />
          </div>

          {/* Desktop Navigation Links & Theme Toggle */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5">
            <NavLink
              to="/brands"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Brands</span>
            </NavLink>
            <NavLink to="/finder" className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Sparkles className="w-4 h-4" aria-hidden="true" /><span>Find my phone</span>
            </NavLink>

            <NavLink
              to={compareUrl}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <Scale className="w-4 h-4" aria-hidden="true" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded-full">
                  {compareCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 bg-rose-600 text-white rounded-full">
                  {favoritesCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <Info className="w-4 h-4" aria-hidden="true" />
              <span>About</span>
            </NavLink>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
              )}
            </button>
          </nav>

          {/* Mobile Right Controls: Dark Mode Toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar row */}
        <div className="block md:hidden pb-3 pt-1">
          <SearchBar variant="compact" placeholder="Search smartphones..." />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/brands"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Brands</span>
          </NavLink>
          <NavLink
            to={compareUrl}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Compare</span>
            </div>
            {compareCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                {compareCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Favorites</span>
            </div>
            {favoritesCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 bg-rose-600 text-white rounded-full">
                {favoritesCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>About SpecLens</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
