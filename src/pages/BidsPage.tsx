// INTEGRA.GOV - Bids Page
import { useAppStore } from '../store/app.store';
import { FileSearch } from 'lucide-react';

export default function BidsPage() {
  const { bids, vendors, companies, getScopedData } = useAppStore();
  const scopedBids = getScopedData(bids);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-teal-500" />
          Licitações
        </h1>
        <p className="text-sm text-slate-500 mt-1">Análise de processos licitatórios e detecção de padrões atípicos</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Processo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Modalidade</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Objeto</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Valor Est.</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Participantes</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Análise</th>
            </tr>
          </thead>
          <tbody>
            {scopedBids.map(bid => {
              const winner = bid.winnerId ? vendors.find(v => v.id === bid.winnerId) : null;
              const winnerCompany = winner ? companies.find(c => c.id === winner.companyId) : null;
              return (
                <tr key={bid.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{bid.processNumber}</p>
                    <p className="text-xs text-slate-500">{bid.openingDate}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{bid.modality}</td>
                  <td className="py-3 px-4 text-xs text-slate-600 max-w-[200px] truncate">{bid.object}</td>
                  <td className="py-3 px-4 text-right font-mono text-xs">
                    R$ {bid.estimatedValue.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs text-slate-600">{bid.participants.length}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${bid.status === 'HOMOLOGADA' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {bid.analysisResult ? (
                      <div>
                        <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                          bid.analysisResult.classification === 'NORMAL' ? 'bg-green-100 text-green-700' :
                          bid.analysisResult.classification === 'ATENCAO' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{bid.analysisResult.classification === 'ATENCAO' ? 'ATENÇÃO' : bid.analysisResult.classification}</span>
                        {bid.analysisResult.requiresReview && (
                          <p className="text-[10px] text-orange-600 mt-0.5">Requer revisão</p>
                        )}
                      </div>
                    ) : <span className="text-xs text-slate-400">—</span>}
                  </td>
                </tr>
              );
            })}
            {scopedBids.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Nenhuma licitação encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
