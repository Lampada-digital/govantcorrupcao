// INTEGRA.GOV - Controls Page
import { useAppStore } from '../store/app.store';
import { hasPermission } from '../services/auth.service';
import { ShieldCheck, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ControlsPage() {
  const { controls, risks, users, createControl, getScopedData } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const scopedControls = getScopedData(controls);
  const canCreate = hasPermission('control:create');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            Controles
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestão de controles preventivos, detectivos e corretivos</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> Novo Controle
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Controle</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Tipo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Frequência</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Eficácia</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Risco Vinculado</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Responsável</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {scopedControls.map(control => {
              const linkedRisk = risks.find(r => r.id === control.riskId);
              const owner = users.find(u => u.id === control.ownerId);
              return (
                <tr key={control.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{control.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{control.description}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      control.type === 'PREVENTIVO' ? 'bg-blue-100 text-blue-700' :
                      control.type === 'DETECTIVO' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{control.type}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{control.frequency}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                      control.effectiveness === 'EFICAZ' ? 'bg-green-100 text-green-700' :
                      control.effectiveness === 'PARCIAL' ? 'bg-yellow-100 text-yellow-700' :
                      control.effectiveness === 'INEFICAZ' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{control.effectiveness === 'NAO_AVALIADO' ? 'Não Avaliado' : control.effectiveness}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">{linkedRisk?.title || '—'}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">{owner?.name || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      control.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>{control.status}</span>
                  </td>
                </tr>
              );
            })}
            {scopedControls.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Nenhum controle cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Novo Controle</h2>
            <ControlForm onSave={(data) => { createControl(data); setShowForm(false); }} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ControlForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PREVENTIVO' | 'DETECTIVO' | 'CORRETIVO'>('PREVENTIVO');
  const [frequency, setFrequency] = useState<'DIARIO' | 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'>('MENSAL');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, description, type, frequency, ownerId: useAppStore.getState().currentUser?.id || '', effectiveness: 'NAO_AVALIADO' as const, status: 'ATIVO' as const, evidenceIds: [] }); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="PREVENTIVO">Preventivo</option>
            <option value="DETECTIVO">Detectivo</option>
            <option value="CORRETIVO">Corretivo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Frequência</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="DIARIO">Diário</option>
            <option value="SEMANAL">Semanal</option>
            <option value="MENSAL">Mensal</option>
            <option value="TRIMESTRAL">Trimestral</option>
            <option value="SEMESTRAL">Semestral</option>
            <option value="ANUAL">Anual</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Criar</button>
      </div>
    </form>
  );
}
