# INTEGRA.GOV — Threat Model

## Methodology

This threat model identifies potential threats to the INTEGRA.GOV platform, their impact, probability, and mitigation strategies.

---

## Threat 1: Unauthorized Access

| Attribute | Value |
|-----------|-------|
| **Asset** | All system data, user sessions |
| **Threat** | Attacker gains access without valid credentials |
| **Impact** | HIGH — Data breach, manipulation |
| **Probability** | MEDIUM |
| **Mitigation** | Strong password hashing, rate limiting, account lockout, MFA (planned) |
| **Control** | Authentication service, session management |
| **Test** | Login brute force test, session expiry test |

---

## Threat 2: Insider Threat

| Attribute | Value |
|-----------|-------|
| **Asset** | Sensitive data, audit findings, investigations |
| **Threat** | Authorized user misuses access privileges |
| **Impact** | HIGH — Data manipulation, evidence tampering |
| **Probability** | MEDIUM |
| **Mitigation** | RBAC, immutable audit logs, segregation of duties, monitoring |
| **Control** | Audit logging, permission checks, activity monitoring |
| **Test** | Attempt to access restricted data, modify audit logs |

---

## Threat 3: Data Leakage

| Attribute | Value |
|-----------|-------|
| **Asset** | Investigation data, personal data, evidence |
| **Threat** | Sensitive data exposed through public portal or API |
| **Impact** | CRITICAL — Legal, reputational damage |
| **Probability** | LOW |
| **Mitigation** | Data classification, access control, public portal isolation |
| **Control** | Data classification system, scoped queries |
| **Test** | Verify public portal never exposes restricted data |

---

## Threat 4: Evidence Manipulation

| Attribute | Value |
|-----------|-------|
| **Asset** | Audit evidence, documents, findings |
| **Threat** | Evidence altered or deleted to cover irregularities |
| **Impact** | CRITICAL — Undermines entire audit process |
| **Probability** | LOW |
| **Mitigation** | Immutable audit logs, file hashing, version control |
| **Control** | Evidence management with hash verification |
| **Test** | Attempt to modify/delete evidence records |

---

## Threat 5: Cross-Tenant Data Access (IDOR)

| Attribute | Value |
|-----------|-------|
| **Asset** | Organization-specific data |
| **Threat** | Organization A accesses Organization B's data |
| **Impact** | HIGH — Data breach between government entities |
| **Probability** | MEDIUM |
| **Mitigation** | Organization scope validation on every query |
| **Control** | getScopedData() in repository layer |
| **Test** | User from Org A attempts to read Org B's risks/contracts |

---

## Threat 6: Privilege Escalation

| Attribute | Value |
|-----------|-------|
| **Asset** | System functions, administrative capabilities |
| **Threat** | User gains permissions beyond their role |
| **Impact** | HIGH — Unauthorized actions |
| **Probability** | LOW |
| **Mitigation** | Permission check on every action, no client-side-only auth |
| **Control** | hasPermission() checks, RBAC enforcement |
| **Test** | Regular user attempts admin actions |

---

## Threat 7: API Attack

| Attribute | Value |
|-----------|-------|
| **Asset** | API endpoints, data |
| **Threat** | SQL injection, mass assignment, parameter tampering |
| **Impact** | HIGH — Data breach, manipulation |
| **Probability** | MEDIUM |
| **Mitigation** | Input validation, parameterized queries, type checking |
| **Control** | Zod validation, TypeScript types, Prisma ORM |
| **Test** | Injection attempts on all endpoints |

---

## Threat 8: AI/LLM Abuse

| Attribute | Value |
|-----------|-------|
| **Asset** | AI responses, analysis results |
| **Threat** | Prompt injection, data poisoning, hallucination |
| **Impact** | MEDIUM — False findings, misinformation |
| **Probability** | MEDIUM |
| **Mitigation** | AI never invents data, all responses cite sources, human review required |
| **Control** | Source attribution, confidence scores, human review workflow |
| **Test** | Prompt injection attempts, verify AI cites only available data |

---

## Threat 9: Dependency Compromise

| Attribute | Value |
|-----------|-------|
| **Asset** | Application integrity |
| **Threat** | Malicious package in dependency chain |
| **Impact** | CRITICAL — Full system compromise |
| **Probability** | LOW |
| **Mitigation** | Dependency audit, lockfile, minimal dependencies |
| **Control** | npm audit, regular dependency review |
| **Test** | npm audit, dependency scan |

---

## Threat 10: Data Exfiltration

| Attribute | Value |
|-----------|-------|
| **Asset** | All system data |
| **Threat** | Bulk data export by unauthorized user |
| **Impact** | CRITICAL — Mass data breach |
| **Probability** | LOW |
| **Mitigation** | Export permissions, rate limiting, audit logging |
| **Control** | report:export permission, export audit logging |
| **Test** | Attempt export without permission |

---

## Risk Matrix Summary

| Threat | Impact | Probability | Risk Level |
|--------|--------|-------------|------------|
| Unauthorized Access | HIGH | MEDIUM | HIGH |
| Insider Threat | HIGH | MEDIUM | HIGH |
| Data Leakage | CRITICAL | LOW | MEDIUM |
| Evidence Manipulation | CRITICAL | LOW | MEDIUM |
| Cross-Tenant Access | HIGH | MEDIUM | HIGH |
| Privilege Escalation | HIGH | LOW | MEDIUM |
| API Attack | HIGH | MEDIUM | HIGH |
| AI/LLM Abuse | MEDIUM | MEDIUM | MEDIUM |
| Dependency Compromise | CRITICAL | LOW | MEDIUM |
| Data Exfiltration | CRITICAL | LOW | MEDIUM |
