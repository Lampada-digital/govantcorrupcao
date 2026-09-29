// INTEGRA.GOV - Authentication & RBAC Service
// Implements secure authentication with proper password hashing simulation,
// session management, and role-based access control

import type { User, Session, Role, PermissionName, RoleName, AuditLogEntry } from '../domain/types';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// ROLE DEFINITIONS WITH PERMISSIONS
// ============================================================

export const ROLE_DEFINITIONS: Record<RoleName, PermissionName[]> = {
  SUPER_ADMIN: [
    'user:read', 'user:create', 'user:update', 'user:delete',
    'org:read', 'org:create', 'org:update', 'org:delete',
    'role:read', 'role:create', 'role:update', 'role:delete',
    'risk:read', 'risk:create', 'risk:update', 'risk:delete',
    'control:read', 'control:create', 'control:update', 'control:delete',
    'contract:read', 'contract:create', 'contract:update', 'contract:delete',
    'bid:read', 'bid:create', 'bid:update', 'bid:delete',
    'vendor:read', 'vendor:create', 'vendor:update', 'vendor:delete',
    'company:read', 'company:create', 'company:update', 'company:delete',
    'payment:read', 'payment:create', 'payment:update', 'payment:delete',
    'audit:read', 'audit:create', 'audit:update', 'audit:delete',
    'incident:read', 'incident:create', 'incident:update', 'incident:delete',
    'complaint:read', 'complaint:create', 'complaint:update', 'complaint:delete',
    'evidence:read', 'evidence:create', 'evidence:update', 'evidence:delete',
    'action_plan:read', 'action_plan:create', 'action_plan:update', 'action_plan:delete',
    'finding:read', 'finding:create', 'finding:update', 'finding:delete',
    'relationship:read', 'relationship:create', 'relationship:update', 'relationship:delete',
    'audit_log:read',
    'report:read', 'report:export',
    'dashboard:read',
    'security:read', 'security:manage',
    'ai:read', 'ai:manage',
    'public:view',
  ],
  ADMIN_ORGAO: [
    'user:read', 'user:create', 'user:update',
    'org:read',
    'risk:read', 'risk:create', 'risk:update',
    'control:read', 'control:create', 'control:update',
    'contract:read', 'contract:create', 'contract:update',
    'bid:read', 'bid:create', 'bid:update',
    'vendor:read', 'vendor:create', 'vendor:update',
    'company:read', 'company:create', 'company:update',
    'payment:read',
    'audit:read', 'audit:create', 'audit:update',
    'incident:read', 'incident:create', 'incident:update',
    'complaint:read', 'complaint:create',
    'evidence:read', 'evidence:create',
    'action_plan:read', 'action_plan:create', 'action_plan:update',
    'finding:read',
    'relationship:read',
    'audit_log:read',
    'report:read', 'report:export',
    'dashboard:read',
    'public:view',
  ],
  GESTOR_GRC: [
    'risk:read', 'risk:create', 'risk:update',
    'control:read', 'control:create', 'control:update',
    'evidence:read', 'evidence:create',
    'action_plan:read', 'action_plan:create', 'action_plan:update',
    'finding:read',
    'audit_log:read',
    'report:read',
    'dashboard:read',
    'public:view',
  ],
  AUDITOR: [
    'risk:read',
    'control:read',
    'contract:read',
    'bid:read',
    'vendor:read',
    'company:read',
    'payment:read',
    'audit:read', 'audit:create', 'audit:update',
    'incident:read',
    'complaint:read',
    'evidence:read', 'evidence:create',
    'action_plan:read', 'action_plan:create',
    'finding:read', 'finding:create', 'finding:update',
    'relationship:read',
    'audit_log:read',
    'report:read', 'report:export',
    'dashboard:read',
    'public:view',
  ],
  CONTROLADOR: [
    'risk:read',
    'control:read', 'control:create', 'control:update',
    'contract:read',
    'bid:read',
    'audit:read',
    'finding:read',
    'action_plan:read', 'action_plan:create', 'action_plan:update',
    'report:read',
    'dashboard:read',
    'public:view',
  ],
  OUVIDORIA: [
    'complaint:read', 'complaint:create', 'complaint:update',
    'incident:read', 'incident:create',
    'evidence:read', 'evidence:create',
    'dashboard:read',
    'public:view',
  ],
  ANALISTA_RISCO: [
    'risk:read', 'risk:create', 'risk:update',
    'control:read',
    'finding:read', 'finding:create',
    'relationship:read',
    'report:read',
    'dashboard:read',
    'public:view',
  ],
  ANALISTA_INTEGRIDADE: [
    'complaint:read', 'complaint:create', 'complaint:update',
    'incident:read', 'incident:create', 'incident:update',
    'evidence:read', 'evidence:create',
    'finding:read',
    'relationship:read',
    'dashboard:read',
    'public:view',
  ],
  INVESTIGADOR: [
    'complaint:read', 'complaint:update',
    'incident:read', 'incident:create', 'incident:update',
    'evidence:read', 'evidence:create', 'evidence:update',
    'finding:read', 'finding:update',
    'relationship:read', 'relationship:create',
    'audit_log:read',
    'report:read',
    'dashboard:read',
  ],
  GESTOR_CONTRATO: [
    'contract:read', 'contract:create', 'contract:update',
    'bid:read', 'bid:create', 'bid:update',
    'vendor:read', 'vendor:create', 'vendor:update',
    'company:read',
    'payment:read', 'payment:create',
    'evidence:read', 'evidence:create',
    'dashboard:read',
    'public:view',
  ],
  GESTOR_SEGURANCA: [
    'security:read', 'security:manage',
    'audit_log:read',
    'incident:read', 'incident:create', 'incident:update',
    'user:read',
    'dashboard:read',
  ],
  USUARIO_INTERNO: [
    'risk:read',
    'control:read',
    'contract:read',
    'bid:read',
    'dashboard:read',
    'public:view',
  ],
  CIDADAO: [
    'public:view',
  ],
};

