import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Dashboards
import { BrandDashboard } from './pages/dashboards/BrandDashboard';
import { HospitalDashboard } from './pages/dashboards/HospitalDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { ProfilePage } from './pages/dashboards/ProfilePage';

import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Landing Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Brand Dashboards */}
            <Route 
              path="/brand" 
              element={
                <ProtectedRoute allowedRoles={['brand']}>
                  <BrandDashboard initialTab="overview" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/brand/campaigns" 
              element={
                <ProtectedRoute allowedRoles={['brand']}>
                  <BrandDashboard initialTab="create" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/brand/support" 
              element={
                <ProtectedRoute allowedRoles={['brand']}>
                  <BrandDashboard initialTab="support" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/brand/profile" 
              element={
                <ProtectedRoute allowedRoles={['brand']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Hospital Dashboards */}
            <Route 
              path="/hospital" 
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalDashboard initialTab="overview" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital/screens" 
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalDashboard initialTab="screens" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital/support" 
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalDashboard initialTab="support" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital/profile" 
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Dashboards */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard initialTab="overview" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/campaigns" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard initialTab="campaigns" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/hospitals" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard initialTab="overview" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/support" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard initialTab="support" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/profile" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
