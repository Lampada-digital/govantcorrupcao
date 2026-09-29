// INTEGRA.GOV - Data Store
// Central state management with persistence and multitenancy isolation

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Organization, Department, User, Role, RoleName, PermissionName, Risk, Control, ControlTest,
  Contract, Bid, Vendor, Company, Payment, Audit, AuditFinding,
  Complaint, Incident, Evidence, ActionPlan, RiskFinding, RiskRule,
  Relationship, AuditLogEntry, AuditLogAction, Session, DashboardData,
  SphereType, RiskLevel, ProbabilityLevel, ImpactLevel
} from '../domain/types';
import { hashPassword, verifyPassword, getSession, ROLE_DEFINITIONS, createSession, destroySession, recordFailedAttempt, resetRateLimit, checkRateLimit } from '../services/auth.service';

// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_PREFIX = 'integra_';
const getStorageKey = (entity: string) => `${STORAGE_PREFIX}${entity}`;

function loadFromStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(getStorageKey(key), JSON.stringify(data));
}

// ============================================================
// INITIAL DATA SEED (Development only - clearly fictional)
// ============================================================

function seedData(): void {
  // Only seed if no data exists
  if (loadFromStorage('organizations').length > 0) return;

  const now = new Date().toISOString();

  // Organizations
  const orgs: Organization[] = [
    { id: 'org-mun-001', name: 'Prefeitura Municipal de Vila Nova', sphere: 'MUNICIPAL', code: 'MUN-VN-001', createdAt: now, updatedAt: now, active: true },
    { id: 'org-est-001', name: 'Governo do Estado de São Exemplar', sphere: 'ESTADUAL', code: 'EST-SE-001', createdAt: now, updatedAt: now, active: true },
    { id: 'org-fed-001', name: 'Ministério da Governança Federal', sphere: 'FEDERAL', code: 'FED-GF-001', createdAt: now, updatedAt: now, active: true },
  ];
  saveToStorage('organizations', orgs);

  // Departments
  const depts: Department[] = [
    { id: 'dept-001', organizationId: 'org-mun-001', name: 'Secretaria de Administração', code: 'SEC-ADM', createdAt: now, updatedAt: now },
    { id: 'dept-002', organizationId: 'org-mun-001', name: 'Secretaria de Saúde', code: 'SEC-SAÚ', createdAt: now, updatedAt: now },
    { id: 'dept-003', organizationId: 'org-mun-001', name: 'Secretaria de Educação', code: 'SEC-EDU', createdAt: now, updatedAt: now },
    { id: 'dept-004', organizationId: 'org-est-001', name: 'Controladoria Geral do Estado', code: 'CGE', createdAt: now, updatedAt: now },
    { id: 'dept-005', organizationId: 'org-est-001', name: 'Secretaria de Fazenda', code: 'SEF', createdAt: now, updatedAt: now },
    { id: 'dept-006', organizationId: 'org-fed-001', name: 'Departamento de Integridade', code: 'DPI', createdAt: now, updatedAt: now },
    { id: 'dept-007', organizationId: 'org-fed-001', name: 'Departamento de Auditoria', code: 'DPA', createdAt: now, updatedAt: now },
  ];
  saveToStorage('departments', depts);

  // Roles
  const roles = Object.entries(ROLE_DEFINITIONS).map(([name, permissions]) => ({
    id: `role-${name.toLowerCase()}`,
    name: name as RoleName,
    description: `Perfil ${name}`,
    permissions,
    createdAt: now,
    updatedAt: now,
  })) as Role[];
  saveToStorage('roles', roles);

  // Users (passwords are hashed)
  // Default password for all: Integra@2024
  const users: User[] = [
    { id: 'user-001', email: 'admin@integra.gov', name: 'Administrador Geral', passwordHash: '', organizationId: 'org-mun-001', roleId: 'role-super_admin', active: true, mfaEnabled: false, loginAttempts: 0, createdAt: now, updatedAt: now },
    { id: 'user-002', email: 'auditor@integra.gov', name: 'Maria Auditora', passwordHash: '', organizationId: 'org-mun-001', roleId: 'role-auditor', active: true, mfaEnabled: false, loginAttempts: 0, createdAt: now, updatedAt: now },
    { id: 'user-003', email: 'grc@integra.gov', name: 'João Gestor GRC', passwordHash: '', organizationId: 'org-mun-001', roleId: 'role-gestor_grc', active: true, mfaEnabled: false, loginAttempts: 0, createdAt: now, updatedAt: now },
    { id: 'user-004', email: 'ouvidor@integra.gov', name: 'Ana Ouvidora', passwordHash: '', organizationId: 'org-est-001', roleId: 'role-ouvidoria', active: true, mfaEnabled: false, loginAttempts: 0, createdAt: now, updatedAt: now },
    { id: 'user-005', email: 'risco@integra.gov', name: 'Carlos Analista', passwordHash: '', organizationId: 'org-fed-001', roleId: 'role-analista_risco', active: true, mfaEnabled: false, loginAttempts: 0, createdAt: now, updatedAt: now },
  ];

  // Seed data (fictional - for development only)
  const risks: Risk[] = [
    { id: 'risk-001', organizationId: 'org-mun-001', title: 'Contratação sem adequada pesquisa de preços', description: 'Risco de contratação de serviços ou aquisição de bens sem realização de pesquisa de preços adequada, podendo resultar em sobrepreço.', category: 'CONTRATAÇÕES', probability: 4, impact: 4, level: 'CRITICO', score: 16, ownerId: 'user-003', status: 'EM_TRATAMENTO', riskFactors: ['Ausência de painel de preços', 'Falta de cotação mínima'], controls: ['control-001', 'control-002'], createdAt: now, updatedAt: now, createdBy: 'user-001' },
    { id: 'risk-002', organizationId: 'org-mun-001', title: 'Fragilidade na segregação de funções', description: 'Possibilidade de uma mesma pessoa realizar etapas incompatíveis do processo de despesa.', category: 'PROCESSOS', probability: 3, impact: 5, level: 'ALTO', score: 15, ownerId: 'user-003', status: 'IDENTIFICADO', riskFactors: ['Equipe reduzida', 'Ausência de sistema integrado'], controls: ['control-003'], createdAt: now, updatedAt: now, createdBy: 'user-001' },
    { id: 'risk-003', organizationId: 'org-mun-001', title: 'Vencimento de contratos sem renovação tempestiva', description: 'Contratos que podem expirar sem que haja processo de renovação ou nova licitação.', category: 'CONTRATOS', probability: 3, impact: 3, level: 'MODERADO', score: 9, ownerId: 'user-002', status: 'EM_ANALISE', riskFactors: ['Ausência de alerta automático', 'Volume elevado de contratos'], controls: [], createdAt: now, updatedAt: now, createdBy: 'user-001' },
    { id: 'risk-004', organizationId: 'org-est-001', title: 'Concentração de contratos em poucos fornecedores', description: 'Indicadores sugerem concentração excessiva de contratos em determinado grupo de fornecedores.', category: 'CONTRATAÇÕES', probability: 3, impact: 4, level: 'ALTO', score: 12, ownerId: 'user-004', status: 'EM_ANALISE', riskFactors: ['Baixa concorrência recorrente', 'Padrão de vencedores'], controls: [], createdAt: now, updatedAt: now, createdBy: 'user-004' },
  ];
  saveToStorage('risks', risks);

  const controls: Control[] = [
    { id: 'control-001', organizationId: 'org-mun-001', riskId: 'risk-001', title: 'Painel de Preços', description: 'Utilização do Painel de Preços para consulta de valores de mercado antes de contratações.', type: 'PREVENTIVO', frequency: 'MENSAL', ownerId: 'user-003', lastExecution: '2024-11-01', nextExecution: '2024-12-01', effectiveness: 'EFICAZ', status: 'ATIVO', evidenceIds: [], createdAt: now, updatedAt: now },
    { id: 'control-002', organizationId: 'org-mun-001', riskId: 'risk-001', title: 'Cotação Mínima de 3 Fornecedores', description: 'Exigência de no mínimo 3 cotações para toda contratação acima de determinado valor.', type: 'PREVENTIVO', frequency: 'DIARIO', ownerId: 'user-003', lastExecution: '2024-11-15', nextExecution: '2024-11-16', effectiveness: 'PARCIAL', status: 'ATIVO', evidenceIds: [], createdAt: now, updatedAt: now },
    { id: 'control-003', organizationId: 'org-mun-001', riskId: 'risk-002', title: 'Segregação de Funções no Sistema', description: 'Configuração do sistema para impedir que a mesma pessoa autorize e execute pagamentos.', type: 'PREVENTIVO', frequency: 'TRIMESTRAL', ownerId: 'user-001', lastExecution: '2024-10-01', nextExecution: '2025-01-01', effectiveness: 'EFICAZ', status: 'ATIVO', evidenceIds: [], createdAt: now, updatedAt: now },
  ];
  saveToStorage('controls', controls);

  const companies: Company[] = [
    { id: 'company-001', name: 'Construtora Alfa LTDA', taxId: '00.000.000/0001-01', legalName: 'Construtora Alfa LTDA', address: 'Rua das Obras, 100', city: 'Vila Nova', state: 'SP', partners: [{ id: 'p1', name: 'Pedro Silva', taxId: '000.000.000-01', role: 'Sócio-Administrador', sharePercentage: 60 }, { id: 'p2', name: 'Paula Silva', taxId: '000.000.000-02', role: 'Sócia', sharePercentage: 40 }], relatedCompanies: ['company-002'], createdAt: now, updatedAt: now },
    { id: 'company-002', name: 'Engenharia Beta S.A.', taxId: '00.000.000/0001-02', legalName: 'Engenharia Beta S.A.', address: 'Av. Central, 200', city: 'Vila Nova', state: 'SP', partners: [{ id: 'p3', name: 'Paula Silva', taxId: '000.000.000-02', role: 'Diretora', sharePercentage: 50 }], relatedCompanies: ['company-001'], createdAt: now, updatedAt: now },
    { id: 'company-003', name: 'Serviços Gama LTDA', taxId: '00.000.000/0001-03', legalName: 'Serviços Gama LTDA', address: 'Rua do Comércio, 50', city: 'Vila Nova', state: 'SP', partners: [{ id: 'p4', name: 'Gabriel Santos', taxId: '000.000.000-03', role: 'Sócio-Administrador', sharePercentage: 100 }], relatedCompanies: [], createdAt: now, updatedAt: now },
  ];
  saveToStorage('companies', companies);

  const vendors: Vendor[] = [
    { id: 'vendor-001', organizationId: 'org-mun-001', companyId: 'company-001', registrationDate: '2023-01-15', status: 'ATIVO', contractsCount: 5, totalValue: 2500000, createdAt: now, updatedAt: now },
    { id: 'vendor-002', organizationId: 'org-mun-001', companyId: 'company-002', registrationDate: '2023-06-20', status: 'ATIVO', contractsCount: 3, totalValue: 1800000, createdAt: now, updatedAt: now },
    { id: 'vendor-003', organizationId: 'org-mun-001', companyId: 'company-003', registrationDate: '2024-01-10', status: 'ATIVO', contractsCount: 1, totalValue: 350000, createdAt: now, updatedAt: now },
  ];
  saveToStorage('vendors', vendors);

  const bids: Bid[] = [
    { id: 'bid-001', organizationId: 'org-mun-001', processNumber: 'PE-001/2024', modality: 'Pregão Eletrônico', object: 'Contratação de serviços de manutenção predial', estimatedValue: 500000, status: 'HOMOLOGADA', openingDate: '2024-03-15', participants: ['vendor-001', 'vendor-003'], winnerId: 'vendor-001', winnerValue: 480000, analysisResult: { classification: 'NORMAL', factors: ['Concorrência adequada', 'Preço dentro da média'], score: 15, analyzedAt: now, requiresReview: false }, createdAt: now, updatedAt: now },
    { id: 'bid-002', organizationId: 'org-mun-001', processNumber: 'PE-002/2024', modality: 'Pregão Eletrônico', object: 'Aquisição de materiais de construção', estimatedValue: 300000, status: 'HOMOLOGADA', openingDate: '2024-05-20', participants: ['vendor-001'], winnerId: 'vendor-001', winnerValue: 295000, analysisResult: { classification: 'ATENCAO', factors: ['Baixa concorrência - apenas 1 participante', 'Vencedor recorrente'], score: 45, analyzedAt: now, requiresReview: true }, createdAt: now, updatedAt: now },
  ];
  saveToStorage('bids', bids);

  const contracts: Contract[] = [
    { id: 'contract-001', organizationId: 'org-mun-001', bidId: 'bid-001', contractNumber: 'CT-001/2024', vendorId: 'vendor-001', object: 'Manutenção predial - Secretaria de Administração', value: 480000, startDate: '2024-04-01', endDate: '2025-03-31', status: 'VIGENTE', addendums: 0, totalValue: 480000, payments: [], createdAt: now, updatedAt: now },
    { id: 'contract-002', organizationId: 'org-mun-001', bidId: 'bid-002', contractNumber: 'CT-002/2024', vendorId: 'vendor-001', object: 'Materiais de construção - diversas secretarias', value: 295000, startDate: '2024-06-01', endDate: '2024-12-31', status: 'VIGENTE', addendums: 2, totalValue: 340000, payments: [], analysisResult: { classification: 'ATENCAO', factors: ['2 aditivos em contrato recente', 'Aumento de 15% no valor'], score: 40, analyzedAt: now, requiresReview: true }, createdAt: now, updatedAt: now },
  ];
  saveToStorage('contracts', contracts);

  const complaints: Complaint[] = [
    { id: 'complaint-001', protocolNumber: 'DEN-2024-001', organizationId: 'org-mun-001', type: 'ANONIMA', category: 'FRAUDE', description: 'Denúncia anônima sobre possível direcionamento em licitação de materiais de construção.', status: 'ANALISE', relatedEntities: ['bid-002', 'vendor-001'], evidenceIds: [], createdAt: now, updatedAt: now },
  ];
  saveToStorage('complaints', complaints);

  const findings: RiskFinding[] = [
    { id: 'finding-001', organizationId: 'org-mun-001', type: 'CONCENTRACAO_FORNECEDOR', entityType: 'BID', entityId: 'bid-002', severity: 'MEDIA', confidence: 0.72, factors: ['Apenas 1 participante na licitação', 'Vencedor possui 5 contratos com o órgão', 'Valor próximo ao estimado (98.3%)'], evidenceIds: [], ruleId: 'rule-001', status: 'EM_REVISAO', createdAt: now, updatedAt: now },
    { id: 'finding-002', organizationId: 'org-mun-001', type: 'ADITIVOS_SUCESSIVOS', entityType: 'CONTRACT', entityId: 'contract-002', severity: 'MEDIA', confidence: 0.68, factors: ['2 aditivos em contrato com menos de 6 meses', 'Aumento acumulado de 15.25%'], evidenceIds: [], ruleId: 'rule-002', status: 'ATIVO', createdAt: now, updatedAt: now },
  ];
  saveToStorage('findings', findings);

  const relationships: Relationship[] = [
    { id: 'rel-001', organizationId: 'org-mun-001', sourceType: 'COMPANY', sourceId: 'company-001', targetType: 'COMPANY', targetId: 'company-002', type: 'SOCIO_COMUM', description: 'Sócia em comum: Paula Silva (CPF fictício)', strength: 0.8, createdAt: now },
    { id: 'rel-002', organizationId: 'org-mun-001', sourceType: 'COMPANY', sourceId: 'company-001', targetType: 'CONTRACT', targetId: 'contract-001', type: 'FORNECEDOR', description: 'Fornecedor do contrato CT-001/2024', strength: 1.0, createdAt: now },
    { id: 'rel-003', organizationId: 'org-mun-001', sourceType: 'COMPANY', sourceId: 'company-001', targetType: 'CONTRACT', targetId: 'contract-002', type: 'FORNECEDOR', description: 'Fornecedor do contrato CT-002/2024', strength: 1.0, createdAt: now },
  ];
  saveToStorage('relationships', relationships);

  const rules: RiskRule[] = [
    { id: 'rule-001', name: 'Concentração de Fornecedor', description: 'Detecta quando um fornecedor concentra grande volume de contratos ou vence licitações com baixa concorrência.', category: 'CONTRATAÇÕES', conditions: [{ field: 'participants_count', operator: 'LESS_THAN', value: 3 }], severity: 'MEDIA', active: true, createdAt: now, updatedAt: now },
    { id: 'rule-002', name: 'Aditivos Sucessivos', description: 'Detecta contratos com múltiplos aditivos em curto período, indicando possível fracionamento.', category: 'CONTRATOS', conditions: [{ field: 'addendums', operator: 'GREATER_THAN', value: 1 }], severity: 'MEDIA', active: true, createdAt: now, updatedAt: now },
  ];
  saveToStorage('rules', rules);
}

