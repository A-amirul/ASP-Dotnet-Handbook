#!/usr/bin/env node
/**
 * Generates TypeScript patch entries for bilingualPatches.ts
 * Output: src/data/_generated_patches.ts.txt
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATCH_ROWS, DIAGRAMS as D } from './patch-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../src/data/_generated_patches.ts.txt');

const T = (en, bn) => ({ en, bn });

function row(slug, diagram, what, why, how, analogy, realWorld, tableEn, tableBn, mistakes, practices) {
  return { slug, diagram, what, why, how, analogy, realWorld, tableEn, tableBn, mistakes, practices };
}

/** Slug metadata: [slug, diagram|null, titleEn, titleBn, focusEn, focusBn, howEn?, howBn?, analogyEn?, analogyBn?, rwEn?, rwBn?, tableEn?, tableBn?, mistakes?, practices?] */
function meta(
  slug, diagram, titleEn, titleBn, focusEn, focusBn,
  howEn, howBn, analogyEn, analogyBn, rwEn, rwBn, tableEn, tableBn, mistakes, practices,
) {
  const what = T(
    `**${titleEn}**: ${focusEn}`,
    `**${titleBn}**: ${focusBn}`,
  );
  const why = T(
    `Understanding ${titleEn.toLowerCase()} prevents production bugs, interview traps, and costly architectural mistakes in .NET systems.`,
    `${titleBn} বুঝলে production bug, interview trap এবং .NET architecture-এ costly mistake এড়ানো যায়।`,
  );
  const how = T(
    howEn ?? `Apply ${titleEn.toLowerCase()} in code reviews, design docs, and incident postmortems — measure before optimizing.`,
    howBn ?? `${titleBn} code review, design doc, incident postmortem-এ apply করুন — optimize-এর আগে measure করুন।`,
  );
  const analogy = T(
    analogyEn ?? `${titleEn} is like a well-labeled toolbox — you reach for the right tool instead of forcing the wrong one.`,
    analogyBn ?? `${titleBn} = সঠিক label-যুক্ত toolbox — ভুল tool force না করে সঠিকটা নিন।`,
  );
  const realWorld = T(
    rwEn ?? `A senior .NET team used ${titleEn.toLowerCase()} during a production incident and reduced MTTR by fixing root cause instead of symptoms.`,
    rwBn ?? `একটি senior .NET team production incident-এ ${titleBn} apply করে symptom নয় root cause fix করে MTTR কমিয়েছিল।`,
  );
  const tblEn = tableEn ?? `| Aspect | Detail | When |
| :--- | :--- | :--- |
| **Core** | ${focusEn.slice(0, 60)}… | Daily development |
| **Risk** | Wrong usage causes subtle bugs | Under load |
| **Verify** | Logs, metrics, tests | Before release |`;
  const tblBn = tableBn ?? `| Aspect | Detail | কখন |
| :--- | :--- | :--- |
| **Core** | ${focusBn.slice(0, 60)}… | Daily development |
| **Risk** | ভুল usage subtle bug | Load-এ |
| **Verify** | Log, metric, test | Release-এর আগে |`;
  const m = mistakes ?? [
    T(`Treating ${titleEn.toLowerCase()} as a silver bullet without measuring impact.`, `${titleBn} measure ছাড়া silver bullet মনে করা।`),
    T(`Skipping documentation so the next developer repeats the same mistake.`, `Documentation skip — পরের developer same mistake।`),
  ];
  const p = practices ?? [
    T(`Document trade-offs when choosing ${titleEn.toLowerCase()}.`, `${titleBn} বেছে নিলে trade-off document করুন।`),
    T(`Add tests or observability to prove the approach works under load.`, `Load-এ কাজ করে proof-এর জন্য test/observability যোগ করুন।`),
  ];
  return row(slug, diagram, what, why, how, analogy, realWorld, tblEn, tblBn, m, p);
}

