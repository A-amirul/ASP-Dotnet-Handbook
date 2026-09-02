import fs from 'fs';

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const merged = fs.readFileSync('src/data/bilingualPatches.ts', 'utf8');
const keys = new Set([...merged.matchAll(/^\s*'([^']+)': \{/gm)].map((m) => m[1]));

const taskTitles = [...fs.readFileSync('src/data/codingTasks.ts', 'utf8').matchAll(/title: "([^"]+)"/g)].map((m) => m[1]);

const all = [
  'MVC Lifecycle + Middleware Pipeline + Routing', 'Filters + Model Binding + Validation',
  'MVC vs Razor Pages vs Web API + State Management', 'Authentication, Authorization, Claims, Roles, Policies',
  'JWT Auth, Cookie Auth, Identity Framework, CORS, Versioning',
  'Normalization vs denormalization, keys, and constraints',
  'Indexes: clustered, nonclustered, composite, covering, included columns, SARGability',
  'Execution plans, query optimization, and missing-index warnings',
  'Joins, CTE vs temp table vs table variable, views, procs, functions',
  'Transactions, ACID, isolation levels, anomalies, deadlocks, blocking',
  'Investigation playbook: API query 1s → 10s and an 88% missing-index warning',
  'Creational Patterns', 'Structural Patterns', 'Behavioral Patterns', 'Pattern Selection and Overengineering',
  'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once, Idempotent Consumers',
  'RabbitMQ: Exchange, Queue, Routing Key, Ack, Retry, DLQ, Ordering',
  'Kafka: Partitions, Offset, Consumer Groups, Ordering Guarantees',
  'RabbitMQ vs Kafka — When to Choose',
  'Practical .NET: Duplicates, Retry, DLQ (MassTransit or Raw)',
  'IHostedService and BackgroundService', 'Hangfire vs Quartz vs Queue-Based Workers',
  'Retry, Scheduling, Failure, Idempotency, Distributed Double-Run',
  'ASP.NET: Do Not Block Request Threads; 202 Accepted',
  'Fundamentals: Statelessness, Scale, Load Balancing, CAP, Consistency',
  'Resilience: Distributed Transactions, Idempotency, Retry, Timeout, Circuit Breaker, Bulkhead, Backoff, Locks',
  'Monolith vs Modular Monolith vs Microservices; Boundaries; When NOT to Split',
  'API Gateway, Service Discovery, REST vs gRPC, Event-Driven',
  'Saga, Outbox, CQRS in a Distributed Context',
  'Distributed Tracing and Resilience in .NET (Polly)',
  'Pyramid, AAA, unit vs integration vs e2e', 'xUnit, Moq, FluentAssertions, doubles',
  'EF, HttpClient, Testcontainers, async tests',
  'Structured Logging with Serilog', 'Correlation, OpenTelemetry, Metrics vs Logs vs Traces',
  'logging-setup', 'correlation-tracing', 'exception-handling', 'performance-monitoring',
  'profiling-tools', 'caching-strategies', 'query-optimization', 'async-programming',
  'Docker & Containerization', 'CI/CD & Automation', 'Azure for .NET Architects', 'Git for Senior Engineers',
  'Monolith vs Microservices', 'Caching Patterns & Redis', 'Clean Architecture',
  'System Design Method + URL Shortener', 'E-commerce, Payments, Notifications — Trade-off Pack',
  'JSON Standards & ProblemDetails',
  "Loop Control: 'foreach' vs 'for'", 'List vs Dictionary: Performance Mapping', 'Tuples, Delegates & Func Concept',
  'API Slow, SQL Suddenly Slow, and N+1', 'Database CPU 100% and Connection Pool Exhaustion',
  'Memory Leaks and GC Pauses', 'Crash Under Load, Thread Pool Starvation, and 10k RPS',
  'Deadlocks and Two Users Updating the Same Record', 'Redis Down and Cache Stampede',
  'RabbitMQ Consumer Stopped, Duplicates, and Poison Messages',
  'Double Submit, JWT Expiry Mid-Request, and Jobs That Run Twice',
  'External API Down and Cascading Failure', 'Bad Deploy — Detect, Rollback, and Stop the Bleeding',
  'Distributed Correctness — Cross-Service Transactions, Split-Brain Locks, Clock Skew',
  '100+ Scenario Catalog and How to Attack Any Unknown Incident',
  'Tell Me About Yourself / Why Hire You as Senior', 'Difficult Production Issue / Incident Command',
  'Technical Disagreement, Code Review, and Mentoring', 'Deadlines, Technical Debt, and Legacy Code',
  'Architectural Decisions, Performance vs Maintainability', 'Handling Production Incidents with Stakeholders',
  'C#, OOP, LINQ, Async', 'ASP.NET, DI, EF, SQL, Security',
  'Architecture, Redis, Messaging, Docker, Azure, Testing', 'System Design & Behavioral',
  'IEnumerable vs IQueryable; First vs Single; AsNoTracking vs Tracking',
  'Task vs Thread; Async vs Parallelism; ConfigureAwait',
  'Interface vs Abstract; Struct vs Class; Const vs Readonly; Ref vs Out vs In',
  'Singleton vs Scoped; Captive Dependency', 'JWT vs Session; Redis vs Database; RabbitMQ vs Kafka',
  'Monolith vs Microservices; Vertical vs Horizontal Scaling',
  'C# / OOP / LINQ / Async Cheat Sheet', 'ASP.NET / DI / EF / SQL Cheat Sheet',
  'Architecture / Security / Redis / Messaging Cheat Sheet', 'System Design — One-Page Method',
  '30 Must-Know Questions (Short Senior Answers)', 'Mock Interview Roadmap — 13 Phases and Night-Before Drill',
  'C# 14 Field Keyword: Clean DDD Entity Encapsulation',
  'EF Core 10 Named Query Filters: Stacked Multi-Tenancy & Soft Deletes',
  'High-Performance T-SQL: Replacing Cursors with WHILE Loop Batches & .NET 10 JIT Loop Inversion',
  ...taskTitles,
];

const missing = all.map(slug).filter((s) => !keys.has(s));
console.log('Total keys in file:', keys.size);
console.log('Required slugs:', all.length);
console.log('Missing:', missing.length);
missing.forEach((m) => console.log(' -', m));
