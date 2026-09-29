// INTEGRA.GOV - Main Application Entry Point
// Plataforma Nacional de Governança, Integridade, Riscos, Auditoria e Transparência

import { useEffect, useState } from 'react';
import { useAppStore } from './store/app.store';
import { isSessionValid } from './services/auth.service';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RisksPage from './pages/RisksPage';
import AuditLogsPage from './pages/AuditLogsPage';
import FindingsPage from './pages/FindingsPage';
import Layout from './components/Layout';
import ControlsPage from './pages/ControlsPage';
import ContractsPage from './pages/ContractsPage';
import BidsPage from './pages/BidsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import RelationshipsPage from './pages/RelationshipsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import PublicPortalPage from './pages/PublicPortalPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  const { initialize, loading } = useAppStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initialize().then(() => {
      setInitialized(true);
      setIsAuthenticated(isSessionValid());
    });
  }, []);

  // Check session periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const valid = isSessionValid();
      if (!valid && isAuthenticated) {
        setIsAuthenticated(false);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-blue-200 mt-4 text-sm">Inicializando INTEGRA.GOV...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPageWithCallback onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'risks': return <RisksPage />;
      case 'controls': return <ControlsPage />;
      case 'contracts': return <ContractsPage />;
      case 'bids': return <BidsPage />;
      case 'complaints': return <ComplaintsPage />;
      case 'findings': return <FindingsPage />;
      case 'relationships': return <RelationshipsPage />;
      case 'ai': return <AIAssistantPage />;
      case 'public': return <PublicPortalPage />;
      case 'audit-logs': return <AuditLogsPage />;
      case 'users': return <UsersPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

// Login wrapper that updates auth state
function LoginPageWithCallback({ onLogin }: { onLogin: () => void }) {
  const { session } = useAppStore();
  
  useEffect(() => {
    if (session) {
      onLogin();
    }
  }, [session]);

  return <LoginPage />;
}