const META_PATCHES = [
  // SQL (6)
  meta('normalization-vs-denormalization-keys-and-constraints', null,
    'Normalization vs Denormalization, Keys & Constraints',
    'Normalization vs Denormalization, Keys ও Constraints',
    'Normalization (3NF) splits tables to reduce redundancy; denormalization duplicates data for faster reads; PK/FK/UNIQUE/CHECK constraints enforce integrity.',
    'Normalization (3NF) table split করে redundancy কমায়; denormalization read speed-এর জন্য duplicate; PK/FK/UNIQUE/CHECK integrity enforce।',
    'Start normalized (3NF). Denormalize only hot read paths with a sync strategy (triggers, events). Always declare PK, FK, and NOT NULL on required columns.',
    '3NF দিয়ে শুরু। শুধু hot read path denormalize — sync strategy (trigger, event) সহ। PK, FK, NOT NULL declare করুন।',
    'Normalization is organizing a warehouse by SKU — no duplicate boxes. Denormalization is keeping a bestseller display near checkout — duplicate stock info for speed.',
    'Normalization = warehouse SKU organize — duplicate box নয়। Denormalization = checkout-এ bestseller display — speed-এর জন্য duplicate info।',
    'Order dashboard needed 12 joins — team denormalized `OrderSummary` table fed by Service Bus events; reads dropped from 800ms to 40ms.',
    'Order dashboard 12 join — team `OrderSummary` denormalize + Service Bus event; read 800ms → 40ms।',
    `| Approach | Pros | Cons |
| :--- | :--- | :--- |
| 3NF | No update anomalies | More joins |
| Denorm | Fast reads | Sync complexity |
| PK/FK | Referential integrity | Migration care |`,
    `| Approach | Pros | Cons |
| :--- | :--- | :--- |
| 3NF | Update anomaly নয় | বেশি join |
| Denorm | Fast read | Sync complexity |
| PK/FK | Integrity | Migration care |`,
    [T('Denormalizing without an update/sync plan (stale reads).', 'Sync plan ছাড়া denormalize — stale read।'), T('Missing FK constraints — orphan rows in production.', 'FK missing — orphan row production-এ।')],
    [T('Measure join cost before denormalizing.', 'Denormalize-এর আগে join cost measure।'), T('Use CHECK constraints for business rules at DB level.', 'Business rule DB-তে CHECK constraint।')],
  ),
  meta('indexes-clustered-nonclustered-composite-covering-included-columns-sargability', null,
    'Indexes: Clustered, Nonclustered, Covering & SARGability',
    'Index: Clustered, Nonclustered, Covering ও SARGability',
    'Clustered index defines physical row order (one per table). Nonclustered indexes are separate structures. Composite/covering indexes include columns to avoid key lookups. SARGable predicates use index-friendly comparisons (no `WHERE Year(Date)=2024`).',
    'Clustered index physical row order (table-এ এক)। Nonclustered আলাদা structure। Composite/covering column include — key lookup avoid। SARGable = index-friendly comparison (`Year(Date)` avoid)।',
    'Put clustered PK on narrow increasing key (bigint identity). Add nonclustered indexes matching WHERE + JOIN columns. Include SELECT columns for covering scans.',
    'Clustered PK narrow increasing key (bigint identity)। Nonclustered WHERE+JOIN column match। SELECT column include covering scan।',
    'Clustered index is the book spine order — pages follow it. Nonclustered is the index at the back — points to page numbers.',
    'Clustered = book spine order। Nonclustered = পেছনের index — page number point।',
    'API filtered `WHERE TenantId=@t AND Status=1 ORDER BY Created DESC` — composite index `(TenantId, Status, Created DESC) INCLUDE (Title)` removed scans.',
    'API `WHERE TenantId=@t AND Status=1 ORDER BY Created DESC` — composite index `(TenantId, Status, Created DESC) INCLUDE (Title)` scan remove।',
  ),
  meta('execution-plans-query-optimization-and-missing-index-warnings', null,
    'Execution Plans, Query Optimization & Missing Index Warnings',
    'Execution Plan, Query Optimization ও Missing Index Warning',
    'SQL Server execution plans show operators (scan, seek, join). Missing index DMVs suggest indexes. Optimization targets fewer reads, no implicit conversions, and set-based logic.',
    'Execution plan operator (scan, seek, join) দেখায়। Missing index DMV suggest। Optimization = কম read, implicit conversion নয়, set-based logic।',
    'Enable actual plan in SSMS/Azure Data Studio. Look for scans on large tables, key lookups, warnings. Test suggested indexes in non-prod first.',
    'SSMS/Azure Data Studio-এ actual plan enable। Large table scan, key lookup, warning খুঁজুন। Suggested index non-prod-এ test।',
  ),
  meta('joins-cte-vs-temp-table-vs-table-variable-views-procs-functions', null,
    'JOINs, CTE vs Temp Table vs Table Variable, Views & Procs',
    'JOIN, CTE vs Temp Table vs Table Variable, View ও Proc',
    'JOINs combine tables. CTEs are readable inline subqueries. Temp tables (#t) have statistics for large sets. Table variables (@t) suit small batches. Views simplify queries; procs encapsulate logic.',
    'JOIN table combine। CTE readable inline subquery। Temp table (#t) large set-এ statistics। Table variable (@t) small batch। View query simplify; proc logic encapsulate।',
  ),
  meta('transactions-acid-isolation-levels-anomalies-deadlocks-blocking', null,
    'Transactions, ACID, Isolation, Deadlocks & Blocking',
    'Transaction, ACID, Isolation, Deadlock ও Blocking',
    'ACID: Atomicity, Consistency, Isolation, Durability. Isolation levels (Read Committed, Serializable) trade consistency vs concurrency. Deadlocks = circular lock wait; blocking = one transaction waits.',
    'ACID: Atomicity, Consistency, Isolation, Durability। Isolation level consistency vs concurrency trade-off। Deadlock = circular lock; blocking = wait।',
    'Keep transactions short. Access tables in consistent order. Use `READ COMMITTED SNAPSHOT` to reduce reader/writer blocking. Retry deadlocks with Polly.',
    'Transaction ছোট রাখুন। Table consistent order-এ access। `READ COMMITTED SNAPSHOT` reader/writer blocking কমায়। Deadlock Polly retry।',
  ),
  meta('investigation-playbook-api-query-1s-10s-and-an-88-missing-index-warning', null,
    'Investigation Playbook: 1s → 10s Query & Missing Index Warning',
    'Investigation Playbook: 1s → 10s Query ও Missing Index Warning',
    'When API latency jumps 1s→10s: check plan regression, parameter sniffing, blocking, pool exhaustion, and missing index warnings (often 88%+ improvement estimates).',
    'API latency 1s→10s: plan regression, parameter sniffing, blocking, pool exhaustion, missing index warning (88%+ estimate) check।',
    '1) Correlate with deploy/stats update. 2) Capture slow query + plan. 3) Compare estimated vs actual rows. 4) Apply index or rewrite query. 5) Verify p95 in APM.',
    '1) Deploy/stats update correlate। 2) Slow query + plan capture। 3) Estimated vs actual row। 4) Index/query fix। 5) APM p95 verify।',
  ),

  // PATTERNS (4)
  meta('creational-patterns', D.DI_FLOW_DIAGRAM, 'Creational Patterns', 'Creational Pattern',
    'Factory, Abstract Factory, Builder, Singleton, Prototype — control object creation without scattering `new` across business code.',
    'Factory, Abstract Factory, Builder, Singleton, Prototype — business code-এ `new` scatter না করে object creation control।',
  ),
  meta('structural-patterns', null, 'Structural Patterns', 'Structural Pattern',
    'Adapter, Facade, Decorator, Proxy, Composite — compose objects into larger structures while keeping interfaces clean.',
    'Adapter, Facade, Decorator, Proxy, Composite — interface clean রেখে object বড় structure-এ compose।',
  ),
  meta('behavioral-patterns', null, 'Behavioral Patterns', 'Behavioral Pattern',
    'Strategy, Observer, Command, Mediator, Chain of Responsibility — assign responsibilities between objects and make algorithms interchangeable.',
    'Strategy, Observer, Command, Mediator, Chain of Responsibility — object-এর মধ্যে responsibility assign, algorithm interchangeable।',
  ),
  meta('pattern-selection-and-overengineering', D.SOLID_DIAGRAM, 'Pattern Selection & Overengineering', 'Pattern Selection ও Overengineering',
    'Choose patterns when pain is real (testability, variation points). Avoid pattern fever — YAGNI applies; DI + interfaces often beat Singleton everywhere.',
    'Pattern তখনই যখন pain real (testability, variation)। Pattern fever avoid — YAGNI; সব জায়গায় Singleton নয়, DI + interface।',
  ),

  // MESSAGING (5)
  meta('delivery-semantics-queue-vs-pub-sub-at-least-once-idempotent-consumers', null,
    'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once & Idempotent Consumers',
    'Delivery Semantics: Queue vs Pub/Sub, At-Least-Once ও Idempotent Consumer',
    'Queues = one consumer per message (work distribution). Pub/Sub = many subscribers. At-least-once delivery means duplicates possible — consumers must be idempotent.',
    'Queue = message-এ এক consumer (work distribution)। Pub/Sub = many subscriber। At-least-once = duplicate possible — consumer idempotent হতে হবে।',
  ),
  meta('rabbitmq-exchange-queue-routing-key-ack-retry-dlq-ordering', null,
    'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry & DLQ',
    'RabbitMQ: Exchange, Queue, Routing Key, ACK, Retry ও DLQ',
    'Producers publish to exchanges; bindings route to queues via routing keys. Manual ACK after success; NACK/requeue or DLQ on failure. Ordering only within single consumer queue.',
    'Producer exchange-এ publish; binding routing key দিয়ে queue-তে route। Success-এ manual ACK; fail-এ NACK/requeue বা DLQ। Ordering শুধু single consumer queue-তে।',
  ),
  meta('kafka-partitions-offset-consumer-groups-ordering-guarantees', null,
    'Kafka: Partitions, Offsets, Consumer Groups & Ordering',
    'Kafka: Partition, Offset, Consumer Group ও Ordering',
    'Topics split into partitions for parallelism. Consumer groups assign partitions — one consumer per partition. Offsets track progress. Ordering guaranteed per partition key.',
    'Topic partition-এ split parallelism-এর জন্য। Consumer group partition assign — partition-এ এক consumer। Offset progress track। Ordering partition key-এ guaranteed।',
  ),
  meta('rabbitmq-vs-kafka-when-to-choose', null,
    'RabbitMQ vs Kafka: When to Choose',
    'RabbitMQ vs Kafka: কখন বেছে নেবেন',
    'RabbitMQ: task queues, routing, low-latency commands, moderate throughput. Kafka: event log, replay, high throughput, stream processing.',
    'RabbitMQ: task queue, routing, low-latency command, moderate throughput। Kafka: event log, replay, high throughput, stream processing।',
  ),
  meta('practical-net-duplicates-retry-dlq-masstransit-or-raw', null,
    'Practical .NET: Duplicates, Retry, DLQ — MassTransit or Raw',
    'Practical .NET: Duplicate, Retry, DLQ — MassTransit বা Raw',
    'Use MassTransit for retries, DLQ, consumer middleware, and outbox patterns. Raw clients need manual ACK, idempotency store, and poison message handling.',
    'MassTransit retry, DLQ, consumer middleware, outbox দেয়। Raw client-এ manual ACK, idempotency store, poison message handle করতে হয়।',
  ),

  // JOBS (4)
  meta('ihostedservice-and-backgroundservice', null,
    'IHostedService & BackgroundService', 'IHostedService ও BackgroundService',
    '`BackgroundService` runs long-lived loops inside the ASP.NET host — ideal for polling, cache warm-up, or queue consumers co-hosted with the API.',
    '`BackgroundService` ASP.NET host-এ long-lived loop — polling, cache warm-up, queue consumer API-র সাথে co-host।',
  ),
  meta('hangfire-vs-quartz-vs-queue-based-workers', null,
    'Hangfire vs Quartz vs Queue-Based Workers',
    'Hangfire vs Quartz vs Queue-Based Worker',
    'Hangfire: SQL/Redis-backed jobs + dashboard. Quartz: cron scheduling. Queue workers (Service Bus/RabbitMQ): scale independently, best for heavy/async work.',
    'Hangfire: SQL/Redis job + dashboard। Quartz: cron schedule। Queue worker (Service Bus/RabbitMQ): independently scale, heavy/async work-এ best।',
  ),
  meta('retry-scheduling-failure-idempotency-distributed-double-run', null,
    'Retry, Scheduling, Failure, Idempotency & Double-Run',
    'Retry, Scheduling, Failure, Idempotency ও Double-Run',
    'Scheduled jobs must be idempotent — clock skew and restarts cause double execution. Use lease locks, dedup keys, and at-least-once safe handlers.',
    'Scheduled job idempotent — clock skew/restart double execution। Lease lock, dedup key, at-least-once safe handler।',
  ),
  meta('asp-net-do-not-block-request-threads-202-accepted', null,
    'ASP.NET: Do Not Block Request Threads — 202 Accepted',
    'ASP.NET: Request Thread Block করবেন না — 202 Accepted',
    'Never `.Result` or `.Wait()` on request threads — causes thread-pool starvation. Long work → background queue + `202 Accepted` with tracking ID.',
    'Request thread-এ `.Result`/`.Wait()` নয় — thread-pool starvation। Long work → background queue + tracking ID সহ `202 Accepted`।',
  ),

  // DISTRIBUTED (6)
  meta('fundamentals-statelessness-scale-load-balancing-cap-consistency', null,
    'Distributed Fundamentals: Statelessness, Scale, CAP',
    'Distributed Fundamentals: Statelessness, Scale, CAP',
    'Stateless services scale horizontally behind load balancers. CAP theorem: under partition, choose consistency or availability. Sticky sessions are a scaling smell.',
    'Stateless service load balancer-এ horizontal scale। CAP: partition-এ consistency বা availability। Sticky session scaling smell।',
  ),
  meta('resilience-distributed-transactions-idempotency-retry-timeout-circuit-breaker-bulkhead-backoff-locks', null,
    'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Locks',
    'Resilience: Retry, Timeout, Circuit Breaker, Bulkhead, Lock',
    'Polly policies: retry with jitter, timeouts, circuit breaker, bulkhead isolation. Prefer Saga/outbox over 2PC. Distributed locks (Redis) only when necessary.',
    'Polly: jitter retry, timeout, circuit breaker, bulkhead। 2PC-এর বদলে Saga/outbox। Distributed lock (Redis) শুধু প্রয়োজনে।',
  ),
  meta('monolith-vs-modular-monolith-vs-microservices-boundaries-when-not-to-split', null,
    'Monolith vs Modular Monolith vs Microservices',
    'Monolith vs Modular Monolith vs Microservice',
    'Start modular monolith with clear boundaries. Split to microservices when independent scaling, team autonomy, or failure isolation justifies ops cost.',
    'Modular monolith clear boundary দিয়ে শুরু। Microservice যখন independent scale, team autonomy, failure isolation ops cost justify।',
  ),
  meta('api-gateway-service-discovery-rest-vs-grpc-event-driven', null,
    'API Gateway, Service Discovery, REST vs gRPC, Event-Driven',
    'API Gateway, Service Discovery, REST vs gRPC, Event-Driven',
    'Gateway handles auth, rate limits, routing. Service discovery (K8s DNS, Consul) locates instances. gRPC for internal low-latency; REST for public APIs. Events decouple services.',
    'Gateway auth, rate limit, routing। Service discovery (K8s DNS) instance locate। Internal gRPC; public REST। Event service decouple।',
  ),
  meta('saga-outbox-cqrs-in-a-distributed-context', D.CQRS_DIAGRAM,
    'Saga, Outbox & CQRS in Distributed Systems',
    'Distributed System-এ Saga, Outbox ও CQRS',
    'Saga coordinates multi-service transactions via compensating steps. Outbox ensures reliable event publish with DB write. CQRS separates read/write models for scale.',
    'Saga compensating step দিয়ে multi-service transaction coordinate। Outbox DB write-এর সাথে reliable event publish। CQRS read/write model separate scale-এর জন্য।',
  ),
  meta('distributed-tracing-and-resilience-in-net-polly', null,
    'Distributed Tracing & Resilience in .NET (Polly)',
    'Distributed Tracing ও .NET Resilience (Polly)',
    'OpenTelemetry traces span across HTTP and messaging. Polly v8 integrates with `HttpClientFactory` for resilient outbound calls.',
    'OpenTelemetry HTTP/messaging-এ trace span। Polly v8 `HttpClientFactory`-এ resilient outbound call।',
  ),

  // TESTING (3)
  meta('pyramid-aaa-unit-vs-integration-vs-e2e', null,
    'Test Pyramid & AAA: Unit vs Integration vs E2E',
    'Test Pyramid ও AAA: Unit vs Integration vs E2E',
    'Many fast unit tests (AAA: Arrange, Act, Assert), fewer integration tests with real DB/HTTP, minimal brittle E2E. Unit tests mock boundaries; integration tests prove wiring.',
    'অনেক fast unit test (AAA), কম integration (real DB/HTTP), minimal brittle E2E। Unit boundary mock; integration wiring prove।',
  ),
  meta('xunit-moq-fluentassertions-doubles', null,
    'xUnit, Moq, FluentAssertions & Test Doubles',
    'xUnit, Moq, FluentAssertions ও Test Double',
    'xUnit for facts/theories. Moq for interfaces. FluentAssertions for readable asserts. Know stub vs mock vs fake vs spy.',
    'xUnit fact/theory। Moq interface-এর জন্য। FluentAssertions readable assert। stub vs mock vs fake vs spy জানুন।',
  ),
  meta('ef-httpclient-testcontainers-async-tests', null,
    'EF, HttpClient, Testcontainers & Async Tests',
    'EF, HttpClient, Testcontainers ও Async Test',
    'Testcontainers spin real SQL/Redis in Docker for integration tests. Use `WebApplicationFactory` for API tests. Always `await` in async tests — no `.Result`.',
    'Testcontainers Docker-এ real SQL/Redis integration test। API test `WebApplicationFactory`। Async test-এ সবসময় `await` — `.Result` নয়।',
  ),

  // OBSERVABILITY (2)
  meta('structured-logging-with-serilog', null,
    'Structured Logging with Serilog', 'Serilog দিয়ে Structured Logging',
    'Serilog writes JSON logs with properties (`{UserId}`, `{ElapsedMs}`) searchable in Seq/ELK. Enrich with correlation ID and machine name.',
    'Serilog JSON log property (`{UserId}`, `{ElapsedMs}`) Seq/ELK-এ searchable। Correlation ID, machine name enrich।',
  ),
  meta('correlation-opentelemetry-metrics-vs-logs-vs-traces', null,
    'Correlation, OpenTelemetry: Metrics vs Logs vs Traces',
    'Correlation, OpenTelemetry: Metric vs Log vs Trace',
    'Logs = discrete events. Metrics = aggregated counters/histograms. Traces = request journey across services. Correlation ID ties all three.',
    'Log = discrete event। Metric = aggregated counter/histogram। Trace = service জুড়ে request journey। Correlation ID তিনটাই tie।',
  ),

  // LOGGING (4)
  meta('logging-setup', null, 'Logging Setup', 'Logging Setup',
    'Configure `ILogger<T>` with Serilog/NLog: console in dev, JSON to file/App Insights in prod. Set levels per namespace (`Microsoft` Warning).',
    '`ILogger<T>` Serilog/NLog: dev console, prod JSON file/App Insights। Namespace level (`Microsoft` Warning)।',
  ),
  meta('correlation-tracing', null, 'Correlation Tracing', 'Correlation Tracing',
    'Propagate `TraceIdentifier` or W3C `traceparent` header through HTTP, queues, and background jobs so one user action is traceable end-to-end.',
    '`TraceIdentifier` বা W3C `traceparent` HTTP, queue, background job-এ propagate — এক user action end-to-end trace।',
  ),
  meta('exception-handling', null, 'Exception Handling', 'Exception Handling',
    'Catch at boundaries (middleware, filter). Log with context, return ProblemDetails to clients, never swallow exceptions silently.',
    'Boundary-তে catch (middleware, filter)। Context সহ log, client-এ ProblemDetails, exception silently swallow নয়।',
  ),
  meta('performance-monitoring', null, 'Performance Monitoring', 'Performance Monitoring',
    'Track p50/p95 latency, error rate, saturation (CPU, thread pool, DB pool). Alert on SLO burn rate, not just averages.',
    'p50/p95 latency, error rate, saturation (CPU, thread pool, DB pool) track। Average নয়, SLO burn rate alert।',
  ),

  // PERFORMANCE (4)
  meta('profiling-tools', null, 'Profiling Tools', 'Profiling Tool',
    'dotTrace, dotMemory, PerfView, and Application Insights Profiler find CPU hotspots, allocations, and sync-over-async blocking.',
    'dotTrace, dotMemory, PerfView, App Insights Profiler CPU hotspot, allocation, sync-over-async blocking খুঁজে।',
  ),
  meta('caching-strategies', D.CACHE_ASIDE_DIAGRAM, 'Caching Strategies', 'Caching Strategy',
    'Cache-aside: app reads cache, on miss loads DB and populates. Watch stampede, TTL, invalidation on writes.',
    'Cache-aside: app cache read, miss-এ DB load + populate। Stampede, TTL, write-এ invalidation watch।',
  ),
  meta('query-optimization', D.EF_DBCONTEXT_DIAGRAM, 'Query Optimization', 'Query Optimization',
    'EF: `AsNoTracking` for reads, `Include` vs projection, compiled queries, batching. SQL: indexes, avoid SELECT *, parameterize.',
    'EF: read-এ `AsNoTracking`, `Include` vs projection, compiled query। SQL: index, `SELECT *` avoid, parameterize।',
  ),
  meta('async-programming', D.ASYNC_FLOW_DIAGRAM, 'Async Programming', 'Async Programming',
    '`async/await` frees threads during I/O. Use `Task.WhenAll` for parallel I/O. Never block with `.Result` on ASP.NET threads.',
    '`async/await` I/O-তে thread free। Parallel I/O `Task.WhenAll`। ASP.NET thread-এ `.Result` block নয়।',
  ),

  // DEVOPS (4)
  meta('docker-containerization', null, 'Docker & Containerization', 'Docker ও Containerization',
    'Multi-stage Dockerfile: SDK stage builds, runtime stage copies published output only. Use `.dockerignore`, non-root user, and env-based config.',
    'Multi-stage Dockerfile: SDK build, runtime শুধু published output copy। `.dockerignore`, non-root user, env config।',
  ),
  meta('ci-cd-automation', null, 'CI/CD & Automation', 'CI/CD ও Automation',
    'CI runs build + test on every PR. CD deploys artifacts to staging/prod with approvals. Store secrets in vault, not YAML.',
    'CI PR-এ build + test। CD artifact staging/prod deploy approval সহ। Secret vault-এ, YAML-এ নয়।',
  ),
  meta('azure-for-net-architects', null, 'Azure for .NET Architects', '.NET Architect-দের জন্য Azure',
    'App Service/Container Apps for APIs, Azure SQL, Redis, Service Bus, Key Vault + Managed Identity, Application Insights for observability.',
    'API App Service/Container Apps, Azure SQL, Redis, Service Bus, Key Vault + Managed Identity, Application Insights observability।',
  ),
  meta('git-for-senior-engineers', null, 'Git for Senior Engineers', 'Senior Engineer-দের Git',
    'Trunk-based flow, small PRs, revert on main (not reset), protected branches, conventional commits, never force-push shared history.',
    'Trunk-based flow, ছোট PR, main-এ revert (reset নয়), protected branch, conventional commit, shared history force-push নয়।',
  ),

  // SYSTEMDESIGN (5)
  meta('monolith-vs-microservices', null, 'Monolith vs Microservices', 'Monolith vs Microservice',
    'Monolith: simple deploy, one DB, good for small teams. Microservices: independent deploy/scale, distributed complexity — use when boundaries are clear.',
    'Monolith: simple deploy, one DB, ছোট team। Microservice: independent deploy/scale, distributed complexity — boundary clear হলে।',
  ),
  meta('caching-patterns-redis', D.CACHE_ASIDE_DIAGRAM, 'Caching Patterns with Redis', 'Redis Caching Pattern',
    'Redis for shared cache, session, rate limits, pub/sub. Always define TTL, handle cache miss stampede with lock or probabilistic early expiry.',
    'Redis shared cache, session, rate limit, pub/sub। TTL define, miss stampede lock/probabilistic early expiry handle।',
  ),
  meta('clean-architecture', D.CLEAN_ARCH_DIAGRAM, 'Clean Architecture', 'Clean Architecture',
    'Dependencies point inward: Domain → Application → Infrastructure. UI and DB are plugins. Test domain without ASP.NET or SQL.',
    'Dependency inward: Domain → Application → Infrastructure। UI/DB plugin। ASP.NET/SQL ছাড়া domain test।',
  ),
  meta('system-design-method-url-shortener', null, 'System Design Method: URL Shortener', 'System Design Method: URL Shortener',
    'Clarify scale (QPS, storage), API design, hash/key generation (base62), redirect flow, analytics, cache, DB sharding strategy.',
    'Scale (QPS, storage) clarify, API design, hash/key (base62), redirect flow, analytics, cache, DB sharding strategy।',
  ),
  meta('e-commerce-payments-notifications-trade-off-pack', null,
    'E-Commerce: Payments, Notifications & Trade-offs',
    'E-Commerce: Payment, Notification ও Trade-off',
    'Separate payment, inventory, notification services. Use Saga for checkout, idempotent webhooks, outbox for email/SMS, eventual consistency for catalog.',
    'Payment, inventory, notification service আলাদা। Checkout Saga, idempotent webhook, email/SMS outbox, catalog eventual consistency।',
  ),

  // FRONTEND (1)
  meta('json-standards-problemdetails', null, 'JSON Standards & ProblemDetails', 'JSON Standard ও ProblemDetails',
    'Serialize JSON as camelCase for JS clients (`JsonNamingPolicy.CamelCase`). Return RFC 7807 ProblemDetails for errors — consistent shape across controllers.',
    'JS client-এ JSON camelCase (`JsonNamingPolicy.CamelCase`)। Error RFC 7807 ProblemDetails — controller-জুড়ে consistent shape।',
  ),
];

