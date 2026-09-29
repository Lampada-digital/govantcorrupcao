// INTEGRA.GOV - Dashboard Page
import { useEffect } from 'react';
import { useAppStore } from '../store/app.store';
import {
  AlertTriangle, ShieldCheck, FileText, AlertOctagon,
  ClipboardList, TrendingUp, TrendingDown, Clock, Activity
} from 'lucide-react';

export default function DashboardPage() {
  const { getDashboardData, findings, actionPlans, currentUser, organizations } = useAppStore();
  const data = getDashboardData();
  const org = organizations.find(o => o.id === currentUser?.organizationId);

  useEffect(() => {
    document.title = 'INTEGRA.GOV — Dashboard';
  }, []);

  const riskLevelColors: Record<string, string> = {
    BAIXO: 'bg-green-100 text-green-800 border-green-200',
    MODERADO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ALTO: 'bg-orange-100 text-orange-800 border-orange-200',
    CRITICO: 'bg-red-100 text-red-800 border-red-200',
  };

  const analysisColors: Record<string, string> = {
    NORMAL: 'bg-green-100 text-green-700',
    ATENCAO: 'bg-yellow-100 text-yellow-700',
    RISCO: 'bg-orange-100 text-orange-700',
    ALTO_RISCO: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel de Governança</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visão geral de riscos, controles, contratos e integridade
            {org && <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{org.name}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            Atualizado: {new Date().toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Riscos Cadastrados"
          value={data.totalRisks}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
          subtitle={`${data.risksByLevel.CRITICO || 0} críticos`}
        />
        <SummaryCard
          title="Controles Ativos"
          value={data.totalControls}
          icon={<ShieldCheck className="w-5 h-5" />}
          color="blue"
          subtitle={`${data.controlsByEffectiveness.EFICAZ || 0} eficazes`}
        />
        <SummaryCard
          title="Contratos Vigentes"
          value={data.totalContracts}
          icon={<FileText className="w-5 h-5" />}
          color="green"
          subtitle={`${Object.values(data.contractsByStatus).reduce((a, b) => a + b, 0)} total`}
        />
        <SummaryCard
          title="Achados de Risco"
          value={data.totalFindings}
          icon={<AlertOctagon className="w-5 h-5" />}
          color="red"
          subtitle={`${findings.filter(f => f.status === 'EM_REVISAO').length} em revisão`}
        />
      </div>

      {/* Second row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Denúncias"
          value={data.totalComplaints}
          icon={<AlertOctagon className="w-5 h-5" />}
          color="purple"
          subtitle={`${data.complaintsByStatus.ANALISE || 0} em análise`}
        />
        <SummaryCard
          title="Planos de Ação"
          value={data.totalActionPlans}
          icon={<ClipboardList className="w-5 h-5" />}
          color="indigo"
          subtitle={`${data.overdueActionPlans} atrasados`}
        />
        <SummaryCard
          title="Licitações"
          value={data.totalBids}
          icon={<FileText className="w-5 h-5" />}
          color="teal"
          subtitle={`${data.bidsByAnalysis.ATENCAO || 0} com atenção`}
        />
        <SummaryCard
          title="Incidentes"
          value={data.totalIncidents}
          icon={<Activity className="w-5 h-5" />}
          color="rose"
          subtitle="Monitoramento ativo"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Matrix Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Matriz de Riscos
          </h3>
          <div className="space-y-3">
            {(['CRITICO', 'ALTO', 'MODERADO', 'BAIXO'] as const).map(level => (
              <div key={level} className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${riskLevelColors[level]}`}>
                  {level}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        level === 'CRITICO' ? 'bg-red-500' :
                        level === 'ALTO' ? 'bg-orange-500' :
                        level === 'MODERADO' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${data.totalRisks > 0 ? (data.risksByLevel[level] / data.totalRisks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 w-6 text-right">{data.risksByLevel[level]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Probabilidade × Impacto → Score → Nível
            </p>
          </div>
        </div>

        {/* Bid Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Análise de Licitações
          </h3>
          <div className="space-y-3">
            {Object.entries(data.bidsByAnalysis).map(([classification, count]) => (
              <div key={classification} className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${analysisColors[classification] || 'bg-slate-100 text-slate-700'}`}>
                  {classification === 'ALTO_RISCO' ? 'ALTO RISCO' : classification === 'ATENCAO' ? 'ATENÇÃO' : classification}
                </span>
                <span className="text-sm font-medium text-slate-700">{count}</span>
              </div>
            ))}
            {Object.keys(data.bidsByAnalysis).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Nenhuma licitação analisada</p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Classificação baseada em fatores de risco objetivos. Não constitui acusação.
            </p>
          </div>
        </div>

        {/* Controls Effectiveness */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Eficácia dos Controles
          </h3>
          <div className="space-y-3">
            {Object.entries(data.controlsByEffectiveness).map(([effectiveness, count]) => (
              <div key={effectiveness} className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  effectiveness === 'EFICAZ' ? 'bg-green-100 text-green-700' :
                  effectiveness === 'PARCIAL' ? 'bg-yellow-100 text-yellow-700' :
                  effectiveness === 'INEFICAZ' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {effectiveness === 'NAO_AVALIADO' ? 'Não Avaliado' : effectiveness}
                </span>
                <span className="text-sm font-medium text-slate-700">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Avaliação baseada em testes de controle realizados.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Findings */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-500" />
          Achados Recentes do Motor de Risco
        </h3>
        {findings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Tipo</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Severidade</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Confiança</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Fatores</th>
                </tr>
              </thead>
              <tbody>
                {findings.slice(0, 5).map(finding => (
                  <tr key={finding.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{finding.type.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        finding.severity === 'CRITICA' ? 'bg-red-100 text-red-700' :
                        finding.severity === 'ALTA' ? 'bg-orange-100 text-orange-700' :
                        finding.severity === 'MEDIA' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{finding.severity}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-600">{(finding.confidence * 100).toFixed(0)}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        finding.status === 'ATIVO' ? 'bg-blue-100 text-blue-700' :
                        finding.status === 'EM_REVISAO' ? 'bg-yellow-100 text-yellow-700' :
                        finding.status === 'CONFIRMADO' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{finding.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {finding.factors.slice(0, 2).map((f, i) => (
                          <span key={i} className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">Nenhum achado registrado</p>
        )}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 italic">
            ⚠️ Achados indicam padrões que requerem análise humana. Não constituem acusação automática.
          </p>
        </div>
      </div>

      {/* Action Plans with overdue */}
      {data.overdueActionPlans > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-semibold text-red-800">Planos de Ação Atrasados</h3>
          </div>
          <p className="text-sm text-red-700">
            Existem <strong>{data.overdueActionPlans}</strong> plano(s) de ação com prazo vencido que requer(em) atenção imediata.
          </p>
        </div>
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, icon, color, subtitle }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
}) {
  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-100' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 ${classes.bg} rounded-lg flex items-center justify-center ${classes.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
