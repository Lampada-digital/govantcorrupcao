// INTEGRA.GOV - Audit Logs Page
import { useState } from 'react';
import { useAppStore } from '../store/app.store';
import { Activity, Search, Filter } from 'lucide-react';
import type { AuditLogAction } from '../domain/types';

export default function AuditLogsPage() {
  const { auditLogs, users } = useAppStore();
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterResult, setFilterResult] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction && log.action !== filterAction) return false;
    if (filterResult && log.result !== filterResult) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.userName.toLowerCase().includes(term) ||
        log.resource.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const actionColors: Record<string, string> = {
    LOGIN: 'bg-green-100 text-green-700',
    LOGOUT: 'bg-slate-100 text-slate-700',
    LOGIN_FAILED: 'bg-red-100 text-red-700',
    DATA_CREATED: 'bg-blue-100 text-blue-700',
    DATA_UPDATED: 'bg-yellow-100 text-yellow-700',
    DATA_DELETED: 'bg-red-100 text-red-700',
    SECURITY_EVENT: 'bg-red-100 text-red-700',
    CASE_CREATED: 'bg-purple-100 text-purple-700',
    CASE_UPDATED: 'bg-purple-100 text-purple-700',
    CASE_CLOSED: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Trilha de Auditoria
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Registro imutável de todas as ações realizadas no sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg border border-slate-200">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuário, recurso ou ação..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as ações</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="LOGIN_FAILED">Login Falhou</option>
          <option value="DATA_CREATED">Dados Criados</option>
          <option value="DATA_UPDATED">Dados Atualizados</option>
          <option value="DATA_DELETED">Dados Excluídos</option>
          <option value="SECURITY_EVENT">Evento de Segurança</option>
          <option value="CASE_CREATED">Caso Criado</option>
        </select>
        <select
          value={filterResult}
          onChange={e => setFilterResult(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os resultados</option>
          <option value="SUCCESS">Sucesso</option>
          <option value="FAILURE">Falha</option>
          <option value="DENIED">Negado</option>
        </select>
        <span className="text-xs text-slate-500">{filteredLogs.length} registro(s)</span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Data/Hora</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Usuário</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Ação</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Recurso</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Resultado</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Contexto</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.slice(0, 100).map(log => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="py-2.5 px-4">
                    <span className="text-xs text-slate-600 font-mono">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-sm text-slate-800">{log.userName}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${actionColors[log.action] || 'bg-slate-100 text-slate-700'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs text-slate-600">{log.resource}</span>
                    {log.resourceId && <span className="text-xs text-slate-400 ml-1">#{log.resourceId.slice(0, 8)}</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      log.result === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                      log.result === 'FAILURE' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{log.result}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs text-slate-500 truncate max-w-[200px] block">
                      {Object.keys(log.context).length > 0 ? JSON.stringify(log.context).slice(0, 60) + '...' : '—'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredLogs.length > 100 && (
          <div className="p-3 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">Exibindo 100 de {filteredLogs.length} registros</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700">
          <strong>Nota de Segurança:</strong> Os logs de auditoria são imutáveis e não podem ser alterados ou excluídos por nenhum usuário, incluindo administradores. 
          Esta trilha garante a rastreabilidade completa de todas as ações realizadas no sistema.
        </p>
      </div>
    </div>
  );
}