// SCENARIOS (12) — [slug, titleEn, titleBn, focusEn]
const SCENARIO_SLUGS = [
  ['api-slow-sql-suddenly-slow-and-n-1', 'API slow: SQL regression & N+1', 'API ধীর: SQL regression ও N+1', 'Check APM for SQL time, EF queries in loop, missing Include, recent deploy/plan change.'],
  ['database-cpu-100-and-connection-pool-exhaustion', 'DB CPU 100% & Connection Pool Exhaustion', 'DB CPU 100% ও Connection Pool Exhaustion', 'Find top queries, blocking, pool max vs active connections, leak from undisposed DbContext.'],
  ['memory-leaks-and-gc-pauses', 'Memory Leaks & GC Pauses', 'Memory Leak ও GC Pause', 'Profile Gen2/LOH growth, event handler leaks, static caches, IDisposable not called.'],
  ['crash-under-load-thread-pool-starvation-and-10k-rps', 'Crash Under Load: Thread Pool Starvation', 'Load-এ Crash: Thread Pool Starvation', 'Sync-over-async, .Wait(), blocked threads — thread pool queue grows, requests timeout.'],
  ['deadlocks-and-two-users-updating-the-same-record', 'Deadlocks & Concurrent Updates', 'Deadlock ও Concurrent Update', 'Optimistic concurrency (RowVersion), short transactions, retry policy, UI conflict message.'],
  ['redis-down-and-cache-stampede', 'Redis Down & Cache Stampede', 'Redis Down ও Cache Stampede', 'Fallback to DB with circuit breaker; stampede lock; TTL jitter; graceful degradation.'],
  ['rabbitmq-consumer-stopped-duplicates-and-poison-messages', 'RabbitMQ: Stopped Consumer & Poison Messages', 'RabbitMQ: Consumer Stop ও Poison Message', 'Check prefetch, ACK mode, DLQ, consumer health, idempotent handlers for redelivery.'],
  ['double-submit-jwt-expiry-mid-request-and-jobs-that-run-twice', 'Double Submit, JWT Expiry & Duplicate Jobs', 'Double Submit, JWT Expiry ও Duplicate Job', 'Idempotency-Key header, token refresh flow, distributed lock or dedup table for jobs.'],
  ['external-api-down-and-cascading-failure', 'External API Down & Cascading Failure', 'External API Down ও Cascading Failure', 'Circuit breaker, timeout, bulkhead, cached fallback, fail fast — do not retry storm.'],
  ['bad-deploy-detect-rollback-and-stop-the-bleeding', 'Bad Deploy: Detect, Rollback, Stop Bleeding', 'Bad Deploy: Detect, Rollback, Stop Bleeding', 'Compare error rate pre/post deploy, slot swap rollback, feature flag kill switch.'],
  ['distributed-correctness-cross-service-transactions-split-brain-locks-clock-skew', 'Distributed Correctness & Split Brain', 'Distributed Correctness ও Split Brain', 'Avoid cross-DB transactions; Saga + outbox; fencing tokens; clock skew aware leases.'],
  ['100-scenario-catalog-and-how-to-attack-any-unknown-incident', '100 Scenario Catalog & Unknown Incidents', '100 Scenario Catalog ও Unknown Incident', 'Stabilize (scale/limit), observe (metrics/logs/traces), bisect (deploy/config/data), fix smallest root cause.'],
];

