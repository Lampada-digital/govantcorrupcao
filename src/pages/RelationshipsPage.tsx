// INTEGRA.GOV - Relationships (Graph) Page
import { useAppStore } from '../store/app.store';
import { Network } from 'lucide-react';

export default function RelationshipsPage() {
  const { relationships, companies, contracts, bids, getScopedData } = useAppStore();
  const scopedRelationships = getScopedData(relationships);

  const getEntityLabel = (type: string, id: string): string => {
    if (type === 'COMPANY') return companies.find(c => c.id === id)?.name || id;
    if (type === 'CONTRACT') return contracts.find(c => c.id === id)?.contractNumber || id;
    if (type === 'BID') return bids.find(b => b.id === id)?.processNumber || id;
    return id;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-500" />
          Mapa de Relacionamentos
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visualização de correlações entre entidades (empresas, contratos, licitações)
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-700">
          <strong>Nota:</strong> Relacionamentos indicam correlações identificadas nos dados disponíveis. 
          A existência de um relacionamento <strong>não constitui prova</strong> de irregularidade. 
          Cada conexão deve ser analisada no contexto adequado por profissional qualificado.
        </p>
      </div>

      {/* Visual Graph */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Grafo de Relacionamentos</h3>
        <div className="relative min-h-[300px] bg-slate-50 rounded-lg border border-slate-100 p-8">
          <svg className="w-full h-64" viewBox="0 0 600 250">
            {/* Draw relationships as lines */}
            {scopedRelationships.map((rel, i) => {
              const sourceX = 100 + (i % 3) * 200;
              const sourceY = 50 + Math.floor(i / 3) * 80;
              const targetX = sourceX + 100;
              const targetY = sourceY + 40;
              return (
                <g key={rel.id}>
                  <line x1={sourceX} y1={sourceY} x2={targetX} y2={targetY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={rel.strength < 0.5 ? "5,5" : undefined} />
                  <circle cx={sourceX} cy={sourceY} r="20" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x={sourceX} y={sourceY + 4} textAnchor="middle" className="text-[8px]" fill="#1e40af">{rel.sourceType.charAt(0)}</text>
                  <circle cx={targetX} cy={targetY} r="20" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="1.5" />
                  <text x={targetX} y={targetY + 4} textAnchor="middle" className="text-[8px]" fill="#065f46">{rel.targetType.charAt(0)}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Relationships Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Origem</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Tipo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Destino</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Descrição</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Força</th>
            </tr>
          </thead>
          <tbody>
            {scopedRelationships.map(rel => (
              <tr key={rel.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{rel.sourceType}</span>
                  <p className="text-xs text-slate-600 mt-0.5">{getEntityLabel(rel.sourceType, rel.sourceId)}</p>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{rel.type.replace(/_/g, ' ')}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">{rel.targetType}</span>
                  <p className="text-xs text-slate-600 mt-0.5">{getEntityLabel(rel.targetType, rel.targetId)}</p>
                </td>
                <td className="py-3 px-4 text-xs text-slate-600">{rel.description}</td>
                <td className="py-3 px-4 text-center">
                  <div className="w-16 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rel.strength * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{(rel.strength * 100).toFixed(0)}%</span>
                </td>
              </tr>
            ))}
            {scopedRelationships.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-slate-400">Nenhum relacionamento identificado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
