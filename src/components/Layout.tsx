// INTEGRA.GOV - Main Layout
import { useState } from 'react';
import { useAppStore } from '../store/app.store';
import { hasPermission } from '../services/auth.service';
import type { PermissionName } from '../domain/types';
import {
  Shield, LayoutDashboard, AlertTriangle, ShieldCheck, FileText,
  Building2, Users, Search, FileSearch, AlertOctagon, MessageSquare,
  ClipboardList, Network, Brain, Globe, LogOut, Menu, X,
  ChevronDown, Bell, Lock, Activity
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  permission?: PermissionName;
  children?: { id: string; label: string; permission?: PermissionName }[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, permission: 'dashboard:read' },
  { id: 'risks', label: 'Riscos', icon: <AlertTriangle className="w-4 h-4" />, permission: 'risk:read',
    children: [
      { id: 'risks', label: 'Matriz de Riscos', permission: 'risk:read' },
      { id: 'controls', label: 'Controles', permission: 'control:read' },
    ]
  },
  { id: 'contracts', label: 'Contratações', icon: <FileText className="w-4 h-4" />, permission: 'contract:read',
    children: [
      { id: 'contracts', label: 'Contratos', permission: 'contract:read' },
      { id: 'bids', label: 'Licitações', permission: 'bid:read' },
      { id: 'vendors', label: 'Fornecedores', permission: 'vendor:read' },
      { id: 'companies', label: 'Empresas', permission: 'company:read' },
    ]
  },
  { id: 'audit', label: 'Auditoria', icon: <FileSearch className="w-4 h-4" />, permission: 'audit:read' },
  { id: 'integrity', label: 'Integridade', icon: <ShieldCheck className="w-4 h-4" />,
    children: [
      { id: 'complaints', label: 'Denúncias', permission: 'complaint:read' },
      { id: 'incidents', label: 'Incidentes', permission: 'incident:read' },
    ]
  },
  { id: 'findings', label: 'Achados & Alertas', icon: <AlertOctagon className="w-4 h-4" />, permission: 'finding:read' },
  { id: 'relationships', label: 'Relacionamentos', icon: <Network className="w-4 h-4" />, permission: 'relationship:read' },
  { id: 'action-plans', label: 'Planos de Ação', icon: <ClipboardList className="w-4 h-4" />, permission: 'action_plan:read' },
  { id: 'ai', label: 'Inteligência (IA)', icon: <Brain className="w-4 h-4" />, permission: 'ai:read' },
  { id: 'public', label: 'Portal Público', icon: <Globe className="w-4 h-4" />, permission: 'public:view' },
  { id: 'security', label: 'Segurança', icon: <Lock className="w-4 h-4" />, permission: 'security:read',
    children: [
      { id: 'audit-logs', label: 'Logs de Auditoria', permission: 'audit_log:read' },
      { id: 'users', label: 'Usuários', permission: 'user:read' },
    ]
  },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, currentRole, organizations, logout, sidebarOpen, setSidebarOpen } = useAppStore();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const org = organizations.find(o => o.id === currentUser?.organizationId);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleLogout = () => {
    logout();
  };

  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">INTEGRA.GOV</h1>
                <p className="text-[10px] text-slate-400">Governança & Integridade</p>
              </div>
            </div>
          </div>

          {/* Organization badge */}
          {org && (
            <div className="px-4 py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300 truncate">{org.name}</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded ${
                org.sphere === 'MUNICIPAL' ? 'bg-green-900/50 text-green-300' :
                org.sphere === 'ESTADUAL' ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-red-900/50 text-red-300'
              }`}>{org.sphere}</span>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-2">
            <ul className="space-y-0.5">
              {visibleNavItems.map(item => (
                <li key={item.id}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition ${
                          expandedMenus.includes(item.id) ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {item.icon}
                          {item.label}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedMenus.includes(item.id) && (
                        <ul className="mt-1 ml-4 space-y-0.5 border-l border-slate-700 pl-3">
                          {item.children.filter(child => !child.permission || hasPermission(child.permission)).map(child => (
                            <li key={child.id}>
                              <button
                                onClick={() => onNavigate(child.id)}
                                className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition ${
                                  currentPage === child.id ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition ${
                        currentPage === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-slate-700/50">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-medium text-white truncate">{currentUser?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentRole?.description}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              
              {showUserMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  <button
                    onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => { onNavigate('audit-logs'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Logs de Auditoria
                  </button>
                  <hr className="border-slate-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:bg-red-900/30 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair do Sistema
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm font-semibold text-slate-800">
              {NAV_ITEMS.find(i => i.id === currentPage)?.label || 
               NAV_ITEMS.flatMap(i => i.children || []).find(c => c.id === currentPage)?.label || 
               'INTEGRA.GOV'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition" title="Notificações">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
              title="Buscar"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
