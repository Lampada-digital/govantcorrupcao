// INTEGRA.GOV - Login Page
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/app.store';
import { Shield, Lock, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'INTEGRA.GOV — Login';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Erro ao realizar login.');
      }
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">INTEGRA.GOV</h1>
          <p className="text-blue-200 mt-2 text-sm">
            Plataforma Nacional de Governança, Integridade, Riscos, Auditoria e Transparência
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-900/50 border border-blue-700/50 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-blue-200">Sistema Operacional</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Acesso ao Sistema</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1.5">
                E-mail institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="seu.email@orgao.gov"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition shadow-lg shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Autenticando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-blue-300/70 text-center mb-3">Credenciais de demonstração (dados fictícios)</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => { setEmail('admin@integra.gov'); setPassword('Integra@2024'); }}
                className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition"
              >
                <span className="text-blue-200">Super Admin</span>
                <span className="text-blue-400 font-mono">admin@integra.gov</span>
              </button>
              <button
                onClick={() => { setEmail('auditor@integra.gov'); setPassword('Integra@2024'); }}
                className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition"
              >
                <span className="text-blue-200">Auditor</span>
                <span className="text-blue-400 font-mono">auditor@integra.gov</span>
              </button>
              <button
                onClick={() => { setEmail('grc@integra.gov'); setPassword('Integra@2024'); }}
                className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition"
              >
                <span className="text-blue-200">Gestor GRC</span>
                <span className="text-blue-400 font-mono">grc@integra.gov</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-300/50">
            INTEGRA.GOV v1.0 — Ambiente de Desenvolvimento
          </p>
          <p className="text-xs text-blue-300/30 mt-1">
            Dados fictícios para teste. Não representam dados governamentais reais.
          </p>
        </div>
      </div>
    </div>
  );
}
