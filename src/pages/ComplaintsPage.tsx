// INTEGRA.GOV - Complaints Page
import { useAppStore } from '../store/app.store';
import { hasPermission } from '../services/auth.service';
import { MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';

export default function ComplaintsPage() {
  const { complaints, createComplaint, getScopedData } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const scopedComplaints = getScopedData(complaints);
  const canCreate = hasPermission('complaint:create');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            Canal de Denúncias
          </h1>
          <p className="text-sm text-slate-500 mt-1">Recebimento e gestão de denúncias de integridade</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> Nova Denúncia
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Protocolo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Tipo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Categoria</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Descrição</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Data</th>
            </tr>
          </thead>
          <tbody>
            {scopedComplaints.map(complaint => (
              <tr key={complaint.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-xs text-slate-800">{complaint.protocolNumber}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    complaint.type === 'ANONIMA' ? 'bg-slate-100 text-slate-700' :
                    complaint.type === 'CONFIDENCIAL' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>{complaint.type}</span>
                </td>
                <td className="py-3 px-4 text-xs text-slate-600">{complaint.category}</td>
                <td className="py-3 px-4 text-xs text-slate-600 max-w-[250px] truncate">{complaint.description}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    complaint.status === 'CONCLUIDA' ? 'bg-green-100 text-green-700' :
                    complaint.status === 'ANALISE' ? 'bg-yellow-100 text-yellow-700' :
                    complaint.status === 'INVESTIGACAO' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{complaint.status.replace(/_/g, ' ')}</span>
                </td>
                <td className="py-3 px-4 text-xs text-slate-500">{new Date(complaint.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
            {scopedComplaints.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Nenhuma denúncia registrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Nova Denúncia</h2>
            <ComplaintForm onSave={(data) => { createComplaint(data); setShowForm(false); }} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ComplaintForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [type, setType] = useState<'ANONIMA' | 'CONFIDENCIAL' | 'IDENTIFICADA'>('ANONIMA');
  const [category, setCategory] = useState('FRAUDE');
  const [description, setDescription] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ type, category, description, status: 'RECEBIDA' as const, relatedEntities: [], evidenceIds: [] }); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
        <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option value="ANONIMA">Anônima</option>
          <option value="CONFIDENCIAL">Confidencial</option>
          <option value="IDENTIFICADA">Identificada</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option value="FRAUDE">Fraude</option>
          <option value="CORRUPCAO">Corrupção</option>
          <option value="ASSÉDIO">Assédio</option>
          <option value="IRREGULARIDADE">Irregularidade</option>
          <option value="OUTROS">Outros</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Registrar</button>
      </div>
    </form>
  );
}
