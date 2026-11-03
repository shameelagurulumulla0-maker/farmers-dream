# Farmers Dream (FD)

Project display name: **Farmers Dream**. Public repository: `farmers-dream`.

Status: setup and discovery. Requirements, actors, features, data model and technology stack are undefined. No application is implemented. License selection is pending.

## Deployment hold
Cloudflare is intended; connection is not yet verified. No deployment, preview deployment, public application URL, custom domain, deploy hook or push-triggered build is authorized until the owner separately approves deployment. Documentation completion never authorizes release.

## Phase-by-phase diagram deliverables

| Phase | Deliverables and gate |
|---|---|
| 0 Setup | Project identity, repository, documentation plan, deployment hold and blocker register; verify setup evidence |
| 1 Discovery | Problem, stakeholders, actors, MVP scope, requirements FD-REQ-###, business rules and assumptions; owner reviews scope |
| 2 Design | Workflows, data, service boundaries, interfaces, exceptions; owner reviews design baseline |
| 3 Implementation | Each increment updates affected diagrams alongside code and links requirements and tests |
| 4 Validation | Verify diagrams against implemented behavior; acceptance cases and decision-rule test matrix |
| 5 Release readiness | Versioned as-built set, operational and rollback views; separate deployment approval required |
| 6 Maintenance | Update impacted diagrams per change; record incidents and review drift |

| Diagram family | Discovery | Design | Build and validation | Release and maintenance |
|---|---|---|---|---|
| Flowcharts (FD-FLOW) | Current/proposed core workflows | Decisions, errors and alternatives | Align with code and tests | As-built workflows |
| Use case (FD-UC) | Actors, goals, boundary | Relationships, pre/postconditions | Trace to requirements and acceptance | Supported roles and scope |
| Sequence (FD-SEQ) | Priority interactions | Happy/failure paths, timeouts, retries | Match interfaces, transactions and async behavior | As-built integration/recovery |
| Activity (FD-ACT) | Activities and responsibility lanes | Branches, concurrency, exceptions | Validate handoffs and state transitions | Operations/support activities |
| ERD (FD-ERD) | Conceptual entities | Keys, cardinality, optionality, constraints | Match migrations and data tests | Schema and migration history |
| Class (FD-CLS) | Domain concepts | Responsibilities, associations, interfaces | Match classes or domain/type structures; explain non-OO mapping | As-built structures |
| C4 architecture (FD-C4) | L1 context | L2 containers, L3 components for complex areas; L4 where useful | Verify interfaces, trust boundaries, data flows | As-built architecture and deployment/rollback design |
| Cause-effect (FD-CE) | Conditions and expected outcomes | Boolean conditions, constraints, decision tables | Derive decision-rule tests; distinguish incident hypotheses | Maintain rule graphs and verified incident causes |

## Documentation contract
- Store each phase under `docs/phases/phase-NN/`; index all eight families as updated, reviewed unchanged or not applicable with a reason.
- Deliver editable source plus SVG or PDF and accessible explanation. PlantUML for UML diagrams; Mermaid for flowcharts, ERDs and cause-effect graphs; consistent C4 notation in PlantUML or Structurizr. Record rendering tool/version.
- Name diagrams `FD-<family>-<number>-<topic>`. Include phase, revision, status (draft/reviewed/approved/superseded), author, reviewer, date, legend, assumptions and requirement/test links.
- Gate each phase on readable exports, cross-diagram consistency, unresolved questions and owner review. Review remains pending until a reviewer is assigned. Keep approved baselines versioned.
- Actual product diagrams are pending requirements. Do not invent actors, entities or workflows to fill the checklist.

## Next decisions
Define the problem, users/roles, top three workflows, MVP boundary, geography/languages, data handling, integrations, nonfunctional needs, budget and reviewers before selecting the stack.