// ============================================================
// STORE INTERFACE
// ============================================================

interface AppState {
  // Auth state
  session: Session | null;
  currentUser: User | null;
  currentRole: Role | null;
  
  // Data
  organizations: Organization[];
  departments: Department[];
  users: User[];
  roles: Role[];
  risks: Risk[];
  controls: Control[];
  controlTests: ControlTest[];
  contracts: Contract[];
  bids: Bid[];
  vendors: Vendor[];
  companies: Company[];
  payments: Payment[];
  audits: Audit[];
  auditFindings: AuditFinding[];
  complaints: Complaint[];
  incidents: Incident[];
  evidence: Evidence[];
  actionPlans: ActionPlan[];
  findings: RiskFinding[];
  rules: RiskRule[];
  relationships: Relationship[];
  auditLogs: AuditLogEntry[];
  
  // UI state
  sidebarOpen: boolean;
  loading: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // CRUD Operations with audit logging
  addAuditLog: (action: AuditLogAction, resource: string, resourceId?: string, result?: 'SUCCESS' | 'FAILURE' | 'DENIED', context?: Record<string, unknown>) => void;
  
  // Organization-scoped data access
  getScopedData: <T extends { organizationId: string }>(data: T[]) => T[];
  
  // Risk operations
  createRisk: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score' | 'level'>) => Risk;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  
  // Control operations
  createControl: (control: Omit<Control, 'id' | 'createdAt' | 'updatedAt'>) => Control;
  