const SCENARIO_PATCHES_FIXED = SCENARIO_SLUGS.map(([slug, titleEn, titleBn, focusEn]) => {
  let diagram = null;
  if (slug.includes('gc-pauses')) diagram = D.GC_GENERATIONS_DIAGRAM;
  if (slug.includes('redis')) diagram = D.CACHE_ASIDE_DIAGRAM;
  return row(
    slug, diagram,
    T(`**${titleEn}**: ${focusEn}`, `**${titleBn}**: ${focusEn}`),
    T('Senior engineers debug with evidence — metrics, logs, traces — not guesses.', 'Senior engineer evidence দিয়ে debug — metric, log, trace — guess নয়।'),
    T('Stabilize service → collect data → form hypothesis → validate → deploy fix → postmortem.', 'Service stabilize → data → hypothesis → validate → fix → postmortem।'),
    T('Firefighter: contain fire, find source, prevent spread — same for production fires.', 'Firefighter: fire contain, source খুঁজুন — production fire-ও same।'),
    T(`During "${titleEn}", the winning move was correlating deploy time with metric spikes.`, `"${titleEn}"-এ deploy time + metric spike correlate করা winning move ছিল।`),
    `| Phase | Goal |\n| :--- | :--- |\n| Stabilize | Stop user impact |\n| Observe | Find signal |\n| Fix | Root cause |`,
    `| Phase | Goal |\n| :--- | :--- |\n| Stabilize | User impact stop |\n| Observe | Signal খুঁজুন |\n| Fix | Root cause |`,
    [T('Restarting servers without capturing dumps/logs.', 'Dump/log capture ছাড়া server restart।'), T('Announcing "fixed" before metrics recover.', 'Metric recover-এর আগে "fixed" announce।')],
    [T('Keep incident channel with single commander.', 'Single commander incident channel।'), T('Document every hypothesis tested.', 'প্রতিটি hypothesis tested document।')],
  );
});

