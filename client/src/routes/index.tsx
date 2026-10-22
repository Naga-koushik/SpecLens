import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';

// Lazy loaded routes for fast initial page load
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage })));
const PhoneDetailPage = lazy(() => import('../pages/PhoneDetailPage').then((m) => ({ default: m.PhoneDetailPage })));
const BrandsPage = lazy(() => import('../pages/BrandsPage').then((m) => ({ default: m.BrandsPage })));
const BrandDetailPage = lazy(() => import('../pages/BrandDetailPage').then((m) => ({ default: m.BrandDetailPage })));
const ComparePage = lazy(() => import('../pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const FinderPage = lazy(() => import('../pages/FinderPage').then((m) => ({ default: m.FinderPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-medium text-slate-400">Loading view...</span>
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchResultsPage />
          </Suspense>
        )
      },
      {
        path: 'phones/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PhoneDetailPage />
          </Suspense>
        )
      },
      {
        path: 'brands',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandsPage />
          </Suspense>
        )
      },
      {
        path: 'brands/:brand',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BrandDetailPage />
          </Suspense>
        )
      },
      {
        path: 'compare',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ComparePage />
          </Suspense>
        )
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FavoritesPage />
          </Suspense>
        )
      },
      {
        path: 'finder',
        element: <Suspense fallback={<PageLoader />}><FinderPage /></Suspense>
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        )
      }
    ]
  }
];

export const router = createBrowserRouter(routes);
