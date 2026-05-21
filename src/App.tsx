/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppShell } from './components/layout/AppShell';
import { useStore } from './store/useStore';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageLoader } from './components/ui/PageLoader';

// Eager load critical initial pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Lazy load protected pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Markets = lazy(() => import('./pages/Markets'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Goals = lazy(() => import('./pages/Goals'));
const Advisor = lazy(() => import('./pages/Advisor'));
const Learn = lazy(() => import('./pages/Learn'));
const Alerts = lazy(() => import('./pages/Alerts'));
const StockDetails = lazy(() => import('./pages/StockDetails'));
const Settings = lazy(() => import('./pages/Settings'));

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="h-screen w-full flex">
                <PageLoader />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/stock/:symbol" element={<StockDetails />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/advisor" element={<Advisor />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="top-right" theme="system" richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