// LEADERSHIP (6)
const LEADERSHIP = [
  ['tell-me-about-yourself-why-hire-you-as-senior', 'Tell Me About Yourself / Why Hire You', 'STAR format: 2-min career arc, 2 wins with metrics, why this role, what you bring (mentoring, incidents, trade-offs).'],
  ['difficult-production-issue-incident-command', 'Difficult Production Issue', 'Describe one incident: detection, command role, comms, root cause, prevention — show calm and ownership.'],
  ['technical-disagreement-code-review-and-mentoring', 'Technical Disagreement & Mentoring', 'Disagree with data and prototypes, not ego. Code review: ask questions, teach patterns, praise good work.'],
  ['deadlines-technical-debt-and-legacy-code', 'Deadlines, Tech Debt & Legacy', 'Negotiate scope, not quality. Boy Scout rule. Strangler fig for legacy. Document debt with cost.'],
  ['architectural-decisions-performance-vs-maintainability', 'Architecture: Performance vs Maintainability', 'Start simple, measure, optimize hot paths. Explain trade-off to stakeholders in business terms.'],
  ['handling-production-incidents-with-stakeholders', 'Incidents with Stakeholders', 'Regular updates, no jargon, ETA honest, postmortem shared — build trust under pressure.'],
];
const LEADERSHIP_PATCHES = LEADERSHIP.map(([slug, title, focus]) =>
  meta(slug, null, title, title, focus, focus,
    'Use STAR (Situation, Task, Action, Result). Quantify impact. Show learning.',
    'STAR (Situation, Task, Action, Result)। Impact quantify। Learning দেখান।',
  ),
);

