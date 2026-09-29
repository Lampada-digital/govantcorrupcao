// INTEGRA.GOV - Users Management Page
import { useAppStore } from '../store/app.store';
import { hasPermission } from '../services/auth.service';
import { Users, Shield } from 'lucide-react';

export default function UsersPage() {
  const { users, roles, organizations, getScopedData } = useAppStore();
  const canManage = hasPermission('user:create');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Gestão de Usuários
        </h1>
        <p className="text-sm text-slate-500 mt-1">Controle de acesso, perfis e permissões (RBAC)</p>
      </div>

      {/* RBAC Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Controle de Acesso Baseado em Funções (RBAC)</p>
            <p className="text-xs text-blue-700 mt-1">
              Cada usuário possui um perfil com permissões específicas. O acesso a recursos é verificado no backend 
              em toda requisição. O isolamento multitenant garante que organizações não acessem dados de outras sem autorização.
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Usuário</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">E-mail</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Perfil</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Organização</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Último Acesso</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">MFA</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const role = roles.find(r => r.id === user.roleId);
              const org = organizations.find(o => o.id === user.organizationId);
              return (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 font-mono">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded font-medium">
                      {role?.name.replace(/_/g, ' ') || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{org?.name || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'Nunca'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${user.mfaEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {user.mfaEnabled ? 'Ativo' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Roles Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Perfis do Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map(role => (
            <div key={role.id} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-semibold text-slate-800">{role.name.replace(/_/g, ' ')}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{role.permissions.length} permissões</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
