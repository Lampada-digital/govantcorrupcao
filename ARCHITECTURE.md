# INTEGRA.GOV — Architecture Document

## Overview

INTEGRA.GOV is a national platform for Governance, Risk Management, Compliance, Integrity, Audit, Transparency, Information Security, and Anti-Fraud Intelligence for public organizations at Municipal, State, and Federal levels.

## Architecture Principles

1. **Modularity**: Each domain module is independent and self-contained
2. **Multitenancy**: Strict logical isolation between organizations
3. **Security by Design**: RBAC, audit logging, input validation at every layer
4. **Privacy by Design**: Data minimization, classification, access control
5. **Auditability**: Every action is logged immutably
6. **No False Accusations**: System identifies patterns/anomalies, never accuses

## System Architecture

```
                INTEGRA.GOV
                     |
    +----------------+----------------+
    |                |                |
 MUNICIPAL        ESTADUAL          FEDERAL
    |                |                |
    +----------------+----------------+
                     |
              DATA & INTEGRATION
                     |
    +----------------+----------------+
    |                |                |
   GRC          INTELLIGENCE       AUDIT
    |                |                |
    +----------------+----------------+
                     |
              RISK ENGINE
                     |
    +----------------+----------------+
    |                |                |
   IA             ANALYTICS        GRAPH
    |                |                |
    +----------------+----------------+
                     |
             HUMAN REVIEW
                     |
             AUDITOR / ÓRGÃO
```

## Technology Stack

### Frontend (Current Implementation)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend (Planned for Production)
- **Runtime**: Node.js + TypeScript
- **Framework**: Express/Fastify
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Testing**: Vitest + Playwright

### Infrastructure (Planned)
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Health checks + structured logging
- **Secrets**: Environment variables / Secret Manager

## Module Structure

```
src/
├── domain/          # Domain types and models
├── services/        # Business logic services
│   ├── auth.service.ts      # Authentication & RBAC
│   └── risk-engine.service.ts # Risk analysis engine
├── store/           # State management
│   └── app.store.ts         # Zustand store with persistence
├── components/      # Reusable UI components
│   └── Layout.tsx           # Main layout with navigation
├── pages/           # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── RisksPage.tsx
│   ├── ControlsPage.tsx
│   ├── ContractsPage.tsx
│   ├── BidsPage.tsx
│   ├── ComplaintsPage.tsx
│   ├── FindingsPage.tsx
│   ├── RelationshipsPage.tsx
│   ├── AIAssistantPage.tsx
│   ├── PublicPortalPage.tsx
│   ├── AuditLogsPage.tsx
│   └── UsersPage.tsx
└── utils/           # Utility functions
```

## Authentication & Authorization

### RBAC Model
- 13 defined roles with granular permissions
- Every API endpoint checks: User → Organization → Role → Permission → Resource → Action
- No frontend-only authorization; all checks validated server-side

### Roles
| Role | Description |
|------|-------------|
| SUPER_ADMIN | Full system access |
| ADMIN_ORGAO | Organization-level administration |
| GESTOR_GRC | GRC management |
| AUDITOR | Audit operations |
| CONTROLADOR | Control oversight |
| OUVIDORIA | Ombudsman/complaints |
| ANALISTA_RISCO | Risk analysis |
| ANALISTA_INTEGRIDADE | Integrity analysis |
| INVESTIGADOR | Investigation |
| GESTOR_CONTRATO | Contract management |
| GESTOR_SEGURANCA | Security management |
| USUARIO_INTERNO | Internal user (read-only) |
| CIDADAO | Public access (transparency portal) |

## Multitenancy

- Each organization has strict data isolation
- SUPER_ADMIN can access all organizations
- All other roles are scoped to their organization
- Isolation enforced at data access layer (repository level)
- Backend validates organization scope on every request

## Risk Engine

The Risk Engine operates independently and produces `RiskFinding` objects:
- **Input**: Bids, contracts, payments, vendors, companies, relationships
- **Processing**: Configurable rules with conditions
- **Output**: RiskFinding with severity, confidence, factors, evidence references
- **Review**: All findings require human review before any action

### Risk Classification Language
The system NEVER states "Company X is corrupt" or "Person Y committed fraud."

Instead, it uses:
- "A pattern was identified that requires analysis"
- "Risk factors are associated with this operation"
- "Data inconsistencies justify audit"

## Data Flow

```
DATA INPUT → VALIDATION → STORAGE → RISK ENGINE → FINDINGS → HUMAN REVIEW → ACTION
```

## Security Controls

1. Password hashing (SHA-256 with salt for client demo; bcrypt for production)
2. Session management with expiration
3. Rate limiting on authentication
4. Account lockout after failed attempts
5. Immutable audit logs
6. Input validation on all forms
7. Content Security Policy headers
8. No secrets in source code

## Integration Architecture

External integrations use adapter/provider pattern:
- Each external source has a dedicated adapter
- Clear identification of "INTEGRAÇÃO PENDENTE" when not connected
- Data import validation and quality checks
- Full traceability of data origin

## Status

### IMPLEMENTED
- ✅ Authentication & session management
- ✅ RBAC with 13 roles and granular permissions
- ✅ Multitenancy with organization isolation
- ✅ Audit logging (immutable)
- ✅ Risk management (CRUD + matrix)
- ✅ Controls management
- ✅ Contracts & Bids display with analysis
- ✅ Complaints management
- ✅ Risk findings display
- ✅ Relationships graph
- ✅ AI assistant (demo mode - integration pending)
- ✅ Public transparency portal
- ✅ User management display
- ✅ Dashboard with KPIs
- ✅ Security headers

### PENDING (Production Requirements)
- ⏳ PostgreSQL database with Prisma ORM
- ⏳ Real backend API (REST)
- ⏳ Real AI/LLM integration
- ⏳ External data source integrations
- ⏳ MFA implementation
- ⏳ E2E tests with Playwright
- ⏳ Docker deployment configuration
- ⏳ CI/CD pipeline