// QUESTIONBANK (4)
const QB = [
  ['c-oop-linq-async', 'C#, OOP, LINQ & Async Bank', 'C#, OOP, LINQ ও Async Question Bank', 'Covers value vs reference, inheritance, LINQ deferred execution, async/await pitfalls — drill with flashcards.'],
  ['asp-net-di-ef-sql-security', 'ASP.NET, DI, EF, SQL & Security Bank', 'ASP.NET, DI, EF, SQL ও Security Bank', 'Pipeline, lifetimes, DbContext, SQL indexes, JWT/OAuth — senior short answers with trade-offs.'],
  ['architecture-redis-messaging-docker-azure-testing', 'Architecture & Production Bank', 'Architecture ও Production Bank', 'Redis, messaging semantics, Docker, Azure services, testing pyramid — cross-topic integration questions.'],
  ['system-design-behavioral', 'System Design & Behavioral Bank', 'System Design ও Behavioral Bank', 'URL shortener, e-commerce, estimation, failure modes plus leadership-style behavioral prompts.'],
];
const QB_PATCHES = QB.map(([slug, titleEn, titleBn, focus]) => meta(slug, null, titleEn, titleBn, focus, focus));

// TRAPS (6)
const TRAP_SPECS = [
  ['ienumerable-vs-iqueryable-first-vs-single-asnotracking-vs-tracking', D.LINQ_DEFERRED_DIAGRAM, 'IEnumerable vs IQueryable, First vs Single, Tracking', 'IQueryable translates to SQL; IEnumerable runs in memory. Single throws if not exactly one. AsNoTracking for read-only.'],
  ['task-vs-thread-async-vs-parallelism-configureawait', D.ASYNC_FLOW_DIAGRAM, 'Task vs Thread, Async vs Parallelism', 'Task is work; thread is OS resource. Async for I/O; Parallel for CPU. ConfigureAwait(false) in library code.'],
  ['interface-vs-abstract-struct-vs-class-const-vs-readonly-ref-vs-out-vs-in', null, 'Type System Traps', 'Interface = contract. Abstract = partial impl. Struct = value type stack. ref/out/in parameter semantics differ.'],
  ['singleton-vs-scoped-captive-dependency', D.DI_LIFETIMES_DIAGRAM, 'Singleton vs Scoped Captive Dependency', 'Never inject Scoped (DbContext) into Singleton — disposed context or stale state.'],
  ['jwt-vs-session-redis-vs-database-rabbitmq-vs-kafka', null, 'Technology Choice Traps', 'JWT stateless API; session sticky; Redis shared cache not primary DB; RabbitMQ tasks vs Kafka log.'],
  ['monolith-vs-microservices-vertical-vs-horizontal-scaling', null, 'Scaling Traps', 'Vertical = bigger machine. Horizontal = more instances. Microservices need ops maturity — not default.'],
];
const TRAP_PATCHES = TRAP_SPECS.map(([slug, diagram, title, focus]) =>
  meta(slug, diagram, title, title, focus, focus,
    'Interview trap: explain definition + when it breaks + example bug.',
    'Interview trap: definition + কখন break + example bug বলুন।',
  ),
);

// REVISION (6)
const REV_SPECS = [
  ['c-oop-linq-async-cheat-sheet', 'C#/OOP/LINQ/Async Cheat Sheet', 'One-page recall: types, SOLID, LINQ operators, async rules.'],
  ['asp-net-di-ef-sql-cheat-sheet', 'ASP.NET/DI/EF/SQL Cheat Sheet', 'Pipeline order, lifetimes, DbContext rules, index basics.'],
  ['architecture-security-redis-messaging-cheat-sheet', 'Architecture/Security/Messaging Cheat Sheet', 'Cache-aside, JWT, delivery semantics, Docker multi-stage.'],
  ['system-design-one-page-method', 'System Design One-Page Method', 'Requirements → API → data → scale → bottlenecks → trade-offs.'],
  ['30-must-know-questions-short-senior-answers', '30 Must-Know Senior Questions', 'Short structured answers: DI, async, SQL, auth, caching, incidents.'],
  ['mock-interview-roadmap-13-phases-and-night-before-drill', 'Mock Interview Roadmap', '13 phases from C# to system design; night-before sleep and flashcard drill.'],
];
const REV_PATCHES = REV_SPECS.map(([slug, title, focus]) => meta(slug, null, title, title, focus, focus));

// DOTNET10 (3)
const DOTNET10 = [
  ['c-14-field-keyword-clean-ddd-entity-encapsulation', 'C# 14 field Keyword & DDD Encapsulation', 'C# 14 `field` keyword simplifies backing field in properties — cleaner entity encapsulation in DDD.'],
  ['ef-core-10-named-query-filters-stacked-multi-tenancy-soft-deletes', 'EF Core 10 Named Query Filters', 'Stacked global filters for multi-tenancy + soft delete — compose with named filters instead of one giant expression.'],
  ['high-performance-t-sql-replacing-cursors-with-while-loop-batches-net-10-jit-loop-inversion', 'High-Performance T-SQL & .NET 10 JIT', 'Replace cursors with set-based or batched WHILE loops; .NET 10 JIT loop inversion improves hot loops.'],
];
const DOTNET10_PATCHES = DOTNET10.map(([slug, title, focus]) => meta(slug, null, title, title, focus, focus));

