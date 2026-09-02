export const bdDotnetInterviewData = {
  id: 'bdinterview',
  title: 'Bangladesh .NET Interview Guide — Scenarios, Q&A & Live Coding',
  description:
    'Content from real BD company interviews (Brain Station 23, TigerIT, Cefalo, NEXT IT, REVE, BJIT, Southtech): production scenarios, 80+ Q&A, mock rounds, LINQ/SQL live coding — beginner to senior, English + Bangla.',
  chapterNumber: 31,
  sections: [
    {
      id: 'bd-scenarios-production',
      topic: 'Production Scenarios 1–20 (Slow API, Deadlock, Payroll, Redis, RabbitMQ)',
      difficulty: 'mid',
      english:
        'These scenarios appear at Brain Station 23, TigerIT, Cefalo, NEXT IT, REVE Systems, BJIT, and similar BD .NET companies. Interviewers test problem-solving — not memorization. Always investigate step by step before guessing.',
      bangla:
        'Brain Station 23, TigerIT, Cefalo, NEXT IT, REVE, BJIT-এর মতো কোম্পানিতে এই scenario আসে। মুখস্থ নয় — Problem Solving Ability দেখান। Guess না করে ধাপে ধাপে Investigation করুন।',
      details: `
### Scenario 1: Slow Employee List API (30 seconds)
**Investigation steps:** SET STATISTICS IO/TIME ON → Execution Plan (Table Scan, Missing Index, Key Lookup) → avoid SELECT * → AsNoTracking() → Pagination (50 not 100000) → Redis cache for hot reads.

**Interview answer:** "I would identify whether the bottleneck is database, API, or network. Then review the execution plan, add indexes if needed, avoid SELECT *, use pagination, AsNoTracking() for read-only queries, and cache frequently requested data in Redis."

### Scenario 2: Deadlock — Salary Process Hangs
Transaction A locks Employee, needs Salary. Transaction B locks Salary, needs Employee. **Fix:** same table access order everywhere, short transactions, proper indexes, retry policy (Polly).

### Scenario 3: 1 Lakh Employees Payroll (40 min)
Batch 1000 records → commit → next batch. Also: async, background job, RabbitMQ, SQL optimization, indexes.

### Scenario 4: Duplicate Employee Insert
Database: UNIQUE(EmployeeCode). Application: AnyAsync() check + transaction (Serializable) or optimistic concurrency (RowVersion).

### Scenario 5: Redis Down
**Wrong:** application crash. **Correct:** cache fallback → SQL Server → reload cache when Redis returns.

### Scenario 6: RabbitMQ Down
Retry → Dead Letter Queue → persistent queue → logging → alert. Never lose messages silently.

### Scenario 7: WHERE YEAR(Date)=2026 is Slow
Index cannot be used (non-SARGable). **Correct:** \`WHERE Date >= '2026-01-01' AND Date < '2027-01-01'\`.

### Scenario 8: 1000 Login/Second
JWT + Redis session + connection pool + async + index on Email + rate limit + load balancer.

### Scenario 9: Memory Leak (500MB → 5GB)
Check IDisposable, large objects, static variables, dotMemory / VS Diagnostic Tools, GC.

### Scenario 10: 10000 Salary Slip PDFs
**Wrong:** generate inside controller. **Correct:** Controller → RabbitMQ → Worker → PDF → Email. User gets immediate response.

### Scenarios 11–20 (Rapid Reference)
| # | Problem | Key Answer |
| :--- | :--- | :--- |
| 11 | API 500 | Serilog, exception middleware, stack trace, DB, payload, DI, env vars |
| 12 | SQL 2s → 30s | Parameter sniffing, stale stats, missing index, data growth, blocking |
| 13 | CPU 100% | Infinite loop, heavy LINQ, nested loop, bad SQL, parallel misuse |
| 14 | EF slow | Avoid ToList().Where() — use Where().ToList() so DB filters |
| 15 | N+1 | 101 queries → fix with Include() or projection |
| 16 | SQL timeout | Index, lock, plan, long transaction, network |
| 17 | MQ duplicate | Idempotency — store MessageId, ignore if processed |
| 18 | API security | JWT, HTTPS, rate limit, validation, SQL injection, XSS |
| 19 | Background job failed | Retry, DLQ, logging, alert, dashboard |
| 20 | Production bug | Never fix directly — log → reproduce → fix → test → deploy → monitor |
      `,
      interviewQs: [
        {
          q: 'Employee List API takes 30 seconds. How do you optimize?',
          a: 'I would not guess. Step 1: check SQL with STATISTICS IO/TIME and execution plan. Step 2: fix table scans and missing indexes. Step 3: avoid SELECT *, use AsNoTracking() for reads, pagination (50 rows), and Redis for frequently accessed lists. Step 4: verify with before/after metrics.',
          bangla: 'Guess নয় — SQL plan, index, SELECT * avoid, AsNoTracking, pagination, Redis।',
          difficulty: 'mid',
        },
        {
          q: 'Why is WHERE YEAR(Date)=2026 slow?',
          a: 'Applying a function on the column prevents index seek — it is non-SARGable. The engine scans the table. Use a range: Date >= start AND Date < end so the index on Date can be used.',
          bangla: 'Column-এ function = index use হয় না। Range predicate ব্যবহার করুন (SARGable)।',
          difficulty: 'mid',
        },
        {
          q: 'Redis suddenly down — what happens to the application?',
          a: 'The application must not crash. Implement cache fallback: try Redis, on miss or failure load from SQL Server, optionally write back to cache when Redis recovers. This is graceful degradation.',
          bangla: 'App crash নয় — SQL fallback, Redis ফিরলে cache reload।',
          difficulty: 'mid',
        },
      ],
      practice: 'Pick Scenario 1 and speak the 6 investigation steps aloud in under 90 seconds.',
    },
    {
      id: 'bd-scenarios-system-design',
      topic: 'Senior Scenarios 21–40 & System Design (HRM, Attendance, Microservices)',
      difficulty: 'senior',
      english:
        'Senior and Technical Lead rounds: concurrency, monitoring, SQL injection, file upload, API versioning, cache stampede, saga pattern, logging, CI/CD, Kubernetes, disaster recovery.',
      bangla:
        'Senior/Lead রাউন্ড: concurrency, monitoring, SQL injection, cache stampede, saga, microservices, API Gateway, CI/CD, Kubernetes, disaster recovery।',
      details: `
### Scenario 21: 1000 Users Generate Salary Simultaneously
Load Balancer → multiple API instances → RabbitMQ → 3–5 background workers → SQL. API returns Job ID immediately.

### Scenario 22: Optimistic Concurrency (RowVersion)
User A and B both read RowVersion=10. A saves → 11. B save throws DbUpdateConcurrencyException — prevents silent overwrite.

### Scenario 23: SQL Server Down
Health check → retry (Polly) → circuit breaker → notify admin → read from Redis cache.

### Scenario 24: How Do You Know API Became Slow?
Serilog → Application Insights/Grafana → alerts on response time, CPU, memory, failed requests, SQL duration.

### Scenario 25: SQL Injection
**Wrong:** \`$"SELECT * FROM Employee WHERE Name='{name}'"\`. **Correct:** EF LINQ or parameterized queries.

### Scenario 31: Attendance for 1 Crore Employees
Load Balancer → API Gateway → Attendance API → **Kafka** (high-throughput punches) → consumers → SQL (primary + read replica) → Redis cluster → Elasticsearch/Grafana.

### Scenario 32: Read Replica
900 reads / 100 writes → route reads (lists, reports, dashboard) to replica; writes (salary, leave) to primary.

### Scenario 33: Cache Stampede
Redis expires → 10000 users hit SQL. Fix: lock so one request rebuilds cache; or sliding/random expiration; background refresh.

### Scenario 34: Distributed Transaction / Saga
Employee created, salary failed → rollback employee + notify. Avoid huge 2PC across services.

### Design: Leave Approval System
Employee → Apply Leave API → validation → SQL transaction → manager approval → RabbitMQ → email → audit log → Redis cache clear.

### Design: 5000 Attendance Punches/Minute
Machine → Load Balancer → API → Kafka/RabbitMQ → Attendance/Payroll/Notification/Analytics services → SQL → Redis.

### CTO Question: 1 Crore Employee HRM
React/Angular → API Gateway → Auth, Employee, Attendance, Leave, Payroll, Notification → RabbitMQ → Redis → SQL → Elasticsearch → Docker/K8s → Azure/AWS.
      `,
      interviewQs: [
        {
          q: 'Design a leave approval system for an HRM application.',
          a: 'Employee applies via API with validation. SQL transaction stores leave request. Manager approves/rejects. On approval, publish event to RabbitMQ for email notification and audit log. Invalidate Redis cache for employee leave balance. Return structured response with correlation ID for tracing.',
          bangla: 'Apply → validate → transaction → approval → RabbitMQ email/audit → Redis invalidate।',
          difficulty: 'senior',
        },
        {
          q: '5000 attendance punches per minute — how do you design?',
          a: 'API must respond fast — accept punch and enqueue to Kafka or RabbitMQ. Separate consumers for attendance storage, payroll calculation, notifications, and analytics. Scale consumers independently. SQL primary for writes, replica for reports. Redis for dashboard cache.',
          bangla: 'API দ্রুত response → queue → independent consumers → SQL + Redis।',
          difficulty: 'senior',
        },
        {
          q: 'Kafka vs RabbitMQ — when which?',
          a: 'RabbitMQ: task queues, background jobs, per-message ack, flexible routing (email after salary). Kafka: high-throughput event streaming, multiple consumers replay same events (attendance → payroll + analytics + dashboard).',
          bangla: 'RabbitMQ = task queue; Kafka = event stream, high volume replay।',
          difficulty: 'senior',
        },
      ],
      practice: 'Whiteboard the HRM architecture flow in 2–3 minutes: Client → Gateway → Services → Queue → DB → Cache → Logging.',
    },
    {
      id: 'bd-csharp-oop-qa',
      topic: 'Core C# & OOP Q&A (Class, Interface, Polymorphism, GC, LINQ)',
      difficulty: 'junior',
      english:
        'Foundation questions from Doc2 Part 1: class vs object, interface vs abstract, encapsulation, polymorphism (overloading vs overriding), virtual/override, sealed, ref/out, String vs StringBuilder, GC, IEnumerable vs IQueryable.',
      bangla:
        'Doc2 Part 1: class/object, interface/abstract, encapsulation, polymorphism, virtual/override, sealed, ref/out, String/StringBuilder, GC, IEnumerable/IQueryable।',
      details: `
### Quick Reference (from interview docs)

| Topic | Key Point |
| :--- | :--- |
| Class vs Object | Class = blueprint; Object = instance |
| Interface vs Abstract | Interface = contract, multiple; Abstract = partial implementation, single inheritance |
| Overloading | Same name, different parameters — compile time |
| Overriding | Parent virtual + child override — runtime |
| String vs StringBuilder | String immutable (new object each +=); StringBuilder mutable for loops |
| IEnumerable | Filter in memory after load |
| IQueryable | Filter translated to SQL (EF Core) |

### Polymorphism Table
| | Overloading | Overriding |
| :--- | :--- | :--- |
| Time | Compile | Runtime |
| Class | Same class | Parent + Child |
| Parameters | Different | Same |
| Keywords | None | virtual / override |
      `,
      code: `// Method Overloading (compile-time)
public class Calculator {
    public int Add(int a, int b) => a + b;
    public int Add(int a, int b, int c) => a + b + c;
    public double Add(double a, double b) => a + b;
}

// Method Overriding (runtime)
public class Animal {
    public virtual void Sound() => Console.WriteLine("Animal sound");
}
public class Dog : Animal {
    public override void Sound() => Console.WriteLine("Dog barks");
}`,
      interviewQs: [
        {
          q: 'Difference between method overloading and overriding?',
          a: 'Overloading: same method name, different parameter lists in the same class — resolved at compile time. Overriding: child replaces parent implementation of a virtual method — resolved at runtime. Overloading = different inputs; overriding = changed behavior in hierarchy.',
          bangla: 'Overloading = same class, different params, compile time। Overriding = virtual/override, runtime।',
          difficulty: 'junior',
        },
        {
          q: 'IEnumerable vs IQueryable — which is faster for EF Core?',
          a: 'IQueryable keeps the query as an expression tree; Where/OrderBy translate to SQL and filter on the database. IEnumerable after ToList() loads all rows into memory then filters in C# — slow for large tables. Always compose IQueryable until the final ToListAsync().',
          bangla: 'IQueryable = DB filter; IEnumerable after ToList = memory filter — বড় data-তে IQueryable।',
          difficulty: 'mid',
        },
        {
          q: 'Why use StringBuilder instead of string concatenation in a loop?',
          a: 'String is immutable — each += creates a new object on the heap, causing many allocations and GC pressure. StringBuilder is mutable and reuses internal buffer — O(n) instead of O(n²) allocations for n concatenations.',
          bangla: 'String immutable → loop-এ নতুন object। StringBuilder mutable → efficient।',
          difficulty: 'junior',
        },
        {
          q: 'virtual vs override vs sealed override?',
          a: 'virtual on parent allows child to override. override on child replaces implementation. sealed override prevents further overriding in derived classes — useful when the implementation must not change downstream.',
          bangla: 'virtual = allow override; override = implement; sealed = stop further override।',
          difficulty: 'mid',
        },
      ],
      practice: 'Explain polymorphism with Animal/Dog/Cat example out loud in Bangla and English.',
    },
    {
      id: 'bd-aspnet-ef-qa',
      topic: 'ASP.NET Core, DI, REST, EF Core Q&A',
      difficulty: 'mid',
      english:
        'Middleware, Serilog, DI lifetimes, REST constraints, status codes, AsNoTracking, Include, migrations, lazy/eager/explicit loading — from Doc2 Parts 2–3.',
      bangla:
        'Middleware, Serilog, DI lifetime, REST, status code, AsNoTracking, Include, migration, lazy/eager/explicit loading — Doc2 Part 2–3।',
      details: `
### DI Lifetimes
| Lifetime | When | Example |
| :--- | :--- | :--- |
| Transient | Every injection | Helper, validator |
| Scoped | Per HTTP request | DbContext, repository |
| Singleton | App lifetime | Logger, cache config |

**Never Singleton DbContext.**

### REST Constraints
- **Stateless:** every request carries auth (Bearer token)
- **Uniform interface:** GET/POST/PUT/PATCH/DELETE on consistent URLs
- **Cacheable:** GET responses can be cached

### EF Loading Strategies
| Strategy | When | Risk |
| :--- | :--- | :--- |
| Eager (Include) | Related data always needed | Cartesian explosion if overused |
| Lazy | Related data sometimes needed | N+1 in APIs |
| Explicit | Load on button click | Developer calls Load() |

**ERP reports:** prefer Eager or projection. **APIs:** avoid Lazy Loading.

### Serilog
Structured logging: \`Log.Information("Employee {EmployeeId} login", id)\` — searchable in Elasticsearch/Grafana.
      `,
      interviewQs: [
        {
          q: 'Transient vs Scoped vs Singleton — give examples.',
          a: 'Transient: new instance every time — lightweight helpers. Scoped: one per HTTP request — DbContext, unit of work. Singleton: one for app lifetime — configuration, logger. DbContext must be Scoped because it is not thread-safe and tracks entities per request.',
          bangla: 'Transient = প্রতি inject; Scoped = per request (DbContext); Singleton = app lifetime।',
          difficulty: 'mid',
        },
        {
          q: 'Why AsNoTracking() for read-only queries?',
          a: 'EF Core skips change tracking and snapshot storage — less memory and faster queries. Use for GET APIs, reports, and lists where you will not call SaveChanges(). Combine with Select projection for best performance.',
          bangla: 'Read-only-তে tracking দরকার নয় — memory কম, query দ্রুত।',
          difficulty: 'mid',
        },
        {
          q: 'Lazy vs Eager vs Explicit loading?',
          a: 'Eager: Include() loads related data in same SQL — use when you always need it. Lazy: loads on navigation access — causes N+1 in loops; avoid in Web APIs. Explicit: Entry().Reference().Load() when developer decides — good for on-demand UI.',
          bangla: 'Eager = Include এক query; Lazy = access-এ query (N+1 risk); Explicit = manual Load()।',
          difficulty: 'mid',
        },
        {
          q: 'What is middleware and give examples?',
          a: 'Middleware sits in the request/response pipeline. Examples: authentication, authorization, logging, exception handling, CORS, rate limiting. Order matters — UseAuthentication before UseAuthorization.',
          bangla: 'Request-response pipeline-এর মাঝে — auth, logging, exception handling। Order গুরুত্বপূর্ণ।',
          difficulty: 'mid',
        },
      ],
      practice: 'Draw middleware pipeline: Request → Logging → Auth → AuthZ → Controller → Response.',
    },
    {
      id: 'bd-sql-performance-qa',
      topic: 'SQL, Index, CTE, JOIN, Performance & Async Q&A',
      difficulty: 'mid',
      english:
        'Clustered/nonclustered index, CTE, ROW_NUMBER, RANK vs DENSE_RANK, JOINs, EXISTS vs IN, stored procedures, query slowness, deadlock, normalization, async/await, Task vs Thread — Doc2 Parts 4–6.',
      bangla:
        'Index, CTE, ROW_NUMBER, RANK/DENSE_RANK, JOIN, EXISTS/IN, SP, slow query, deadlock, normalization, async, Task/Thread — Doc2 Part 4–6।',
      details: `
### EXISTS vs IN
| Scenario | Use |
| :--- | :--- |
| Record exists check | EXISTS (stops at first match) |
| Large table | EXISTS |
| Small static list IN (1,2,3) | IN |
| NOT with possible NULL | NOT EXISTS (not NOT IN) |

### CTE vs Temp Table
- **CTE:** one query scope, readability, recursive hierarchy (employee-manager tree)
- **Temp table:** session-scoped, can index, reuse multiple times, large datasets

### ACID
| Property | Meaning |
| :--- | :--- |
| Atomicity | All or nothing |
| Consistency | Rules never broken |
| Isolation | Transactions do not interfere |
| Durability | Committed data survives crash |

### Task vs Thread
- **Thread** = OS worker (expensive)
- **Task** = work unit scheduled on thread pool
- **async/await** = non-blocking I/O (APIs, DB)
- **Parallel.ForEach** = CPU-bound work (not on request thread in ASP.NET)
      `,
      interviewQs: [
        {
          q: 'EXISTS vs IN — when to use which?',
          a: 'EXISTS checks existence and stops at first match — usually faster on large tables for correlated subqueries. IN compares against a list — fine for small sets. Avoid NOT IN when subquery can return NULL — use NOT EXISTS instead.',
          bangla: 'EXISTS = আছে কিনা, early stop; IN = list match; NOT EXISTS safer than NOT IN with NULL।',
          difficulty: 'mid',
        },
        {
          q: 'What is ACID?',
          a: 'Atomicity: all operations succeed or all roll back. Consistency: database rules hold after transaction. Isolation: concurrent transactions do not corrupt each other. Durability: committed data persists after crash. EF SaveChanges wraps changes in a transaction.',
          bangla: 'Atomicity = all/nothing; Consistency = rule; Isolation = concurrent safe; Durability = commit permanent।',
          difficulty: 'mid',
        },
        {
          q: 'Why is query slow — investigation steps?',
          a: 'Check execution plan for table scan, missing index, key lookup, sort. Look for parameter sniffing, stale statistics, scalar functions on columns, too many joins. Fix: proper indexes, SARGable predicates, select only needed columns, pagination.',
          bangla: 'Plan → scan/index → SARGable → SELECT columns → pagination।',
          difficulty: 'mid',
        },
        {
          q: 'Task vs Thread?',
          a: 'Thread is an OS execution unit — expensive to create. Task represents work scheduled on the thread pool — preferred in .NET. Use async/await for I/O (database, HTTP). Use Task.Run or Parallel only for CPU-bound work, carefully in ASP.NET.',
          bangla: 'Thread = OS worker; Task = thread pool work; async = I/O; Parallel = CPU-bound।',
          difficulty: 'mid',
        },
      ],
      practice: 'Write EXISTS vs IN example for "employees without attendance".',
    },
    {
      id: 'bd-design-security-qa',
      topic: 'SOLID, Repository, JWT, Security & ERP Scenarios',
      difficulty: 'mid',
      english:
        'SOLID with real examples, repository pattern, DTO, JWT vs authorization, API slow/payroll/Redis/RabbitMQ/Kafka scenarios, self-introduction — Doc2 Parts 7–9.',
      bangla:
        'SOLID উদাহরণ, repository, DTO, JWT, API slow/payroll/Redis/RabbitMQ/Kafka scenario, self-intro — Doc2 Part 7–9।',
      details: `
### SOLID One-Line Summary
| Letter | Rule |
| :--- | :--- |
| S | One class, one responsibility |
| O | Extend without modifying existing code |
| L | Child replaces parent without breaking |
| I | Small interfaces, not fat ones |
| D | Depend on abstractions (IRepository not SqlRepository) |

### Authentication vs Authorization
- **Authentication:** Who are you? (login, JWT)
- **Authorization:** What can you access? (roles, policies)

### ERP Scenario Answers
| Question | Answer |
| :--- | :--- |
| API slow | SQL plan, index, AsNoTracking, pagination, Redis |
| 1 lakh payroll | Batch, SP, background job, RabbitMQ |
| Redis why | Cache frequent reads, reduce DB load |
| RabbitMQ why | Email/PDF/SMS without blocking API |
| Kafka why | High-volume event stream (attendance punches) |
      `,
      interviewQs: [
        {
          q: 'Explain SOLID with a payment example.',
          a: 'SRP: EmployeeService saves employees, EmailService sends mail — separate classes. OCP: add BkashPayment class implementing IPayment without changing existing code. LSP: all IPayment implementations must process without throwing unexpectedly. ISP: IWork and IEat instead of one IWorker with Eat for Robot. DIP: EmployeeService depends on IRepository not SqlServerRepository.',
          bangla: 'SRP = এক class এক কাজ; OCP = extend not modify; DIP = interface depend।',
          difficulty: 'mid',
        },
        {
          q: 'Authentication vs Authorization?',
          a: 'Authentication verifies identity — login, JWT validation. Authorization checks permissions — can this user approve leave, view salary? AuthN first, then AuthZ in pipeline or attributes.',
          bangla: 'AuthN = কে তুমি; AuthZ = তুমি কী access পাবে।',
          difficulty: 'junior',
        },
        {
          q: 'Should every project use Repository Pattern?',
          a: 'No. EF Core DbContext already implements repository and unit-of-work patterns. Small CRUD apps: Controller → Service → DbContext is enough. Large enterprise with complex queries or multiple data sources: custom repository adds value. Do not add abstraction without benefit.',
          bangla: 'সব project-এ নয় — EF Core-ই repository; বড় system-এ useful।',
          difficulty: 'mid',
        },
      ],
      practice: 'Prepare 90-second "Tell me about yourself" for ERP/HRM background.',
    },
    {
      id: 'bd-bonus-erp-traps',
      topic: 'Bonus ERP Trap Questions (LINQ, EF, DI, Concurrency)',
      difficulty: 'mid',
      english:
        'The 10 questions BD ERP companies ask most: LINQ vs SQL, IEnumerable vs IQueryable, Any vs Count, First vs FirstOrDefault, Single vs SingleOrDefault, DI lifetimes, Task.WhenAll, transactions, optimistic vs pessimistic concurrency, index/plan analysis.',
      bangla:
        'BD ERP কোম্পানির ১০টি bonus trap: LINQ vs SQL, IEnumerable/IQueryable, Any/Count, First/FirstOrDefault, Single/SingleOrDefault, DI lifetime, Task.WhenAll, transaction, concurrency, index/plan।',
      details: `
### Trap Answers (memorize the pattern)

| Question | Wrong | Correct |
| :--- | :--- | :--- |
| Any vs Count | Count() > 0 | Any() — stops at first match |
| First vs FirstOrDefault | First when empty | FirstOrDefault when record may not exist |
| Single vs SingleOrDefault | Single for email lookup | SingleOrDefault when uniqueness expected |
| Sequential vs parallel | await each API one by one | Task.WhenAll when independent |
| Transaction | TransactionScope everywhere | BeginTransaction() for single DB |
| Concurrency | Pessimistic lock always | Optimistic (RowVersion) for ERP updates |

### Task.WhenAll Example
Independent calls: employee, department, salary — parallel ≈ 2s vs sequential 6s.
**Warning:** do not parallel queries on same DbContext.
      `,
      code: `// Independent I/O — parallel
var emp = GetEmployeeAsync();
var dept = GetDepartmentAsync();
var sal = GetSalaryAsync();
await Task.WhenAll(emp, dept, sal);

// Dependent — sequential
var employee = await SaveEmployeeAsync(dto);
await SaveSalaryAsync(employee.Id);`,
      interviewQs: [
        {
          q: 'Any() vs Count() > 0?',
          a: 'Any() returns as soon as one matching row exists — O(1) best case with index. Count() scans or counts all matching rows. For existence checks always prefer Any().',
          bangla: 'Any() = প্রথম match-এ stop; Count() = সব count — existence-এ Any()।',
          difficulty: 'junior',
        },
        {
          q: 'FirstOrDefaultAsync vs SingleOrDefaultAsync for email lookup?',
          a: 'SingleOrDefaultAsync expects zero or one row — throws if duplicates exist, which helps catch data integrity bugs. FirstOrDefaultAsync returns first of many without error. For unique business keys like email, SingleOrDefaultAsync documents the invariant.',
          bangla: 'Unique key (email) → SingleOrDefault; duplicate হলে exception = data bug catch।',
          difficulty: 'mid',
        },
        {
          q: 'TransactionScope vs BeginTransaction()?',
          a: 'BeginTransaction() on DbContext is standard for single-database EF operations. TransactionScope can span multiple databases or resources but adds complexity and MSDTC issues — use only when truly needed for distributed scenarios.',
          bangla: 'Single DB → BeginTransaction(); multiple DB → TransactionScope (সাবধানে)।',
          difficulty: 'mid',
        },
        {
          q: 'Optimistic vs pessimistic concurrency in ERP?',
          a: 'Optimistic: RowVersion/timestamp — no locks during read, check on save. Good when conflicts are rare (profile update, leave approval). Pessimistic: lock row during edit — use sparingly for inventory or scarce resources.',
          bangla: 'ERP update-এ সাধারণত Optimistic (RowVersion); inventory-তে Pessimistic।',
          difficulty: 'mid',
        },
      ],
      practice: 'Answer all 10 bonus questions out loud without looking.',
    },
    {
      id: 'bd-advanced-master',
      topic: 'Advanced Master Q&A 61–80 (DI, JWT, Redis, CQRS, Docker, Microservices)',
      difficulty: 'senior',
      english:
        'Deep DI, SOLID real examples, middleware, JWT + refresh token, Redis/RabbitMQ/Kafka projects, API versioning, exception middleware, Serilog, BackgroundService, CQRS, Clean Architecture, Docker, microservices, API Gateway, unit testing, full ERP design.',
      bangla:
        'Deep DI, SOLID, middleware, JWT+refresh, Redis/RabbitMQ/Kafka, API versioning, exception middleware, Serilog, BackgroundService, CQRS, Clean Architecture, Docker, microservices, API Gateway, unit test, ERP design।',
      details: `
### Clean Architecture Layers
Presentation (API) → Application (DTO, services) → Domain (entities, rules) → Infrastructure (EF, Redis, MQ).

**Rule:** Domain knows nothing about EF or ASP.NET.

### JWT + Refresh Token
Access token: 15–30 min. Refresh token: 7 days, stored in DB, revoked on logout.

### Redis Cache Pattern
Check cache → miss → load SQL → set cache with TTL → on update delete cache key.

### CQRS
Commands (write) and queries (read) separated — scale independently. Use MediatR in .NET. Not for every CRUD app.

### Microservices — When NOT
Small team, unclear boundaries, no observability → stay modular monolith.

### ERP Design (2–3 min answer)
ASP.NET Core + Clean Architecture + SQL Server + EF Core + JWT + Redis + RabbitMQ + Serilog + Hangfire + async + indexes + pagination + AsNoTracking(). Split to microservices only when scale demands.
      `,
      interviewQs: [
        {
          q: 'What is refresh token and why?',
          a: 'Access tokens are short-lived for security. Refresh tokens are long-lived and stored server-side. When access expires, client sends refresh token to get new access without re-login. Revoke refresh on logout.',
          bangla: 'Access short-lived; refresh long-lived — logout-এ revoke।',
          difficulty: 'mid',
        },
        {
          q: 'Explain Clean Architecture in an HRM project.',
          a: 'Domain has Employee, Leave rules — no EF references. Application has commands/queries and DTOs. Infrastructure implements EF repositories, Redis, RabbitMQ. API has controllers and middleware. Business logic survives database or framework changes.',
          bangla: 'Domain = rule; Application = use case; Infrastructure = EF/Redis; API = controller।',
          difficulty: 'senior',
        },
        {
          q: 'CQRS — use everywhere?',
          a: 'No. Small CRUD: traditional service is fine. Large ERP with heavy read reports and complex writes: CQRS lets you optimize reads (projections, replicas) and writes (commands, validation) separately.',
          bangla: 'Small CRUD → no; large ERP read/write load আলাদা → yes।',
          difficulty: 'senior',
        },
        {
          q: 'What is API Gateway?',
          a: 'Single entry point for clients routing to multiple microservices. Handles authentication, rate limiting, SSL, logging, routing. Examples: YARP, Ocelot, Kong, NGINX.',
          bangla: 'Single entry — auth, rate limit, routing to microservices।',
          difficulty: 'senior',
        },
      ],
      practice: 'Explain JWT flow from login to API call with Authorization header.',
    },
    {
      id: 'bd-mock-interview',
      topic: 'Mock Interview Rounds (Behavioral + Advanced .NET)',
      difficulty: 'mid',
      english:
        'Round 1: tell me about yourself, current project, difficult bug, optimize API, DI, lifetimes, async, SOLID, Clean Architecture, HR questions. Round 2: repository pattern, DbContext as repository, IQueryable, deferred execution, ValueTask, Span, StringBuilder, GC, IDisposable, web request pipeline.',
      bangla:
        'Round 1: self-intro, project, bug, API optimize, DI, lifetime, async, SOLID, Clean Architecture, HR। Round 2: repository, DbContext, IQueryable, deferred, ValueTask, Span, GC, IDisposable, request pipeline।',
      details: `
### Strong "Tell Me About Yourself" (90 sec)
"I'm a .NET Software Engineer with experience building ERP and HRM applications using ASP.NET Core, EF Core, and SQL Server. My work focuses on attendance, payroll, employee management, and reporting. I enjoy SQL performance optimization and scalable APIs. Recently I have been learning Redis, RabbitMQ, and Clean Architecture. I'm looking for opportunities on large-scale backend systems."

### Difficult Bug STAR Example
Attendance report 30s → root cause: missing index + N+1 + SELECT * → fix: index, projection, AsNoTracking → result: 2s. End with "What I learned."

### HR Answers
- **Why leave?** Growth, larger systems — never badmouth boss.
- **Weakness?** "I focused on implementation over testing — now learning xUnit/Moq."
- **5 years?** Senior engineer or tech lead designing scalable systems.

### Round 2 Highlights
- **Repository:** EF DbContext is already repository + UoW — add layer only when valuable.
- **Deferred execution:** query runs at ToListAsync/foreach, not at Where().
- **Request pipeline:** Browser → Kestrel → middleware → auth → controller → service → EF → SQL → JSON response.
      `,
      interviewQs: [
        {
          q: 'Tell me about yourself (ERP candidate).',
          a: '90-second thesis: role (.NET backend), domain (HRM/payroll/attendance), stack (ASP.NET Core, EF, SQL), proof (performance win or module you owned), growth (Redis, messaging, architecture), goal (this team/scale).',
          bangla: 'Role + domain + stack + proof + growth + goal — ৯০ সেকেন্ড।',
          difficulty: 'mid',
        },
        {
          q: 'Is DbContext already a Repository?',
          a: 'Yes, to a large extent. DbSet is a repository per entity; DbContext is unit of work with SaveChanges. Adding another repository layer duplicates abstraction unless you need test doubles, multiple data sources, or complex query encapsulation.',
          bangla: 'DbSet = repository, DbContext = UoW — extra layer শুধু clear benefit থাকলে।',
          difficulty: 'senior',
        },
        {
          q: 'Trace a Web API request to SQL Server and back.',
          a: 'HTTP → Kestrel → middleware pipeline (logging, auth) → routing → controller → application service → DbContext → EF generates SQL → SQL Server → materialize entities → map to DTO → JSON serialize → middleware outbound → client.',
          bangla: 'Kestrel → middleware → controller → service → EF → SQL → DTO → JSON।',
          difficulty: 'senior',
        },
        {
          q: 'Why should we hire you?',
          a: 'Hands-on HRM/ERP modules, SQL optimization experience, maintainable code habits, continuous learning (Redis, Docker, Clean Architecture), and ability to contribute quickly while growing with the team.',
          bangla: 'ERP experience + SQL optimize + maintainable code + learning mindset।',
          difficulty: 'mid',
        },
      ],
      practice: 'Record yourself answering Q1 and Q4 — listen for clarity and length.',
    },
  ],
  tasks: [
    {
      title: '1. Find Duplicate Emails (LINQ GroupBy)',
      english: 'From employee list, return emails that appear more than once.',
      bangla: 'Employee list থেকে duplicate email বের করুন — GroupBy ব্যবহার করুন।',
      code: `var duplicateEmails = employees
    .GroupBy(e => e.Email)
    .Where(g => g.Count() > 1)
    .Select(g => new { Email = g.Key, Count = g.Count() });`,
    },
    {
      title: '2. Second Highest Salary (Distinct + Skip)',
      english: 'Return second highest salary handling duplicate salary values.',
      bangla: 'Duplicate salary handle করে second highest salary return করুন।',
      code: `var second = employees
    .Select(e => e.Salary)
    .Distinct()
    .OrderByDescending(s => s)
    .Skip(1)
    .First();`,
    },
    {
      title: '3. Missing Numbers in Sequence 1..n',
      english: 'Given array with gaps, return missing numbers from 1 to n.',
      bangla: '১ থেকে n পর্যন্ত missing number return করুন — Except/Range।',
      code: `var numbers = new[] { 1, 2, 3, 5, 6, 8, 9 };
var missing = Enumerable.Range(1, 9).Except(numbers);`,
    },
    {
      title: '4. Reverse String (Two Pointers)',
      english: 'Reverse a string in-place using two pointers — no built-in Reverse.',
      bangla: 'Two pointer দিয়ে string reverse — built-in Reverse ছাড়া।',
      code: `static string Reverse(string input) {
    var chars = input.ToCharArray();
    int left = 0, right = chars.Length - 1;
    while (left < right) {
        (chars[left], chars[right]) = (chars[right], chars[left]);
        left++; right--;
    }
    return new string(chars);
}`,
    },
    {
      title: '5. Employee Exists — Any vs Count',
      english: 'Check if employee with Id=10 exists — use Any(), not Count.',
      bangla: 'Id=10 employee আছে কিনা — Any() ব্যবহার করুন, Count() নয়।',
      code: `bool exists = employees.Any(e => e.Id == 10);`,
    },
    {
      title: '6. Top 3 Highest Salary',
      english: 'Return top 3 employees by salary.',
      bangla: 'Salary অনুযায়ী top 3 employee return করুন।',
      code: `var top3 = employees
    .OrderByDescending(e => e.Salary)
    .Take(3);`,
    },
    {
      title: '7. Department Wise Average Salary',
      english: 'Group employees by department and return average salary per department.',
      bangla: 'Department অনুযায়ী group করে average salary return করুন।',
      code: `var avg = employees
    .GroupBy(e => e.Department)
    .Select(g => new { Department = g.Key, AvgSalary = g.Average(e => e.Salary) });`,
    },
    {
      title: '8. Dynamic LINQ Search (Optional Filters)',
      english: 'Build IQueryable with optional name, department, designation filters.',
      bangla: 'Optional name/department/designation filter সহ IQueryable build করুন।',
      code: `IQueryable<Employee> query = _context.Employees;
if (!string.IsNullOrWhiteSpace(name))
    query = query.Where(x => x.Name.Contains(name));
if (!string.IsNullOrWhiteSpace(dept))
    query = query.Where(x => x.Department.Name == dept);
var result = await query.AsNoTracking().ToListAsync();`,
    },
    {
      title: '9. Pagination + Search + Sorting API',
      english: 'Combine search, sort switch, Skip/Take pagination with AsNoTracking.',
      bangla: 'Search, sort, pagination এক API-তে — AsNoTracking সহ।',
      code: `var query = _context.Employees.AsNoTracking();
if (!string.IsNullOrEmpty(search))
    query = query.Where(x => x.Name.Contains(search));
query = sortBy switch {
    "name" => query.OrderBy(x => x.Name),
    "salary" => query.OrderByDescending(x => x.Salary),
    _ => query.OrderBy(x => x.Id)
};
var page = await query.Skip((pageNum - 1) * size).Take(size).ToListAsync();`,
    },
    {
      title: '10. SQL — Second Highest Salary',
      english: 'T-SQL: find second highest salary without TOP 2.',
      bangla: 'T-SQL: second highest salary — subquery MAX pattern।',
      code: `SELECT MAX(Salary) AS SecondHighest
FROM Employee
WHERE Salary < (SELECT MAX(Salary) FROM Employee);`,
    },
  ],
  interviewQuestions: [
    {
      q: 'If you were CTO, how would you design attendance for 1 crore employees?',
      a: 'API Gateway + attendance ingestion service accepting punches and publishing to Kafka. Consumers process asynchronously into SQL (partitioned/sharded). Read replicas for reports. Redis for dashboard cache. Elasticsearch for search/analytics. Auto-scale consumers and API pods. Never synchronous insert of every punch in the request thread.',
      bangla: 'Gateway → Kafka ingest → async consumers → SQL shard/replica → Redis cache → scale horizontally।',
      difficulty: 'senior',
    },
    {
      q: 'PostgreSQL instead of SQL Server — what changes in Clean Architecture?',
      a: 'Change EF provider (Npgsql), regenerate/review migrations, adapt T-SQL specific SPs/functions/types to PostgreSQL syntax. Repository and domain layers stay unchanged — that is the benefit of Clean Architecture.',
      bangla: 'Provider + migration + SQL syntax; business layer unchanged।',
      difficulty: 'senior',
    },
  ],
  quickRevision: {
    concepts: [
      'Slow API: plan → index → SELECT columns → AsNoTracking → page → Redis',
      'Deadlock: same lock order + short tx + retry',
      'IQueryable filters on DB; IEnumerable filters in memory',
      'Any not Count; SingleOrDefault for unique keys',
      'Redis fallback when cache down',
      'RabbitMQ = tasks; Kafka = event stream',
      'RowVersion = optimistic concurrency',
      'SOLID + Clean Architecture for ERP',
    ],
    questions: [
      'Optimize 30s Employee List API?',
      'Redis down — application behavior?',
      'Kafka vs RabbitMQ?',
      'Repository on every project?',
      'Tell me about yourself?',
    ],
    mistakes: [
      'SELECT * in production APIs',
      'ToList() before Where()',
      'Singleton DbContext',
      'Saying yes to K8s/Kafka without honest experience',
      'Fixing production DB directly without process',
    ],
    scenarios: [
      'Payroll batch 1 lakh employees',
      '5000 punches/minute attendance',
      'Cache stampede on Redis expiry',
      'Duplicate employee on concurrent insert',
      'API 15s → 2s optimization checklist',
    ],
  },
  summary:
    'BD .NET interviews reward step-by-step investigation, ERP domain knowledge, and honest depth on SQL, EF, Redis, and messaging — use this module with Problem Solving and Scenarios for full coverage.',
};
