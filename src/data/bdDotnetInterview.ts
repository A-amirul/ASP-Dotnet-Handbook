export const bdDotnetInterviewData = {
  id: 'bdinterview',
  title: 'Bangladesh .NET Interview — Scenarios & Mock Rounds',
  description:
    'BD company interview scenarios only (Brain Station 23, TigerIT, Cefalo, NEXT IT, REVE, BJIT): production incidents, HRM/ERP system design, mock behavioral rounds. Theory lives in C#, Database, and Problem Solving modules — no duplicate Q&A here.',
  chapterNumber: 32,
  sections: [
    {
      id: 'bd-learning-path',
      topic: 'Study Order — Where to Learn Each Topic (No Duplicates)',
      difficulty: 'junior',
      english:
        'This module is scenarios and mock interviews only. Learn theory in the grouped modules below — in order — before practicing here.',
      bangla:
        'এই module-এ শুধু scenario ও mock interview। theory নিচের module-গুলোতে serial order-এ পড়ুন — duplicate নেই।',
      details: `
### Recommended path (follow sidebar order)

| Phase | Modules | What you learn |
| :--- | :--- | :--- |
| **1 — C#** | Basics → C# & OOP → LINQ → Async → .NET 10 | Class, polymorphism, IQueryable, Task, GC |
| **2 — Web** | ASP.NET → MVC → DI → Web API → API Docs | Middleware, REST, lifetimes, JWT pipeline |
| **3 — Database** | EF Core → SQL Server | AsNoTracking, N+1, index, CTE, deadlock |
| **4 — Architecture** | Architecture → Patterns | Clean Architecture, SOLID, Repository, CQRS |
| **5 — Production & DevOps** | Security → Caching → Messaging → Jobs → Distributed → Testing → Observability → Logging → Performance → **DevOps** | Redis, RabbitMQ, Docker, CI/CD |
| **6 — Coding** | **Problem Solving** → **Algorithms** → **C# DSA & .NET Tasks** | UMPIRE, Big-O, Dictionary/Stack, LINQ live coding |
| **7 — Interview** | **This module** → Real-world Tasks → Scenarios → System Design → Question Bank → Traps → Revision | BD scenarios, mock rounds, production stories |

### Do not repeat these topics here
- C# OOP / IEnumerable vs IQueryable → **/csharp** and **/linq**
- Middleware / DI lifetimes → **/aspnet** and **/di**
- AsNoTracking / lazy vs eager → **/database**
- Index / SARGable / EXISTS vs IN → **/sql**
- SOLID / Clean Architecture → **/patterns** and **/architecture**
- Redis / RabbitMQ / Kafka → **/caching** and **/messaging**
- LINQ live coding (duplicate email, top salary) → **/csharpproblems**
      `,
      interviewQs: [
        {
          q: 'Which module should I read for Any() vs Count()?',
          a: 'Read LINQ module for deferred execution, then Question Bank section "C#, OOP, LINQ, Async" for Any vs Count and First vs Single. Practice ERP-style LINQ in C# DSA module tasks 21–30.',
          bangla: 'LINQ module → Question Bank → C# DSA tasks 21–30।',
          difficulty: 'junior',
        },
      ],
      practice: 'Follow sidebar top to bottom once before using this scenario module.',
    },
    {
      id: 'bd-scenarios-production',
      topic: 'Production Scenarios 1–20 (Slow API, Deadlock, Payroll, Redis, RabbitMQ)',
      difficulty: 'mid',
      english:
        'Real BD company scenarios. Show step-by-step investigation — never guess. For SQL/EF details see Database and SQL modules.',
      bangla:
        'BD company scenario — step-by-step investigation। SQL/EF theory **/database** ও **/sql**-এ আছে।',
      details: `
### Scenario 1: Slow Employee List API (30 seconds)
SET STATISTICS IO/TIME ON → Execution Plan → avoid SELECT * → AsNoTracking() → Pagination (50) → Redis cache.

**Answer:** "Identify bottleneck (DB/API/network), review execution plan, add indexes, avoid SELECT *, pagination, AsNoTracking(), cache hot reads in Redis."

### Scenario 2: Deadlock — Salary Process Hangs
Same table access order, short transactions, indexes, Polly retry.

### Scenario 3: 1 Lakh Employees Payroll (40 min)
Batch 1000 → commit → next batch + background job + RabbitMQ.

### Scenario 4: Duplicate Employee
UNIQUE(EmployeeCode) + AnyAsync() + RowVersion optimistic concurrency.

### Scenario 5–10
| # | Topic | Key fix |
| :--- | :--- | :--- |
| 5 | Redis down | SQL fallback, no crash |
| 6 | RabbitMQ down | Retry, DLQ, persistent queue |
| 7 | YEAR(Date)=2026 slow | SARGable date range |
| 8 | 1000 login/sec | JWT, Redis, pool, rate limit |
| 9 | Memory leak | IDisposable, profiler |
| 10 | 10k PDFs | Queue + worker, not controller |

### Scenarios 11–20
| # | Problem | Answer focus |
| :--- | :--- | :--- |
| 11 | API 500 | Serilog, middleware, stack trace |
| 12 | SQL 2s→30s | Parameter sniffing, stats, index |
| 13 | CPU 100% | Loop, LINQ, bad SQL |
| 14 | EF slow | Where().ToList() not ToList().Where() |
| 15 | N+1 | Include or projection |
| 16 | SQL timeout | Index, lock, plan |
| 17 | MQ duplicate | Idempotency MessageId |
| 18 | Security | JWT, HTTPS, rate limit |
| 19 | Job failed | Retry, DLQ, alert |
| 20 | Prod bug | Log → reproduce → fix → deploy → monitor |
      `,
      interviewQs: [
        {
          q: 'Employee List API takes 30 seconds. How do you optimize?',
          a: 'Never guess. Measure: STATISTICS IO/TIME and execution plan. Fix scans with indexes, SELECT only needed columns, AsNoTracking() for reads, pagination, Redis for hot lists. Verify before/after duration.',
          bangla: 'Plan → index → columns → AsNoTracking → page → Redis → verify।',
          difficulty: 'mid',
        },
        {
          q: 'Redis suddenly down — what happens?',
          a: 'Application must not crash. Cache-aside with fallback: try Redis, on failure read SQL, optionally repopulate cache when Redis returns.',
          bangla: 'Crash নয় — SQL fallback।',
          difficulty: 'mid',
        },
        {
          q: 'WHERE YEAR(Date)=2026 is slow — why?',
          a: 'Function on column blocks index seek (non-SARGable). Use Date >= start AND Date < end. See SQL module for full SARGable guide.',
          bangla: 'Column-এ function → index miss → date range use করুন।',
          difficulty: 'mid',
        },
      ],
      practice: 'Scenario 1: speak 6 steps in 90 seconds without reading.',
    },
    {
      id: 'bd-scenarios-system-design',
      topic: 'Senior Scenarios 21–40 & ERP System Design',
      difficulty: 'senior',
      english:
        'Concurrency, cache stampede, saga, HRM/attendance at scale. Architecture details in Architecture, Distributed, and System Design modules.',
      bangla:
        'Senior scenario + ERP design। Architecture theory **/architecture**, **/distributed**, **/systemdesign**-এ।',
      details: `
### Key senior scenarios
- **21:** 1000 salary jobs → RabbitMQ + workers, API returns JobId
- **22:** RowVersion optimistic concurrency
- **23:** SQL down → health check, Polly, circuit breaker, Redis read
- **33:** Cache stampede → lock + single rebuild
- **34:** Saga — no 2PC across HTTP

### Design: 5000 punches/minute
Machine → LB → API → Kafka → Attendance/Payroll/Notification consumers → SQL + Redis

### Design: Leave approval
Apply → validate → SQL tx → manager approval → RabbitMQ (email) → audit → cache invalidate

### CTO: 1 crore employee HRM
Gateway → microservices → Kafka → SQL (primary + replica) → Redis cluster → observability stack
      `,
      interviewQs: [
        {
          q: 'Design leave approval for HRM.',
          a: 'Validate input, SQL transaction for leave record, manager workflow, RabbitMQ for async email/audit, invalidate Redis leave balance cache, correlation ID in logs.',
          bangla: 'Validate → tx → approval → queue → cache invalidate।',
          difficulty: 'senior',
        },
        {
          q: '5000 attendance punches per minute?',
          a: 'Fast API accept + enqueue Kafka. Independent consumers for storage, payroll, notifications. Scale consumers. Read replica for reports.',
          bangla: 'API enqueue → Kafka consumers scale → replica for reports।',
          difficulty: 'senior',
        },
        {
          q: 'If CTO: attendance for 1 crore employees?',
          a: 'Ingestion API → Kafka (never sync insert per punch in request) → partitioned storage → read replicas → Redis dashboard cache → horizontal scale. See System Design module for full NFR discussion.',
          bangla: 'Kafka ingest → async → shard/replica → scale horizontally।',
          difficulty: 'senior',
        },
      ],
      practice: 'Draw HRM architecture in 2 minutes on paper.',
    },
    {
      id: 'bd-mock-interview',
      topic: 'Mock Interview Rounds (Behavioral + Senior Traps)',
      difficulty: 'mid',
      english:
        'Tell me about yourself, project stories, HR questions, and senior traps (repository, DbContext, request pipeline). Theory answers are in Question Bank — practice speaking here.',
      bangla:
        'Self-intro, project, HR, senior trap — উচ্চস্বরে practice। theory **/questionbank**-এ।',
      details: `
### Strong self-intro (90 sec)
".NET engineer, ERP/HRM (attendance, payroll, SQL optimization). Stack: ASP.NET Core, EF, SQL Server. Learning Redis, messaging, Clean Architecture. Want large-scale backend role."

### STAR bug example
Report 30s → missing index + N+1 → index + projection + AsNoTracking → 2s. End: "What I learned."

### HR (good answers)
- **Why leave?** Growth, larger systems — never badmouth boss
- **Weakness?** "Focused on delivery over tests — now using xUnit/Moq"
- **5 years?** Senior engineer / tech lead, scalable systems

### Senior traps (short — full answers in Question Bank)
| Trap | Best answer |
| :--- | :--- |
| Repository everywhere? | No — DbContext is enough for small apps; add layer when complex |
| DbContext = Repository? | Yes — DbSet + SaveChanges = repository + UoW |
| K8s in production? | Honest: studied pods/deployments, ready to learn on team |
| Kafka in production? | Honest: sample projects + architecture, not false claim |

### Request pipeline (2 min)
Browser → Kestrel → middleware → auth → controller → service → EF → SQL → DTO → JSON
      `,
      interviewQs: [
        {
          q: 'Tell me about yourself (ERP candidate).',
          a: '90 seconds: role, domain (HRM/payroll), stack proof, one win (e.g. query 30s→2s), learning goal, why this company.',
          bangla: 'Role + domain + stack + proof + goal — ৯০ sec।',
          difficulty: 'mid',
        },
        {
          q: 'Why should we hire you?',
          a: 'ERP/HRM hands-on, SQL optimization, maintainable code, Redis/messaging learning, contribute quickly.',
          bangla: 'ERP + SQL + clean code + growth mindset।',
          difficulty: 'mid',
        },
        {
          q: 'Is DbContext already a Repository?',
          a: 'Largely yes: DbSet per entity, DbContext as unit of work. Extra repository only when multiple sources, heavy query encapsulation, or testing strategy requires it.',
          bangla: 'DbSet + SaveChanges = repository + UoW; extra layer optional।',
          difficulty: 'senior',
        },
        {
          q: 'Trace Web API request to SQL and back.',
          a: 'HTTP → Kestrel → middleware (log, auth) → routing → controller → service → DbContext → SQL → entities → DTO map → JSON → client.',
          bangla: 'Kestrel → middleware → controller → EF → SQL → DTO → JSON।',
          difficulty: 'senior',
        },
      ],
      practice: 'Record Q1 and listen — under 2 minutes, no filler words.',
    },
  ],
  interviewQuestions: [
    {
      q: 'PostgreSQL instead of SQL Server in Clean Architecture?',
      a: 'Change EF provider, migrations, SQL dialect in Infrastructure only. Domain and Application unchanged — that is the point of Clean Architecture.',
      bangla: 'Infrastructure-এ provider/migration; Domain/Application same।',
      difficulty: 'senior',
    },
  ],
  quickRevision: {
    concepts: [
      'This module = scenarios + mock only',
      'C# theory → /csharp, /linq',
      'Database → /database, /sql',
      'Coding → /problemsolving → /algorithms → /csharpproblems',
      'DevOps → /devops',
    ],
    questions: [
      'Slow API 30s — first 3 steps?',
      'Redis down?',
      '5000 punches/min design?',
      'Tell me about yourself?',
    ],
    mistakes: [
      'Reading duplicate Q&A here instead of core modules',
      'Skipping Problem Solving before live coding',
      'Claiming K8s/Kafka production without experience',
    ],
    scenarios: [
      'Payroll 1 lakh batch',
      'Cache stampede',
      'Leave approval design',
      'Production bug process',
    ],
  },
  summary:
    'BD interview prep: learn theory in grouped modules (C# → Web → Database → DevOps → Problem Solving), then practice scenarios and mock rounds here — no duplicate topics.',
};
