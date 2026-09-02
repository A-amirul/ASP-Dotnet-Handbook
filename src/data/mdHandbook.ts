/**
 * Complete coverage of uploaded Doc.md + Doc2.md topics with bilingual explanations.
 * Core modules (csharp, sql, etc.) go deeper; this module ensures nothing from the MD uploads is missing.
 */
export const mdHandbookData = {
  id: 'mdhandbook',
  title: 'Uploaded MD Topics — Complete Q&A & Scenarios',
  description:
    'Every topic from your uploaded Doc.md (scenarios 1–40, live coding, mock rounds) and Doc2.md (Q1–80 + ACID) — full explanations in English + Bangla. Use with core modules for depth.',
  chapterNumber: 33,
  sections: [
    {
      id: 'md-scenarios-1-20',
      topic: 'Doc.md — Scenarios 1–20 (Production & Troubleshooting)',
      difficulty: 'mid',
      english: 'Full step-by-step answers from uploaded Doc.md: slow API, deadlock, payroll batch, duplicate records, Redis/RabbitMQ failure, SQL performance, login scale, memory leak, background jobs, 500 errors, N+1, security.',
      bangla: 'Uploaded MD — scenario 1–20 সম্পূর্ণ: slow API, deadlock, payroll, Redis, RabbitMQ, N+1, security।',
      details: `
### Scenario 1 — Slow Employee List API (30 sec)
**Never guess.** Step 1: SET STATISTICS IO/TIME ON. Step 2: Execution plan — Table Scan, Missing Index, Key Lookup, Sort. Step 3: Avoid SELECT * — project EmployeeID, EmployeeName only. Step 4: AsNoTracking() for read-only. Step 5: Pagination — 50 records not 100000. Step 6: Redis cache for hot lists.

**Interview answer:** "Identify bottleneck (DB/API/network), review execution plan, add indexes, avoid SELECT *, pagination, AsNoTracking(), cache frequently requested data in Redis."

### Scenario 2 — Deadlock (Salary Process Hangs)
Transaction A locks Employee then needs Salary; Transaction B locks Salary then needs Employee — both wait forever.
**Fix:** Same table access order in all transactions, short transactions, proper indexes, Polly retry on deadlock.

### Scenario 3 — 1 Lakh Employees Payroll (40 min)
**Wrong:** one transaction for all. **Correct:** batch 1000 → commit → next batch; or background job + RabbitMQ workers.

### Scenario 4 — Duplicate Employee Record
UNIQUE constraint on EmployeeCode + AnyAsync() check before insert + RowVersion for optimistic concurrency.

### Scenario 5 — Redis Down
Application must not crash. Cache-aside: try Redis → on failure read SQL → optionally repopulate when Redis returns.

### Scenario 6 — RabbitMQ Down
Retry policy, dead-letter queue (DLQ), persistent messages, idempotent consumers.

### Scenario 7 — SQL Performance (YEAR(Date)=2026)
Function on column = non-SARGable = index scan. Use \`Date >= '2026-01-01' AND Date < '2027-01-01'\`.

### Scenario 8 — Login API (1000 req/sec)
JWT stateless auth, Redis session/cache, connection pool tuning, rate limiting on login endpoint.

### Scenario 9 — Memory Leak
IDisposable for streams/connections, avoid static collections growing, dotMemory/PerfView profiler.

### Scenario 10 — 10k PDF Generation
**Wrong:** generate in controller → timeout/OOM. **Correct:** enqueue background job → worker generates → notify user.

### Scenarios 11–20 (from MD)
| # | Problem | Investigation / Fix |
| :--- | :--- | :--- |
| 11 | API 500 | Serilog + exception middleware → correlation ID → stack trace |
| 12 | SQL 2s→30s | Parameter sniffing, outdated stats, missing index |
| 13 | CPU 100% | Infinite loop, LINQ in memory, bad SQL in hot path |
| 14 | EF Core slow | \`.Where().ToListAsync()\` not \`.ToList().Where()\` |
| 15 | N+1 | Include() or Select projection — one query |
| 16 | SQL timeout | Index, lock escalation, execution plan |
| 17 | MQ duplicate message | Idempotency key / MessageId dedup |
| 18 | API security | JWT, HTTPS, rate limit, input validation |
| 19 | Background job failed | Retry + DLQ + alert admin |
| 20 | Production bug | Log → reproduce in test → fix → unit test → deploy → monitor. **Never fix prod DB directly.** |
      `,
      interviewQs: [
        {
          q: 'Walk through Slow API optimization (Doc.md Scenario 1).',
          a: 'Measure first: STATISTICS IO/TIME and execution plan. Fix table scans with indexes. SELECT only needed columns. AsNoTracking() for reads. Paginate (50). Cache hot data in Redis. Verify before/after.',
          bangla: 'Measure → plan → index → columns → AsNoTracking → page → Redis → verify।',
          difficulty: 'mid',
        },
        {
          q: 'Deadlock in payroll — root cause and fix (Doc.md Scenario 2)?',
          a: 'Two transactions lock resources in opposite order. Fix: consistent lock order, keep transactions short, indexes to reduce lock time, retry policy for transient deadlocks.',
          bangla: 'Opposite lock order → same order + short tx + retry।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-live-coding-sql-api',
      topic: 'Doc.md — Live Coding, SQL 1–10, API & Hard Coding 21–30',
      difficulty: 'mid',
      english: 'Complete coding topics from uploaded Doc.md: live coding 1–20 patterns, SQL window functions, API CRUD/pagination/search, Task.WhenAll, hard coding (spec, generic repo, bulk, concurrency, queue, rate limit, cache, MediatR).',
      bangla: 'Uploaded MD — live coding, SQL 1–10, API pattern, hard coding 21–30।',
      details: `
### Live Coding 1–10 (from MD)
| # | Task | Pattern |
| :--- | :--- | :--- |
| 1 | Duplicate employees | GroupBy + Where Count>1 or HashSet |
| 2 | Highest salary | \`OrderByDescending(Salary).First()\` or MaxBy |
| 3 | Second highest | Distinct OrderByDescending Skip(1) First |
| 4 | Group by department | GroupBy + Select count/avg |
| 5 | Missing numbers 1..n | HashSet or sum formula |
| 6 | Reverse string | Two pointers on char array |
| 7 | Count words | Split + filter empty |
| 8 | Remove duplicate numbers | Distinct() or HashSet |
| 9 | Even numbers | Where(n => n % 2 == 0) |
| 10 | Prime number | Loop to sqrt(n) |

### Live Coding 11–20 (from MD)
| # | Task | LINQ |
| :--- | :--- | :--- |
| 11 | Last 30 days join | \`DateJoined >= Today.AddDays(-30)\` |
| 12 | Dept employee count | GroupBy + Count |
| 13 | Highest per dept | GroupBy + OrderByDescending + First |
| 14 | Multi sort | OrderByDescending(Salary).ThenBy(Name) |
| 15 | Top 5 recent | OrderByDescending(DateJoined).Take(5) |
| 16 | Common elements | Intersect() |
| 17 | No department | Where(d => d.Department == null) |
| 18 | Oldest employee | OrderBy(DateOfBirth).First() |
| 19 | Total salary | Sum(x => x.Salary) |
| 20 | Employee exists? | **Any()** not Count()>0 |

### SQL 1–10 (from MD)
**SQL 1 — Second highest:** \`SELECT MAX(Salary) FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee)\`

**SQL 2 — Duplicate email:** \`GROUP BY Email HAVING COUNT(*)>1\`

**SQL 3 — Nth highest:** \`DENSE_RANK() OVER (ORDER BY Salary DESC)\` then filter Rnk=N

**SQL 4 — Dept highest salary:** \`ROW_NUMBER() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC)\` WHERE RN=1

**SQL 5 — Running total:** \`SUM(Salary) OVER (ORDER BY EmployeeID)\`

### API Coding (from MD)
**API 1 — CRUD:** Controller → Service → Repository → EF Core (layered)

**API 2 — Pagination:** \`Skip((page-1)*pageSize).Take(pageSize)\`

**API 3 — Search:** \`.Where(x => x.Name.Contains(name))\` on IQueryable before ToListAsync

### Async (from MD)
**Wrong:** sequential await GetEmployee(); await GetDepartment(); await GetSalary();
**Correct:** \`await Task.WhenAll(GetEmployee(), GetDepartment(), GetSalary())\` — independent I/O in parallel.

### Hard Coding 21–30 (from MD)
| # | Topic | Key idea |
| :--- | :--- | :--- |
| 21 | Dynamic LINQ search | Build IQueryable with conditional Where |
| 22 | Pagination + search + sort | Skip/Take + dynamic OrderBy |
| 23 | Specification pattern | Reusable query specs on IQueryable |
| 24 | Generic repository | \`IRepository<T>\` with GetById, Add, Update |
| 25 | Bulk insert 50k | BulkInsert/SqlBulkCopy — not foreach SaveChanges |
| 26 | Optimistic concurrency | RowVersion + catch DbUpdateConcurrencyException |
| 27 | Background queue | Channel<T> or IHostedService worker |
| 28 | Rate limiting | AddRateLimiter FixedWindow on login |
| 29 | Distributed cache | Cache-aside Redis + invalidate on update |
| 30 | MediatR + CQRS | IRequest handler separates command/query |

**Practice:** See **C# DSA & LINQ Tasks** module tasks 21–52 for runnable code.
      `,
      interviewQs: [
        {
          q: 'SQL 4 — Department-wise highest salary (from MD)?',
          a: 'ROW_NUMBER() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC) AS RN, then WHERE RN=1. Alternative: correlated subquery with MAX per department.',
          bangla: 'ROW_NUMBER partition by dept → RN=1।',
          difficulty: 'mid',
        },
        {
          q: 'Hard Coding 30 — MediatR CQRS one-line purpose?',
          a: 'Separate read (queries) from write (commands); each handler has one responsibility; controller sends IRequest, MediatR dispatches to handler — testable, decoupled.',
          bangla: 'Command/query split — IRequest → handler — decoupled।',
          difficulty: 'senior',
        },
      ],
    },
    {
      id: 'md-scenarios-21-30',
      topic: 'Doc.md — Scenarios 21–30 (Senior Mid-Level)',
      difficulty: 'senior',
      english: 'Salary concurrency, RowVersion, SQL down, monitoring, SQL injection, file upload, API versioning, Excel export, OTP, audit log — from uploaded MD.',
      bangla: 'Uploaded MD — scenario 21–30: concurrency, RowVersion, monitoring, file upload, OTP, audit log।',
      details: `
### 21 — 1000 users generate salary simultaneously
**Wrong:** increase RAM only. **Correct:** Load balancer → multiple APIs → RabbitMQ → 3–5 workers → SQL. API returns JobId immediately.

### 22 — Data overwrite (optimistic concurrency)
\`[Timestamp] byte[] RowVersion\` on Employee. User A and B both read v10; A saves v11; B save throws \`DbUpdateConcurrencyException\`.

### 23 — SQL Server down
Health check → Polly retry → circuit breaker → notify admin → read cache from Redis.

### 24 — How do you know API is slow?
Serilog → Application Insights/Grafana → alert on response time, CPU, memory, failed requests, SQL duration.

### 25 — SQL injection
**Wrong:** \`$"SELECT * FROM Employee WHERE Name='{name}'"\` — \`' OR 1=1 --\` returns all rows. **Correct:** EF LINQ or parameterized SQL.

### 26 — File upload validation
Check: file size, extension, MIME type, virus scan (enterprise), random file name (not resume.pdf → 7f8d2f1a.pdf), store sensitive files outside wwwroot.

### 27 — API versioning
Keep /api/v1 and /api/v2 both active; deprecate v1 later — do not break mobile clients.

### 28 — Large Excel export (5 lakh rows)
**Wrong:** generate in controller → OOM. **Correct:** background job → generate file → store → email download link.

### 29 — OTP system
Store in Redis with 5-minute TTL — not SQL. OTP is temporary data.

### 30 — Audit log
AuditLog table: TableName, RecordId, OldValue, NewValue, UpdatedBy, UpdatedDate, IPAddress — who changed salary and when.
      `,
      interviewQs: [
        {
          q: 'Why store OTP in Redis not SQL?',
          a: 'OTP is temporary, high-churn data with natural expiry. Redis TTL auto-deletes after 5 minutes without cleanup jobs. SQL would bloat with expired rows.',
          bangla: 'OTP temporary — Redis TTL; SQL-এ expired row জমা হবে।',
          difficulty: 'mid',
        },
        {
          q: 'How do you prevent SQL injection?',
          a: 'Always use parameterized queries or EF Core LINQ — never concatenate user input into SQL strings. Validate and sanitize input at API boundary.',
          bangla: 'Parameterized query / EF LINQ — string concat never।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-scenarios-31-40',
      topic: 'Doc.md — Scenarios 31–40 (System Design & Architecture)',
      difficulty: 'senior',
      english: '1 crore attendance, read replica, cache stampede, saga, blob storage, logging, microservice comms, CI/CD, Kubernetes, disaster recovery.',
      bangla: 'Scenario 31–40: scale attendance, replica, stampede, saga, blob, CI/CD, K8s, DR।',
      details: `
### 31 — Attendance for 1 crore employees
API Gateway → Attendance API → **Kafka** (punches) → consumers → SQL (primary + replica) → Redis cluster → Elasticsearch/Grafana.

### 32 — Read replica
900 reads / 100 writes → lists/reports/dashboard from replica; salary/leave writes to primary.

### 33 — Cache stampede
Redis expires → 10000 users hit SQL. Fix: lock — one request rebuilds cache; others wait or use stale-while-revalidate.

### 34 — Saga (distributed transaction)
Employee created, salary failed → compensate (rollback employee) + notify. Avoid 2PC across HTTP.

### 35 — File storage
Employee photo, resume, PDF → **Azure Blob / S3 / MinIO** — DB stores URL only, not binary.

### 36 — Logging strategy
API → Serilog → Elasticsearch → Grafana/Kibana. Log: UserId, IP, URL, Duration, Exception, **CorrelationId**.

### 37 — Microservice communication
**Sync:** REST/gRPC when immediate response needed. **Async:** RabbitMQ/Kafka for events (EmployeeCreated → Payroll + Notification).

### 38 — CI/CD
GitHub → PR → Build → Unit test → Docker image → Deploy. Tools: GitHub Actions, Azure DevOps, Jenkins.

### 39 — Kubernetes
Pod crash → new pod auto-starts. Benefits: auto-scaling, self-healing, rolling updates, load balancing.

### 40 — Disaster recovery
Daily backup → geo backup → secondary server → restore. Define **RPO** (max data loss) and **RTO** (max downtime).

### Senior rapid fire (from MD)
| Q | Answer |
| :--- | :--- |
| Kafka vs RabbitMQ? | Kafka = high-throughput event stream; RabbitMQ = task queue |
| Redis Cluster? | Distributed capacity, no single point of failure |
| API Gateway? | Single entry: routing, auth, rate limit |
| CQRS? | Separate read/write optimization |
| Clean Architecture? | Business logic independent of framework/DB |
      `,
      interviewQs: [
        {
          q: 'Kafka vs RabbitMQ — when which?',
          a: 'RabbitMQ for task queues and background jobs with per-message ack. Kafka for high-volume event streaming where multiple consumers replay the same events (attendance, analytics).',
          bangla: 'RabbitMQ = task queue; Kafka = event stream replay।',
          difficulty: 'senior',
        },
        {
          q: 'What is cache stampede and fix?',
          a: 'Many requests miss cache simultaneously and hammer SQL. Fix: mutex/singleflight so one thread rebuilds; sliding expiration; background refresh before expiry.',
          bangla: 'একসাথে cache miss → SQL hit; lock দিয়ে একজন rebuild।',
          difficulty: 'senior',
        },
      ],
    },
    {
      id: 'md-doc2-csharp',
      topic: 'Doc2.md — C# & OOP (Q1–10)',
      difficulty: 'junior',
      english: 'Class vs object, interface vs abstract, encapsulation, polymorphism, virtual/override, sealed, ref/out, StringBuilder, GC, IEnumerable vs IQueryable — full MD explanations.',
      bangla: 'Doc2 Part 1 — C# OOP Q1–10 সম্পূর্ণ ব্যাখ্যা।',
      details: `
### Q1 — Class vs Object
Class = blueprint; Object = instance (\`Employee emp = new Employee();\`).

### Q2 — Interface vs Abstract
| Interface | Abstract |
| :--- | :--- |
| Multiple inheritance | Single |
| Contract only | Can have implementation |
| Use for shared contract | Use for shared code + hierarchy |

### Q3 — Encapsulation
Hide data with private fields; controlled access via properties with validation.

### Q4 — Polymorphism
**Overloading:** same name, different params — compile time. **Overriding:** virtual/override — runtime.

### Q5 — virtual vs override
virtual = parent allows override; override = child replaces implementation.

### Q6 — sealed override
Prevents further overriding downstream.

### Q7 — ref vs out
**ref:** must assign before pass. **out:** callee must assign; caller need not initialize.

### Q8 — String vs StringBuilder
String immutable — each += new object. StringBuilder mutable — efficient in loops.

### Q9 — Garbage Collection
CLR removes unreachable objects — Gen 0 (short-lived) → Gen 1 → Gen 2 (long-lived).

### Q10 — IEnumerable vs IQueryable
**IEnumerable:** data loaded to memory, then filtered. **IQueryable:** filter translated to SQL on server — faster for large EF queries.
      `,
      code: `// Overloading vs Overriding
public class Calculator {
    public int Add(int a, int b) => a + b;
    public int Add(int a, int b, int c) => a + b + c;
}
public class Animal {
    public virtual void Sound() => Console.WriteLine("sound");
}
public class Dog : Animal {
    public override void Sound() => Console.WriteLine("bark");
}`,
      interviewQs: [
        {
          q: 'Difference between overloading and overriding?',
          a: 'Overloading: same method name, different parameters, same or different class, resolved at compile time. Overriding: same signature in child replacing parent virtual method, resolved at runtime.',
          bangla: 'Overloading = compile time, different params। Overriding = runtime, virtual/override।',
          difficulty: 'junior',
        },
        {
          q: 'ref vs out?',
          a: 'ref requires variable initialized before call — passed both ways. out caller need not initialize — method must assign before return.',
          bangla: 'ref = আগে value; out = method assign করবে।',
          difficulty: 'junior',
        },
      ],
    },
    {
      id: 'md-doc2-aspnet-ef',
      topic: 'Doc2.md — ASP.NET, EF Core (Q11–20)',
      difficulty: 'mid',
      english: 'Middleware, Serilog, DI lifetimes, REST constraints, status codes, AsNoTracking, Include, migration, lazy/eager/explicit loading, SaveChanges.',
      bangla: 'Doc2 Q11–20 — Middleware, Serilog, DI, REST, EF loading।',
      details: `
### Q11 — Middleware
Pipeline between request/response: authentication, logging, exception handling, CORS.

### Serilog
Structured logging framework — sinks to Console, File, Elasticsearch, Grafana Loki. **Sink** = where logs are stored.

### Q12 — DI
Register in Program.cs → container creates → constructor injection. Loose coupling, testable.

### Q13 — Lifetimes
| Lifetime | Scope | Example |
| :--- | :--- | :--- |
| Transient | Every injection | Validator |
| Scoped | Per HTTP request | DbContext |
| Singleton | App lifetime | Logger |

### Q14 — REST
Stateless, uniform interface, cacheable. GET=read, POST=create, PUT=full update, PATCH=partial, DELETE=remove.

### Q15 — Status codes
200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error.

### Q16 — AsNoTracking()
Read-only queries skip change tracking — faster, less memory.

### Q17 — Include()
Eager load related data in same SQL query.

### Q18 — Migration
EF Core migration = version control for database schema. \`dotnet ef migrations add Initial\` → \`dotnet ef database update\`. Tracks schema changes in code — team syncs DB from migration history.

### Q19 — Loading strategies
| Strategy | When | Remember |
| :--- | :--- | :--- |
| Lazy | Load on access | "Load when accessed" — N+1 risk in APIs |
| Eager | Include() | "Load everything now" — reports |
| Explicit | Load() on demand | "Load when I say so" — button click |

### Q20 — SaveChanges()
Commits all tracked changes in one transaction.
      `,
      interviewQs: [
        {
          q: 'What is Serilog and what is a Sink?',
          a: 'Serilog is structured logging for .NET. A sink is the destination — file, SQL, Elasticsearch. Use structured templates: Log.Information("User {UserId} login", id) not string concat.',
          bangla: 'Serilog = structured log; Sink = log কোথায় save (file, ES)।',
          difficulty: 'mid',
        },
        {
          q: 'Lazy vs Eager vs Explicit loading?',
          a: 'Eager (Include): load related data upfront — best for reports. Lazy: load on navigation access — risky in Web APIs (N+1). Explicit: developer calls Load() when needed.',
          bangla: 'Eager = Include; Lazy = access-এ load; Explicit = manual Load()।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-doc2-sql',
      topic: 'Doc2.md — SQL Server (Q21–35)',
      difficulty: 'mid',
      english: 'Clustered/nonclustered index, CTE, ROW_NUMBER, RANK vs DENSE_RANK, JOINs, EXISTS vs IN, SP, view, trigger, slow query, execution plan, deadlock, normalization.',
      bangla: 'Doc2 Q21–35 — Index, CTE, ROW_NUMBER, EXISTS, normalization, deadlock।',
      details: `
### Q21–22 — Indexes
**Clustered:** physically sorts table (one per table, usually PK). **Nonclustered:** separate structure pointing to rows (many allowed).

### Q23 — CTE
Temporary named result set for one query. **Recursive CTE:** employee-manager hierarchy. vs Temp table: use temp when reuse/index needed on intermediate data.

### Q24 — ROW_NUMBER()
Unique serial per row in partition/order.

### Q25 — RANK vs DENSE_RANK
Rank: 1,2,2,**4** (gap). Dense_rank: 1,2,2,**3** (no gap).

### Q26 — INNER vs LEFT JOIN
Inner: matching rows only. Left: all left table rows + matches from right.

### Q27 — EXISTS vs IN
EXISTS: "does row exist?" — stops early, good for large tables. IN: value in list — good for small sets. **NOT EXISTS** safer than NOT IN when NULL possible.

### Q28–30 — SP, View, Trigger
SP: precompiled SQL, performance. View: virtual table. Trigger: auto action on INSERT/UPDATE/DELETE.

### Q31–35 — Performance
Slow query causes: missing index, table scan, too many joins, scalar functions on columns, parameter sniffing. **Normalization:** reduce duplication. **Denormalization:** duplicate for read speed.
      `,
      code: `-- Second highest salary (Doc.md SQL 1)
SELECT MAX(Salary) FROM Employee
WHERE Salary < (SELECT MAX(Salary) FROM Employee);

-- Nth highest (DENSE_RANK)
SELECT Salary FROM (
  SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) Rnk
  FROM Employee
) t WHERE Rnk = 3;

-- Department highest salary (ROW_NUMBER)
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC) RN
  FROM Employee
) t WHERE RN = 1;`,
      interviewQs: [
        {
          q: 'EXISTS vs IN — when which?',
          a: 'EXISTS for existence checks on large datasets — stops at first match. IN for small static lists. Use NOT EXISTS instead of NOT IN when subquery may contain NULL.',
          bangla: 'EXISTS = exists check; IN = small list; NOT EXISTS > NOT IN with NULL।',
          difficulty: 'mid',
        },
        {
          q: 'CTE vs Temp Table?',
          a: 'CTE: readable, one-query scope, good for recursion. Temp table: session-scoped, can index, reuse across multiple statements, better for large intermediate results used multiple times.',
          bangla: 'CTE = one query readability; Temp table = reuse + index।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-doc2-async-design',
      topic: 'Doc2.md — Async, SOLID, Security (Q36–50)',
      difficulty: 'mid',
      english: 'async/await, Task vs Thread, ConfigureAwait, SOLID with examples, Repository, UoW, DTO, JWT, Auth vs AuthZ, ERP scenarios.',
      bangla: 'Doc2 Q36–50 — async, SOLID, JWT, ERP scenario।',
      details: `
### Q36–38 — Async
**async/await:** non-blocking I/O — thread freed while waiting. **Task vs Thread:** Thread = OS worker (expensive); Task = work unit on thread pool. **ConfigureAwait(false):** library code — do not capture UI context (less relevant in ASP.NET Core).

### Q39 — SOLID (MD examples)
- **S:** EmployeeService only saves — EmailService sends mail separately
- **O:** Add BkashPayment class without changing existing payment code
- **L:** Child payment must not throw unexpectedly vs parent contract
- **I:** IWork + IEat instead of fat IWorker forcing Robot.Eat()
- **D:** Depend on IRepository not SqlServerRepository

### Q40–42 — Repository, UoW, DTO
Repository separates data access. UoW coordinates multiple repos in one transaction. DTO hides sensitive fields in API responses.

### Q43–44 — JWT & Auth
JWT = stateless token auth. **Authentication** = who are you? **Authorization** = what can you access?

### Q45–50 — ERP scenarios (from MD)
| # | Topic | Answer summary |
| :--- | :--- | :--- |
| 45 | API slow | SQL plan, index, AsNoTracking, pagination, Redis |
| 46 | 1 lakh payroll | Batch, SP, background job, RabbitMQ |
| 47 | Redis why | Cache frequent reads |
| 48 | RabbitMQ why | Async email/PDF without blocking API |
| 49 | Kafka why | High-volume event streaming |
| 50 | Self intro | Name, stack, ERP domain, achievement, learning goal |
      `,
      interviewQs: [
        {
          q: 'Explain SOLID with payment example (from MD).',
          a: 'SRP: separate EmailService from EmployeeService. OCP: new payment gateway as new class implementing IPayment. DIP: EmployeeService depends on IPayment not concrete Bkash class.',
          bangla: 'SRP = এক class এক কাজ; OCP = extend; DIP = interface depend।',
          difficulty: 'mid',
        },
        {
          q: 'Task vs Thread?',
          a: 'Thread is OS execution unit — costly to create. Task represents work scheduled on thread pool — preferred in .NET. Use async/await for I/O; Parallel/Task.Run for CPU-bound with care in ASP.NET.',
          bangla: 'Thread = OS worker; Task = thread pool work; async = I/O।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-doc2-bonus-51-60',
      topic: 'Doc2.md — Bonus ERP Traps (Q51–60)',
      difficulty: 'mid',
      english: 'LINQ vs SQL, IEnumerable vs IQueryable, Any vs Count, First vs FirstOrDefault, Single vs SingleOrDefault, DI lifetimes, Task.WhenAll, transactions, concurrency, index/plan.',
      bangla: 'Doc2 Bonus Q51–60 — ERP trap questions সম্পূর্ণ।',
      details: `
### Q51 — LINQ vs SQL
SQL = database language (runtime). LINQ = C# type-safe, compile-time check, EF translates to SQL.

### Q52 — IEnumerable vs IQueryable (EF)
ToList() first → filter in memory (bad). IQueryable Where → filter in SQL (good).

### Q53 — Any vs Count
Any() stops at first match. Count() counts all — slower for existence check.

### Q54–55 — First vs FirstOrDefault vs Single vs SingleOrDefault
First: throws if empty. FirstOrDefault: returns null. Single: exactly one or throws. SingleOrDefault: zero or one — use for unique keys like email.

### Q56 — DI lifetimes (table)
Transient / Scoped / Singleton — DbContext must be Scoped.

### Q57 — Task.WhenAll vs sequential
Independent I/O → Task.WhenAll (~2s vs ~6s). Dependent steps (save employee then salary) → sequential await.

### Q58 — TransactionScope vs BeginTransaction()
Single DB → BeginTransaction(). Multiple DBs → TransactionScope (careful with MSDTC).

### Q59 — Optimistic vs Pessimistic
ERP updates: usually optimistic (RowVersion). Pessimistic lock for scarce inventory.

### Q60 — Optimize slow SQL
Execution plan → missing index → avoid SELECT * → SARGable predicates → pagination → verify improvement.
      `,
      interviewQs: [
        {
          q: 'Task.WhenAll vs sequential await?',
          a: 'When calls are independent (employee, department, salary from different services), Task.WhenAll runs concurrently. When step B needs result from step A, use sequential await. Do not parallel on same DbContext.',
          bangla: 'Independent → WhenAll; dependent → sequential; same DbContext parallel নয়।',
          difficulty: 'mid',
        },
        {
          q: 'TransactionScope vs BeginTransaction()?',
          a: 'EF BeginTransaction() for single database operations — most common. TransactionScope when spanning multiple databases or resource managers — adds complexity.',
          bangla: 'Single DB → BeginTransaction(); multi DB → TransactionScope।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-doc2-advanced-61-80',
      topic: 'Doc2.md — Advanced Q61–80 + ACID',
      difficulty: 'senior',
      english: 'Deep DI, SOLID examples, middleware, JWT, refresh token, Redis/RabbitMQ/Kafka projects, API versioning, exception middleware, Serilog, BackgroundService, CQRS, Clean Architecture, Docker, microservices, API Gateway, unit testing, ERP design, ACID.',
      bangla: 'Doc2 Q61–80 + ACID — advanced interview সম্পূর্ণ।',
      details: `
### Q61–65 — DI, SOLID, Repository, Middleware, JWT
Full code examples in MD: without DI vs constructor injection; SRP/OCP/LSP/ISP/DIP with Employee/Payment/Robot examples; custom RequestLoggingMiddleware; JWT flow (login → token → Bearer header).

### Q66 — Refresh Token
Access token 15–30 min; refresh token 7 days in DB; revoke on logout.

### Q67–69 — Redis, RabbitMQ, Kafka (real project answers)
Redis: cache employee profile 10 min TTL, invalidate on update. RabbitMQ: salary done → queue email/SMS. Kafka vs Rabbit: queue vs event stream table from MD.

### Q70 — API Versioning
/api/v1/employee and /api/v2/employee — URL versioning most common.

### Q71–75 — Exception middleware, Serilog, BackgroundService, CQRS, Clean Architecture
Global exception handler; structured logs to Elasticsearch; AttendanceJob : BackgroundService; separate read/write; Domain → Application → Infrastructure layers.

### Q76–80 — Docker, Microservices, API Gateway, Unit Testing, ERP Design
Multi-stage Dockerfile; when NOT microservices; YARP/Ocelot gateway; xUnit + Moq; full HRM architecture answer (2–3 min spoken).

### ACID (from MD)
| Property | Meaning |
| :--- | :--- |
| Atomicity | All or nothing |
| Consistency | Rules never broken |
| Isolation | Concurrent txs don't corrupt |
| Durability | Committed survives crash |

EF SaveChanges() wraps changes in a transaction. Use BeginTransaction() for multi-step business operations.
      `,
      code: `// Exception middleware (from MD)
public class ExceptionMiddleware {
    private readonly RequestDelegate _next;
    public ExceptionMiddleware(RequestDelegate next) => _next = next;
    public async Task Invoke(HttpContext ctx) {
        try { await _next(ctx); }
        catch (Exception ex) {
            ctx.Response.StatusCode = 500;
            await ctx.Response.WriteAsJsonAsync(new { success = false, message = "Internal Server Error" });
        }
    }
}

// Redis cache-aside (from MD)
public async Task<Employee?> GetEmployee(int id) {
    var key = $"employee:{id}";
    var cached = await _redis.GetStringAsync(key);
    if (cached != null) return JsonSerializer.Deserialize<Employee>(cached);
    var emp = await _context.Employees.FindAsync(id);
    await _redis.SetStringAsync(key, JsonSerializer.Serialize(emp),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) });
    return emp;
}`,
      interviewQs: [
        {
          q: 'Explain Clean Architecture layers (from MD).',
          a: 'Domain: entities and business rules — no EF. Application: use cases, DTOs. Infrastructure: EF, Redis, RabbitMQ. API: controllers, middleware. Dependency points inward — Domain knows nothing external.',
          bangla: 'Domain → Application → Infrastructure; API outer; dependency inward।',
          difficulty: 'senior',
        },
        {
          q: 'What is ACID?',
          a: 'Atomicity: all operations succeed or all roll back. Consistency: valid state after commit. Isolation: concurrent transactions do not interfere. Durability: committed data persists after crash.',
          bangla: 'Atomicity=all/nothing; Consistency=rule; Isolation=concurrent safe; Durability=permanent।',
          difficulty: 'mid',
        },
        {
          q: 'Refresh token — why needed?',
          a: 'Short-lived access tokens limit exposure if stolen. Refresh tokens allow new access tokens without re-login. Store refresh in DB and revoke on logout.',
          bangla: 'Access short; refresh long-lived; logout-এ revoke।',
          difficulty: 'mid',
        },
      ],
    },
    {
      id: 'md-mock-rounds-full',
      topic: 'Doc.md — Mock Interview Round 1 & 2 (Complete)',
      difficulty: 'mid',
      english: 'Full mock answers from uploaded MD: self-intro, project, bug STAR, API optimize, DI, lifetimes, async, SOLID, Clean Architecture, HR questions, repository, IQueryable, ValueTask, Span, GC, IDisposable, SELECT *, Any, First.',
      bangla: 'Uploaded MD — Mock Round 1 ও 2 সম্পূর্ণ উত্তর।',
      details: `
### Round 1 — Key answers (from MD)

**Q1 Tell me about yourself (strong):**
"I'm a .NET Software Engineer with ERP/HRM experience — ASP.NET Core, EF Core, SQL Server. I focus on attendance, payroll, SQL optimization. Learning Redis, RabbitMQ, Clean Architecture. Looking for large-scale backend opportunities."

**Q2 Current project structure:**
Name → Purpose → Tech → Modules → Your role → Challenges → Achievement

**Q4 Difficult bug (STAR):**
Report 30s → missing index + N+1 + SELECT * → index + projection + AsNoTracking → 2s

**Q5 Optimize API (10 steps from MD):**
Profile → SQL plan → index → DTO projection → AsNoTracking → pagination → remove N+1 → parallel independent calls → Redis → monitor

**Q6 DI:** Dependencies injected via constructor — loose coupling, testable, maintainable.

**Q7 Lifetimes:** Never Singleton DbContext.

**Q8 async/await:** Frees thread during I/O — better scalability.

**Q9 SOLID:** S=one responsibility, O=extend not modify, L=child replaces parent, I=small interfaces, D=depend on abstractions.

**HR Q11 Why leave:** Growth opportunity — never badmouth boss.

**HR Q13 Weakness:** "Focused on implementation over testing — now learning xUnit/Moq."

### Round 2 — Advanced (from MD)

**Q16 Repository every project?** No — EF DbContext is enough for CRUD; add when complex.

**Q18 IQueryable vs IEnumerable:** IQueryable builds SQL; IEnumerable filters in memory after load.

**Q19 Deferred execution:** Query runs at ToListAsync/foreach, not at Where.

**Q20 ValueTask:** Less allocation when method often completes synchronously — measure first.

**Q21 Span:** Lightweight memory view — high performance parsing; cannot cross await.

**Q26 SELECT * bad:** Extra columns, network, memory, covering index miss.

**Q27 Any vs Count>0:** Any stops early.

**Q28 First vs FirstOrDefault:** First throws when empty; FirstOrDefault returns null.
      `,
      interviewQs: [
        {
          q: 'Describe a difficult bug you solved (STAR from MD).',
          a: 'Situation: attendance report 30 seconds. Task: I owned performance. Action: execution plan showed table scan and N+1 — added index, DTO projection, AsNoTracking. Result: 2 seconds. Learned: always measure before caching.',
          bangla: 'STAR: 30s report → index + projection → 2s → learned measure first।',
          difficulty: 'mid',
        },
        {
          q: 'Does every project need Repository Pattern (from MD)?',
          a: 'No. EF Core DbContext already provides repository and unit of work. Small apps: Controller → Service → DbContext. Add repository when complex queries, multiple data sources, or testing boundaries require it.',
          bangla: 'সব project-এ নয় — EF Core-ই repository; complex হলে add।',
          difficulty: 'senior',
        },
        {
          q: 'Why ValueTask (from MD)?',
          a: 'Default to Task. Consider ValueTask only in hot paths where profiling shows benefit and the operation often completes synchronously — reduces allocations.',
          bangla: 'Default Task; ValueTask শুধু measure করে hot path-এ।',
          difficulty: 'senior',
        },
      ],
    },
  ],
  quickRevision: {
    concepts: [
          'Doc.md: 40 scenarios + mock + live coding + SQL 1–10',
      'Doc2: Q1–80 + ACID',
      'All topics in this module — cross-check with core modules',
      'Scenario 21–30: OTP Redis, audit log, file upload',
      'Q61–80: refresh token, Docker, ERP design',
    ],
    questions: [
      'ACID meaning?',
      'Refresh token why?',
      'Cache stampede fix?',
      'Mock self-intro 90 sec?',
      'Repository on every project?',
    ],
    mistakes: [
      'Skipping this module thinking bdinterview had everything',
      'Not practicing mock answers aloud',
      'Claiming K8s/Kafka production falsely',
    ],
    scenarios: [
      'Full MD scenario checklist 1–40',
      'Doc2 Q51–60 traps',
      'ERP system design Q80',
    ],
  },
  summary:
    'Complete index of uploaded Doc.md and Doc2.md — every topic with bilingual explanations. Pair with core modules and /csharpproblems for live coding practice.',
};