function taskMeta(slug, diagram, titleEn, titleBn, focusEn, focusBn, extra = {}) {
  const {
    howEn = `1) Restate the problem. 2) ${focusEn} 3) Handle edge cases. 4) State time/space complexity.`,
    howBn = `1) Problem restate। 2) ${focusBn} 3) Edge case handle। 4) Time/space complexity বলুন।`,
    analogyEn = extra.analogyEn ?? `Solving "${titleEn}" is like following a recipe card — each step has a reason, and skipping one ruins the dish.`,
    analogyBn = extra.analogyBn ?? `"${titleBn}" = recipe card follow — এক step skip করলে result ভুল।`,
    rwEn = extra.rwEn ?? `In a .NET machine test, "${titleEn}" checks whether you write clean code, explain trade-offs, and handle edge cases — not just pass sample input.`,
    rwBn = extra.rwBn ?? `.NET machine test-এ "${titleBn}" clean code, trade-off explain, edge case — sample pass মাত্র নয়।`,
    tableEn = extra.tableEn,
    tableBn = extra.tableBn,
    mistakes = extra.mistakes,
    practices = extra.practices,
  } = extra;
  return meta(
    slug,
    diagram,
    titleEn,
    titleBn,
    focusEn,
    focusBn,
    howEn,
    howBn,
    analogyEn,
    analogyBn,
    rwEn,
    rwBn,
    tableEn ?? `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | Often O(n²) | O(1)–O(n) | Easy to write, fails scale |
| Optimal | See focus | Minimal extra | Explain in interview |`,
    tableBn ?? `| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Naive | প্রায় O(n²) | O(1)–O(n) | লেখা সহজ, scale fail |
| Optimal | focus দেখুন | Minimal extra | Interview-এ explain |`,
    mistakes ?? [
      T(`Not stating time/space complexity for ${titleEn}.`, `${titleBn}-এ time/space complexity না বলা।`),
      T(`Ignoring edge cases (empty input, single element, duplicates).`, `Edge case ignore (empty, single, duplicate)।`),
    ],
    practices ?? [
      T(`Use meaningful variable names and small helper methods.`, `Meaningful name ও ছোট helper method।`),
      T(`Walk through one example on the whiteboard before coding.`, `Code-এর আগে whiteboard-এ example walkthrough।`),
    ],
  );
}

// CODING TASKS (42) — [slug, diagram, titleEn, focusEn, focusBn]
const CODING_TASKS = [
  ['1-the-shopping-cart-complex-calculation', null, 'Shopping Cart Calculation', 'Apply discount → shipping → tax in order using `decimal` — never `double` for money.', 'Discount → shipping → tax order-এ `decimal` — money-তে `double` নয়।'],
  ['2-the-cache-aside-pattern', D.CACHE_ASIDE_DIAGRAM, 'Cache-Aside Pattern', 'Redis get → miss → DB → set TTL → return; degrade gracefully if Redis is down.', 'Redis get → miss → DB → TTL set → return; Redis down হলে graceful degrade।'],
  ['3-background-report-generation', null, 'Background Report Generation', 'Enqueue CSV job, return `202 Accepted` + job ID — never block HTTP for 30s export.', 'CSV job enqueue, `202 Accepted` + job ID — 30s export-এ HTTP block নয়।'],
  ['4-thread-safety-with-interlocked', null, 'Thread Safety with Interlocked', '`Interlocked.Increment` for shared counters — lighter than `lock` for simple atomic ops.', 'Shared counter-এ `Interlocked.Increment` — simple atomic-এ `lock`-এর চেয়ে হালকা।'],
  ['5-global-exception-handler-middleware', D.MIDDLEWARE_CHAIN_ASCII, 'Global Exception Middleware', 'Outer middleware → log + ProblemDetails JSON + trace ID; never leak stack in prod.', 'Outer middleware → log + ProblemDetails + trace ID; prod-এ stack leak নয়।'],
  ['6-generic-repository-implementation', D.REPOSITORY_PATTERN_DIAGRAM, 'Generic Repository', '`IRepository<T>` CRUD abstraction — avoid leaking `IQueryable` unless intentional.', '`IRepository<T>` CRUD — intentional না হলে `IQueryable` leak নয়।'],
  ['7-palindrome-check-string-optimization', null, 'Palindrome Check', 'Two pointers after filtering non-alphanumeric — O(n) time, O(1) space.', 'Non-alphanumeric filter → two pointer — O(n) time, O(1) space।'],
  ['8-dependency-injection-with-factory', D.DI_FLOW_DIAGRAM, 'DI Factory Pattern', 'Keyed DI or factory returns `IPaymentGateway` — consumer never `new`s Stripe/PayPal.', 'Keyed DI/factory `IPaymentGateway` — consumer Stripe/PayPal `new` করে না।'],
  ['9-linq-optimization-n-1-solution', D.LINQ_DEFERRED_DIAGRAM, 'LINQ N+1 Fix', '`.Include()` or projection in one query — not `foreach` + query per row.', '`.Include()` বা projection এক query — row প্রতি query নয়।'],
  ['10-singleton-pattern-thread-safe', null, 'Thread-Safe Singleton', '`Lazy<T>` or DI Singleton — avoid hand-rolled double-checked locking bugs.', '`Lazy<T>` বা DI Singleton — hand-rolled double-checked locking bug avoid।'],
  ['11-two-sum-problem', null, 'Two Sum', 'Hash map stores `value → index`; for each `x`, check if `target - x` exists — O(n).', 'Hash map `value → index`; প্রতি `x`-এ `target - x` আছে কিনা — O(n)।'],
  ['12-reverse-a-linked-list', null, 'Reverse Linked List', 'Three pointers: prev, curr, next — flip links in one pass O(n), O(1) space.', 'Three pointer prev/curr/next — one pass O(n), O(1) space।'],
  ['13-binary-search-implementation', null, 'Binary Search', 'Sorted array, `lo/hi` mid — O(log n); watch `lo <= hi` and overflow-safe mid.', 'Sorted array `lo/hi` mid — O(log n); `lo <= hi` ও overflow-safe mid।'],
  ['14-valid-parentheses-stack', null, 'Valid Parentheses', 'Stack push opens; pop must match close — O(n) single scan.', 'Stack-এ open push; close match pop — O(n) single scan।'],
  ['15-find-missing-number-xor', null, 'Find Missing Number (XOR)', 'XOR all indices 0..n and all values — duplicate cancels, missing remains.', 'Index 0..n ও value XOR — duplicate cancel, missing থেকে যায়।'],
  ['16-fibonacci-with-memoization', null, 'Fibonacci Memoization', 'Top-down cache or bottom-up array — O(n) vs exponential naive recursion.', 'Top-down cache/bottom-up — O(n) vs exponential naive recursion।'],
  ['17-merge-intervals', null, 'Merge Intervals', 'Sort by start, merge if overlap — O(n log n); calendar booking pattern.', 'Start দিয়ে sort, overlap merge — O(n log n); calendar booking pattern।'],
  ['18-maximum-subarray-kadane-s', null, "Maximum Subarray (Kadane's)", 'Track `currentSum` reset when negative; keep `maxSum` — O(n).', '`currentSum` negative হলে reset; `maxSum` track — O(n)।'],
  ['19-cycle-detection-floyd-s', null, "Cycle Detection (Floyd's)", 'Slow/fast pointers meet if cycle; find start by resetting one pointer — O(n).', 'Slow/fast meet = cycle; এক pointer reset → start — O(n)।'],
  ['20-climbing-stairs-dp', null, 'Climbing Stairs DP', '`dp[i] = dp[i-1] + dp[i-2]` — classic 1D DP intro.', '`dp[i] = dp[i-1] + dp[i-2]` — classic 1D DP intro।'],
  ['21-valid-anagram', null, 'Valid Anagram', '26-letter freq count or sort both strings — O(n).', '26-letter freq count বা sort — O(n)।'],
  ['22-binary-tree-inorder-traversal', null, 'Binary Tree Inorder', 'Recursive or explicit stack: left → root → right.', 'Recursive/stack: left → root → right।'],
  ['23-implementing-a-queue-using-stacks', null, 'Queue Using Two Stacks', 'In-stack + out-stack; amortized O(1) enqueue/dequeue.', 'In-stack + out-stack; amortized O(1) enqueue/dequeue।'],
  ['24-remove-duplicates-from-sorted-array', null, 'Remove Duplicates In-Place', 'Write pointer `k` for unique positions — O(n), O(1) extra.', 'Write pointer `k` unique position — O(n), O(1) extra।'],
  ['25-best-time-to-buy-and-sell-stock', null, 'Best Time Buy/Sell Stock', 'Track min price so far, update max profit — single pass O(n).', 'Min price track, max profit update — single pass O(n)।'],
  ['26-fizzbuzz-implementation', null, 'FizzBuzz', 'Mod 3/5/15 rules — tests readability and edge case 15.', 'Mod 3/5/15 rule — readability ও edge 15 test।'],
  ['27-reverse-words-in-a-string', null, 'Reverse Words', 'Trim, split, reverse array or reverse char segments in-place.', 'Trim, split, reverse array বা in-place char segment reverse।'],
  ['28-factorial-recursion-vs-iterative', null, 'Factorial Recursion vs Iterative', 'Iterative loop avoids stack overflow for large n; O(n) both.', 'Iterative loop large n-এ stack overflow avoid; O(n) both।'],
  ['29-check-for-balanced-tree', null, 'Balanced Binary Tree', 'Return height or -1 if |left-right| > 1 — O(n) one pass.', 'Height return বা |left-right|>1 → -1 — O(n) one pass।'],
  ['30-deep-copy-vs-shallow-copy', null, 'Deep Copy vs Shallow Copy', 'Shallow copies references; deep clone nested collections — records vs manual.', 'Shallow reference copy; deep nested clone — record vs manual।'],
  ['31-longest-common-subsequence-dp', null, 'Longest Common Subsequence', '2D DP: match → +1 diagonal, else max(up, left).', '2D DP: match → diagonal +1, else max(up, left)।'],
  ['32-sliding-window-maximum', null, 'Sliding Window Maximum', 'Monotonic deque stores useful indices — O(n) window max.', 'Monotonic deque useful index — O(n) window max।'],
  ['33-graph-bfs-implementation', null, 'Graph BFS', 'Queue + visited set — shortest path in unweighted graph.', 'Queue + visited — unweighted graph shortest path।'],
  ['34-implement-a-trie-prefix-tree', null, 'Trie (Prefix Tree)', 'Char nodes + `IsEnd` flag — prefix search/autocomplete O(m).', 'Char node + `IsEnd` — prefix/autocomplete O(m)।'],
  ['35-container-with-most-water', null, 'Container With Most Water', 'Two pointers from ends; move shorter line — O(n) greedy.', 'Two pointer ends; shorter line move — O(n) greedy।'],
  ['36-find-all-anagrams-in-a-string', null, 'Find All Anagrams', 'Fixed sliding window + freq map compare — O(n).', 'Fixed sliding window + freq map — O(n)।'],
  ['37-lowest-common-ancestor-tree', null, 'Lowest Common Ancestor', 'Recursive: if node is p or q return it; LCA where both subtrees return non-null.', 'Recursive: node p/q → return; both subtree non-null → LCA।'],
  ['38-subsets-generation-backtracking', null, 'Subsets Backtracking', 'Include/exclude each element — O(2^n); explain pruning if asked.', 'Include/exclude each element — O(2^n); pruning explain।'],
  ['39-top-k-frequent-elements', null, 'Top K Frequent Elements', 'Freq map + min-heap size k or bucket sort — O(n log k).', 'Freq map + min-heap k বা bucket sort — O(n log k)।'],
  ['40-coin-change-problem-dp', null, 'Coin Change DP', 'Bottom-up `dp[amount]` min coins — unbounded knapsack variant.', 'Bottom-up `dp[amount]` min coin — unbounded knapsack variant।'],
  ['41-senior-deduplicate-concurrent-checkout-idempotency', null, 'Idempotent Checkout', 'Store `Idempotency-Key` + response hash — duplicate POST returns same result.', '`Idempotency-Key` + response hash store — duplicate POST same result।'],
  ['42-senior-sliding-window-rate-limit-in-memory-sketch', null, 'Rate Limit Sliding Window', 'Per-user timestamp queue; prod uses Redis INCR + TTL or token bucket.', 'Per-user timestamp queue; prod Redis INCR + TTL/token bucket।'],
];
const CODING_PATCHES = CODING_TASKS.map(([slug, diagram, titleEn, focusEn, focusBn]) =>
  taskMeta(slug, diagram, titleEn, titleEn, focusEn, focusBn),
);

