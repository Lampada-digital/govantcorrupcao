// INTEGRA.GOV - Contracts Page
import { useAppStore } from '../store/app.store';
import { FileText } from 'lucide-react';

export default function ContractsPage() {
  const { contracts, vendors, companies, getScopedData } = useAppStore();
  const scopedContracts = getScopedData(contracts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Contratos
        </h1>
        <p className="text-sm text-slate-500 mt-1">Gestão e análise de contratos governamentais</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Contrato</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Objeto</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Fornecedor</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Valor</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Aditivos</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Análise</th>
            </tr>
          </thead>
          <tbody>
            {scopedContracts.map(contract => {
              const vendor = vendors.find(v => v.id === contract.vendorId);
              const company = vendor ? companies.find(c => c.id === vendor.companyId) : null;
              return (
                <tr key={contract.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{contract.contractNumber}</p>
                    <p className="text-xs text-slate-500">{contract.startDate} → {contract.endDate}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 max-w-[200px] truncate">{contract.object}</td>
                  <td className="py-3 px-4 text-xs text-slate-700">{company?.name || '—'}</td>
                  <td className="py-3 px-4 text-right font-mono text-xs">
                    R$ {contract.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${contract.addendums > 1 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                      {contract.addendums}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${contract.status === 'VIGENTE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {contract.analysisResult ? (
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        contract.analysisResult.classification === 'NORMAL' ? 'bg-green-100 text-green-700' :
                        contract.analysisResult.classification === 'ATENCAO' ? 'bg-yellow-100 text-yellow-700' :
                        contract.analysisResult.classification === 'RISCO' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>{contract.analysisResult.classification === 'ATENCAO' ? 'ATENÇÃO' : contract.analysisResult.classification}</span>
                    ) : <span className="text-xs text-slate-400">—</span>}
                  </td>
                </tr>
              );
            })}
            {scopedContracts.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Nenhum contrato encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