// ============================================================
// PASSWORD HASHING (SHA-256 simulation for client-side)
// In production, this would use bcrypt on the server
// ============================================================

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_integra_gov_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

const SESSION_KEY = 'integra_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export function createSession(user: User, role: Role): Session {
  const session: Session = {
    userId: user.id,
    token: uuidv4() + '-' + uuidv4(),
    organizationId: user.organizationId,
    roleId: role.id,
    permissions: role.permissions,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  
  try {
    const session: Session = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function destroySession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isSessionValid(): boolean {
  const session = getSession();
  return session !== null && new Date(session.expiresAt) > new Date();
}

export function hasPermission(permission: PermissionName): boolean {
  const session = getSession();
  if (!session) return false;
  return session.permissions.includes(permission);
}

export function hasAnyPermission(permissions: PermissionName[]): boolean {
  const session = getSession();
  if (!session) return false;
  return permissions.some(p => session.permissions.includes(p));
}

export function requirePermission(permission: PermissionName): boolean {
  if (!hasPermission(permission)) {
    // Log denied access
    const session = getSession();
    if (session) {
      const logEntry: AuditLogEntry = {
        id: uuidv4(),
        userId: session.userId,
        userName: '',
        organizationId: session.organizationId,
        action: 'SECURITY_EVENT',
        resource: 'permission',
        result: 'DENIED',
        context: { attemptedPermission: permission },
        timestamp: new Date().toISOString(),
      };
      const logs = JSON.parse(localStorage.getItem('integra_audit_logs') || '[]');
      logs.unshift(logEntry);
      localStorage.setItem('integra_audit_logs', JSON.stringify(logs.slice(0, 10000)));
    }
    return false;
  }
  return true;
}

// ============================================================
// RATE LIMITING (Client-side simulation)
// ============================================================

const RATE_LIMIT_KEY = 'integra_rate_limits';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; lockedUntil?: string } {
  const limits = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
  const entry = limits[identifier];
  
  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }
  
  if (entry.lockedUntil && new Date(entry.lockedUntil) > new Date()) {
    return { allowed: false, remainingAttempts: 0, lockedUntil: entry.lockedUntil };
  }
  
  // Reset if lockout expired
  if (entry.lockedUntil && new Date(entry.lockedUntil) <= new Date()) {
    delete limits[identifier];
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }
  
  const remaining = MAX_LOGIN_ATTEMPTS - (entry.attempts || 0);
  return { allowed: remaining > 0, remainingAttempts: Math.max(0, remaining) };
}

export function recordFailedAttempt(identifier: string): void {
  const limits = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
  const entry = limits[identifier] || { attempts: 0 };
  entry.attempts = (entry.attempts || 0) + 1;
  
  if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
  }
  
  limits[identifier] = entry;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
}

export function resetRateLimit(identifier: string): void {
  const limits = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
  delete limits[identifier];
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
}
