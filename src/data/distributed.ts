export const distributedData = {
  id: 'distributed',
  title: 'Distributed Systems & Microservices',
  description:
    'CAP, consistency, resilience patterns, service boundaries, Saga/Outbox/CQRS, and .NET Polly + tracing — with explicit guidance on when microservices are the wrong answer.',
  sections: [
    {
      topic: 'Fundamentals: Statelessness, Scale, Load Balancing, CAP, Consistency',
      difficulty: 'senior',
      english:
        'Horizontal scale means more instances behind a load balancer; it only works if the app is stateless (or state is external: Redis, SQL, blob). Vertical scale is a bigger box — simpler, finite. CAP: under partition you choose availability or consistency. Most product APIs choose AP + eventual consistency for replicas, and CP for the money path (single-leader SQL). Eventual consistency is not "we do not care"; it is a bounded delay with a repair story.',
      bangla:
        'হরাইজন্টাল স্কেল = স্টেটলেস ইনস্ট্যান্স + লোড ব্যালেন্সার। ক্যাপে পার্টিশনে অ্যাভেইলেবিলিটি বা কনসিস্টেন্সি। ইভেঞ্চুয়াল কনসিস্টেন্সি মানে ডিলে + রিপেয়ার, "যতখুশি ভুল" নয়।',
      details: `
| Idea | Senior meaning |
| :--- | :--- |
| **Stateless** | Any instance can serve any request; session in Redis/JWT, files in blob |
| **Vertical** | Bigger CPU/RAM — good until cost and failover hurt |
| **Horizontal** | N replicas; needs shared nothing compute + sticky only as a smell |
| **LB** | L4/L7, health checks, draining; sticky sessions hide design debt |
| **CAP** | Partition happens; you pick C or A for that subsystem |
| **Strong consistency** | Read sees latest write (single leader, or consensus) |
| **Eventual** | Replicas converge; read-your-writes may need sticky or version tokens |

In-process memory cache is **not** a source of truth across instances. Sticky sessions + in-memory cart will fail a rolling deploy.
      `,
      commonMistakes: [
        'Storing session or "current tenant" only in memory on one pod.',
        'Saying "we are CA" — you dropped P, which is not how networks work.',
        'Treating eventual consistency as an excuse for lost updates without version checks.',
      ],
      bestPractices: [
        'Put state in stores that all instances share; keep compute disposable.',
        'Health/readiness probes that match real dependencies (DB, broker).',
        'Name the consistency model per use case: catalog can lag; ledger cannot.',
      ],
      interviewQs: [
        {
          q: 'Explain CAP without the textbook cop-out.',
          a: 'When the network splits, a node must either refuse writes (stay consistent with the other side — CP) or accept writes that may conflict (stay available — AP). You do not "have all three" during a partition. In .NET shops, SQL Server failover + primary reads is typically CP for that database. A cache-aside Redis replica is AP-ish for reads. Design per data, not one sticker for the company.',
          bangla: 'পার্টিশনে লিখতে অস্বীকার (CP) বা কনফ্লিক্ট মেনে সার্ভ (AP) — পুরো সিস্টেমে এক ক্যাপ লেবেল হয় না।',
          followUp: 'Is a single-node SQL Server CA? What did you give up?',
          difficulty: 'senior',
        },
        {
          q: 'Why does sticky session load balancing fight horizontal scale?',
          a: 'Requests for a user pin to one instance, so that instance becomes a hotspot and you cannot drain it without disconnecting users. Memory on that box is now user state. Rolling updates and autoscaling become painful. Prefer JWT or Redis-backed session and round-robin/least-conn. Sticky is a migration crutch, not a target architecture.',
          bangla: 'স্টিকি সেশন এক পডে হটস্পট ও স্টেট বাঁধে — ড্রেন/অটোস্কেল কঠিন। সেশন রেডিসে বা JWT এ তুলুন।',
          followUp: 'When is sticky still acceptable for a short period?',
          difficulty: 'mid',
        },
      ],
      practice:
        'List three pieces of state in a typical shop API and where each must live for 4 replicas to be interchangeable.',
      code: `// Stateless API: no in-memory user store
builder.Services.AddStackExchangeRedisCache(o =>
    o.Configuration = builder.Configuration["Redis"]);
builder.Services.AddSession(o => o.IdleTimeout = TimeSpan.FromMinutes(20));
// Data Protection keys MUST be shared (Redis/blob) or auth cookies break across pods`,
    },
    {
      topic: 'Resilience: Distributed Transactions, Idempotency, Retry, Timeout, Circuit Breaker, Bulkhead, Backoff, Locks',
      difficulty: 'expert',
      english:
        'Two-phase commit across services is avoided: it couples availability. You use idempotency, timeouts, retries with backoff+jitter, circuit breakers, bulkheads, and sometimes a distributed lock. Timeouts without retries still fail users; retries without idempotency double-submit. A circuit breaker stops calling a dead dependency so your thread pool survives. A lock in Redis is not a transaction.',
      bangla:
        'সার্ভিস জুড়ে ২পিসি এড়াবেন। আইডেমপোটেন্সি, টাইমআউট, জিটার-ব্যাকঅফ রিট্রাই, সার্কিট ব্রেকার, বাল্কহেড। রেডিস লক ট্রানজেকশন নয়।',
      details: `
| Pattern | Purpose | Failure if misused |
| :--- | :--- | :--- |
| **Idempotency** | Safe retry | Unique key missing → double charge |
| **Timeout** | Bound wait | Too long = cascade; too short = false failure |
| **Retry + backoff + jitter** | Transient faults | Thundering herd without jitter |
| **Circuit breaker** | Fail fast when dependency is down | Half-open stampede if not limited |
| **Bulkhead** | Isolate thread/connection pools | One slow API starves the whole process |
| **Distributed lock** | Mutual exclusion | Lock expiry + still running = split brain |

Distributed transactions (MSDTC / XA) across microservices: slow, operationally cursed, and they turn a partition into a total outage. Prefer Saga + outbox.

Locks: Redis \`SET NX PX\` + fencing token (Redlock is controversial). Prefer DB unique constraints when the critical section is "insert this business row once."
      `,
      commonMistakes: [
        'Retrying every HttpClient call with 5 attempts and no jitter against a saturated API.',
        'Circuit breaker wrapping the database in a way that one timeout takes down all reads.',
        'Redis lock without a fencing token; work continues after expiry.',
      ],
      bestPractices: [
        'Timeout < caller\'s budget; retry only idempotent/transient; jitter always.',
        'Bulkhead: dedicated HttpClient / Polly isolation per downstream.',
        'Prefer uniqueness constraints over locks for "create once" semantics.',
      ],
      interviewQs: [
        {
          q: 'Why are distributed transactions a bad default between microservices?',
          a: 'They require all participants to be up and to agree, stretching locks across the network. A slow or partitioned service blocks the whole business transaction. Ops (DTC, XA) is fragile. You couple deployability and SLOs. Saga with compensating actions and an outbox keeps each service\'s commit local. You trade atomicity for availability and must design compensations and idempotency instead.',
          bangla: '২পিসি সব সার্ভিস আপ রাখে এবং লক লম্বা করে — স্যাগা+আউটবক্স লোকাল কমিট রাখে, কম্পেনসেশন ডিজাইন করতে হয়।',
          followUp: 'When is a single database transaction still the right call?',
          difficulty: 'expert',
        },
        {
          q: 'Circuit breaker vs retry vs timeout — how do they compose?',
          a: 'Timeout is the inner bound on one attempt. Retry wraps timeouts for transient errors with backoff. Circuit breaker wraps the whole call: if error rate is high, fail immediately without retrying (protects both sides). Order in Polly typically: timeout per try → retry → circuit breaker (or breaker outside so retries do not keep a closed-broken circuit open). Bulkhead limits concurrency before you even call. Wrong order = retries hammer an open circuit or ignore timeouts.',
          bangla: 'প্রতি চেষ্টায় টাইমআউট, বাইরে রিট্রাই, তার উপর সার্কিট ব্রেকার — ভুল অর্ডারে রিট্রাই ভাঙা ডিপেন্ডেন্সিকে মারে।',
          followUp: 'Where does bulkhead sit in that pipeline?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Write a policy: 2s timeout, 3 retries exponential jitter, circuit breaker 30s break, only on HttpRequestException/5xx, never on 400.',
      code: `var pipeline = new ResiliencePipelineBuilder<HttpResponseMessage>()
    .AddTimeout(TimeSpan.FromSeconds(2))
    .AddRetry(new RetryStrategyOptions<HttpResponseMessage>
    {
        MaxRetryAttempts = 3,
        Delay = TimeSpan.FromMilliseconds(200),
        BackoffType = DelayBackoffType.Exponential,
        UseJitter = true,
        ShouldHandle = new PredicateBuilder<HttpResponseMessage>()
            .Handle<HttpRequestException>()
            .HandleResult(r => (int)r.StatusCode >= 500)
    })
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions<HttpResponseMessage>
    {
        FailureRatio = 0.5,
        SamplingDuration = TimeSpan.FromSeconds(30),
        MinimumThroughput = 10,
        BreakDuration = TimeSpan.FromSeconds(30)
    })
    .Build();`,
    },
    {
      topic: 'Monolith vs Modular Monolith vs Microservices; Boundaries; When NOT to Split',
      difficulty: 'senior',
      english:
        'A monolith is one deployable. A modular monolith is one deployable with hard module boundaries (projects, no cross-module DB tables). Microservices are independently deployable units with separate data. Database-per-service is the actual split — two services sharing tables is a distributed monolith. Most teams should not start with microservices: they buy network failure, dual writes, and org overhead before they have scale or team boundaries.',
      bangla:
        'মডুলার মনোলিথ = এক ডিপ্লয়, কঠিন মডিউল বাউন্ডারি। মাইক্রোসার্ভিস = আলাদা ডিপ্লয়+ডাটা। শেয়ার্ড টেবিল মানে ডিস্ট্রিবিউটেড মনোলিথ। দরকার না থাকলে স্প্লিট করবেন না।',
      details: `
### Service boundaries
Drawn around **business capability** and **data ownership** (Orders owns Order rows), not around technical layers (a "UserService" that is just CRUD). If two modules always change together and share a transaction, they are one service.

### Database-per-service
No FK across services. Integration via APIs or events. Reporting may use a read model / replica / warehouse — not "just join across DBs."

### When NOT to use microservices
- Team of 5, one product, one release train.
- You cannot yet test, observe, or deploy a monolith well.
- The split is "for resume-driven development."
- You need a single ACID transaction for the core use case and have no saga design.
- Latency budget cannot afford extra hops.

Modular monolith first: extract a service when a team, scale axis, or failure domain **forces** it.
      `,
      commonMistakes: [
        'Nano-services: one CRUD table per repo.',
        'Shared DbContext / shared database "just for now" forever.',
        'Splitting before you have module boundaries in the monolith.',
      ],
      bestPractices: [
        'Start modular monolith; publish internal events even in-process (mediatr) so extraction is later possible.',
        'Own data per module; no Select * from OtherModule.Table.',
        'Split along scale/failure/team lines, not along controllers.',
      ],
      interviewQs: [
        {
          q: 'When would you tell a CTO not to do microservices?',
          a: 'When the pain is code quality, not independent scale or team autonomy. Microservices multiply distributed failure modes. I would propose a modular monolith with explicit modules, separate schemas, and CI that forbids cross-module table access. Extract the first service only when a module needs a different SLO, datastore, or team cadence. "Netflix does it" is not a requirement analysis.',
          bangla: 'টিম ছোট, ট্রানজেকশন জরুরি, অবজারভেবিলিটি দুর্বল — মাইক্রোসার্ভিস নয়, মডুলার মনোলিথ।',
          followUp: 'What metric would convince you it is time to extract Payments?',
          difficulty: 'senior',
        },
        {
          q: 'What is a distributed monolith?',
          a: 'Many services that must be deployed together, share a database, and fail as one — you paid the network tax without gaining independent deploy or data isolation. Classic signs: synchronous chain of 6 HTTP calls per click, shared SQL, and a "release train" for all repos. Fix by merging or by truly separating data and using async integration.',
          bangla: 'অনেক সার্ভিস কিন্তু শেয়ার্ড ডিবি ও একসাথে ডিপ্লয় — নেটওয়ার্ক ট্যাক্স আছে, স্বাধীনতা নেই।',
          followUp: 'How do you detect this in a code review of "new services"?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Given Catalog, Cart, Checkout, Payments — which stay in one modular monolith and which might split first? Justify with data ownership.',
      code: `// Modular monolith: project reference rules
// Catalog.Module -> Catalog.Domain, Catalog.Infrastructure
// Checkout may reference Catalog.Contracts (IDs, DTOs) — NOT Catalog.Data.DbContext
// Forbidden: Checkout querying Products table directly`,
    },
    {
      topic: 'API Gateway, Service Discovery, REST vs gRPC, Event-Driven',
      difficulty: 'senior',
      english:
        'An API gateway is the edge: auth, rate limit, routing, TLS — not a second business layer. Service discovery (K8s DNS, Consul) finds instances; do not hardcode pod IPs. REST is the public/human-friendly contract; gRPC is efficient internal RPC (protobuf, HTTP/2). Event-driven integration decouples writers from readers but makes the flow harder to trace and to make consistent. Use sync when the caller needs the answer now; events when others need to react.',
      bangla:
        'গেটওয়ে এজ (অথ, রেট লিমিট, রাউট) — বিজনেস লজিক নয়। REST পাবলিক, gRPC ইন্টারনাল। ইভেন্ট ডি কাপল করে কিন্তু ট্রেস ও কনসিস্টেন্সি কঠিন করে।',
      details: `
| Style | Strength | Cost |
| :--- | :--- | :--- |
| **REST/HTTP JSON** | Universal, cacheable, easy debug | Chatty, weaker typing |
| **gRPC** | Fast, contracts, streaming | Browser/gateway friction, versioning .proto |
| **Events** | Loose coupling, fan-out | Dual write, eventual consistency, replay |

Gateway anti-pattern: putting all domain rules in YARP/Ocelot so every change needs a gateway deploy. Discovery anti-pattern: load-balancer list in appsettings updated by hand.
      `,
      commonMistakes: [
        'Chatty client → gateway → 15 sequential REST calls (latency death).',
        'gRPC across the public internet without a gateway/transcoding story.',
        'Event-driven for a user click that must show success/failure immediately without a status model.',
      ],
      bestPractices: [
        'BFF or aggregation at the edge for mobile; keep domain services coarse.',
        'gRPC inside the cluster; REST (or gRPC-Web) at the boundary.',
        'Correlate events with trace-id; document payload versioning.',
      ],
      interviewQs: [
        {
          q: 'REST vs gRPC for service-to-service in .NET?',
          a: 'gRPC if both ends are .NET/K8s, you want protobuf contracts, low latency, and streaming. REST if you need HTTP caching, easy browser/Postman debug, or external partners. Mixing is normal: public REST, internal gRPC. Do not expose raw gRPC to anonymous internet clients without a gateway. Version protobuf like APIs — additive fields, no silent reuse of field numbers.',
          bangla: 'ক্লাস্টারের ভিতর gRPC, বাইরে REST সাধারণ — পাবলিক gRPC গেটওয়ে ছাড়া নয়।',
          followUp: 'How do you evolve a .proto without breaking old consumers?',
          difficulty: 'senior',
        },
        {
          q: 'What belongs in an API gateway vs the service?',
          a: 'Gateway: TLS termination, authentication token validation (sometimes), rate limiting, routing, request size limits, WAF. Service: authorization against domain data, validation, transactions, business rules. If the gateway needs the Orders database to decide, you misplaced the rule. YARP/Ocelot/Azure APIM are reverse proxies with policies, not your application.',
          bangla: 'গেটওয়ে অথ/রেট লিমিট/রাউট; ডোমেইন অথরাইজেশন ও ট্রানজেকশন সার্ভিসে থাকবে।',
          followUp: 'Should the gateway call three services and aggregate, or should a BFF?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Draw the path of a mobile "place order" call: gateway, BFF, Orders, Payments event to Inventory. Mark sync vs async hops.',
      code: `// YARP is routing, not business logic
"ReverseProxy": {
  "Routes": { "orders": { "ClusterId": "orders", "Match": { "Path": "/api/orders/{**catch-all}" } } },
  "Clusters": { "orders": { "Destinations": { "d1": { "Address": "http://orders/" } } } }
}`,
    },
    {
      topic: 'Saga, Outbox, CQRS in a Distributed Context',
      difficulty: 'expert',
      english:
        'A saga is a long-running business transaction with compensations, not a magic ACID wrapper. Orchestration: one coordinator (process manager). Choreography: each service reacts to events. Outbox makes "DB commit + publish" atomic locally. CQRS splits write model from read model — in distributed systems the read side is often eventually consistent projections from events. Using all three everywhere is a smell.',
      bangla:
        'স্যাগা = কম্পেনসেশন সহ লম্বা ফ্লো, ডিস্ট্রিবিউটেড ACID নয়। আউটবক্স লোকাল কমিট+পাবলিশ। CQRS রিড মডেল আলাদা — প্রায়ই ইভেঞ্চুয়ালি কনসিস্টেন্ট।',
      details: `
### Saga
- **Happy path**: Order created → payment captured → inventory reserved → shipped.
- **Compensation**: payment failed → mark order failed; inventory reserved then payment fails → release stock.
- Orchestration is easier to see in one place; choreography avoids a god orchestrator but can loop and hide the flow.

### Outbox
Write \`Orders\` + \`OutboxMessages\` in one SaveChanges. A dispatcher publishes. Consumer inbox for idempotency. This is how you stop "order without event" after a crash.

### CQRS (distributed)
Commands hit the write service. Reads hit a denormalized store updated by events. Do not CQRS a CRUD module with one user. Do CQRS when read shape and write shape diverge hard (search, dashboards) or when you already have events.
      `,
      commonMistakes: [
        'Saga without idempotent steps — compensation runs twice and over-refunds.',
        'Publishing events in the same request without outbox.',
        'CQRS + Event Sourcing cargo-cult on a simple admin app.',
      ],
      bestPractices: [
        'Each saga step is idempotent; store saga state explicitly.',
        'Outbox + inbox as default for cross-service events.',
        'CQRS reads: document staleness (seconds) to product, not only to engineers.',
      ],
      interviewQs: [
        {
          q: 'Orchestration vs choreography saga — which do you pick for checkout?',
          a: 'Checkout I usually orchestrate: a CheckoutSaga/process manager with an explicit state machine (PaymentPending, Reserved, Failed). You can timeout, compensate, and support ops ("where is order X?"). Choreography (OrderPlaced → Payment service → Inventory listens) works until a missing event or a cycle appears and nobody owns the flow. Hybrid is common: orchestrate the money path, choreograph notifications.',
          bangla: 'চেকআউটে অর্কেস্ট্রেশন — স্টেট মেশিন, টাইমআউট, কম্পেনসেশন স্পষ্ট। নোটিফিকেশনে কোরিওগ্রাফি চলে।',
          followUp: 'How do you compensate a step that was a third-party charge?',
          difficulty: 'expert',
        },
        {
          q: 'How does the outbox pattern interact with CQRS projections?',
          a: 'The write service commits aggregate + outbox. Dispatcher publishes DomainEvent. The read model consumer is another subscriber: inbox then update projection. At-least-once means the projector must be idempotent (upsert by id/version). The UI may lag; if the user must see their own write, read-your-writes via the write DB or a wait-for-version token — do not pretend the projection is strongly consistent.',
          bangla: 'আউটবক্স ইভেন্ট পাবলিশ করে, প্রজেক্টর আইডেমপোটেন্ট আপসার্ট করে — UI ল্যাগ হতে পারে, নিজের রাইট দেখতে ভার্সন টোকেন লাগতে পারে।',
          followUp: 'What if the projector is down for an hour?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Write saga states for PlaceOrder and the compensation for "payment captured, inventory failed."',
      code: `public async Task Handle(ReserveInventoryFailed e, CancellationToken ct)
{
    var saga = await _db.CheckoutSagas.SingleAsync(x => x.OrderId == e.OrderId, ct);
    if (saga.State == CheckoutState.Compensated) return; // idempotent

    await _payments.RefundAsync(saga.PaymentId, saga.OrderId, ct); // idempotency key = OrderId
    saga.State = CheckoutState.Compensated;
    await _db.SaveChangesAsync(ct);
}`,
    },
    {
      topic: 'Distributed Tracing and Resilience in .NET (Polly)',
      difficulty: 'senior',
      english:
        'Resilience without traces is flying blind. OpenTelemetry in .NET (Activity, ActivitySource) propagates trace-id across HTTP, gRPC, and messaging so a 2am incident is one waterfall, not five log files. Polly (v8 resilience pipelines) implements timeout/retry/breaker/hedging. W3C trace context must be copied onto MassTransit/Kafka headers or you lose the chain at the broker.',
      bangla:
        'পলি রিট্রাই/ব্রেকার দেয়; ওপেনটেলিমেট্রি ট্রেস-আইডি চেইন করে। ব্রোকার হেডারে ট্রেস না দিলে কিউয়ের পর কানেকশন হারায়।',
      details: `
### Tracing
- \`Activity.Current?.Id\` / \`traceparent\` header on HttpClient (automatic with \`AddHttpClient\` + OTel).
- Messaging: inject \`traceparent\` into RabbitMQ/Kafka headers; consumers start a child Activity.
- Spans should include order id as a tag — not only HTTP path.
- Sampling in prod; 100% in staging.

### Polly in production
- Named pipelines per downstream (Payments vs Catalog) — different SLOs.
- Metrics: retry count, breaker state, timeout count — alert on breaker open.
- Do not wrap non-idempotent POSTs in aggressive retry.
- Combine with \`IHttpClientFactory\` (typed clients), not a static HttpClient with Polly bolted once.
      `,
      commonMistakes: [
        'Logging without trace-id; correlating by timestamp in Kibana.',
        'One global Polly policy for every URL.',
        'Retry on the request path amplifying a dependency outage (no breaker).',
      ],
      bestPractices: [
        'OTel traces + metrics + logs with the same trace-id.',
        'Per-dependency pipelines; expose breaker state to health/readiness if needed.',
        'Propagate context through queues; test it with a single request and three services.',
      ],
      interviewQs: [
        {
          q: 'A request is slow across four services. How do you find the bottleneck?',
          a: 'Open the distributed trace for that trace-id. Look at span duration, wait vs self time, and which dependency (SQL, HTTP, broker) dominates. Logs without correlation are a last resort. If messaging is in the path, confirm the consumer span is a child of the producer. Then fix the slow span — N+1, missing index, unbounded retry — not "add more pods" first. This is why we instrument HttpClient, EF, and MassTransit.',
          bangla: 'ট্রেস-আইডির ওয়াটারফলে কোন স্প্যান লম্বা দেখুন — আগে ইনডেক্স/এন+১, পরে পড বাড়ানো।',
          followUp: 'What if the gap is between publish and consume, not inside a service?',
          difficulty: 'senior',
        },
        {
          q: 'How do you apply Polly in ASP.NET Core without retrying non-idempotent calls?',
          a: 'Typed HttpClient per downstream with a pipeline that retries GET/PUT/idempotent POST (Idempotency-Key) only. POST charge uses timeout + breaker, retry count 0 or retry only on connection failures before the request is written. StandardResilienceHandler is a starting point; seniors customize ShouldHandle. Document this in the client, not as a surprise in production.',
          bangla: 'আইডেমপোটেন্ট কলে রিট্রাই; চার্জ পোস্টে টাইমআউট+ব্রেকার, বডি পাঠানোর পর রিট্রাই নয়।',
          followUp: 'How does this interact with the outbox dispatcher retrying publish?',
          difficulty: 'expert',
        },
      ],
      practice:
        'List the headers you would set on a Kafka message to continue an incoming HTTP trace, and where you start the consumer Activity.',
      code: `builder.Services.AddHttpClient<PaymentsClient>(c =>
        c.BaseAddress = new Uri("https://payments/"))
    .AddResilienceHandler("payments", b =>
    {
        b.AddTimeout(TimeSpan.FromSeconds(3));
        b.AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
        {
            BreakDuration = TimeSpan.FromSeconds(20)
        });
        // no retry on this client — charges are not idempotent without a key
    });

// Program.cs: builder.Services.AddOpenTelemetry().WithTracing(t =>
//     t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation().AddSource("Shop"));`,
    },
  ],
  quickRevision: {
    concepts: [
      'Horizontal scale requires shared-nothing compute',
      'CAP is per subsystem during partition, not a company slogan',
      'Eventual consistency needs a repair/read-your-writes story',
      'No 2PC between services — saga + outbox',
      'Retry only with idempotency, timeout, jitter',
      'Circuit breaker + bulkhead protect the thread pool',
      'Distributed lock ≠ transaction; prefer unique constraints',
      'Modular monolith before microservices; DB-per-service is the real split',
      'Gateway = edge policies; gRPC inside, REST at the edge',
      'OTel traceparent across HTTP and brokers; Polly per dependency',
    ],
    questions: [
      'Explain CAP with a SQL vs cache example',
      'Why sticky sessions hurt scale',
      'Why avoid distributed transactions',
      'How do timeout, retry, and breaker compose?',
      'When do you refuse microservices?',
      'What is a distributed monolith?',
      'REST vs gRPC internally?',
      'Orchestration vs choreography for checkout?',
      'Outbox vs dual write?',
      'How do you trace across Kafka?',
    ],
    mistakes: [
      'In-memory state on one replica',
      'Retries without jitter or idempotency',
      'Shared database between "services"',
      'Business logic in the API gateway',
      'CQRS/saga on a simple CRUD app',
    ],
    scenarios: [
      'Payment succeeded, inventory service down',
      'Rolling deploy drops in-memory carts',
      'Retry storm during a dependency outage',
      'Read model 30s behind after a purchase',
      'Cannot find which service ate 800ms of a request',
    ],
  },
  revisionSummary: `
- **Scale**: stateless instances, honest CAP, consistency chosen per data.
- **Resilience**: idempotency, timeout, jittered retry, breaker, bulkhead; avoid 2PC.
- **Shape**: modular monolith first; split on data ownership and team/scale pressure.
- **Integration**: gateway at the edge, events + outbox, saga for multi-step money flows.
- **.NET**: Polly pipelines per client, OpenTelemetry across HTTP and messaging.
  `,
  summary:
    'ডিস্ট্রিবিউটেড সিস্টেম ইন্টারভিউতে মাইক্রোসার্ভিস নাম নয় — কনসিস্টেন্সি, স্যাগা/আউটবক্স, কখন স্প্লিট করবেন না, এবং পলি+ট্রেসিং দিয়ে প্রোডাকশন জজমেন্ট দেখানো হয়।',
};