  // Complaint operations
  createComplaint: (complaint: Omit<Complaint, 'id' | 'protocolNumber' | 'createdAt' | 'updatedAt'>) => Complaint;
  
  // Action Plan operations
  createActionPlan: (plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>) => ActionPlan;
  
  // Dashboard
  getDashboardData: () => DashboardData;
}

// ============================================================
// RISK CALCULATION
// ============================================================

function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 16) return 'CRITICO';
  if (score >= 10) return 'ALTO';
  if (score >= 5) return 'MODERADO';
  return 'BAIXO';
}

function calculateRiskScore(probability: ProbabilityLevel, impact: ImpactLevel): number {
  return probability * impact;
}

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  session: null,
  currentUser: null,
  currentRole: null,
  organizations: [],
  departments: [],
  users: [],
  roles: [],
  risks: [],
  controls: [],
  controlTests: [],
  contracts: [],
  bids: [],
  vendors: [],
  companies: [],
  payments: [],
  audits: [],
  auditFindings: [],
  complaints: [],
  incidents: [],
  evidence: [],
  actionPlans: [],
  findings: [],
  rules: [],
  relationships: [],
  auditLogs: [],
  sidebarOpen: true,
  loading: false,

  initialize: async () => {
    set({ loading: true });
    
    // Seed development data
    seedData();
    
    // Hash default passwords
    const defaultHash = await hashPassword('Integra@2024');
    const users = loadFromStorage<User>('users');
    const needsUpdate = users.some(u => !u.passwordHash);
    if (needsUpdate) {
      const updatedUsers = users.map(u => ({ ...u, passwordHash: u.passwordHash || defaultHash }));
      saveToStorage('users', updatedUsers);
    }
    
    // Load all data
    set({
      organizations: loadFromStorage('organizations'),
      departments: loadFromStorage('departments'),
      users: loadFromStorage('users'),
      roles: loadFromStorage('roles'),
      risks: loadFromStorage('risks'),
      controls: loadFromStorage('controls'),
      controlTests: loadFromStorage('controlTests'),
      contracts: loadFromStorage('contracts'),
      bids: loadFromStorage('bids'),
      vendors: loadFromStorage('vendors'),
      companies: loadFromStorage('companies'),
      payments: loadFromStorage('payments'),
      audits: loadFromStorage('audits'),
      auditFindings: loadFromStorage('auditFindings'),
      complaints: loadFromStorage('complaints'),
      incidents: loadFromStorage('incidents'),
      evidence: loadFromStorage('evidence'),
      actionPlans: loadFromStorage('actionPlans'),
      findings: loadFromStorage('findings'),
      rules: loadFromStorage('rules'),
      relationships: loadFromStorage('relationships'),
      auditLogs: loadFromStorage('audit_logs'),
      loading: false,
    });

    // Restore session
    const session = getSession();
    if (session) {
      const state = get();
      const user = state.users.find(u => u.id === session.userId);
      const role = state.roles.find(r => r.id === session.roleId);
      if (user && role) {
        set({ session, currentUser: user, currentRole: role });
      }
    }
  },

  login: async (email: string, password: string) => {
    const state = get();
    
    // Rate limiting check
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      get().addAuditLog('LOGIN_FAILED', 'auth', undefined, 'DENIED', { email, reason: 'rate_limited' });
      return { success: false, error: `Conta temporariamente bloqueada. Tente novamente mais tarde.` };
    }
    
    const user = state.users.find(u => u.email === email);
    if (!user) {
      recordFailedAttempt(email);
      get().addAuditLog('LOGIN_FAILED', 'auth', undefined, 'FAILURE', { email, reason: 'user_not_found' });
      return { success: false, error: 'Credenciais inválidas.' };
    }
    
    if (!user.active) {
      get().addAuditLog('LOGIN_FAILED', 'auth', user.id, 'DENIED', { email, reason: 'user_inactive' });
      return { success: false, error: 'Conta desativada. Contate o administrador.' };
    }
    
    const valid = await verifyPassword(password, user.passwordHash);
    
    if (!valid) {
      recordFailedAttempt(email);
      const attempts = user.loginAttempts + 1;
      const users = state.users.map(u => u.id === user.id ? { ...u, loginAttempts: attempts } : u);
      set({ users });
      saveToStorage('users', users);
      get().addAuditLog('LOGIN_FAILED', 'auth', user.id, 'FAILURE', { email, reason: 'invalid_password', attempts });
      return { success: false, error: `Credenciais inválidas. Tentativas restantes: ${Math.max(0, 5 - attempts)}` };
    }
    
    const role = state.roles.find(r => r.id === user.roleId);
    if (!role) {
      return { success: false, error: 'Erro de configuração de perfil.' };
    }
    
    const session = createSession(user, role);
    
    // Update user login data
    const updatedUsers = state.users.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString(), loginAttempts: 0 } : u);
    set({ users: updatedUsers, session, currentUser: user, currentRole: role });
    saveToStorage('users', updatedUsers);
    
    resetRateLimit(email);
    get().addAuditLog('LOGIN', 'auth', user.id, 'SUCCESS', { email });
    
    return { success: true };
  },

  logout: () => {
    const state = get();
    if (state.currentUser) {
      get().addAuditLog('LOGOUT', 'auth', state.currentUser.id, 'SUCCESS');
    }
    destroySession();
    set({ session: null, currentUser: null, currentRole: null });
  },

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  addAuditLog: (action, resource, resourceId, result = 'SUCCESS', context = {}) => {
    const state = get();
    const entry: AuditLogEntry = {
      id: uuidv4(),
      userId: state.currentUser?.id || 'system',
      userName: state.currentUser?.name || 'Sistema',
      organizationId: state.session?.organizationId || state.currentUser?.organizationId || '',
      action,
      resource,
      resourceId,
      result,
      context,
      timestamp: new Date().toISOString(),
    };
    const logs = [entry, ...state.auditLogs].slice(0, 10000);
    set({ auditLogs: logs });
    saveToStorage('audit_logs', logs);
  },

  getScopedData: <T extends { organizationId: string }>(data: T[]) => {
    const session = get().session;
    if (!session) return [];
    // SUPER_ADMIN can see all data
    if (get().currentRole?.name === 'SUPER_ADMIN') return data;
    return data.filter(item => item.organizationId === session.organizationId);
  },

  createRisk: (riskData) => {
    const session = get().session;
    if (!session) throw new Error('Não autenticado');
    
    const score = calculateRiskScore(riskData.probability, riskData.impact);
    const level = calculateRiskLevel(score);
    const risk: Risk = {
      ...riskData,
      id: uuidv4(),
      score,
      level,
      organizationId: session.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const risks = [...get().risks, risk];
    set({ risks });
    saveToStorage('risks', risks);
    get().addAuditLog('DATA_CREATED', 'risk', risk.id, 'SUCCESS', { title: risk.title });
    return risk;
  },

  updateRisk: (id, updates) => {
    const risks = get().risks.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
      if (updates.probability || updates.impact) {
        updated.score = calculateRiskScore(updated.probability, updated.impact);
        updated.level = calculateRiskLevel(updated.score);
      }
      return updated;
    });
    set({ risks });
    saveToStorage('risks', risks);
    get().addAuditLog('DATA_UPDATED', 'risk', id, 'SUCCESS', { updates: Object.keys(updates) });
  },

  createControl: (controlData) => {
    const session = get().session;
    if (!session) throw new Error('Não autenticado');
    
    const control: Control = {
      ...controlData,
      id: uuidv4(),
      organizationId: session.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const controls = [...get().controls, control];
    set({ controls });
    saveToStorage('controls', controls);
    get().addAuditLog('DATA_CREATED', 'control', control.id, 'SUCCESS', { title: control.title });
    return control;
  },

  createComplaint: (complaintData) => {
    const session = get().session;
    if (!session) throw new Error('Não autenticado');
    
    const protocolNumber = `DEN-${new Date().getFullYear()}-${String(get().complaints.length + 1).padStart(3, '0')}`;
    const complaint: Complaint = {
      ...complaintData,
      id: uuidv4(),
      protocolNumber,
      organizationId: session.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const complaints = [...get().complaints, complaint];
    set({ complaints });
    saveToStorage('complaints', complaints);
    get().addAuditLog('CASE_CREATED', 'complaint', complaint.id, 'SUCCESS', { protocol: protocolNumber });
    return complaint;
  },

  createActionPlan: (planData) => {
    const session = get().session;
    if (!session) throw new Error('Não autenticado');
    
    const plan: ActionPlan = {
      ...planData,
      id: uuidv4(),
      organizationId: session.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const plans = [...get().actionPlans, plan];
    set({ actionPlans: plans });
    saveToStorage('actionPlans', plans);
    get().addAuditLog('DATA_CREATED', 'action_plan', plan.id, 'SUCCESS', { title: plan.title });
    return plan;
  },

  getDashboardData: () => {
    const state = get();
    const isSuperAdmin = state.currentRole?.name === 'SUPER_ADMIN';
    const orgId = state.session?.organizationId;
    const scopedRisks = isSuperAdmin ? state.risks : state.risks.filter(r => r.organizationId === orgId);
    const scopedContracts = isSuperAdmin ? state.contracts : state.contracts.filter(c => c.organizationId === orgId);
    const scopedBids = isSuperAdmin ? state.bids : state.bids.filter(b => b.organizationId === orgId);
    const scopedFindings = isSuperAdmin ? state.findings : state.findings.filter(f => f.organizationId === orgId);
    const scopedComplaints = isSuperAdmin ? state.complaints : state.complaints.filter(c => c.organizationId === orgId);
    const scopedControls = isSuperAdmin ? state.controls : state.controls.filter(c => c.organizationId === orgId);
    const scopedIncidents = isSuperAdmin ? state.incidents : state.incidents.filter(i => i.organizationId === orgId);
    const scopedPlans = isSuperAdmin ? state.actionPlans : state.actionPlans.filter(p => p.organizationId === orgId);

    const risksByLevel: Record<RiskLevel, number> = { BAIXO: 0, MODERADO: 0, ALTO: 0, CRITICO: 0 };
    scopedRisks.forEach(r => { risksByLevel[r.level]++; });

    const controlsByEffectiveness: Record<string, number> = { EFICAZ: 0, PARCIAL: 0, INEFICAZ: 0, NAO_AVALIADO: 0 };
    scopedControls.forEach(c => { controlsByEffectiveness[c.effectiveness]++; });

    const contractsByStatus: Record<string, number> = {};
    scopedContracts.forEach(c => { contractsByStatus[c.status] = (contractsByStatus[c.status] || 0) + 1; });

    const bidsByAnalysis: Record<string, number> = {};
    scopedBids.forEach(b => { if (b.analysisResult) bidsByAnalysis[b.analysisResult.classification] = (bidsByAnalysis[b.analysisResult.classification] || 0) + 1; });

    const findingsBySeverity: Record<string, number> = {};
    scopedFindings.forEach(f => { findingsBySeverity[f.severity] = (findingsBySeverity[f.severity] || 0) + 1; });

    const complaintsByStatus: Record<string, number> = {};
    scopedComplaints.forEach(c => { complaintsByStatus[c.status] = (complaintsByStatus[c.status] || 0) + 1; });

    const incidentsByCategory: Record<string, number> = {};
    scopedIncidents.forEach(i => { incidentsByCategory[i.category] = (incidentsByCategory[i.category] || 0) + 1; });

    const now = new Date();
    const overduePlans = scopedPlans.filter(p => p.status !== 'CONCLUIDA' && p.status !== 'CANCELADA' && new Date(p.dueDate) < now).length;

    return {
      totalRisks: scopedRisks.length,
      risksByLevel,
      totalControls: scopedControls.length,
      controlsByEffectiveness,
      totalContracts: scopedContracts.length,
      contractsByStatus,
      totalBids: scopedBids.length,
      bidsByAnalysis,
      totalFindings: scopedFindings.length,
      findingsBySeverity,
      totalComplaints: scopedComplaints.length,
      complaintsByStatus,
      totalIncidents: scopedIncidents.length,
      incidentsByCategory,
      totalActionPlans: scopedPlans.length,
      overdueActionPlans: overduePlans,
      recentAuditLogs: state.auditLogs.slice(0, 20),
    };
  },
}));
