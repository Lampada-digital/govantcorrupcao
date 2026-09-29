// INTEGRA.GOV - Findings & Alerts Page
import { useAppStore } from '../store/app.store';
import { AlertOctagon, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function FindingsPage() {
  const { findings, companies, contracts, bids } = useAppStore();

  const getEntityName = (entityType: string, entityId: string): string => {
    if (entityType === 'COMPANY') return companies.find(c => c.id === entityId)?.name || entityId;
    if (entityType === 'CONTRACT') return contracts.find(c => c.id === entityId)?.contractNumber || entityId;
    if (entityType === 'BID') return bids.find(b => b.id === entityId)?.processNumber || entityId;
    return entityId;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          Achados & Alertas do Motor de Risco
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Identificações automáticas de padrões atípicos que requerem análise humana
        </p>
      </div>

      {/* Important notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Aviso Importante</p>
            <p className="text-xs text-amber-700 mt-1">
              Os achados abaixo representam <strong>padrões identificados pelo motor de risco</strong> que requerem análise humana. 
              Eles <strong>não constituem acusação</strong> de irregularidade ou fraude. 
              Cada achado deve ser investigado por profissional qualificado antes de qualquer conclusão.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{findings.length}</p>
          <p className="text-xs text-slate-500">Total de Achados</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{findings.filter(f => f.status === 'EM_REVISAO').length}</p>
          <p className="text-xs text-slate-500">Em Revisão</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{findings.filter(f => f.status === 'ATIVO').length}</p>
          <p className="text-xs text-slate-500">Ativos</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{findings.filter(f => f.severity === 'ALTA' || f.severity === 'CRITICA').length}</p>
          <p className="text-xs text-slate-500">Alta Severidade</p>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {findings.map(finding => (
          <div key={finding.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    finding.severity === 'CRITICA' ? 'bg-red-100 text-red-700' :
                    finding.severity === 'ALTA' ? 'bg-orange-100 text-orange-700' :
                    finding.severity === 'MEDIA' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{finding.severity}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    finding.status === 'ATIVO' ? 'bg-blue-100 text-blue-700' :
                    finding.status === 'EM_REVISAO' ? 'bg-yellow-100 text-yellow-700' :
                    finding.status === 'CONFIRMADO' ? 'bg-red-100 text-red-700' :
                    finding.status === 'DESCARTADO' ? 'bg-slate-100 text-slate-600' :
                    'bg-purple-100 text-purple-700'
                  }`}>{finding.status.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-slate-400">
                    Confiança: {(finding.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                
                <h3 className="font-medium text-slate-800">{finding.type.replace(/_/g, ' ')}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Entidade: <strong>{finding.entityType}</strong> — {getEntityName(finding.entityType, finding.entityId)}
                </p>

                {/* Factors */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-600 mb-1.5">Fatores identificados:</p>
                  <ul className="space-y-1">
                    {finding.factors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <span className="text-slate-400 mt-0.5">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Human review status */}
                {finding.humanReview && (
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">
                      <strong>Revisão humana:</strong> {finding.humanReview.conclusion}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Por: {finding.humanReview.reviewerId} em {new Date(finding.humanReview.reviewedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">
                  {new Date(finding.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        ))}
        {findings.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <AlertOctagon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Nenhum achado registrado pelo motor de risco.</p>
          </div>
        )}
      </div>
    </div>
  );
}
