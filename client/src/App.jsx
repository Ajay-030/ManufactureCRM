import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Performance from './pages/Performance';
import Notifications from './pages/Notifications';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { Loader2 } from 'lucide-react';

// Guard for protected routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Securing BDA workspace session...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Layout for inside the workspace
const WorkspaceLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Responsive Sidebar component */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Content view with scrollbar support */}
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<Home />} />

          {/* Protected CRM Workspaces */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <WorkspaceLayout>
                  <Dashboard />
                </WorkspaceLayout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/leads" 
            element={
              <PrivateRoute>
                <WorkspaceLayout>
                  <Leads />
                </WorkspaceLayout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <PrivateRoute>
                <WorkspaceLayout>
                  <Clients />
                </WorkspaceLayout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/performance" 
            element={
              <PrivateRoute>
                <WorkspaceLayout>
                  <Performance />
                </WorkspaceLayout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <PrivateRoute>
                <WorkspaceLayout>
                  <Notifications />
                </WorkspaceLayout>
              </PrivateRoute>
            } 
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
