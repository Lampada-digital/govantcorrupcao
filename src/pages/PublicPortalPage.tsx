// INTEGRA.GOV - Public Portal Page
import { useAppStore } from '../store/app.store';
import { Globe, Shield, FileText, AlertTriangle } from 'lucide-react';

export default function PublicPortalPage() {
  const { contracts, bids, companies, vendors, findings, organizations } = useAppStore();

  // Only show authorized public data
  const publicContracts = contracts.filter(c => c.status === 'VIGENTE');
  const publicBids = bids.filter(b => b.status === 'HOMOLOGADA');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-500" />
          Portal da Transparência
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Informações públicas sobre contratações, licitações e indicadores
        </p>
      </div>

      {/* Transparency notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">Acesso Público</p>
            <p className="text-xs text-green-700 mt-1">
              Este portal exibe apenas informações autorizadas para transparência pública. 
              Dados de investigações sigilosas, informações pessoais protegidas e evidências restritas 
              não são exibidos nesta área.
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{publicContracts.length}</p>
          <p className="text-xs text-slate-500">Contratos Vigentes</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <FileText className="w-6 h-6 text-teal-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{publicBids.length}</p>
          <p className="text-xs text-slate-500">Licitações Homologadas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{organizations.length}</p>
          <p className="text-xs text-slate-500">Órgãos Participantes</p>
        </div>
      </div>

      {/* Public contracts */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Contratos Públicos Vigentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Número</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Objeto</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Fornecedor</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500">Valor</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Vigência</th>
              </tr>
            </thead>
            <tbody>
              {publicContracts.map(contract => {
                const vendor = vendors.find(v => v.id === contract.vendorId);
                const company = vendor ? companies.find(c => c.id === vendor.companyId) : null;
                return (
                  <tr key={contract.id} className="border-b border-slate-50">
                    <td className="py-2 px-3 font-mono text-xs">{contract.contractNumber}</td>
                    <td className="py-2 px-3 text-xs text-slate-600">{contract.object}</td>
                    <td className="py-2 px-3 text-xs text-slate-700">{company?.name || '—'}</td>
                    <td className="py-2 px-3 text-right font-mono text-xs">
                      R$ {contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 text-xs text-slate-500">{contract.startDate} a {contract.endDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public bids */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Licitações Homologadas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Processo</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Modalidade</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500">Objeto</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500">Valor</th>
              </tr>
            </thead>
            <tbody>
              {publicBids.map(bid => (
                <tr key={bid.id} className="border-b border-slate-50">
                  <td className="py-2 px-3 font-mono text-xs">{bid.processNumber}</td>
                  <td className="py-2 px-3 text-xs text-slate-600">{bid.modality}</td>
                  <td className="py-2 px-3 text-xs text-slate-600">{bid.object}</td>
                  <td className="py-2 px-3 text-right font-mono text-xs">
                    R$ {(bid.winnerValue || bid.estimatedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organizations */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Órgãos Participantes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {organizations.map(org => (
            <div key={org.id} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-800">{org.name}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded ${
                org.sphere === 'MUNICIPAL' ? 'bg-green-100 text-green-700' :
                org.sphere === 'ESTADUAL' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>{org.sphere}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
