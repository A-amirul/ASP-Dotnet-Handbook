export const revisionData = {
  id: 'revision',
  title: 'Senior .NET — Last-Day Revision',
  description:
    'High-yield recap for the night before a senior .NET interview: cheat sheets, a one-page system-design method, 30 must-know Q&As, and a 13-phase mock roadmap. This is a recap, not a first read.',
  sections: [
    {
      topic: 'C# / OOP / LINQ / Async Cheat Sheet',
      difficulty: 'senior',
      english: `Last-day C# is contracts and failure modes, not syntax. Value vs reference, GC generations, SOLID as design pressure, LINQ execution location, and async as thread-release — these are the questions that still kill seniors who "use C# every day."`,
      bangla: 'শেষ দিনে সিনট্যাক্স নয় — ভ্যালু vs রেফ, GC, SOLID, LINQ কোথায় চলে, async থ্রেড ছাড়ে।',
      details: `
### C# memory (30 seconds each)

| Topic | Senior line |
| :--- | :--- |
| **Value vs ref** | Struct copies; class is identity. Large/mutable struct = bugs, not speed. |
| **Stack vs heap** | Locals can be stack; objects heap; structs on heap as fields/arrays/box. |
| **GC** | Gen0/1/2 + LOH (>85KB). Pauses ≠ leaks. Dump for retainers. |
| **IDisposable** | Unmanaged / event / scope. \`await using\`. Do not dispose injected scoped services you do not own. |
| **Span / Memory** | Stack/slice, no heap \`Span\` on classes (\`ref struct\`). |

### OOP / SOLID (one example each)

| Letter | Production meaning |
| :--- | :--- |
| **S** | One reason to change — OrderProcessor does not also send email SMTP |
| **O** | New discount = new strategy class, not a switch in a 2k-line method |
| **L** | No \`NotImplementedException\` in overrides; Square/Rectangle |
| **I** | Fat \`IRepository\` forces fake methods in tests |
| **D** | Depend on \`IClock\`, not \`DateTime.Now\`, for tests and skew |

Interface = role at a boundary. Abstract = shared template + fields you own.

### LINQ

| Rule | Remember |
| :--- | :--- |
| Deferred | Nothing runs until \`ToList\` / \`Count\` / \`foreach\` |
| \`IQueryable\` | Expression → SQL |
| \`IEnumerable\` | In memory — after \`ToList\` you are done with SQL |
| \`Select\` DTO | Beats \`Include\` graphs for APIs |
| \`First\` vs \`Single\` | Unique key → Single*; First needs OrderBy |
| Closure | \`foreach\` captured variable (modern C# is OK; still know the trap) |

### Async

| Do | Do not |
| :--- | :--- |
| \`async\` all the way for I/O | \`.Result\` / \`.Wait()\` on ASP.NET |
| \`WhenAll\` for independent I/O | \`Task.Run\` wrapping sync EF |
| \`CancellationToken\` to EF/HttpClient | \`async void\` (except events) |
| \`ConfigureAwait(false)\` in libraries | Assume await = new thread |
| \`Task.Delay\` | \`Thread.Sleep\` in request path |

**Starvation signature:** CPU idle, queue length up, stacks on Wait.
      `,
      code: `// Last-day snippets
await using var db = await factory.CreateDbContextAsync(ct);
var dto = await db.Orders.AsNoTracking()
    .Where(o => o.Id == id)
    .Select(o => new OrderDto(o.Id, o.Total))
    .SingleOrDefaultAsync(ct);

await Task.WhenAll(GetA(ct), GetB(ct));
await http.GetAsync(url, ct); // pass token

public readonly struct Money(decimal amount, string ccy)
{
    public decimal Amount { get; } = amount;
    public string Ccy { get; } = ccy;
}`,
      commonMistakes: [
        'Calling yourself fluent in async while using .Result in middleware.',
        'Explaining GC as "it deletes unused objects" with no generations or LOH.',
        'LINQ answers that never mention deferred execution or SQL translation.',
      ],
      bestPractices: [
        'Every LINQ answer: where does it run, how many rows, tracked or not.',
        'Every async answer: what thread is doing during the wait.',
        'SOLID with a class name from your last project, not a textbook animal.',
      ],
      interviewQs: [
        {
          q: 'Value type vs reference type — why does it matter in an API DTO vs an entity?',
          a: 'Entities have identity and are classes. DTOs can be records/classes; small immutable values can be structs. Copying a large struct in a hot loop is slower than a reference. Mutating a struct copy is a silent bug. Do not make an entity a struct.',
          bangla: 'এন্টিটি = আইডেন্টিটি/ক্লাস। বড় মিউটেবল স্ট্রাক্ট বাগ।',
          difficulty: 'mid',
        },
        {
          q: 'What happens when you await an HttpClient call?',
          a: 'The request thread is returned to the pool. The I/O completion port resumes a continuation later. No dedicated thread sits blocked in the kernel wait if it is true async. That is why async scales; it is not parallelism.',
          bangla: 'থ্রেড পুলে ফেরত, I/O শেষে কন্টিনিউয়েশন — নতুন থ্রেড নয়।',
          difficulty: 'senior',
        },
      ],
      practice: 'Speak 8 minutes: GC, SOLID, IQueryable, First vs Single, async vs thread. Record and cut filler.',
    },
    {
      topic: 'ASP.NET / DI / EF / SQL Cheat Sheet',
      difficulty: 'senior',
      english: `Platform last-day: middleware order, lifetimes, tracking, and the SQL that actually runs. If you can debug a slow request from Kestrel through EF to an execution plan, you are in senior territory.`,
      bangla: 'পাইপলাইন অর্ডার, DI লাইফটাইম, EF ট্র্যাকিং, এক্সিকিউশন প্ল্যান — স্লো রিকোয়েস্ট এখানেই ধরা পড়ে।',
      details: `
### ASP.NET Core pipeline

Order matters: exception handler → HTTPS → routing → CORS → authN → authZ → endpoints. Wrong order = CORS "not working", auth running too late, or static files skipping auth.

- **Minimal APIs vs controllers:** both fine; filters vs endpoint filters; ProblemDetails for errors.
- **Model binding + validation:** DataAnnotations / FluentValidation; never trust query strings for authz.
- **Filters:** authorization → resource → action → exception → result.
- **HttpClient:** \`IHttpClientFactory\` only; named clients + timeouts; no \`new HttpClient()\` per call.

### DI lifetimes (one table)

| Lifetime | Use | Never |
| :--- | :--- | :--- |
| Singleton | Cache, mux, factories | DbContext, HttpContext, current user |
| Scoped | DbContext, UoW | Captured by Singleton |
| Transient | Stateless helpers | Expensive stateful without thought |

**Captive:** Singleton → Scoped. Fix: \`IDbContextFactory\` / \`IServiceScopeFactory\`. \`ValidateScopes\` on in Dev. Hosted services create their own scope.

### EF Core

| Topic | Line |
| :--- | :--- |
| DbContext | UoW + identity map; **Scoped** |
| Tracking | Writes need it; APIs should \`AsNoTracking\` + project |
| N+1 | Loop queries; fix with \`Select\`, not infinite Includes |
| Split query | Multiple collection Includes cartesian-explode |
| Concurrency | \`rowversion\` / token; 409 on conflict |
| Migrations | Expand/contract; N and N-1 during rolling deploy |
| \`ExecuteUpdate\` | Bulk without tracking; still parameterized |

### SQL (interview killers)

| Topic | Line |
| :--- | :--- |
| Index | Seek vs scan; covering; implicit conversion kills seeks |
| Plan flip | Query Store; parameter sniffing; stats |
| Isolation | RCSI/read committed vs serializable deadlocks |
| Deadlock | Lock order + short tx + retry 1205 |
| Pool | Leases not returned; HTTP inside a transaction |
| \`SELECT *\` | Extra IO + breaks covering indexes |

**Math:** concurrency ≈ RPS × latency. Size the pool to that, not to "100 default."
      `,
      code: `app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs)); // scoped
services.AddDbContextFactory<AppDbContext>(...); // for workers

// Read
db.Orders.AsNoTracking().Where(...).Select(...).ToQueryString();

// Write + concurrency
[Timestamp] public byte[] RowVersion { get; set; }

// SQL you should be able to read
// CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId) INCLUDE (Total, Status);`,
      commonMistakes: [
        'Auth middleware after endpoints.',
        'DbContext Singleton "for performance."',
        'Cannot explain a seek vs a scan on a real predicate.',
      ],
      bestPractices: [
        'Draw the pipeline once from memory the night before.',
        'One tracked write path, one untracked read path — never mix casually.',
        'Always mention parameterization and indexes when talking EF.',
      ],
      interviewQs: [
        {
          q: 'Why must UseAuthentication come before UseAuthorization?',
          a: 'Authorization needs an identity. If authN has not run, the user is anonymous and [Authorize] fails closed (or worse, a custom policy sees empty claims). Pipeline order is a production bug factory, not trivia.',
          bangla: 'অথরাইজেশনের আগে আইডেন্টিটি লাগবে — অর্ডার ভুল মানে সবাই অ্যানোনিমাস।',
          difficulty: 'mid',
        },
        {
          q: 'How does SaveChanges decide what SQL to emit?',
          a: 'Change tracker compares snapshot/original values to current. Added → INSERT, deleted → DELETE, modified properties → UPDATE. Untracked entities do nothing unless you Attach and mark. That is why AsNoTracking plus mutate is a silent no-op.',
          bangla: 'চেঞ্জ ট্র্যাকার স্ন্যাপশট দেখে SQL বানায় — আনট্র্যাকড মিউটেট = কিছু হয় না।',
          difficulty: 'senior',
        },
      ],
      practice: 'On paper: pipeline order, three lifetimes, N+1 fix, deadlock retry, covering index definition.',
    },
    {
      topic: 'Architecture / Security / Redis / Messaging Cheat Sheet',
      difficulty: 'expert',
      english: `This is the "why not Kafka" half of the interview. Clean architecture is a dependency rule. Security is threat + control. Redis is optional performance. Messaging is at-least-once. Say the failure mode in the same breath as the pattern.`,
      bangla: 'আর্কিটেকচার = ডিপেন্ডেন্সি রুল। সিকিউরিটি = থ্রেট+কন্ট্রোল। Redis অপশনাল। মেসেজিং at-least-once।',
      details: `
### Architecture

| Pattern | Use when | Failure |
| :--- | :--- | :--- |
| **Modular monolith** | 1–2 teams, changing model | Becomes a ball of mud without module rules |
| **Clean / onion** | Domain must not reference EF/HTTP | Over-abstracted CRUD |
| **CQRS** | Read/write scale or model diverge | Dual write bugs; not required for every app |
| **Outbox** | DB commit + message atomicity | Dispatcher stuck; need alerting |
| **Saga** | Cross-service business flow | Compensation fails; need inbox + ops |
| **BFF** | Different clients, different shapes | Logic duplication vs fat BFF |

**Rule:** no 2PC over HTTP. Events are facts; commands are intent.

### Security (OWASP-shaped)

| Threat | Control |
| :--- | :--- |
| Authn | Short JWT + refresh rotation **or** server session; HTTPS |
| Authz | Resource checks, not just roles; no IDOR |
| Injection | Parameterized SQL; EF; never string concat |
| XSS | Encode; APIs still care if they return HTML |
| CSRF | Cookies need tokens/SameSite; Bearer less exposed |
| Secrets | Key Vault / env; never logs or git |
| Mass assignment | Dedicated DTOs |
| SSRF / uploads | Allowlists, size limits |

Password hashing: ASP.NET Identity / bcrypt / PBKDF2 — not MD5. Clock skew on JWT is explicit.

### Redis

- Cache aside + TTL **jitter** + **single-flight** (stampede).
- L1 memory + L2 Redis; SQL remains truth unless you designed otherwise.
- Down: degrade, circuit break, 429 — do not die.
- Locks: TTL + **fencing token**; GC pause > TTL = split brain.

### Messaging

| | RabbitMQ | Kafka |
| :--- | :--- | :--- |
| Model | Queues + routing | Partitioned log |
| Replay | Awkward | Native (offsets) |
| Ordering | Per queue, limited | Per partition key |
| Exactly-once | You build it | You still build it |

**Always:** outbox publish, inbox consume, bounded retry, **DLQ**, idempotency keys on money.
      `,
      code: `// Outbox in the same SaveChanges as the order
db.Orders.Add(order);
db.Outbox.Add(Outbox.From(new OrderPlaced(order.Id)));
await db.SaveChangesAsync(ct);

// Stampede: coalescing Task per key + jittered TTL (see scenarios module)

// Authz: not just [Authorize(Roles="User")]
var order = await db.Orders.SingleOrDefaultAsync(o => o.Id == id && o.UserId == userId, ct);
if (order is null) return NotFound(); // no IDOR leak`,
      commonMistakes: [
        'Drawing microservices with one shared database.',
        'Redis as the order ledger.',
        'Claiming the broker is exactly-once.',
      ],
      bestPractices: [
        'Name source of truth, consistency model, and revoke story in every design.',
        'Poison → DLQ; duplicates → inbox.',
        'Security answers include a concrete IDOR or injection example.',
      ],
      interviewQs: [
        {
          q: 'When is the outbox pattern required?',
          a: 'When a database write and a message must not diverge (order committed, event never published, or the reverse). You write both in one local transaction; a dispatcher publishes. Dual independent writes will eventually disagree.',
          bangla: 'DB আর মেসেজ এক ট্রানজেকশনে না লিখলে একদিন ডাইভার্জ করবে — outbox।',
          difficulty: 'senior',
        },
        {
          q: 'JWT is stateless — so logout is free, right?',
          a: 'No. You cannot kill a valid JWT without a denylist, a version claim, or a short TTL plus refresh you control. "Stateless" pushed revocation into another design problem. Say the revoke story first.',
          bangla: 'স্টেটলেস মানে লগআউট ফ্রি নয় — TTL/ডিনাইলিস্ট/রিফ্রেশ ফ্যামিলি লাগবে।',
          difficulty: 'senior',
        },
      ],
      practice: 'Whiteboard: checkout with SQL + Redis cache + one queue. Mark truth, TTL, outbox, IDOR check, what happens if Redis dies.',
    },
    {
      topic: 'System Design — One-Page Method',
      difficulty: 'expert',
      english: `Forty-five minutes is not a dump of every pattern you know. It is a script: clarify, estimate, sketch, deepen the bottleneck, attack your own design. Seniors drive the conversation with numbers and trade-offs. Mid-level jump to Kafka.`,
      bangla: '৪৫ মিনিট = ক্ল্যারিফাই, এস্টিমেট, স্কেচ, বটলনেক, নিজের ডিজাইন আক্রমণ। আগে Kafka নয়।',
      details: `
### The one-page script (use every time)

| Min | Move | Output on the board |
| :--- | :--- | :--- |
| **0–5** | Clarify | Functional + non-functional: QPS, p99, size, consistency, region |
| **5–10** | Estimate | RPS × latency = concurrency; storage = records × bytes × years; bandwidth |
| **10–20** | Happy path | Clients → API → app → SQL; auth; one write, one read |
| **20–30** | Scale the bottleneck | Cache, read replica, queue, split **only** the hot part |
| **30–38** | Failure | Redis down, poison, deploy, partition, hotspot key |
| **38–45** | Deep dive | The piece they care about (SQL schema, idempotency, search) |

### Questions you must ask (do not skip)

- Read/write ratio? Payload size?
- Consistency: can checkout be "pending"?
- Multi-region? Compliance (PII, audit)?
- Team size (ops tax)?
- Peak vs average (Black Friday)?

### Back-of-envelope (keep these)

- 1M users/day ≈ 12 RPS average; peak 10× → ~120 RPS unless they said otherwise.
- 10k RPS × 50ms SQL = 500 in-flight SQL **per instance** if unsynced — you will not unsync.
- 100-byte event × 10k RPS ≈ 1 MB/s; easy. 1 MB images × 10k RPS ≈ 10 GB/s; not easy.
- SQL primary: thousands of QPS with indexes; not a substitute for thinking.

### Default .NET shape (then modify)

1. Stateless ASP.NET + Kestrel behind LB.
2. SQL Server / PostgreSQL source of truth, expand/contract migrations.
3. Redis optional L2 + coalescing; not required for correctness.
4. Outbox → Rabbit/Kafka for side effects.
5. OIDC / short JWT + refresh; server-to-server mTLS or managed identity.
6. Observability: traces, RED metrics, structured logs, health ready vs live.

### Attack your design (say this unprompted)

- Hot partition (one tenant = 80% traffic).
- Exactly-once illusion.
- Dual write without outbox.
- Cache stampede after deploy.
- Rolling deploy contract break.

### English closer
"I would start here. The bottleneck is X, so I would add Y. I would not add Z yet because [team/consistency]. If Redis dies we [degrade]. Questions on schema or on the queue?"
      `,
      code: `// Estimation scratchpad
// QPS_peak = QPS_avg * 10
// concurrency = QPS * latency_s
// connections ≈ concurrency * instances  (watch SQL pool)
// storage_GB = rows * bytes / 1e9 * retention_years * 1.3 (indexes)
// cache_hit 0.9 → SQL QPS *= 0.1 (after stampede controls)`,
      commonMistakes: [
        'Designing 12 services before a single sequence diagram.',
        'No numbers — then claiming 10k RPS.',
        'Never mentioning what you would cut if the team is five people.',
      ],
      bestPractices: [
        'Write NFRs at the top of the board and point at them when choosing tools.',
        'One deep dive beats five shallow boxes.',
        'End by attacking the design; interviewers score that.',
      ],
      interviewQs: [
        {
          q: 'How do you start a system design interview?',
          a: 'I lock requirements and NFRs with numbers, then a tiny happy path, then estimates, then scale only the bottleneck, then failure modes. I ask about consistency and team size before I draw a broker. I leave time to deep-dive one component and to list what would fail.',
          bangla: 'সংখ্যাসহ NFR, হ্যাপি পাথ, বটলনেক, ফেইলিউর — আগে ব্রোকার আঁকবেন না।',
          followUp: 'What if the interviewer gives no QPS?',
          difficulty: 'senior',
        },
        {
          q: 'Design a URL shortener in .NET — 60 second skeleton.',
          a: 'API: POST URL → 302 GET. SQL table (code PK, url, created). Base62 id from sequence or hash with collision retry. Cache GET in Redis with jitter. Stateless pods. Rate-limit POST. Not Kafka. Scale reads with cache; writes are smaller. Hash hotspot if we shard by first character — use full code.',
          bangla: 'SQL সোর্স অফ ট্রুথ, GET ক্যাশ, স্টেটলেস পড — শর্টেনারে Kafka লাগে না।',
          difficulty: 'mid',
        },
      ],
      practice: 'Time a 25-minute design of "news feed" or "ticket booking" using only the table above. Record yourself attacking the design for 3 minutes.',
    },
    {
      topic: '30 Must-Know Questions (Short Senior Answers)',
      difficulty: 'senior',
      english: `These thirty show up constantly. Answers are short on purpose: 30–45 seconds. If they want depth, they will follow up — that is where scenarios and traps modules live. Drill these out loud until you do not search for the first sentence.`,
      bangla: '৩০টা প্রশ্ন, ৩০–৪৫ সেকেন্ডের উত্তর। মুখস্থ স্ক্রিপ্ট নয় — প্রথম বাক্যটা যেন তৈরি থাকে।',
      details: `
### How to drill
Cover the question, speak the answer, then peek. Mark any answer you cannot start in five seconds. Those are tonight's list — not a new chapter.

### Coverage map
C# / async (1–8) · ASP.NET / DI (9–14) · EF / SQL (15–20) · Distributed / security (21–26) · Leadership / design (27–30).
      `,
      commonMistakes: [
        'Reading answers instead of speaking them.',
        'Expanding every answer to five minutes and never finishing the 30.',
        'Skipping the ones you "already know" — those are often the trap questions.',
      ],
      bestPractices: [
        'One breath: definition. Second: failure mode. Stop.',
        'Use a real class name from your job once per five answers so you do not sound generic.',
        'After 30, pick five follow-ups from the traps module.',
      ],
      interviewQs: [
        {
          q: '1. Stack vs heap?',
          a: 'Stack holds frames and some locals; heap holds objects. Structs are values — they can live on either. GC manages the heap. Do not say "structs always stack."',
          bangla: 'স্ট্যাক = ফ্রেম; হিপ = অবজেক্ট। স্ট্রাক্ট সবসময় স্ট্যাক নয়।',
          difficulty: 'mid',
        },
        {
          q: '2. Interface vs abstract class?',
          a: 'Interface = role, multiple, no instance fields. Abstract = shared state + template method, single inheritance. DIM does not replace abstract classes.',
          bangla: 'ইন্টারফেস রোল, অ্যাবস্ট্রাক্ট শেয়ার্ড ইমপ্লিমেন্টেশন।',
          difficulty: 'mid',
        },
        {
          q: '3. SOLID in one minute?',
          a: 'SRP one reason to change; OCP extend without edit; LSP subtypes safe; ISP no fat interfaces; DIP depend on abstractions. Give one class from your system.',
          bangla: 'পাঁচটা অক্ষর + নিজের প্রজেক্টের একটা ক্লাস।',
          difficulty: 'mid',
        },
        {
          q: '4. IEnumerable vs IQueryable?',
          a: 'IQueryable is an expression tree translated to SQL. IEnumerable LINQ runs in memory. ToList/AsEnumerable too early = full table then filter.',
          bangla: 'IQueryable = SQL, IEnumerable = মেমোরি।',
          followUp: 'Should a repository return IQueryable?',
          difficulty: 'senior',
        },
        {
          q: '5. First vs Single?',
          a: 'Single* = exactly one (or zero for OrDefault); duplicates throw. First* = first row; needs OrderBy; hides duplicates. Unique key → SingleOrDefault.',
          bangla: 'ইউনিক কি = Single। First = সর্টেড টপ-১।',
          difficulty: 'mid',
        },
        {
          q: '6. Deferred execution?',
          a: 'The query object is a plan. SQL/iteration runs at enumeration. Mutating a captured variable or enumerating twice can surprise you. Materialize once at the boundary.',
          bangla: 'এনুমারেশনে চলে — দুবার এনুমারেট করলে দুবার SQL।',
          difficulty: 'mid',
        },
        {
          q: '7. Task vs Thread?',
          a: 'Thread is an OS execution resource. Task is a promise. I/O tasks often occupy no thread while waiting. await does not mean "new thread."',
          bangla: 'Task প্রমিস, Thread এক্সিকিউশন। Await ≠ নতুন থ্রেড।',
          difficulty: 'senior',
        },
        {
          q: '8. Async vs parallelism? ConfigureAwait?',
          a: 'Async overlaps waits. Parallelism uses many cores for CPU. ConfigureAwait(false) in libraries; ASP.NET Core has no UI SyncContext. Never .Result on the request path.',
          bangla: 'Async অপেক্ষা, Parallel CPU। লাইব্রেরিতে ConfigureAwait(false)। .Result নয়।',
          difficulty: 'senior',
        },
        {
          q: '9. Middleware order?',
          a: 'Exception, HTTPS, routing, CORS, authentication, authorization, endpoints. AuthN before AuthZ. Wrong CORS/auth order is a classic prod bug.',
          bangla: 'অথN তারপর অথZ। CORS/রাউটিং অর্ডার মাথায় রাখুন।',
          difficulty: 'mid',
        },
        {
          q: '10. Singleton vs Scoped vs Transient?',
          a: 'Singleton: process, thread-safe, no request state. Scoped: per request/UoW (DbContext). Transient: new each resolve. Lifetime is ownership, not speed.',
          bangla: 'সিঙ্গেলটন স্টেটলেস, স্কোপড DbContext, ট্রানসিয়েন্ট হালকা।',
          difficulty: 'senior',
        },
        {
          q: '11. Captive dependency?',
          a: 'Long-lived service holds short-lived (Singleton → DbContext). Disposed or leaked context. Fix with factory/scope. ValidateScopes in Development.',
          bangla: 'সিঙ্গেলটন স্কোপড ধরে রাখলে captive — factory ব্যবহার করুন।',
          difficulty: 'expert',
        },
        {
          q: '12. IHttpClientFactory why?',
          a: 'Avoids socket exhaustion from new HttpClient per call and DNS staleness from a static client forever. Named clients get timeouts and resilience handlers.',
          bangla: 'প্রতি কলে new HttpClient সকেট শেষ করে; factory ব্যবহার করুন।',
          difficulty: 'mid',
        },
        {
          q: '13. Model validation vs authz?',
          a: 'Validation is shape/required fields. Authz is whether this user may touch this resource. A valid DTO can still be IDOR. Check ownership in the query.',
          bangla: 'ভ্যালিডেশন শেপ, অথরাইজেশন ওনারশিপ — IDOR আলাদা।',
          difficulty: 'senior',
        },
        {
          q: '14. Filters vs middleware?',
          a: 'Middleware is the pipeline for all requests. Filters run in MVC/endpoint context (have action descriptors, ModelState). Cross-cutting HTTP → middleware; MVC-specific → filters.',
          bangla: 'মিডলওয়্যার পুরো পাইপলাইন; ফিল্টার MVC/এন্ডপয়েন্ট কনটেক্সট।',
          difficulty: 'mid',
        },
        {
          q: '15. DbContext lifetime?',
          a: 'Scoped. Unit of work + identity map. Singleton is a captive/concurrency bug. Workers: create a scope per iteration.',
          bangla: 'DbContext স্কোপড — সিঙ্গেলটন নয়। ওয়ার্কারে প্রতি লুপে স্কোপ।',
          difficulty: 'senior',
        },
        {
          q: '16. AsNoTracking?',
          a: 'No identity map, no snapshot, cheaper reads, SaveChanges will not UPDATE. Use for APIs/projections. Wrong if you plan to mutate the instance.',
          bangla: 'রিডে AsNoTracking; মিউটেট করতে হলে ট্র্যাকিং।',
          difficulty: 'mid',
        },
        {
          q: '17. N+1?',
          a: 'One query plus one per child in a loop (or lazy load). Fix with projection/join, not a cartesian Include bomb. Count SQL per request.',
          bangla: 'লুপে কোয়েরি = N+1। প্রজেকশন দিয়ে এক/দুই SQL।',
          difficulty: 'senior',
        },
        {
          q: '18. EF migrations in rolling deploy?',
          a: 'Expand/contract: additive first so N and N-1 both run. Never rename/drop in the same release as the code that needs it. Rollback may be illegal after a breaking migration.',
          bangla: 'আগে কলাম যোগ, পরে কোড, পরে ড্রপ — N ও N-1 একসাথে চলে।',
          difficulty: 'expert',
        },
        {
          q: '19. Clustered vs covering index?',
          a: 'Clustered is the table order (usually PK). Covering index includes all columns the query needs so it does not lookup the heap/clustered table. Seek + cover beats scan.',
          bangla: 'ক্লাস্টার্ড = টেবিল অর্ডার। কভারিং = কোয়েরির সব কলাম ইনডেক্সে।',
          difficulty: 'senior',
        },
        {
          q: '20. Isolation levels / deadlock?',
          a: 'Read committed/RCSI for most OLTP. Serializable increases range locks and deadlocks. Deadlock = lock order; retry 1205 with jitter; keep transactions short.',
          bangla: 'ডিফল্ট RC; সিরিয়ালাইজেবল ডেডলক বাড়ায়। লক অর্ডার + ছোট tx।',
          difficulty: 'senior',
        },
        {
          q: '21. JWT vs session?',
          a: 'JWT: scalable claims, revoke is hard (short TTL/denylist). Session: revoke is delete, needs a store. Pick from the revoke and CSRF story, not from fashion.',
          bangla: 'রিভোক স্টোরি দিয়ে বাছুন — JWT সবসময় ভালো নয়।',
          difficulty: 'senior',
        },
        {
          q: '22. IDOR?',
          a: 'Insecure direct object reference: /orders/5 without checking owner. Fix in the query (UserId == current) and tests. Roles alone are not enough.',
          bangla: 'আইডি দিয়ে অন্যের রেকর্ড — কোয়েরিতে ওনার চেক।',
          difficulty: 'mid',
        },
        {
          q: '23. Redis vs SQL?',
          a: 'SQL is source of truth for business data. Redis is cache/session/lock/rate-limit with TTL and fallback. If the site dies when Redis dies, the design is wrong for a cache.',
          bangla: 'SQL সত্য; Redis ক্যাশ। Redis ডাউন = ডিগ্রেড।',
          difficulty: 'senior',
        },
        {
          q: '24. Cache stampede?',
          a: 'Many misses on one key hit origin together. Jitter TTL, single-flight per key, optionally stale-while-revalidate. GetOrCreate is not enough across a farm.',
          bangla: 'এক কি মিস করে সবাই DB — jitter + coalescing।',
          difficulty: 'senior',
        },
        {
          q: '25. RabbitMQ vs Kafka?',
          a: 'Rabbit: work queues and routing. Kafka: durable log, replay, consumer groups. Neither is exactly-once; both need inbox/idempotency. Choose replay vs routing.',
          bangla: 'রিপ্লে = Kafka, ওয়ার্ক কিউ = Rabbit। দুটোতেই inbox।',
          difficulty: 'expert',
        },
        {
          q: '26. Outbox / idempotency?',
          a: 'Outbox: message in the same DB transaction as the write. Idempotency: unique MessageId/business key so at-least-once delivery does not double charge.',
          bangla: 'আউটবক্স = এক ট্রানজেকশন। আইডেমপোটেন্সি = ডুপ্লিকেট সেফ।',
          difficulty: 'senior',
        },
        {
          q: '27. Monolith vs microservices?',
          a: 'Modular monolith until a team and data boundary exist. Microservices buy isolation and independent deploy; they cost sagas and ops. Shared DB + many services = distributed monolith.',
          bangla: 'আগে মডুলার মনোলিথ। শেয়ার্ড DB + অনেক সার্ভিস = ডিস্ট্রিবিউটেড মনোলিথ।',
          difficulty: 'expert',
        },
        {
          q: '28. Vertical vs horizontal scale?',
          a: 'Scale the bottleneck. Stateless APIs scale out. SQL often scales up + indexes + replicas before shards. More API pods can worsen pool exhaustion.',
          bangla: 'বটলনেক মাপুন। API আউট, SQL আগে আপ/ইনডেক্স।',
          difficulty: 'senior',
        },
        {
          q: '29. Why hire you as Senior?',
          a: 'Scope (end-to-end including ops), judgment (trade-offs and failure modes), multiplier (reviews, mentoring, runbooks). Mid makes it work; senior makes it operable without them.',
          bangla: 'স্কোপ, জাজমেন্ট, মাল্টিপ্লায়ার — শুধু ফিচার নয়।',
          difficulty: 'senior',
        },
        {
          q: '30. Production incident — first five minutes?',
          a: 'Impact and blast radius, what changed, stabilize if SLO is burning (rollback/flag/shed), one hypothesis with evidence, stakeholder update with a next-clock. Do not hunt RCA while customers burn.',
          bangla: 'ইমপ্যাক্ট, চেঞ্জ, স্টেবিলাইজ, এক হাইপোথিসিস, আপডেটের ঘড়ি।',
          followUp: 'Rollback vs forward-fix?',
          difficulty: 'expert',
        },
      ],
      practice: 'Shuffle 1–30. Answer all in under 25 minutes. Anything that took more than 60 seconds goes on a sticky note for a second pass.',
    },
    {
      topic: 'Mock Interview Roadmap — 13 Phases and Night-Before Drill',
      difficulty: 'senior',
      english: `The handbook is a 13-phase system. Last night you do not reread everything. You run a timed mock, drill traps, speak two stories, and sleep. This section is the operating plan for the 24 hours before the panel.`,
      bangla: '১৩ ফেজের সিস্টেম। শেষ রাতে সব পড়া নয় — টাইমড মক, ট্র্যাপ, দুই স্টোরি, ঘুম।',
      details: `
### The 13 phases (what each phase must leave in your mouth)

| Phase | Module focus | You can explain without notes |
| :--- | :--- | :--- |
| **1. C# & OOP** | Value/ref, GC, SOLID, interface vs abstract | One SOLID example from your repo |
| **2. LINQ & Async** | IQueryable, deferred, deadlock, tokens | Why .Result starves the pool |
| **3. ASP.NET Core** | Pipeline, filters, ProblemDetails | AuthN before AuthZ |
| **4. EF Core & SQL** | Tracking, N+1, indexes, isolation | Seek vs scan; rowversion |
| **5. Architecture** | Modular monolith, when not to split | One ADR you would write |
| **6. Security** | JWT revoke, IDOR, OWASP | One IDOR fix in a query |
| **7. Redis & messaging** | Stampede, outbox, DLQ | Redis down story |
| **8. Microservices** | Saga, outbox, when not to | No 2PC over HTTP |
| **9. Docker & cloud** | Health, secrets, rolling deploy | Ready vs live probes |
| **10. System design** | One-page method | 45-min timed design |
| **11. Coding** | Arrays/HashMap + a senior task | Speak while you type |
| **12. Scenarios** | 12 playbooks + 100 titles | One incident timeline |
| **13. Mock interviews** | This section | Full 45+45+30 dry run |

If a phase is weak, do not "skim architecture." Go back. Last-day revision cannot create SQL intuition overnight.

### Night before (T-12 hours to sleep) — drill, do not cram

| Block | Minutes | What |
| :--- | :--- | :--- |
| **1. Trap sprint** | 25 | IEnumerable/IQueryable, First/Single, Task/Thread, captive DI, JWT revoke, RMQ vs Kafka |
| **2. 30 Qs** | 25 | Section 5 of this module, out loud, standing |
| **3. Incident story** | 15 | STAR-L with times and a wrong hypothesis |
| **4. Architecture story** | 10 | ADR: options, rejected, reversal |
| **5. Design sprint** | 30 | One prompt (shortener, tickets, feed) with the one-page method |
| **6. Coding warm** | 20 | Two easy HashMap problems speaking aloud |
| **7. Logistics** | 10 | Job description keywords, questions for them, water, IDE font |
| **8. Stop** | — | Sleep. No new chapters after this |

Total ≈ 2 hours 15 minutes. More than that is diminishing returns and worse sleep.

### Morning of (90 minutes max)

- 10 min: pipeline + lifetimes + AsNoTracking.
- 10 min: your 90-second "tell me about yourself."
- 10 min: skim your two stories' numbers.
- Then stop. Light review of their engineering blog if any.

### Mock panel format (do this at least once before last night)

1. **45 min behavioral + traps** (leadership + traps modules).
2. **45 min system design** (one-page method).
3. **30–45 min coding** with talking.
4. **15 min** you ask them: on-call, deploy, what seniority means here.

Record at least one mock. Cringe is the point.

### What not to do the night before
- Open a new distributed-systems textbook.
- Rewrite your CV.
- Memorize the 100 scenario titles as a speech.
- Skip sleep to reread EF internals.
      `,
      code: `// Last-night checklist (print or notes app)
// [ ] 90s pitch timed
// [ ] Incident STAR-L with T+0 / T+15 / resolve
// [ ] One ADR spoken (rejected option included)
// [ ] 30 Qs once through
// [ ] Traps: IQueryable, Single, captive, JWT revoke
// [ ] One 30-min design
// [ ] Two questions for the interviewer
// [ ] Sleep`,
      commonMistakes: [
        'Treating last-day revision as the first read of SQL and async.',
        'Mock interviews only in your head, never timed out loud.',
        'Cramming until 2am and losing the pitch to fatigue.',
      ],
      bestPractices: [
        'Phases 1–10 before this module; this module is a recap.',
        'Voice > highlights. Interviewers hear structure.',
        'Protect sleep like it is part of the exam.',
      ],
      interviewQs: [
        {
          q: 'How should a senior candidate use the last 24 hours?',
          a: 'Recap traps and the 30 questions out loud, rehearse two stories (incident + architecture), run one timed design, warm coding, then sleep. Do not start new domains. Morning: pitch + pipeline only. The 13 phases should already be done; last day is retrieval practice, not learning.',
          bangla: 'ট্র্যাপ, ৩০ প্রশ্ন, দুই স্টোরি, এক ডিজাইন, ঘুম — নতুন চ্যাপ্টার নয়।',
          followUp: 'What if you only have three days total to prepare?',
          difficulty: 'senior',
        },
        {
          q: 'What does a good mock interview look like?',
          a: 'Timed, spoken, with a human or a recording. Include traps, a design with NFRs on the board, and coding while talking. Debrief: where you ramble, where you skipped failure modes. One mock beats three silent rereads. Use the 45/45/30 format so the real panel feels familiar.',
          bangla: 'টাইমড, জোরে বলা, রেকর্ড — চুপচাপ পড়া মক নয়।',
          difficulty: 'mid',
        },
        {
          q: 'How do the 13 phases map to a two-week plan?',
          a: 'Week 1: phases 1–4 (C#, async, ASP.NET, EF/SQL) — where most seniors still fail. Week 2: 5–10 plus one design a day, then scenarios and two full mocks (phase 13). Drop trivia. Last-day revision is the final 24 hours, not day 1.',
          bangla: 'সপ্তাহ ১: ভাষা ও ডেটা। সপ্তাহ ২: আর্কি + ডিজাইন + মক। লাস্ট-ডে দিন ১ নয়।',
          difficulty: 'senior',
        },
      ],
      practice: 'Tonight: run the 8-block night-before table with a timer. Tomorrow morning: only the 90-second pitch and pipeline order.',
    },
  ],
  quickRevision: {
    concepts: [
      'IQueryable vs in-memory LINQ; Single vs First',
      'Task ≠ thread; no .Result on ASP.NET',
      'Pipeline: AuthN then AuthZ; DI captives',
      'DbContext scoped; AsNoTracking for reads',
      'N+1, covering index, deadlock retry',
      'JWT revoke story; IDOR in the query',
      'Redis degrade; stampede coalescing',
      'Outbox + inbox; RMQ vs Kafka',
      'Design: NFR → estimate → bottleneck → failure',
      'Last night: retrieve and sleep, do not cram',
    ],
    questions: [
      'IEnumerable vs IQueryable?',
      'Captive dependency?',
      'How does SaveChanges work?',
      'JWT vs session revoke?',
      'Cache stampede?',
      'Outbox why?',
      'Monolith vs services?',
      'First five minutes of an incident?',
      'System design first five minutes?',
      'Why hire you as Senior?',
    ],
    mistakes: [
      'Using last-day revision as the first read',
      'Silent mocks (reading, not speaking)',
      '.Result and Singleton DbContext still in your examples',
      'Design without numbers',
      'Skipping sleep',
    ],
    scenarios: [
      'Panel opens with "tell me about yourself" then a trap First vs Single',
      'Design prompt with no QPS given',
      'They ask Redis down on your design',
      'Behavioral: disagreement with a staff engineer',
      'Live coding: you freeze on HashMap vs sort',
    ],
  },
  revisionSummary: `
- Cheat sheets: C#/async, ASP.NET/DI/EF/SQL, architecture/security/Redis/messaging — failure modes, not syntax.
- System design: one-page timed method; attack your own board.
- 30 short Q&As for retrieval; 13-phase roadmap; night-before is a 2-hour spoken drill plus sleep.
  `,
  summary:
    'Last-day revision is retrieval practice for a senior .NET panel: compact cheat sheets, a 45-minute design script, 30 spoken answers, and a 13-phase mock plan. It only works if the earlier modules are already in your bones.',
};
