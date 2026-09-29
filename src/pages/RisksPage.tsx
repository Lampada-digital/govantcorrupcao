// INTEGRA.GOV - Risks Management Page
import { useState } from 'react';
import { useAppStore } from '../store/app.store';
import { hasPermission } from '../services/auth.service';
import type { Risk, RiskLevel, ProbabilityLevel, ImpactLevel } from '../domain/types';
import { AlertTriangle, Plus, Filter, Eye, Edit, ChevronRight } from 'lucide-react';

export default function RisksPage() {
  const { risks, users, controls, createRisk, updateRisk, getScopedData } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const scopedRisks = getScopedData(risks);
  const filteredRisks = scopedRisks.filter(r => {
    if (filterLevel && r.level !== filterLevel) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  const canCreate = hasPermission('risk:create');
  const canEdit = hasPermission('risk:update');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Matriz de Riscos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Identificação, avaliação e tratamento de riscos organizacionais
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Risco
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg border border-slate-200">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os níveis</option>
          <option value="CRITICO">Crítico</option>
          <option value="ALTO">Alto</option>
          <option value="MODERADO">Moderado</option>
          <option value="BAIXO">Baixo</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="IDENTIFICADO">Identificado</option>
          <option value="EM_ANALISE">Em Análise</option>
          <option value="EM_TRATAMENTO">Em Tratamento</option>
          <option value="MITIGADO">Mitigado</option>
          <option value="ACEITO">Aceito</option>
        </select>
        <span className="text-xs text-slate-500 ml-auto">{filteredRisks.length} risco(s)</span>
      </div>

      {/* Risk Matrix Visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Matriz Probabilidade × Impacto</h3>
        <div className="grid grid-cols-6 gap-0.5 max-w-md">
          <div className="text-xs text-slate-500 text-center py-1"></div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="text-xs text-slate-500 text-center py-1">{i}</div>
          ))}
          {[5,4,3,2,1].map(prob => (
            <>
              <div key={`label-${prob}`} className="text-xs text-slate-500 text-center py-2 font-medium">{prob}</div>
              {[1,2,3,4,5].map(imp => {
                const score = prob * imp;
                const level = score >= 16 ? 'CRITICO' : score >= 10 ? 'ALTO' : score >= 5 ? 'MODERADO' : 'BAIXO';
                const count = filteredRisks.filter(r => r.probability === prob && r.impact === imp).length;
                return (
                  <div
                    key={`${prob}-${imp}`}
                    className={`aspect-square flex items-center justify-center text-xs font-bold rounded ${
                      level === 'CRITICO' ? 'bg-red-200 text-red-800' :
                      level === 'ALTO' ? 'bg-orange-200 text-orange-800' :
                      level === 'MODERADO' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}
                    title={`Probabilidade: ${prob}, Impacto: ${imp}, Score: ${score}, Riscos: ${count}`}
                  >
                    {count > 0 ? count : ''}
                  </div>
                );
              })}
            </>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span>← Impacto →</span>
          <span className="ml-auto">Probabilidade ↑</span>
        </div>
      </div>

      {/* Risk List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Risco</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Categoria</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">P × I</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Score</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Nível</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Controles</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRisks.map(risk => {
                const owner = users.find(u => u.id === risk.ownerId);
                const riskControls = controls.filter(c => risk.controls.includes(c.id));
                return (
                  <tr key={risk.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{risk.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{risk.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{risk.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-mono text-slate-600">{risk.probability} × {risk.impact}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-800">{risk.score}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        risk.level === 'CRITICO' ? 'bg-red-100 text-red-700' :
                        risk.level === 'ALTO' ? 'bg-orange-100 text-orange-700' :
                        risk.level === 'MODERADO' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{risk.level}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs ${
                        risk.status === 'MITIGADO' ? 'text-green-600' :
                        risk.status === 'EM_TRATAMENTO' ? 'text-blue-600' :
                        'text-slate-600'
                      }`}>{risk.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-600">{riskControls.length} controle(s)</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedRisk(risk)}
                          className="p-1.5 hover:bg-slate-100 rounded transition"
                          title="Visualizar"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => { setSelectedRisk(risk); setShowForm(true); }}
                            className="p-1.5 hover:bg-slate-100 rounded transition"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRisks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-sm">
                    Nenhum risco encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Detail Modal */}
      {selectedRisk && !showForm && (
        <RiskDetailModal risk={selectedRisk} onClose={() => setSelectedRisk(null)} />
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <RiskFormModal
          risk={selectedRisk}
          onClose={() => { setShowForm(false); setSelectedRisk(null); }}
          onSave={(data) => {
            if (selectedRisk) {
              updateRisk(selectedRisk.id, data);
            } else {
              const { id, createdAt, updatedAt, score, level, organizationId, ...rest } = data as any;
              createRisk({ ...rest, createdBy: useAppStore.getState().currentUser?.id || '' });
            }
            setShowForm(false);
            setSelectedRisk(null);
          }}
        />
      )}
    </div>
  );
}

// Risk Detail Modal
function RiskDetailModal({ risk, onClose }: { risk: Risk; onClose: () => void }) {
  const { users, controls } = useAppStore();
  const owner = users.find(u => u.id === risk.ownerId);
  const riskControls = controls.filter(c => risk.controls.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{risk.title}</h2>
              <p className="text-sm text-slate-500 mt-1">Categoria: {risk.category}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
              risk.level === 'CRITICO' ? 'bg-red-100 text-red-700' :
              risk.level === 'ALTO' ? 'bg-orange-100 text-orange-700' :
              risk.level === 'MODERADO' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>{risk.level} (Score: {risk.score})</span>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Descrição</h4>
            <p className="text-sm text-slate-700">{risk.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Probabilidade</h4>
              <p className="text-sm font-medium">{risk.probability}/5</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Impacto</h4>
              <p className="text-sm font-medium">{risk.impact}/5</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</h4>
              <p className="text-sm font-medium">{risk.status.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Responsável</h4>
              <p className="text-sm font-medium">{owner?.name || 'Não definido'}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Fatores de Risco</h4>
            <div className="flex flex-wrap gap-1.5">
              {risk.riskFactors.map((f, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded">{f}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Controles Associados ({riskControls.length})</h4>
            {riskControls.length > 0 ? (
              <div className="space-y-2">
                {riskControls.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">{c.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      c.effectiveness === 'EFICAZ' ? 'bg-green-100 text-green-700' :
                      c.effectiveness === 'PARCIAL' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{c.effectiveness}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Nenhum controle associado</p>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Risk Form Modal
function RiskFormModal({ risk, onClose, onSave }: {
  risk: Risk | null;
  onClose: () => void;
  onSave: (data: Partial<Risk>) => void;
}) {
  const [title, setTitle] = useState(risk?.title || '');
  const [description, setDescription] = useState(risk?.description || '');
  const [category, setCategory] = useState(risk?.category || 'CONTRATAÇÕES');
  const [probability, setProbability] = useState<ProbabilityLevel>(risk?.probability || 3);
  const [impact, setImpact] = useState<ImpactLevel>(risk?.impact || 3);
  const [status, setStatus] = useState<Risk['status']>(risk?.status || 'IDENTIFICADO');
  const [riskFactors, setRiskFactors] = useState(risk?.riskFactors.join(', ') || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      probability,
      impact,
      status,
      riskFactors: riskFactors.split(',').map(f => f.trim()).filter(Boolean),
      controls: risk?.controls || [],
      ownerId: risk?.ownerId || useAppStore.getState().currentUser?.id || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">{risk ? 'Editar Risco' : 'Novo Risco'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição breve do risco"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Detalhamento do risco"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CONTRATAÇÕES">Contratações</option>
                <option value="CONTRATOS">Contratos</option>
                <option value="PROCESSOS">Processos</option>
                <option value="SEGURANCA">Segurança</option>
                <option value="PRIVACIDADE">Privacidade</option>
                <option value="INTEGRIDADE">Integridade</option>
                <option value="TECNOLOGIA">Tecnologia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Risk['status'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IDENTIFICADO">Identificado</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="EM_TRATAMENTO">Em Tratamento</option>
                <option value="MITIGADO">Mitigado</option>
                <option value="ACEITO">Aceito</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Probabilidade (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={probability}
                onChange={e => setProbability(Math.min(5, Math.max(1, Number(e.target.value))) as ProbabilityLevel)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Impacto (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={impact}
                onChange={e => setImpact(Math.min(5, Math.max(1, Number(e.target.value))) as ImpactLevel)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500">Score calculado: <strong className="text-slate-800">{probability * impact}</strong> → Nível: <strong className="text-slate-800">{probability * impact >= 16 ? 'CRÍTICO' : probability * impact >= 10 ? 'ALTO' : probability * impact >= 5 ? 'MODERADO' : 'BAIXO'}</strong></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fatores de Risco (separados por vírgula)</label>
            <input
              value={riskFactors}
              onChange={e => setRiskFactors(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Baixa concorrência, Preço atípico"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              {risk ? 'Salvar Alterações' : 'Criar Risco'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