const ALL_PATCHES = [
  ...PATCH_ROWS,
  ...META_PATCHES,
  ...SCENARIO_PATCHES_FIXED,
  ...LEADERSHIP_PATCHES,
  ...QB_PATCHES,
  ...TRAP_PATCHES,
  ...REV_PATCHES,
  ...DOTNET10_PATCHES,
  ...CODING_PATCHES,
];

// ── TypeScript emitter ──
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/'/g, "\\'");
}

function emitLocalized(obj, indent) {
  return `{ en: '${esc(obj.en)}', bn: '${esc(obj.bn)}' }`;
}

function emitPatch(p) {
  let out = `  '${p.slug}': {\n    id: '${p.slug}',\n    explanation: {\n`;
  for (const key of ['what', 'why', 'how', 'analogy', 'realWorld']) {
    if (p[key]) out += `      ${key}: ${emitLocalized(p[key], 6)},\n`;
  }
  out += `    },\n`;
  if (p.diagram) out += `    diagram: ${p.diagram},\n`;
  if (p.tableEn && p.tableBn) {
    out += `    comparisonTable: {\n      en: \`${esc(p.tableEn)}\`,\n      bn: \`${esc(p.tableBn)}\`,\n    },\n`;
  }
  out += `    commonMistakes: [\n`;
  for (const m of p.mistakes) out += `      ${emitLocalized(m)},\n`;
  out += `    ],\n    bestPractices: [\n`;
  for (const b of p.practices) out += `      ${emitLocalized(b)},\n`;
  out += `    ],\n  },\n`;
  return out;
}

// Validate unique slugs
const slugs = ALL_PATCHES.map((p) => p.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) {
  console.error('Duplicate slugs:', [...new Set(dupes)]);
  process.exit(1);
}

const header = `// AUTO-GENERATED by scripts/generate-bilingual-patches.mjs
// Generated: ${new Date().toISOString()}
// Patch count: ${ALL_PATCHES.length}
// Merge entries below into bilingualPatches.ts

`;

const body = ALL_PATCHES.map(emitPatch).join('\n');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header + body, 'utf8');

console.log(`Wrote ${ALL_PATCHES.length} patches to ${OUT}`);
console.log('First 3 slugs:', slugs.slice(0, 3).join(', '));
