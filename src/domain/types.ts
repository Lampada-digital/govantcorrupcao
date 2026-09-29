// INTEGRA.GOV - Domain Types
// Plaftforma Nacional de Governança, Integridade, Riscos, Auditoria e Transparência

// ============================================================
// ORGANIZATION & HIERARCHY
// ============================================================

export type SphereType = 'MUNICIPAL' | 'ESTADUAL' | 'FEDERAL';

export interface Organization {
  id: string;
  name: string;
  sphere: SphereType;
  code: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// AUTHENTICATION & RBAC
// ============================================================

export type RoleName =
  | 'SUPER_ADMIN'
  | 'ADMIN_ORGAO'
  | 'GESTOR_GRC'
  | 'AUDITOR'
  | 'CONTROLADOR'
  | 'OUVIDORIA'
  | 'ANALISTA_RISCO'
  | 'ANALISTA_INTEGRIDADE'
  | 'INVESTIGADOR'
  | 'GESTOR_CONTRATO'
  | 'GESTOR_SEGURANCA'
  | 'USUARIO_INTERNO'
  | 'CIDADAO';

export type PermissionName =
  | 'user:read' | 'user:create' | 'user:update' | 'user:delete'
  | 'org:read' | 'org:create' | 'org:update' | 'org:delete'
  | 'role:read' | 'role:create' | 'role:update' | 'role:delete'
  | 'risk:read' | 'risk:create' | 'risk:update' | 'risk:delete'
  | 'control:read' | 'control:create' | 'control:update' | 'control:delete'
  | 'contract:read' | 'contract:create' | 'contract:update' | 'contract:delete'
  | 'bid:read' | 'bid:create' | 'bid:update' | 'bid:delete'
  | 'vendor:read' | 'vendor:create' | 'vendor:update' | 'vendor:delete'
  | 'company:read' | 'company:create' | 'company:update' | 'company:delete'
  | 'payment:read' | 'payment:create' | 'payment:update' | 'payment:delete'
  | 'audit:read' | 'audit:create' | 'audit:update' | 'audit:delete'
  | 'incident:read' | 'incident:create' | 'incident:update' | 'incident:delete'
  | 'complaint:read' | 'complaint:create' | 'complaint:update' | 'complaint:delete'
  | 'evidence:read' | 'evidence:create' | 'evidence:update' | 'evidence:delete'
  | 'action_plan:read' | 'action_plan:create' | 'action_plan:update' | 'action_plan:delete'
  | 'finding:read' | 'finding:create' | 'finding:update' | 'finding:delete'
  | 'relationship:read' | 'relationship:create' | 'relationship:update' | 'relationship:delete'
  | 'audit_log:read'
  | 'report:read' | 'report:export'
  | 'dashboard:read'
  | 'security:read' | 'security:manage'
  | 'ai:read' | 'ai:manage'
  | 'public:view';

export interface Role {
  id: string;
  name: RoleName;
  description: string;
  permissions: PermissionName[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  organizationId: string;
  roleId: string;
  active: boolean;
  mfaEnabled: boolean;
  lastLogin?: string;
  loginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
  token: string;
  organizationId: string;
  roleId: string;
  permissions: PermissionName[];
  expiresAt: string;
  createdAt: string;
}

// ============================================================
// GRC - GOVERNANCE, RISK & COMPLIANCE
// ============================================================

export type RiskLevel = 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO';
export type ProbabilityLevel = 1 | 2 | 3 | 4 | 5;
export type ImpactLevel = 1 | 2 | 3 | 4 | 5;

export interface Risk {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: string;
  probability: ProbabilityLevel;
  impact: ImpactLevel;
  level: RiskLevel;
  score: number;
  ownerId: string;
  status: 'IDENTIFICADO' | 'EM_ANALISE' | 'EM_TRATAMENTO' | 'MITIGADO' | 'ACEITO';
  riskFactors: string[];
  controls: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Control {
  id: string;
  organizationId: string;
  riskId?: string;
  title: string;
  description: string;
  type: 'PREVENTIVO' | 'DETECTIVO' | 'CORRETIVO';
  frequency: 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  ownerId: string;
  lastExecution?: string;
  nextExecution?: string;
  effectiveness: 'EFICAZ' | 'PARCIAL' | 'INEFICAZ' | 'NAO_AVALIADO';
  status: 'ATIVO' | 'INATIVO' | 'EM_REVISAO';
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ControlTest {
  id: string;
  controlId: string;
  organizationId: string;
  testedBy: string;
  testedAt: string;
  result: 'CONFORME' | 'NAO_CONFORME' | 'PARCIAL';
  observations: string;
  evidenceIds: string[];
  createdAt: string;
}

// ============================================================
// CONTRACTS, BIDS, VENDORS
// ============================================================

export type BidStatus = 'ABERTA' | 'EM_ANDAMENTO' | 'DESERTA' | 'FRACASSADA' | 'HOMOLOGADA' | 'CANCELADA' | 'REVogada';
export type ContractStatus = 'VIGENTE' | 'ENCERRADO' | 'SUSPENSO' | 'CANCELADO' | 'ADITIVADO';

export interface Bid {
  id: string;
  organizationId: string;
  processNumber: string;
  modality: string;
  object: string;
  estimatedValue: number;
  status: BidStatus;
  openingDate: string;
  participants: string[];
  winnerId?: string;
  winnerValue?: number;
  analysisResult?: BidAnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export interface BidAnalysisResult {
  classification: 'NORMAL' | 'ATENCAO' | 'RISCO' | 'ALTO_RISCO';
  factors: string[];
  score: number;
  analyzedAt: string;
  requiresReview: boolean;
}

export interface Contract {
  id: string;
  organizationId: string;
  bidId?: string;
  contractNumber: string;
  vendorId: string;
  object: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  addendums: number;
  totalValue: number;
  payments: Payment[];
  analysisResult?: ContractAnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export interface ContractAnalysisResult {
  classification: 'NORMAL' | 'ATENCAO' | 'RISCO' | 'ALTO_RISCO';
  factors: string[];
  score: number;
  analyzedAt: string;
  requiresReview: boolean;
}

export interface Vendor {
  id: string;
  organizationId: string;
  companyId: string;
  registrationDate: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'IMPEDIDO';
  contractsCount: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  taxId: string;
  legalName: string;
  address: string;
  city: string;
  state: string;
  partners: Partner[];
  relatedCompanies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  taxId: string;
  role: string;
  sharePercentage: number;
}

export interface Payment {
  id: string;
  organizationId: string;
  contractId: string;
  vendorId: string;
  type: 'EMPENHO' | 'LIQUIDACAO' | 'PAGAMENTO';
  amount: number;
  date: string;
  expenseNature: string;
  status: 'PROCESSADO' | 'PAGO' | 'CANCELADO';
  createdAt: string;
}

// ============================================================
// AUDIT
// ============================================================

export type AuditStatus = 'PLANEJAMENTO' | 'EXECUCAO' | 'ACHADO' | 'RECOMENDACAO' | 'PLANO_ACAO' | 'FOLLOW_UP' | 'ENCERRAMENTO';

export interface Audit {
  id: string;
  organizationId: string;
  title: string;
  scope: string;
  objectives: string;
  status: AuditStatus;
  leadAuditorId: string;
  teamIds: string[];
  startDate: string;
  endDate?: string;
  findings: AuditFinding[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  organizationId: string;
  title: string;
  description: string;
  criteria: string;
  condition: string;
  cause: string;
  effect: string;
  severity: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  recommendation: string;
  status: 'ABERTO' | 'EM_ANALISE' | 'ENCAMINHADO' | 'RESOLVIDO';
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// INTEGRITY - COMPLAINTS & INCIDENTS
// ============================================================

export type ComplaintStatus = 'RECEBIDA' | 'TRIAGEM' | 'ANALISE' | 'ENCAMINHADA' | 'INVESTIGACAO' | 'CONCLUIDA' | 'ARQUIVADA';
export type ComplaintType = 'IDENTIFICADA' | 'ANONIMA' | 'CONFIDENCIAL';

export interface Complaint {
  id: string;
  protocolNumber: string;
  organizationId: string;
  type: ComplaintType;
  category: string;
  department?: string;
  description: string;
  reporterName?: string;
  reporterEmail?: string;
  relatedEntities: string[];
  status: ComplaintStatus;
  evidenceIds: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentSeverity = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type IncidentCategory = 'INTEGRIDADE' | 'FRAUDE' | 'NAO_CONFORMIDADE' | 'SEGURANCA' | 'PRIVACIDADE' | 'CONTRATOS' | 'PROCESSOS';

export interface Incident {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  impact: string;
  source: string;
  status: 'ABERTO' | 'EM_INVESTIGACAO' | 'CONTIDO' | 'RESOLVIDO' | 'FECHADO';
  assignedTo: string;
  evidenceIds: string[];
  actionPlanIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// EVIDENCE & DOCUMENTS
// ============================================================

export interface Evidence {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  hash: string;
  source: string;
  author: string;
  classification: 'PUBLICO' | 'INTERNO' | 'CONFIDENCIAL' | 'RESTRITO';
  relatedEntityType: string;
  relatedEntityId: string;
  version: number;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// ACTION PLANS
// ============================================================

export type ActionPlanStatus = 'ABERTA' | 'EM_ANDAMENTO' | 'ATRASADA' | 'CONCLUIDA' | 'CANCELADA';

export interface ActionPlan {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: ActionPlanStatus;
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  sourceType: string;
  sourceId: string;
  evidenceIds: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// RISK ENGINE
// ============================================================

export type FindingSeverity = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface RiskFinding {
  id: string;
  organizationId: string;
  type: string;
  entityType: string;
  entityId: string;
  severity: FindingSeverity;
  confidence: number;
  factors: string[];
  evidenceIds: string[];
  ruleId: string;
  status: 'ATIVO' | 'EM_REVISAO' | 'CONFIRMADO' | 'DESCARTADO' | 'ENCAMINHADO';
  assignedTo?: string;
  humanReview?: {
    reviewerId: string;
    reviewedAt: string;
    conclusion: string;
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: RiskCondition[];
  severity: FindingSeverity;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RiskCondition {
  field: string;
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'EXISTS' | 'NOT_EXISTS';
  value: string | number | boolean;
}

// ============================================================
// RELATIONSHIPS (GRAPH)
// ============================================================

export interface Relationship {
  id: string;
  organizationId: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  type: string;
  description: string;
  strength: number;
  createdAt: string;
}

// ============================================================
// AUDIT LOG
// ============================================================

export type AuditLogAction =
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED'
  | 'PASSWORD_CHANGED' | 'ROLE_CHANGED' | 'PERMISSION_CHANGED'
  | 'DATA_CREATED' | 'DATA_UPDATED' | 'DATA_DELETED' | 'DATA_EXPORTED'
  | 'DOCUMENT_UPLOADED' | 'DOCUMENT_ACCESSED'
  | 'CASE_CREATED' | 'CASE_UPDATED' | 'CASE_CLOSED'
  | 'SECURITY_EVENT';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  organizationId: string;
  action: AuditLogAction;
  resource: string;
  resourceId?: string;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  context: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================
// DASHBOARD
// ============================================================

export interface DashboardData {
  totalRisks: number;
  risksByLevel: Record<RiskLevel, number>;
  totalControls: number;
  controlsByEffectiveness: Record<string, number>;
  totalContracts: number;
  contractsByStatus: Record<string, number>;
  totalBids: number;
  bidsByAnalysis: Record<string, number>;
  totalFindings: number;
  findingsBySeverity: Record<string, number>;
  totalComplaints: number;
  complaintsByStatus: Record<string, number>;
  totalIncidents: number;
  incidentsByCategory: Record<string, number>;
  totalActionPlans: number;
  overdueActionPlans: number;
  recentAuditLogs: AuditLogEntry[];
}
