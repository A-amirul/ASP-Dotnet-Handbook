export const scenariosData = {
  id: 'scenarios',
  title: '100+ Real-World Senior .NET Scenarios',
  description:
    'Production incident playbooks for senior .NET interviews: how you investigate, what the root cause usually is, how you fix it without making it worse, and how you answer the follow-up. Twelve deep dives plus a 100-title catalog so the handbook literally covers 100+ scenarios.',
  sections: [
    {
      topic: 'API Slow, SQL Suddenly Slow, and N+1',
      difficulty: 'senior',
      english: `Problem → p95/p99 jumped; one endpoint or all? Investigation → traces, SQL, allocations — never guess. Root cause → N+1, bad plan, missing index, sync-over-async, or chatty downstream. Solution → fix the hottest path with evidence. Prevention → budgets, query limits, load tests. Interview answer → walk the timeline with metrics, not a list of tools.`,
      bangla: 'API স্লো হলে অনুমান নয় — ট্রেস, SQL, অ্যালোকেশন দিয়ে প্রমাণ করুন। N+1, খারাপ প্ল্যান, মিসিং ইনডেক্স, sync-over-async — এগুলোই সাধারণ রুট কজ।',
      details: `
### Problem
Checkout p95 went from 180ms to 3.4s after a "small" feature. Error rate is still ~0.2%. Product thinks "the API is slow." A senior does not optimize randomly.

### Investigation
1. **Split the symptom.** One route or all? One tenant or all? Started at a deploy, a data-volume cliff, or a dependency outage?
2. **Trace first.** OpenTelemetry / Application Insights: time in ASP.NET, EF, Redis, HTTP. If 90% is SQL, do not profile C# first.
3. **SQL evidence.** EF \`ToQueryString\`, MiniProfiler, \`QueryTrackingBehavior\`, SQL Server Query Store / \`sys.dm_exec_query_stats\`. Count round-trips per request.
4. **N+1 signature.** 1 query + N queries in a loop; or lazy-load after the context is still open. Logs show dozens of nearly identical \`SELECT\`s.
5. **Plan change signature.** Same query text, duration exploded, CPU on SQL high, \`SET STATISTICS IO\` logical reads through the roof — parameter sniffing or stale stats after a data spike.
6. **App signature.** Thread pool queue length up, \`sync-over-async\` stacks, or a serializer allocating 50MB JSON.

### Root Cause (typical)
| Pattern | What you see | Usual cause |
| :--- | :--- | :--- |
| **N+1** | 50–500 similar SELECTs / request | Missing \`Include\` / projection; lazy load; \`foreach\` + extra query |
| **Cartesian explosion** | One SQL, huge row count, then client group | Multiple collection \`Include\`s |
| **Plan flip** | Sudden, after stats/data change | Parameter sniffing; missing covering index |
| **Chatty API** | Time in HttpClient, not SQL | Sequential downstream calls that should be parallel or batched |

### Solution
- Replace lazy graphs with **explicit projection** (\`Select\` to DTO) — not "add more Includes."
- Split collection Includes (\`AsSplitQuery\`) when the join product is the problem.
- For plan flips: **Query Store force plan**, **OPTIMIZE FOR UNKNOWN** / \`AsNoTracking\` + parameterized SQL, or a covering index proved by actual plan — not by guessing columns.
- Cap work: paging, compiled queries for hot paths, and a **query complexity budget** in code review.

### Prevention
- Fail CI if a request issues more than N SQL statements in a test (EF logging interceptor).
- p95 SLO + alert on regression vs last deploy.
- Load-test the checkout path with production-like data volume, not 10 rows.

### Interview Answer
"I would not start by adding a cache. I would prove where the time went: trace → SQL count and duration → plan. If it is N+1 I project to a DTO. If it is a plan flip I use Query Store and indexes. If it is downstream I isolate with timeouts and bulkheads. Then I add a regression test so the next Include does not bring it back."
      `,
      code: `// Detect N+1 in a request (logging interceptor) + fix with projection
public sealed class SqlCountInterceptor : DbCommandInterceptor
{
    private static readonly AsyncLocal<int> Count = new();
    public static int Current => Count.Value;
    public static void Reset() => Count.Value = 0;

    public override ValueTask<DbDataReader> ReaderExecutedAsync(
        DbCommand command, CommandExecutedEventData eventData,
        DbDataReader result, CancellationToken ct = default)
    {
        Count.Value++;
        return new ValueTask<DbDataReader>(result);
    }
}

// BAD: N+1 — each order hits the database again
var orders = await db.Orders.Where(o => o.CustomerId == id).ToListAsync();
foreach (var o in orders)
    o.Lines = await db.OrderLines.Where(l => l.OrderId == o.Id).ToListAsync();

// GOOD: one SQL, DTO, no tracking
var dto = await db.Orders.AsNoTracking()
    .Where(o => o.CustomerId == id)
    .Select(o => new OrderListItem(
        o.Id, o.Total,
        o.Lines.Select(l => new LineItem(l.Sku, l.Qty)).ToList()))
    .ToListAsync();`,
      commonMistakes: [
        'Adding Redis before proving the time is in SQL.',
        'Fixing N+1 with a giant Include graph that cartesian-explodes.',
        'Rebuilding indexes blindly without looking at the actual execution plan.',
      ],
      bestPractices: [
        'One request → count SQL statements; seniors treat >10 as a smell unless proven.',
        'Prefer projection over graph loading for APIs.',
        'Use Query Store for "it was fast yesterday."',
      ],
      interviewQs: [
        {
          q: 'p95 of GET /orders went from 90ms to 2s after a release. How do you investigate?',
          a: 'Confirm blast radius (one route vs all, one region vs all) and whether it started at the deploy. Pull a distributed trace and split time: ASP.NET, EF, Redis, HTTP. If SQL dominates, count round-trips (N+1) and inspect the actual plan (Query Store). Fix with projection or an index proved by the plan. Ship a query-count assertion so it cannot regress silently.',
          bangla: 'ট্রেস দিয়ে সময় ভাগ করুন — SQL হলে রাউন্ড-ট্রিপ আর প্ল্যান দেখুন, আগে ক্যাশ যোগ করবেন না।',
          followUp: 'What if traces look fine but the client still sees 2s?',
          difficulty: 'senior',
        },
        {
          q: 'How do you explain N+1 to a mid-level engineer in 60 seconds?',
          a: 'You ran one query for parents, then one query per child in a loop. Latency is O(N) network round-trips, not O(1) SQL. The fix is a join or a batched IN query expressed as a projection, not more Includes of collections that multiply rows.',
          bangla: 'প্যারেন্ট একবার, চাইল্ড লুপে — এটাই N+1। Include বাড়িয়ে কার্টেসিয়ান ব্লাস্ট করবেন না, প্রজেকশন করুন।',
          difficulty: 'mid',
        },
        {
          q: 'A query that was 20ms is now 8s with the same code. What happened?',
          a: 'Same text, new plan: parameter sniffing, stale statistics after a data load, or an index that no longer covers. Query Store shows the plan flip. I compare estimated vs actual rows, look at spills to tempdb, then force a good plan temporarily and add the right covering index or \`OPTIMIZE FOR UNKNOWN\` with a measured trade-off.',
          bangla: 'কোড একই, প্ল্যান বদলেছে — Query Store, stats, covering index।',
          followUp: 'When is OPTIMIZE FOR UNKNOWN the wrong fix?',
          difficulty: 'expert',
        },
      ],
      practice: 'Take a controller that returns Order + Lines + Customer. Log SQL count. Drive it to 1–2 queries with a DTO projection and AsNoTracking.',
    },
    {
      topic: 'Database CPU 100% and Connection Pool Exhaustion',
      difficulty: 'expert',
      english: `Problem → SQL CPU pegged or app throws timeout getting a connection. Investigation → who holds connections, which queries burn CPU, pool vs server. Root cause → long transactions, missing indexes, chatty ORM, leaked DbContext, or pool smaller than concurrency. Solution → kill the burner, then fix leases. Prevention → pool metrics, command timeouts, no sync SQL on request threads.`,
      bangla: 'DB CPU ১০০% আর pool exhaustion আলাদা সমস্যা — কে কানেকশন ধরে রাখছে আর কোন কোয়েরি CPU খাচ্ছে তা আলাদা করে মাপুন।',
      details: `
### Problem
Two related outages that interviewers love to mix:
- **SQL CPU 100%:** queries compile/execute too hard (scans, sorts, functions on columns, parameter sniffing).
- **Pool exhaustion:** \`Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool.\` The database may be healthy.

### Investigation
1. **SQL side:** \`sys.dm_exec_requests\` + query stats + wait stats (\`CXPACKET\`, \`PAGEIOLATCH\`, \`LCK_M_*\`, \`SOS_SCHEDULER_YIELD\`). CPU high with \`SOS_SCHEDULER_YIELD\` → CPU-bound queries. High \`LCK\` → blocking, not CPU.
2. **App side:** \`SqlClient\` performance counters / EventSource: NumberOfActiveConnections, NumberOfPooledConnections, NumberOfFreeConnections. If active == max and free == 0, you are leased out.
3. **Who holds the lease?** DbContext not disposed (missing \`await using\`), \`TransactionScope\` left open, or a request that calls SQL then waits on HTTP **while holding the connection**.
4. **Thread dump / parallel stacks:** many threads blocked in \`WaitForConnection\`.

### Root Cause
| Symptom | Root cause |
| :--- | :--- |
| CPU 100%, few connections | Table scan / bad plan / implicit conversion |
| CPU low, pool full | Connections held across I/O; leaked context; Max Pool Size too low for concurrency |
| Both | Retry storm: every timeout retries and multiplies load (retry amplification) |

### Solution
- **Stabilize:** enable read-only intent on replicas for reporting; kill runaway sessions only with a documented owner; scale **reads** if the burner is reporting, not OLTP.
- **Release leases:** \`await using var db\`; never call HTTP inside a transaction; keep transactions milliseconds, not seconds.
- **Right-size pool:** \`Max Pool Size\` must exceed (Kestrel max concurrent requests that touch SQL) × (connections per request). Default 100 is often too low for 10k RPS with even 5% SQL time.
- **Break retry storms:** jittered backoff, circuit breaker, and **do not retry 500s that already hit SQL**.

### Prevention
- Alert: pool utilization > 80%, SQL CPU > 70% for 5 minutes, blocked process report.
- Code review: no \`Task.Result\` on EF; no ambient transactions around HTTP.
- Query Store + index hygiene as a weekly ops habit, not a fire drill.

### Interview Answer
"I separate CPU from pool. CPU is a query/plan problem; pool is a lease problem. I look at wait stats and SqlClient pool counters, then I find who holds connections across awaits. The senior failure is the retry storm that turns a slow query into a total outage."
      `,
      code: `// Connection string: size the pool to concurrency, fail fast, do not hold across HTTP
// Max Pool Size=200; Connect Timeout=3; Command Timeout=5;

public sealed class CheckoutService(AppDbContext db, IPaymentClient payments)
{
    public async Task CheckoutAsync(Order order, CancellationToken ct)
    {
        // BAD: HTTP inside an implicit EF transaction / open reader
        // await db.Orders.AddAsync(order);
        // await payments.ChargeAsync(order); // holds connection if not careful
        // await db.SaveChangesAsync();

        // GOOD: short DB write, then IO, then compensating DB if needed
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct); // connection returned to pool

        var pay = await payments.ChargeAsync(order, ct); // no SQL lease
        if (!pay.Ok)
            await CompensateAsync(order.Id, ct);
    }
}`,
      commonMistakes: [
        'Raising Max Pool Size forever instead of finding the leak.',
        'Retrying SqlException timeouts without jitter — retry amplification.',
        'Calling a downstream HTTP API while a SqlTransaction is open.',
      ],
      bestPractices: [
        'Transactions in milliseconds; connections not held across HTTP.',
        'Alert on pool utilization, not only on HTTP 500s.',
        'Command timeout shorter than the HTTP request timeout.',
      ],
      interviewQs: [
        {
          q: 'Users see "timeout getting a connection from the pool" but SQL CPU is 15%. What is going on?',
          a: 'The pool is exhausted, not the CPU. Something is leasing connections and not returning them: undisposed DbContext, a transaction spanning an HTTP call, or concurrency above Max Pool Size. I check SqlClient pool counters and dumps for WaitForConnection, then I fix the lease, not the hardware.',
          bangla: 'Pool শেষ, CPU নয় — কানেকশন ফেরত আসছে না। HTTP কল ট্রানজেকশনের ভিতরে রাখবেন না।',
          followUp: 'How do you choose Max Pool Size for a 50-instance service?',
          difficulty: 'senior',
        },
        {
          q: 'SQL CPU is 100%. Do you add a read replica immediately?',
          a: 'Not until I know the burner. If OLTP writes are scanning, a replica will not save the primary. If it is reporting, offload. First: top queries, wait stats, Query Store. Then index or rewrite. Replica is a scale-out of reads, not a substitute for a missing index.',
          bangla: 'আগে টপ কোয়েরি — রাইট স্ক্যান হলে রেপ্লিকা কাজে আসবে না।',
          difficulty: 'expert',
        },
      ],
      practice: 'Reproduce pool exhaustion: 200 parallel requests each holding a transaction and delaying 5s. Watch active connections hit Max Pool Size. Then fix by committing before the delay.',
    },
    {
      topic: 'Memory Leaks and GC Pauses',
      difficulty: 'expert',
      english: `Problem → working set grows until OOM or Gen2 pauses spike p99. Investigation → dump, histograms, allocation rate — not Task Manager. Root cause → event handlers, static caches, captured scopes, LOH fragmentation, or unbounded channels. Solution → fix the retainer, then tune GC only if allocation rate is the issue. Prevention → memory budgets, dump on threshold, no unbounded in-memory queues.`,
      bangla: 'মেমোরি লিক মানে কেউ রেফারেন্স ধরে রাখছে। GC পজ মানে অ্যালোকেশন রেট বা LOH। ডাম্প ছাড়া টিউন করবেন না।',
      details: `
### Problem
- **Leak:** process memory climbs over hours/days; recycle "fixes" it. Classic in IIS app pools and long-lived Kubernetes pods.
- **GC pauses:** memory is stable but p99 spikes every few seconds; \`% Time in GC\` high; Gen2 collections frequent.

These are different diseases. Interviewers fail candidates who say "just set GC to server mode."

### Investigation
1. **Is it a leak or high cache?** After a traffic dip, does memory fall? Cache that never evicts looks like a leak.
2. **Dump:** \`dotnet-dump collect\` / Visual Studio Diagnostic. \`dumpheap -stat\`, then \`gcroot\` on a suspicious type.
3. **Common retainers in .NET:**
   - Static \`ConcurrentDictionary\` / \`IMemoryCache\` without size limit
   - Event \`+=\` without \`-=\` (especially on static events)
   - \`IHttpClientFactory\` misused vs a static \`HttpClient\` with cookies/handlers
   - Singleton holding scoped objects (captured \`DbContext\`, captured \`HttpContext\`)
   - Unbounded \`Channel<T>\` / \`BlockingCollection\` / in-memory queue
   - EF tracking: huge identity map in a long-lived context
4. **GC pauses:** allocation rate (B/sec), LOH allocations (>85KB), pinned handles (HTTP, sockets). \`dotnet-counters\` : \`gc-heap-size\`, \`gen-2-gc-count\`, \`time-in-gc\`.

### Root Cause
| Signal | Cause |
| :--- | :--- |
| Byte[] / string growing | Unbounded cache, logs, or JSON buffer |
| EventHandler / Timer | Subscription leak |
| DbContext / ChangeTracker | Context used as singleton or never cleared |
| LOH fragments | Large arrays allocated per request (e.g. 1MB buffers) |
| Time in GC > 20% | Allocation rate too high (boxing, LINQ on hot path) |

### Solution
- Fix the **root retainer** first. GC mode will not fix a static dictionary.
- Bound every cache (\`SizeLimit\`, TTL, compaction).
- ArrayPool / RecyclableMemoryStream for large buffers; avoid per-request LOH.
- Server GC in web apps; DATAS / dynamic adaptation on modern runtimes when heap varies.
- For pauses: reduce allocations (span, pooling), then consider GC settings — never the first knob.

### Prevention
- Alert working set and Gen2 count per second.
- Memory dump on threshold in staging weekly.
- Code review: no static mutable collections; no Singleton → DbContext.

### Interview Answer
"I distinguish leak vs GC pressure. Leak is a retainer — dump and gcroot. Pauses are allocation rate or LOH. I would not tune GC until I know which. The senior story is the unbounded cache that looked like a leak and the captured HttpContext in a singleton."
      `,
      code: `// Bounded cache + pooled buffers (leak and LOH prevention)
builder.Services.AddMemoryCache(o =>
{
    o.SizeLimit = 1024;          // entries must set Size
    o.CompactionPercentage = 0.2;
});

public sealed class ReportCache(IMemoryCache cache)
{
    public Task<byte[]> GetPdfAsync(string id, CancellationToken ct) =>
        cache.GetOrCreateAsync(id, async e =>
        {
            e.Size = 1;
            e.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
            return await GenerateAsync(id, ct);
        })!;
}

// BAD: static event leak
public static event Action<string>? OnMsg;
// GOOD: scoped handler with IDisposable unsubscribe

// BAD: 1MB new byte[] per request → LOH
// GOOD:
byte[] rented = ArrayPool<byte>.Shared.Rent(1024 * 1024);
try { /* use rented */ }
finally { ArrayPool<byte>.Shared.Return(rented); }`,
      commonMistakes: [
        'Recycling the app pool as the "fix" and never taking a dump.',
        'IMemoryCache without SizeLimit in a high-cardinality key space.',
        'Tuning GCServer / latency mode before measuring allocation rate.',
      ],
      bestPractices: [
        'Every cache has a size, TTL, and eviction policy.',
        'Dump first, tune GC second.',
        'Never store DbContext or HttpContext in a Singleton.',
      ],
      interviewQs: [
        {
          q: 'Memory grows 200MB/hour in production. How do you find the leak?',
          a: 'Confirm it is a retainer, not a warm cache: after traffic drops, does it fall? Take two dumps an hour apart, dumpheap -stat, diff the types that grew, gcroot one instance. In ASP.NET the usual suspects are unbounded caches, static events, and a singleton holding scoped services. Fix the retainer; recycling is not a root-cause fix.',
          bangla: 'দুইটা ডাম্প ডিফ করুন — unbounded cache, static event, singleton-এ scoped।',
          followUp: 'How is a memory leak different from a Gen2 pause problem?',
          difficulty: 'expert',
        },
        {
          q: 'p99 spikes every 30 seconds with no error logs. What do you suspect?',
          a: 'Gen2 / blocking GC or a stop-the-world pause. Check time-in-gc and gen-2 count. If allocation rate is huge, find the allocator (JSON, string concat, EF tracking). If LOH, pool buffers. GC config is last.',
          bangla: 'পিরিয়ডিক p99 = GC পজ সন্দেহ — আগে অ্যালোকেশন কমান।',
          difficulty: 'senior',
        },
      ],
      practice: 'Build a tiny API that caches per-user reports in a static Dictionary with no eviction. Watch working set. Then replace with IMemoryCache SizeLimit.',
    },
    {
      topic: 'Crash Under Load, Thread Pool Starvation, and 10k RPS',
      difficulty: 'expert',
      english: `Problem → works at 50 RPS, dies at 2k–10k: 502s, timeouts, or frozen process. Investigation → thread pool queue, sync-over-async, lock contention, downstream. Root cause → blocked thread pool threads, not "Kestrel is slow." Solution → async all the way, inject min threads only as a bandage, then remove blocking. Prevention → load tests with realistic think time and failure injection.`,
      bangla: 'লোডে ক্র্যাশ মানে সাধারণত থ্রেড পুল স্টারভেশন — sync-over-async, lock, বা blocking I/O। ১০কে RPS আগে আর্কিটেকচার, পরে হার্ডওয়্যার।',
      details: `
### Problem
Load test or a marketing spike: CPU is not 100%, yet requests queue, TTFB explodes, health checks fail, Kubernetes restarts pods (crash loop). Or the process truly crashes (OOM, StackOverflow, fail-fast on thread injection).

### Investigation
1. **Thread pool:** \`ThreadPool.GetAvailableThreads\`, \`dotnet-counters\` \`threadpool-queue-length\`, \`threadpool-completed-items-count\`. Queue growing while CPU idle = starvation.
2. **Stacks:** many threads in \`WaitHandle.WaitOne\`, \`.Result\`, \`.Wait()\`, \`lock\`, \`SemaphoreSlim.Wait\` (sync), or sync ADO.NET.
3. **Kestrel:** connection queue, \`RequestQueueLimit\`. 502 from ingress often means the pod stopped accepting, not that nginx is broken.
4. **10k RPS math:** 10,000 RPS × 50ms SQL = 500 concurrent SQL operations **per instance** if you have one instance. You need horizontal scale, pooling, and cache — not a bigger VM first.

### Root Cause
| Pattern | What happens |
| :--- | :--- |
| **Sync-over-async** | Thread pool thread blocked waiting on a Task that needs a thread pool thread to complete → deadlock/starvation |
| **lock around I/O** | Throughput collapses to 1 |
| **CPU-bound on request path** | Need dedicated pool / queue, not more ASP.NET threads |
| **Unbounded fan-out** | Each request starts 20 HTTP calls; 10k RPS becomes 200k RPS downstream |

### Solution
- Async all the way: \`await\`, never \`.Result\` on ASP.NET.
- \`ConfigureAwait(false)\` in libraries; in ASP.NET Core it is less critical but still correct in libs.
- For 10k RPS: cache hot GETs, connection pool, avoid per-request service locator, use \`IHttpClientFactory\`, output caching, and **backpressure** (queue + 429) instead of accepting infinite work.
- \`ThreadPool.SetMinThreads\` can hide starvation for a day — it is not the architecture.

### Prevention
- Load test to 2× expected peak with a soak (memory + thread pool).
- Chaos: kill Redis, slow SQL to 500ms, see if you shed load.
- SLOs: if you cannot shed, you cannot claim 10k RPS.

### Interview Answer
"Crashes under load are usually thread pool starvation or resource exhaustion, not a missing microservice. I would show queue length vs CPU, find blocking calls, and do the 10k RPS math: concurrency = RPS × latency. Then cache, pool, and shed load. SetMinThreads is a tourniquet."
      `,
      code: `// Starvation: NEVER do this on a request thread
public IActionResult Bad() => Ok(_svc.GetAsync().Result);

// GOOD
public async Task<IActionResult> Good(CancellationToken ct) =>
    Ok(await _svc.GetAsync(ct));

// 10k RPS GET: cache + coalescing (see also stampede section)
public async Task<ProductDto?> GetProduct(string id, CancellationToken ct)
{
    if (_cache.TryGetValue(id, out ProductDto? hit)) return hit;

    using var lease = await _gate.AcquireAsync(id, ct); // one factory per key
    if (_cache.TryGetValue(id, out hit)) return hit;

    var dto = await _db.Products.AsNoTracking()
        .Where(p => p.Id == id)
        .Select(p => new ProductDto(p.Id, p.Name, p.Price))
        .FirstOrDefaultAsync(ct);

    if (dto is not null)
        _cache.Set(id, dto, TimeSpan.FromSeconds(30));
    return dto;
}

// Shed load instead of dying
app.Use(async (ctx, next) =>
{
    if (ThreadPool.PendingWorkItemCount > 1_000)
    {
        ctx.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        return;
    }
    await next();
});`,
      commonMistakes: [
        'Calling .Result / .Wait() "just this once" in a filter or middleware.',
        'Claiming 10k RPS without stating payload size, cache hit ratio, and DB concurrency.',
        'Scaling pods while each request still does 20 serial HTTP calls.',
      ],
      bestPractices: [
        'Concurrency ≈ RPS × latency; size pools to that number.',
        'Load-shed with 429 before the process dies.',
        'Treat SetMinThreads as an incident bandage, then remove blocking.',
      ],
      interviewQs: [
        {
          q: 'The API is fine at 100 RPS and times out at 800 RPS with CPU at 20%. Why?',
          a: 'Classic thread pool starvation or a lock/connection bottleneck. CPU idle plus growing queue means threads are blocked, not busy computing. I look for .Result, sync IO, and lock around HTTP. Then I measure pool queue length. Scaling out copies the bug; fixing blocking multiplies throughput.',
          bangla: 'CPU ফাঁকা অথচ টাইমআউট = থ্রেড ব্লকড। .Result খুঁজুন।',
          followUp: 'Would you raise min threads in production during the incident?',
          difficulty: 'senior',
        },
        {
          q: 'Design GET /product/{id} for 10k RPS.',
          a: 'Hot path must almost never hit SQL. Layer: CDN/output cache → Redis → coalesced DB read. Instance count from concurrency math. HttpClient factory, no per-request allocations on the hot path, 429 when Redis is down rather than stampedes. Writes are a different pipeline.',
          bangla: '১০কে RPS GET মানে ক্যাশ + কোয়ালেসিং — প্রতি রিকোয়েস্টে SQL নয়।',
          difficulty: 'expert',
        },
      ],
      practice: 'Write a benchmark: 500 parallel calls to an action that uses .Result vs await. Compare thread pool queue length.',
    },
    {
      topic: 'Deadlocks and Two Users Updating the Same Record',
      difficulty: 'senior',
      english: `Problem → SQL deadlock victim errors, or silent lost updates (last write wins). Investigation → deadlock graph vs rowversion. Root cause → lock order, isolation, or missing concurrency token. Solution → consistent lock order, shorter transactions, optimistic concurrency for users, pessimistic only for scarce resources. Prevention → retry on deadlock with jitter; never swallow DbUpdateConcurrencyException.`,
      bangla: 'ডেডলক আর লস্ট আপডেট আলাদা। ডেডলক = লক অর্ডার। দুই ইউজার = rowversion / optimistic concurrency।',
      details: `
### Problem
- **Deadlock:** \`40001\` / "deadlocked on lock resources." One transaction is killed. Often under load, rare in dev.
- **Lost update:** two agents edit the same order; both GET, both PUT; the first save disappears. No error. Worse than a deadlock.

### Investigation
- SQL: deadlock XEvent / \`system_health\` session, deadlock graph — resource order (key vs key), isolation level, whether you took U vs X locks.
- App: EF \`DbUpdateConcurrencyException\`; if you never configured a token, you will not get it.
- Repro: two sessions, opposite update order (\`UPDATE A then B\` vs \`B then A\`).

### Root Cause
| Issue | Cause |
| :--- | :--- |
| Deadlock | Inconsistent lock order; too-wide locks (serializable + range); long transactions |
| Lost update | No concurrency token; last writer wins |
| Blocking (not deadlock) | Uncommitted transaction holding locks while waiting on UI/HTTP |

### Solution
- **Deadlock:** same table order everywhere; keep transactions tiny; \`UPDLOCK, ROWLOCK\` only when you must serialize a scarce row; deadlock retry (3×, jitter) at the **unit of work** boundary.
- **Two users:** \`rowversion\` / \`xmin\` / \`UpdatedAt + original value\` in EF \`IsConcurrencyToken\`. API returns 409 Conflict with the current server state. UI merges or retries.
- Do not use Serializable as a default "fix."

### Prevention
- Concurrency token on every mutable business entity.
- Code review: no HTTP inside a transaction (also a pool issue).
- Alert on deadlock rate > N/min.

### Interview Answer
"Deadlock is lock order; lost update is missing optimistic concurrency. I show a deadlock graph and a rowversion. I retry deadlocks; I return 409 to humans. I never hide either error."
      `,
      code: `public class Order
{
    public Guid Id { get; set; }
    public decimal Total { get; set; }
    [Timestamp] public byte[] RowVersion { get; set; } = default!;
}

public async Task<IActionResult> Put(Guid id, UpdateOrder dto, CancellationToken ct)
{
    var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == id, ct);
    if (order is null) return NotFound();

    db.Entry(order).Property(o => o.RowVersion).OriginalValue = dto.RowVersion;
    order.Total = dto.Total;

    try
    {
        await db.SaveChangesAsync(ct);
        return Ok(order);
    }
    catch (DbUpdateConcurrencyException)
    {
        return Conflict(new { message = "Order changed; reload and retry." });
    }
}

// Deadlock retry at unit-of-work boundary
public static async Task WithDeadlockRetry(Func<Task> action)
{
    for (var i = 0; ; i++)
    {
        try { await action(); return; }
        catch (SqlException ex) when (ex.Number == 1205 && i < 3)
        {
            await Task.Delay(Random.Shared.Next(20, 80) * (i + 1));
        }
    }
}`,
      commonMistakes: [
        'Catching DbUpdateConcurrencyException and retrying with the same stale token.',
        'Using Serializable isolation to "be safe" and creating deadlock storms.',
        'Updating tables in different orders in different services.',
      ],
      bestPractices: [
        'Optimistic concurrency for user edits; pessimistic for inventory reservation.',
        'Retry deadlocks with jitter; never retry lost updates blindly.',
        'Return 409 with enough state for the client to merge.',
      ],
      interviewQs: [
        {
          q: 'Two users save the same customer record. What should happen?',
          a: 'The second save must fail with 409 if the row changed, using a rowversion or equivalent token. Last-write-wins is a product bug unless the domain explicitly allows it. I would also log the conflict for support. Pessimistic locking is for scarce inventory, not for CRM fields.',
          bangla: 'দ্বিতীয় সেভ ৪০৯ দেবে — rowversion। Last-write-wins সাধারণত বাগ।',
          followUp: 'How does this change if the clients are two microservices, not two humans?',
          difficulty: 'senior',
        },
        {
          q: 'How do you diagnose a SQL deadlock in EF Core?',
          a: 'Enable deadlock XEvents, get the graph, identify the two lock chains and the application stack (command text). Align update order, shorten the transaction, add a retry. EF does not magically prevent deadlocks; it just sends SQL.',
          bangla: 'ডেডলক গ্রাফ + লক অর্ডার এক করুন + ছোট ট্রানজেকশন + রিট্রাই।',
          difficulty: 'mid',
        },
      ],
      practice: 'Write two parallel PUTs with the same RowVersion. Assert one 200 and one 409. Then implement a client retry that reloads.',
    },
    {
      topic: 'Redis Down and Cache Stampede',
      difficulty: 'senior',
      english: `Problem → Redis outage or TTL expiry makes the app slower than having no cache. Investigation → hit ratio, connection multiplexer status, thundering herd at expiry. Root cause → cache as a hard dependency, or all keys expire together. Solution → Redis optional with fallback + coalescing + jittered TTL. Prevention → circuit breaker, local memory L1, never stampede the database.`,
      bangla: 'Redis ডাউন হলে অ্যাপ বাঁচতে হবে। Stampede = TTL শেষে সবাই একসাথে DB তে যায়। Jitter + coalescing বাধ্যতামূলক।',
      details: `
### Problem
- **Redis down:** timeouts, then thread pool / connection pool collapse as every request hits SQL.
- **Stampede (thundering herd):** a hot key expires; 5,000 requests miss together and all run the same expensive query.

### Investigation
- Hit ratio, evictions, \`connected_clients\`, multiplexer \`IsConnected\`.
- At stampede: SQL QPS spike aligned with TTL; traces show many identical queries.
- Distinguish: Redis slow vs Redis unreachable vs serialization CPU.

### Root Cause
Cache treated as **source of truth** or as **mandatory**. Or TTL aligned on the hour for all keys. Or \`GetOrCreate\` without single-flight.

### Solution
- **Degrade:** if Redis is down, serve from L1 memory (short TTL) or DB with **strict concurrency** (coalesce) and 429 if DB cannot take it.
- **Stampede:** (1) jitter TTL, (2) single-flight / request coalescing per key, (3) probabilistic early refresh, (4) stale-while-revalidate.
- Circuit breaker on Redis; do not retry Redis 3 times on every request.

### Prevention
- Redis is a performance dependency, not a correctness dependency (unless you designed it as a store — then you need persistence and failover).
- Chaos: kill Redis in staging weekly.
- Alert on hit ratio drop and on fallback QPS.

### Interview Answer
"If Redis dies and the site dies, the design is wrong for a cache. I fail open to DB with coalescing and load-shed. For stampede I jitter TTLs and single-flight the factory. I never let 10k requests replay one query."
      `,
      code: `public sealed class CoalescingCache(
    IMemoryCache local,
    IDistributedCache redis,
    IProductRepository db)
{
    private readonly ConcurrentDictionary<string, Task<ProductDto?>> _inflight = new();

    public async Task<ProductDto?> GetAsync(string id, CancellationToken ct)
    {
        if (local.TryGetValue(id, out ProductDto? hit)) return hit;

        try
        {
            var bytes = await redis.GetAsync(id, ct);
            if (bytes is { Length: > 0 })
            {
                var dto = JsonSerializer.Deserialize<ProductDto>(bytes);
                local.Set(id, dto, TimeSpan.FromSeconds(5));
                return dto;
            }
        }
        catch (Exception) { /* circuit: skip Redis */ }

        var task = _inflight.GetOrAdd(id, _ => LoadAsync(id, ct));
        try { return await task; }
        finally { _inflight.TryRemove(id, out _); }
    }

    private async Task<ProductDto?> LoadAsync(string id, CancellationToken ct)
    {
        var dto = await db.GetAsync(id, ct);
        if (dto is null) return null;
        var ttl = TimeSpan.FromSeconds(30 + Random.Shared.Next(0, 15)); // jitter
        local.Set(id, dto, TimeSpan.FromSeconds(5));
        try { await redis.SetAsync(id, JsonSerializer.SerializeToUtf8Bytes(dto),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = ttl }, ct); }
        catch { /* still return dto */ }
        return dto;
    }
}`,
      commonMistakes: [
        'Failing the whole request when Redis times out.',
        'Identical TTL on millions of keys loaded at deploy time.',
        'GetOrCreate that still runs the factory in parallel for the same key.',
      ],
      bestPractices: [
        'L1 (memory) + L2 (Redis) + coalesced DB.',
        'Jittered TTLs and stale-while-revalidate for hot keys.',
        'Circuit-break Redis; protect SQL with 429.',
      ],
      interviewQs: [
        {
          q: 'Redis is down. Should checkout fail?',
          a: 'Not if Redis is a cache. Checkout correctness lives in SQL and payments. I skip Redis, coalesce DB reads, and shed load if SQL saturates. If Redis was used as a session store or a lock, that is a different design — then I fail the features that require it, not the whole site if I can.',
          bangla: 'ক্যাশ ডাউন = ডিগ্রেড, পুরো সাইট নয়। লক/সেশন হলে সেই ফিচার ফেল করবে।',
          followUp: 'How do you prevent a stampede when Redis comes back empty?',
          difficulty: 'senior',
        },
        {
          q: 'What is a cache stampede and how do you stop it in .NET?',
          a: 'Many requests miss the same key at once and all hit the origin. Stop it with single-flight (ConcurrentDictionary of Task), jittered expiration, and optionally locking in Redis (SET NX) for multi-instance. IMemoryCache GetOrCreate is not enough across a farm.',
          bangla: 'একই কি মিস করে সবাই DB তে — single-flight + TTL jitter।',
          difficulty: 'mid',
        },
      ],
      practice: 'Expire a hot key and fire 1,000 parallel requests. Count SQL. Then add coalescing and show the count drop to 1.',
    },
    {
      topic: 'RabbitMQ Consumer Stopped, Duplicates, and Poison Messages',
      difficulty: 'expert',
      english: `Problem → queue depth grows, or the same message is processed twice, or one bad message blocks the queue. Investigation → consumer connected?, ack mode, prefetch, DLQ. Root cause → unacked crash, at-least-once delivery, or infinite retry of poison. Solution → idempotent handlers, DLQ with bounded retries, alerting on consumer count. Prevention → outbox on publish, inbox on consume, poison isolation.`,
      bangla: 'কনজিউমার থেমে গেলে কিউ বাড়ে। Duplicate = at-least-once। Poison = খারাপ মেসেজ রিট্রাই লুপ। Idempotency + DLQ বাধ্যতামূলক।',
      details: `
### Problem
Three incidents that get bundled in interviews:
1. **Consumer stopped:** process up, but channel closed; or hosted service crashed and was not restarted; or prefetch + deadlock in handler.
2. **Duplicates:** user charged twice; email sent twice. RabbitMQ (and Kafka) are **at-least-once** unless you build exactly-once yourself.
3. **Poison message:** JSON that never deserializes; handler throws; message redelivered forever; queue looks "stuck."

### Investigation
- Management UI / metrics: consumers = 0? unacked growing? DLQ growing?
- Logs: handler exceptions, connection recovery (\`EventingBasicConsumer\` vs \`AsyncEventingBasicConsumer\`).
- Duplicate: same \`MessageId\` / business key processed twice — check inbox table.
- Poison: the same delivery tag failing N times.

### Root Cause
| Symptom | Cause |
| :--- | :--- |
| Depth ↑, consumers 0 | Hosted service died; RMQ connection dropped; autoscaler scaled to 0 |
| Duplicates | Redelivery after crash before ack; publisher retry; competing consumers without idempotency |
| Queue stuck | Poison retried infinitely; prefetch=1 and handler blocked |

### Solution
- **Stopped:** health check that fails if consumer count is 0 for a required queue; Kubernetes restart; connection recovery with backoff.
- **Duplicates:** **inbox** table unique on MessageId / business key; handler is idempotent (INSERT IF NOT EXISTS). Publisher **outbox** so DB commit and message do not diverge.
- **Poison:** retry 3–5 times with backoff, then **nack to DLQ** (or \`basic.reject\` requeue=false + DLX). Never infinite requeue. Alert on DLQ depth.
- Ack **after** successful side effects (or after inbox write in the same DB transaction as the side effect).

### Prevention
- Treat messaging as at-least-once. Exactly-once is "inbox + unique constraints + careful side effects."
- SLO: consumer lag, DLQ depth, publish failures.
- Chaos: kill a consumer mid-handler; prove no double charge.

### Interview Answer
"If the consumer is stopped I look at consumer count and the hosted service, not the publisher first. Duplicates are expected; I design idempotency. Poison goes to DLQ after bounded retries. I would not claim exactly-once from RabbitMQ itself."
      `,
      code: `public sealed class PaymentHandler(AppDbContext db)
{
    public async Task HandleAsync(PaymentRequested msg, CancellationToken ct)
    {
        // Inbox: unique (MessageId)
        db.Inbox.Add(new InboxRow { Id = msg.MessageId, Name = nameof(PaymentRequested) });
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateException) { return; } // duplicate delivery — ack and stop

        // Side effect in same transaction when possible
        db.Payments.Add(new Payment { OrderId = msg.OrderId, Amount = msg.Amount });
        await db.SaveChangesAsync(ct);
    }
}

// Poison: bounded retry then DLQ (MassTransit / custom)
// e.g. UseMessageRetry(r => r.Interval(3, TimeSpan.FromSeconds(5)));
//      UseDelayedRedelivery(...); then error queue / DLX

// Outbox publish (same SQL transaction as business write)
public async Task PlaceOrder(Order order, CancellationToken ct)
{
    db.Orders.Add(order);
    db.Outbox.Add(new OutboxMessage
    {
        Id = Guid.NewGuid(),
        Type = nameof(OrderPlaced),
        Payload = JsonSerializer.Serialize(new OrderPlaced(order.Id))
    });
    await db.SaveChangesAsync(ct); // dispatcher publishes later
}`,
      commonMistakes: [
        'Auto-ack before the DB commit succeeds.',
        'Infinite requeue of a message that can never succeed.',
        'Assuming competing consumers plus a unique business key is optional.',
      ],
      bestPractices: [
        'Outbox on publish, inbox on consume.',
        'DLQ + alert; humans inspect poison.',
        'Health check: required queues have consumers.',
      ],
      interviewQs: [
        {
          q: 'The RabbitMQ queue depth is 2 million and climbing. What do you do in the first 15 minutes?',
          a: 'Check consumer count and unacked. If consumers are 0, restart and fix the hosted service / connection. If consumers are up but unacked is huge, the handler is blocked or prefetch is wrong. If they are processing but slower than publish, scale consumers and pause publishers if needed. Do not purge until you know it is poison or replay-safe.',
          bangla: 'আগে consumer count — শূন্য হলে রিস্টার্ট। Purge শেষ অপশন।',
          followUp: 'When is purging a queue acceptable?',
          difficulty: 'senior',
        },
        {
          q: 'Why did the customer get charged twice with a single "publish"?',
          a: 'At-least-once: the handler charged, then crashed before ack; RMQ redelivered. Or the publisher retried after a timeout while the first publish succeeded. Fix with idempotency keys at the payment provider and an inbox unique constraint. The broker will not save you.',
          bangla: 'Ack এর আগে ক্র্যাশ = রিডেলিভারি। Inbox + পেমেন্ট আইডেমপোটেন্সি।',
          difficulty: 'expert',
        },
      ],
      practice: 'Write a consumer that inserts into an Inbox with a unique MessageId, then simulate redelivery. Assert the side effect runs once.',
    },
    {
      topic: 'Double Submit, JWT Expiry Mid-Request, and Jobs That Run Twice',
      difficulty: 'senior',
      english: `Problem → double charge from a double click, 401 in the middle of a long request, or Hangfire/Quartz firing twice. Investigation → client retries, token lifetime vs request duration, job storage uniqueness. Root cause → missing idempotency, clock/skew on JWT, competing schedulers. Solution → Idempotency-Key, refresh inside the request or split work, distributed lock / clustered job store. Prevention → all mutating endpoints are idempotent.`,
      bangla: 'ডাবল সাবমিট = আইডেমপোটেন্সি কি। JWT মাঝপথে এক্সপায়ার = লং রিকোয়েস্ট vs টোকেন লাইফ। জব দুবার = লক/ক্লাস্টার স্টোর।',
      details: `
### Problem
- **Double submit:** user double-clicks Pay; two POSTs; two charges. Also: mobile retries, gateway retries, and "refresh" on a POST.
- **JWT expires mid-request:** token valid at the start of a 2-minute import; a downstream call at T+90s gets 401; or SignalR connection dies.
- **Background job twice:** two instances of the app, both run the same cron; or Hangfire without a distributed lock; or at-least-once message triggering the job.

### Investigation
- Correlate by Idempotency-Key / OrderId in logs. If two requests have different keys, it is two business intents.
- JWT: \`exp\`, clock skew (\`ClockSkew = TimeSpan.Zero\` vs default 5 minutes), whether you validate on every downstream hop.
- Jobs: how many workers, which storage (SQL/Redis), whether the job is [DisableConcurrentExecution], whether the schedule is per-pod.

### Root Cause
Not "the user clicked twice" as a moral failing — **HTTP POST is not idempotent unless you make it so.** JWT is a snapshot of identity, not a lease for a long workflow. Cron on every replica is two schedulers.

### Solution
- **Idempotency-Key** header stored with the response (24h). Same key + same body hash → return stored result. Different body → 409.
- Long work: do not bind the whole job to a 15-minute access token. Use a server-side session / service identity for the worker; refresh tokens for the user; or split: accept 202 + job id.
- JWT: short access token + refresh; for mid-request, authenticate once at the edge and flow a trusted internal identity; set clock skew deliberately.
- Jobs: one leader (Hangfire server with SQL storage is OK if configured), \`[DisableConcurrentExecution]\`, or a Redis lock around the job body; unique job id.

### Prevention
- All POST / PUT money paths require idempotency keys.
- Never schedule the same cron in two uncoordinated processes.
- Document token lifetimes vs max request duration.

### Interview Answer
"Double submit is an idempotency design gap. JWT mid-request means I used a user access token as a long-running capability — I would not. Duplicate jobs are competing schedulers. I would show the idempotency table, the 202 pattern, and a clustered job store."
      `,
      code: `// Idempotency middleware (simplified)
public sealed class IdempotencyFilter(AppDbContext db) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext ctx, ActionExecutionDelegate next)
    {
        if (!HttpMethods.IsPost(ctx.HttpContext.Request.Method)) { await next(); return; }
        if (!ctx.HttpContext.Request.Headers.TryGetValue("Idempotency-Key", out var key))
        {
            ctx.Result = new BadRequestObjectResult("Idempotency-Key required");
            return;
        }

        var existing = await db.Idempotency.FindAsync(key.ToString());
        if (existing is not null)
        {
            ctx.Result = new ContentResult { StatusCode = existing.Status, Content = existing.Body };
            return;
        }

        var executed = await next();
        if (executed.Result is ObjectResult { StatusCode: >= 200 and < 300 } ok)
        {
            db.Idempotency.Add(new IdempotencyRow
            {
                Key = key.ToString()!,
                Status = ok.StatusCode ?? 200,
                Body = JsonSerializer.Serialize(ok.Value)
            });
            await db.SaveChangesAsync();
        }
    }
}

// JWT: do not let default 5-minute skew hide expiry bugs in tests
options.TokenValidationParameters.ClockSkew = TimeSpan.FromSeconds(30);

// Hangfire: one execution across a farm
[DisableConcurrentExecution(timeoutInSeconds: 60)]
public void ReconcilePayments() { /* Redis lock inside if needed */ }`,
      commonMistakes: [
        'Disabling the Pay button in UI and calling that idempotency.',
        'Using the user JWT for a 30-minute Hangfire job.',
        'Running the same IHostedService cron on every Kubernetes replica with no lock.',
      ],
      bestPractices: [
        'Idempotency-Key on all monetary POSTs.',
        '202 Accepted + background worker with service credentials for long work.',
        'Cluster-aware job storage or an explicit leader lock.',
      ],
      interviewQs: [
        {
          q: 'How do you prevent double charges from retries and double clicks?',
          a: 'Idempotency-Key persisted with the charge result, unique constraint on the payment intent id at the provider, and the same key returned on retries. UI debounce is UX, not safety. Gateways will retry; design for that.',
          bangla: 'Idempotency-Key + প্রোভাইডার ইনটেন্ট আইডি। বাটন ডিসেবল যথেষ্ট নয়।',
          followUp: 'What if the first request is still in flight when the retry arrives?',
          difficulty: 'senior',
        },
        {
          q: 'A 2-minute import fails at 1:50 with 401. The user logged in at the start. Why?',
          a: 'Access token expired during the request, or a downstream API validated exp independently. Fix: authenticate at the edge, run the import as a job with service identity, or refresh before long hops. Do not extend access tokens to 2 hours as the "fix."',
          bangla: 'লং জব ইউজার JWT দিয়ে চালাবেন না — ২০২ + সার্ভিস আইডেন্টিটি।',
          difficulty: 'mid',
        },
      ],
      practice: 'Implement Idempotency-Key on POST /payments. Fire two parallel identical requests. Assert one charge and two identical 200 bodies.',
    },
    {
      topic: 'External API Down and Cascading Failure',
      difficulty: 'expert',
      english: `Problem → one slow dependency takes down your whole site. Investigation → which dependency, timeout vs error, thread/connection pile-up. Root cause → no timeout, no bulkhead, retries without jitter, shared thread pool. Solution → timeouts, circuit breaker, bulkhead, fallback, shed load. Prevention → SLOs per dependency, chaos, never share one HttpClient timeout of 100s.`,
      bangla: 'একটা স্লো ডিপেন্ডেন্সি পুরো সাইট মারতে পারে — timeout, circuit breaker, bulkhead ছাড়া। Retry যেন আগুনে ঘি না হয়।',
      details: `
### Problem
Payments, email, rates, KYC — one of them slows to 30s. Your API threads / HttpHandler connections exhaust. Unrelated endpoints fail. This is a **cascading failure**. Kubernetes may restart pods, making it worse (thundering restart).

### Investigation
- Dependency latency and error rate vs your p99.
- Thread pool and HttpClient pool (\`SocketsHttpHandler.MaxConnectionsPerServer\`).
- Retry metrics: are you sending 4× traffic to a dying service?
- Blast radius: did checkout take down search because they share the same host and thread pool?

### Root Cause
No timeout (or timeout > ingress timeout). Retries on timeout. No isolation (one pool for all outbound calls). Synchronous wait. Cache stampede onto the dependency when it recovers.

### Solution
- **Timeout** shorter than the user-facing SLO (e.g. 2s) and shorter than ingress.
- **Retry** only on transient errors, **budgeted**, with jitter; **do not retry timeouts** of non-idempotent POSTs.
- **Circuit breaker:** after N failures, fail fast for 30s.
- **Bulkhead:** separate \`SocketsHttpHandler\` / Polly bulkhead so payments cannot eat all connections.
- **Fallback:** cached rates, delayed email, queue the work.
- **Shed:** 503 with Retry-After on non-critical features.

### Prevention
- Each outbound call has an explicit timeout in code review.
- Chaos: delay the fake payment API 10s in staging.
- Dependency SLOs on the dashboard next to your own.

### Interview Answer
"Cascading failure is an isolation failure. I would put timeouts and bulkheads on the dependency, fail fast with a circuit, and keep unrelated endpoints healthy. Retries without a budget are how you DDoS your friend and yourself."
      `,
      code: `builder.Services.AddHttpClient("payments", c =>
{
    c.BaseAddress = new Uri(builder.Configuration["Payments:BaseUrl"]!);
    c.Timeout = TimeSpan.FromSeconds(3);
})
.AddStandardResilienceHandler(o =>
{
    o.AttemptTimeout.Timeout = TimeSpan.FromSeconds(2);
    o.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(6);
    o.Retry.MaxRetryAttempts = 2;
    o.CircuitBreaker.SamplingDuration = TimeSpan.FromSeconds(30);
    o.CircuitBreaker.FailureRatio = 0.5;
    o.CircuitBreaker.MinimumThroughput = 20;
});

builder.Services.AddHttpClient("search", c =>
{
    c.Timeout = TimeSpan.FromMilliseconds(400);
}); // separate handler = bulkhead

public async Task<IActionResult> Checkout(Order dto, CancellationToken ct)
{
    try
    {
        var pay = await _payments.ChargeAsync(dto, ct);
        return Ok(pay);
    }
    catch (BrokenCircuitException)
    {
        return StatusCode(503, new { error = "payments_unavailable", retryAfter = 30 });
    }
}`,
      commonMistakes: [
        'HttpClient.Timeout = 100 seconds because "sometimes payments are slow."',
        'Retrying a non-idempotent charge on timeout (double charge + cascade).',
        'One named client for all third parties.',
      ],
      bestPractices: [
        'Timeout < user SLO < ingress timeout.',
        'Bulkhead per dependency; circuit breaker with a fallback story.',
        'Queue non-critical side effects (email) instead of blocking checkout.',
      ],
      interviewQs: [
        {
          q: 'A third-party KYC API slowed to 20s and our entire site went down. How?',
          a: 'Threads or outbound connections piled up waiting on KYC. Other requests could not get thread pool threads or sockets. That is a missing bulkhead and timeout. I would isolate KYC, fail that feature fast, and keep catalog/search up. Then I would add a circuit breaker so we stop sending traffic into the tar pit.',
          bangla: 'এক ডিপেন্ডেন্সি সব থ্রেড খেয়ে ফেলে — bulkhead + ছোট timeout।',
          followUp: 'Where do you put the queue vs the synchronous call?',
          difficulty: 'expert',
        },
        {
          q: 'Should you retry when the downstream times out?',
          a: 'Only if the operation is idempotent and you have a retry budget. A timeout on POST /charge is unknown outcome — retry can double charge unless you have an idempotency key. Prefer fail, queue, or reconcile.',
          bangla: 'Timeout + POST = আননোন আউটকাম। আইডেমপোটেন্সি ছাড়া রিট্রাই নয়।',
          difficulty: 'senior',
        },
      ],
      practice: 'Point an HttpClient at a delayed endpoint (10s). Show the host starving. Then add a 2s timeout and a circuit breaker; show other routes surviving.',
    },
    {
      topic: 'Bad Deploy — Detect, Rollback, and Stop the Bleeding',
      difficulty: 'senior',
      english: `Problem → error rate or latency explodes after a release. Investigation → what changed, blast radius, canary vs full. Root cause → config, migration, contract, feature flag, or actual bug. Solution → rollback or forward-fix based on data migrations and contracts. Prevention → canary, automated rollback, backward-compatible schema, feature flags.`,
      bangla: 'খারাপ ডিপ্লয় = আগে ব্লাস্ট রেডিয়াস, তারপর রোলব্যাক vs ফরওয়ার্ড-ফিক্স। মাইগ্রেশন একবার এগোলে পেছনে ফেরা কঠিন।',
      details: `
### Problem
New pods are live. 5xx from 0.1% to 12%. Or a silent bug: wrong prices, duplicate emails. The clock is ticking on customer impact and on "who broke prod."

### Investigation
1. **What changed?** Build id, config, feature flags, DB migration, infra (certificate, DNS).
2. **Blast radius:** one region, one tenant, one route, one instance (bad node) vs all.
3. **Health vs business:** health checks still 200 while checkout is wrong — health is not enough.
4. **Logs/traces** sampled on the new version only (version tag).
5. **Migration state:** is the new code incompatible with the old schema or vice versa during rolling deploy?

### Root Cause (typical)
| Class | Example |
| :--- | :--- |
| Config | Wrong connection string, Redis SSL, missing secret |
| Contract | JSON property renamed; API client not updated |
| Schema | Code expects a column the migration did not run; or migration locked the table |
| Flag | Flag default true in prod |
| Perf | N+1 introduced; missing index on new query |
| Partial deploy | New publisher, old consumer (or reverse) |

### Solution
- **Stop the bleeding:** rollback the app if schema is backward compatible; freeze rollouts; disable the flag.
- **Do not rollback** if a non-backward-compatible migration already ran — **forward-fix** or restore from backup with an explicit data-loss decision.
- Communicate: incident commander, status page, "next update in 15 minutes."
- Preserve evidence: do not delete the bad pods' logs.

### Prevention
- Expand/contract DB migrations (add column → dual write → switch → drop).
- Canary 5% with automated abort on SLO.
- Feature flags for risky behavior.
- Backward-compatible events (add fields, do not rename).

### Interview Answer
"I treat a bad deploy as an incident: blast radius, version diff, then rollback vs forward-fix depending on migrations. I would not blindly revert if the schema already moved. Prevention is expand/contract and canaries, not heroics."
      `,
      code: `// Expand/contract: add column nullable first (expand)
migrationBuilder.AddColumn<string>(
    name: "DisplayName",
    table: "Users",
    type: "nvarchar(200)",
    nullable: true);

// Dual-write in code, then backfill, then make required (contract), then drop old (contract)

// Health that reflects business, not just "process is up"
builder.Services.AddHealthChecks()
    .AddSqlServer(cs, name: "sql", tags: new[] { "ready" })
    .AddRedis(redis, name: "redis", tags: new[] { "ready" })
    .AddCheck<CheckoutCanaryHealthCheck>("checkout-canary", tags: new[] { "ready" });

// Kubernetes: separate liveness (restart) from readiness (remove from LB)
// liveness = process hung; readiness = cannot serve traffic (SQL down, bad config)`,
      commonMistakes: [
        'Rolling back the app after a breaking migration already applied.',
        'Equating "pods healthy" with "business correct."',
        'Hotfixing on the bad build without stopping the rollout.',
      ],
      bestPractices: [
        'Expand/contract for schema and events.',
        'Canary + auto-abort on SLO burn.',
        'Readiness probes that include critical dependencies.',
      ],
      interviewQs: [
        {
          q: 'You deployed 10 minutes ago and checkout 500s are at 40%. Rollback or fix-forward?',
          a: 'If the schema is compatible with the previous build, rollback immediately to stop the bleeding, then debug offline. If a breaking migration already ran, rollback will make it worse — freeze, feature-flag off, or forward-fix. I decide from migration status and blast radius, not from panic.',
          bangla: 'স্কিমা কম্প্যাটিবল হলে রোলব্যাক। ব্রেকিং মাইগ্রেশন হলে ফরওয়ার্ড-ফিক্স।',
          followUp: 'How do you make rollbacks always possible?',
          difficulty: 'senior',
        },
        {
          q: 'Rolling update: new API instances with old workers. What goes wrong?',
          a: 'Contract mismatch: new events old consumers cannot parse, or new required fields. During a rolling deploy both versions run. Events and DB must be compatible with N and N-1. That is why you add fields, never rename, and use feature flags for new consumers.',
          bangla: 'রোলিং ডিপ্লয়ে N এবং N-1 একসাথে — ইভেন্ট/স্কিমা দুই ভার্সন সহ্য করবে।',
          difficulty: 'expert',
        },
      ],
      practice: 'Write an expand/contract plan for renaming User.Name → DisplayName across API, DB, and a RabbitMQ event.',
    },
    {
      topic: 'Distributed Correctness — Cross-Service Transactions, Split-Brain Locks, Clock Skew',
      difficulty: 'expert',
      english: `Problem → money or inventory wrong across services; locks "held" by a dead owner; tokens invalid on one node. Investigation → saga/outbox vs 2PC, lock TTL vs GC pause, NTP. Root cause → pretending there is a distributed transaction; Redis lock without fencing; trusting DateTime.Now. Solution → saga + outbox, fencing tokens, monotonic clocks for expiry. Prevention → never 2PC across HTTP; never lock without a token.`,
      bangla: 'একাধিক সার্ভিসে এক ট্রানজেকশন হয় না — Saga + outbox। Redis লকে fencing token ছাড়া split-brain। Clock skew JWT ভাঙে।',
      details: `
### Problem
- **Multiple services, one "transaction":** Order service commits, Payment fails, inventory already reserved. Interviewers ask for \`TransactionScope\` across HTTP — that is the trap.
- **Split-brain lock:** Redis lock TTL expires during a GC pause; a second worker takes the lock; now two workers mutate. Or a network partition: both sides think they are leader.
- **Clock skew:** JWT \`nbf\`/\`exp\` fail on one machine; Hangfire jobs run early; "last write wins" using timestamps is wrong.

### Investigation
- Trace the business id across services; find the first commit that has no compensating action.
- Lock: who holds it, TTL, did the owner heartbeat? Was there a pause > TTL?
- Time: compare \`DateTime.UtcNow\` across nodes; look at JWT validation failures clustered on one pod.

### Root Cause
There is **no safe 2PC** over HTTP in practice. Redis \`SET NX PX\` is not a mutex in the presence of pauses (see Redlock debate). Wall clocks are not monotonic and not synchronized enough for security-critical windows without NTP + skew tolerance.

### Solution
- **Cross-service:** choreography or orchestration **saga**; each local transaction + **outbox**; compensations are first-class. Idempotent consumers. Accept eventual consistency and make it visible in the UI ("payment pending").
- **Locks:** short critical section; **fencing token** (monotonic version from Redis INCR / ZooKeeper / etcd) so a late writer is rejected by the resource; or do the work **inside the database** with a single-row lock.
- **Clock:** NTP; JWT \`ClockSkew\` explicit; store \`exp\` as Unix seconds from the issuer; use \`Stopwatch\` / monotonic for TTLs inside a process; do not use last-write-wins timestamps across regions without Hybrid Logical Clocks / version vectors.

### Prevention
- Architecture review: "where is the source of truth for this write?"
- Chaos: pause a lock holder with a debugger longer than TTL.
- Ban \`TransactionScope\` with \`TransactionScopeOption.Required\` across HttpClient.

### Interview Answer
"I would not start a distributed transaction. I would design a saga with outbox and compensations. For locks I would not trust TTL alone — fencing tokens or push the critical section into SQL. For time I assume clocks lie and I design skew into JWT and I avoid timestamp LWW."
      `,
      code: `// Saga-style local transaction + outbox (Order side)
public async Task PlaceOrderAsync(PlaceOrder cmd, CancellationToken ct)
{
    var order = Order.Create(cmd);
    db.Orders.Add(order);
    db.Outbox.Add(Outbox.From(new OrderPlaced(order.Id, cmd.Amount)));
    await db.SaveChangesAsync(ct);
}

// Payment service: inbox + compensate if later fails
public async Task OnOrderPlaced(OrderPlaced e, CancellationToken ct)
{
    if (!await db.TryInboxAsync(e.EventId, ct)) return;
    var result = await _stripe.ChargeAsync(e.Amount, idempotencyKey: e.OrderId.ToString(), ct);
    if (!result.Ok)
        db.Outbox.Add(Outbox.From(new PaymentFailed(e.OrderId, result.Reason)));
    await db.SaveChangesAsync(ct);
}

// Fencing token: resource rejects stale lock holders
public async Task<bool> WriteWithFenceAsync(string key, long fence, byte[] value)
{
    // SQL: UPDATE Cache SET Value=@v WHERE Key=@k AND Fence < @fence
    return await db.Cache
        .Where(c => c.Key == key && c.Fence < fence)
        .ExecuteUpdateAsync(s => s.SetProperty(c => c.Value, value)
                                  .SetProperty(c => c.Fence, fence)) > 0;
}

// JWT: explicit skew; never DateTime.Now
options.TokenValidationParameters.ClockSkew = TimeSpan.FromMinutes(1);
options.TokenValidationParameters.LifetimeValidator = (nbf, exp, _, _) =>
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    return nbf is null || now >= nbf.Value;
};`,
      commonMistakes: [
        'TransactionScope across HTTP or MSMQ "like we did in .NET Framework."',
        'Redis lock with a 30s TTL around a job that GC-pauses for 40s.',
        'Using DateTime.Now for expiry in a multi-region farm.',
      ],
      bestPractices: [
        'Saga + outbox + inbox; compensations tested.',
        'Fencing tokens or single-resource SQL locks.',
        'Assume clock skew; use UTC and explicit JWT skew.',
      ],
      interviewQs: [
        {
          q: 'How do you keep Order, Inventory, and Payment consistent?',
          a: 'Not with a distributed transaction. Each service commits locally and publishes via outbox. A saga coordinates: reserve inventory, charge, confirm — or compensate (release, refund). The UI shows pending states. I test the failure of each step. Consistency is eventual and explicit.',
          bangla: 'ডিস্ট্রিবিউটেড ট্রানজেকশন নয় — local commit + outbox + saga compensation।',
          followUp: 'What if compensation itself fails?',
          difficulty: 'expert',
        },
        {
          q: 'Why is a Redis distributed lock not enough?',
          a: 'TTL can expire while the holder is paused (GC, network). Another worker takes the lock; the first wakes and still writes. You need a fencing token the storage layer enforces, or to serialize in the database. Split-brain in a partition makes two leaders.',
          bangla: 'TTL শেষ হয়ে গেলে দুই ওয়ার্কার লিখে — fencing token বা SQL লক।',
          difficulty: 'expert',
        },
        {
          q: 'Tokens fail only on two pods in the cluster. What do you check?',
          a: 'Clock skew on those nodes (NTP), then timezone, then a stale signing key cache. JWT nbf/exp are time-based. I compare Unix time across pods and the issuer.',
          bangla: 'ওই পডগুলোর ঘড়ি — NTP, তারপর কি ক্যাশ।',
          difficulty: 'senior',
        },
      ],
      practice: 'Sketch a saga for PlaceOrder with two failure injections (payment down, inventory down) and the compensating events. Implement the outbox table.',
    },
    {
      topic: '100+ Scenario Catalog and How to Attack Any Unknown Incident',
      difficulty: 'expert',
      english: `Problem → interviewer names a scenario you did not memorize. Investigation → always: blast radius, change, evidence, hypothesis, experiment. Root cause → one of: compute, data, dependency, config, concurrency, or human process. Solution → stabilize, then fix cause, then prevent. Prevention → runbooks and SLOs. Interview answer → narrate this loop; use the catalog below as coverage, not a script. The numbered list is 100 distinct production scenarios so this handbook literally contains 100+ cases (12 deep dives + this catalog).`,
      bangla: 'অজানা সিনারিওতেও একই লুপ: ব্লাস্ট রেডিয়াস → চেঞ্জ → প্রমাণ → হাইপোথিসিস। নিচের ১০০টা টাইটেল কভারেজ — মুখস্থ স্ক্রিপ্ট নয়।',
      details: `
### Problem
You will not remember 100 playbooks under pressure. Seniors share a **method**. The catalog exists so you have seen the names and can map them onto the method.

### Investigation (universal)
1. **User impact** — what is broken, since when, how many.
2. **Change** — deploy, flag, traffic, data, dependency, cert, DNS.
3. **Evidence** — RED metrics (rate, errors, duration), traces, logs, SQL, dumps. One hypothesis at a time.
4. **Stabilize** — rollback, flag off, shed load, scale, disable a feature — before a perfect root cause.
5. **Cause** — prove it with a before/after or a dump, not a vibe.
6. **Prevent** — test, alert, runbook.

### Root Cause buckets
Compute (CPU, threads, GC) · Data (SQL, plans, pools) · Dependency (HTTP, Redis, RMQ) · Config/deploy · Concurrency (locks, idempotency) · Security (authz, secrets) · Human (process, communication).

### Solution
Speak the loop out loud. Pick the closest deep dive in this module. If none fit, still use the loop.

### Prevention
After every real incident, add one catalog item to your personal notes with the metric that would have caught it.

### Interview Answer
"I have a 12-section playbook for the common ones, and a 100-title catalog for coverage. For anything new I still do impact → change → evidence → stabilize → cause → prevent. I would rather be methodical than encyclopedic."

### Catalog — 100 numbered scenario titles
1. API p95 latency jumped from 80ms to 2s after a release
2. Database CPU pegged at 100% on the primary
3. Working set grows until the pod OOMs
4. Process crash / 502 from ingress under load
5. SQL deadlock storm (error 1205)
6. Redis node or cluster failover
7. RabbitMQ consumer count dropped to zero
8. Duplicate message processing / double side effects
9. Double HTTP submit / double charge
10. Two users overwrite the same row (lost update)
11. Need to sustain 10k RPS on a hot GET
12. Downstream HTTP API timeout cascade
13. A query that was fast is suddenly slow (plan flip)
14. Bad deploy: 5xx spike after rollout
15. JWT expires during a long-running request
16. Hangfire/Quartz job executes twice on two replicas
17. Business "transaction" spans three microservices
18. Thread pool starvation (sync-over-async)
19. EF Core N+1 query explosion
20. Cache stampede after TTL expiry
21. Gen2 GC pauses causing periodic p99 spikes
22. ADO.NET / EF connection pool exhaustion
23. Cascading failure across otherwise unrelated APIs
24. Poison message blocking a queue
25. Clock skew breaking JWT validation on some pods
26. Redis split-brain / lock holder paused past TTL
27. Health check killing healthy pods (false liveness)
28. Sticky session lost after scale-out
29. File lock on a shared network path
30. tempdb contention / version store growth
31. Parameter sniffing / bad cached plan
32. Missing covering index after data growth
33. Table lock from a long uncommitted transaction
34. Identity / sequence exhaustion
35. Soft-delete global filter accidentally bypassed
36. EF tracking identity map exploding memory
37. DbContext used concurrently across threads
38. Captive dependency: Singleton holds disposed DbContext
39. CORS blocking the production SPA
40. TLS certificate expired
41. Secrets leaked in logs or a client bundle
42. CSRF on a cookie-authenticated endpoint
43. Mass assignment / over-posting on an update DTO
44. IDOR: user A reads user B's \`/api/orders/{id}\`
45. Rate limiter bypassed (NAT, spoofed headers)
46. Webhook replay attack
47. Idempotency-Key not honored under concurrency
48. Outbox dispatcher stuck / unpublished events
49. Inbox unique constraint missing → duplicate consume
50. Saga compensation failed (refund did not run)
51. Eventual consistency bug visible to the user
52. Read replica lag serving stale balances
53. Application wrote to a read replica by mistake
54. Multi-tenant data leak (missing tenant filter)
55. Global query filter disabled with \`IgnoreQueryFilters\`
56. EF migration applied out of order / on the wrong DB
57. Blue-green swap dropping in-flight requests
58. Rolling deploy with a breaking API contract
59. Feature flag default flipped all traffic to a bad path
60. Configuration reload not observed (\`IOptions\` vs Monitor)
61. BackgroundService exception swallowed; service looks "up"
62. IHostedService blocking application startup
63. Unbounded Channel / in-memory queue OOM
64. SemaphoreSlim deadlock (sync Wait inside async)
65. \`lock(this)\` / lock on interned string
66. ConcurrentDictionary race on a lazy factory
67. \`DateTime.Now\` vs UtcNow in a distributed farm
68. DST / time zone conversion billing bug
69. \`decimal\` vs \`double\` money rounding
70. Culture-dependent parsing (comma vs dot)
71. JSON camelCase vs PascalCase contract break
72. Newtonsoft vs System.Text.Json mismatch
73. Large payload OOM in the serializer
74. File upload buffering entire body into memory
75. Multipart temp files filling the disk
76. HttpClient socket exhaustion (\`new HttpClient\` per call)
77. DNS change not picked up (handler lifetime too long)
78. TLS handshake storms after a cert rotation
79. gRPC deadline vs CancellationToken mismatch
80. SignalR scale-out without a backplane
81. WebSocket / SignalR connection leak
82. Output cache serving authenticated HTML to the wrong user
83. CDN caching \`Cache-Control: private\` responses
84. ETag / If-None-Match mismatch after deploy
85. Deep OFFSET pagination melting SQL
86. \`LIKE '%term%'\` full scan on a hot search
87. Bulk insert escalating to table locks
88. MERGE / upsert race without a unique key
89. Serializable isolation deadlock under contention
90. Repeatable read phantom rows in a report
91. \`DbUpdateConcurrencyException\` swallowed
92. Pessimistic lock timeout on inventory
93. Distributed lock not released after a crash
94. Redlock without fencing tokens
95. Kafka consumer lag / rebalance storm
96. Exactly-once assumed from the broker
97. IIS / Kestrel request queue full (503)
98. Forwarded headers / wrong client IP behind a proxy
99. Hosted service runs before migrations complete
100. Split-horizon DNS / wrong environment connection string after swap
      `,
      code: `// Incident loop you can actually run in an interview whiteboard
// 1. Impact:   what, who, since when, SLO burn
// 2. Change:   deploy, flag, traffic, dependency, cert
// 3. Evidence: RED + trace + one dump or one plan
// 4. Stabilize: rollback / flag / shed / scale
// 5. Cause:    prove with before/after
// 6. Prevent:  test + alert + runbook

public sealed record IncidentNote(
    string Impact,
    string Change,
    string Evidence,
    string Stabilize,
    string Cause,
    string Prevent);`,
      commonMistakes: [
        'Memorizing 100 titles and still guessing without metrics.',
        'Stabilizing so slowly that customers churn while you hunt a perfect cause.',
        'Skipping prevention — the same incident returns next quarter.',
      ],
      bestPractices: [
        'Method first, catalog second.',
        'Stabilize within minutes; root-cause within hours; prevent within days.',
        'Map every new war story onto one of the 12 deep dives.',
      ],
      interviewQs: [
        {
          q: 'I will describe a production issue you have never seen. How do you start?',
          a: 'Impact and blast radius, then what changed, then evidence (metrics/traces) before theories. I stabilize if the SLO is burning. I keep one hypothesis at a time and I say what would falsify it. I do not name-drop tools I would not know how to read.',
          bangla: 'ইমপ্যাক্ট → চেঞ্জ → প্রমাণ → স্টেবিলাইজ — টুলের নাম নয়, মেথড।',
          followUp: 'Give an example of a hypothesis and what would falsify it.',
          difficulty: 'senior',
        },
        {
          q: 'Why does this handbook list 100 scenario titles if you should not memorize them?',
          a: 'Coverage. Interviewers pick from a long tail. If you have seen the name "cache stampede" or "captive dependency," you can map it to a deep dive. The titles are a checklist for study, not a script for the room.',
          bangla: 'টাইটেলগুলো স্টাডি চেকলিস্ট — ইন্টারভিউ স্ক্রিপ্ট নয়।',
          difficulty: 'mid',
        },
      ],
      practice: 'Pick 10 catalog numbers at random. For each, speak a 45-second Impact → Evidence → Stabilize → Cause answer without notes.',
    },
  ],
  quickRevision: {
    concepts: [
      'Trace first: where is the time (SQL vs app vs HTTP)?',
      'N+1 vs cartesian Include vs plan flip',
      'Pool exhaustion ≠ SQL CPU 100%',
      'Leak = retainer; GC pause = allocation/LOH',
      'Starvation: CPU idle, queue growing, .Result',
      'Deadlock = lock order; lost update = rowversion',
      'Redis down must degrade; stampede = single-flight + jitter',
      'Messaging is at-least-once: inbox + DLQ',
      'Idempotency-Key; jobs need a cluster lock',
      'No 2PC over HTTP: saga + outbox; fencing tokens; clocks lie',
    ],
    questions: [
      'p95 jumped after a release — first three steps?',
      'Timeout getting a connection, SQL CPU 15% — why?',
      'How do you prove a memory leak vs a cache?',
      'Fine at 100 RPS, dead at 800, CPU 20% — why?',
      'Two users save the same row — API contract?',
      'Redis is down — does checkout fail?',
      'Customer charged twice from one publish — why?',
      'KYC slowness took down search — how?',
      'Rollback or forward-fix after a migration?',
      'How do Order + Payment stay consistent?',
    ],
    mistakes: [
      'Caching before proving the bottleneck',
      'Retry storms and retries on non-idempotent POSTs',
      'Infinite poison requeue',
      'TransactionScope across HTTP',
      'Redis lock TTL without a fencing token',
    ],
    scenarios: [
      'N+1 after a "small" Include',
      'Thread pool starvation from .Result in middleware',
      'Cache stampede at the top of the hour',
      'Poison JSON blocking the payments queue',
      'Split-brain lock after a GC pause',
    ],
  },
  revisionSummary: `
- Twelve playbooks: slow API/N+1, SQL CPU vs pool, leak vs GC, load/starvation, deadlock vs lost update, Redis/stampede, messaging, idempotency/JWT/jobs, cascade, bad deploy, distributed correctness, plus a 100-title catalog.
- Interview answers follow Problem → Investigation → Root Cause → Solution → Prevention.
- Stabilize with evidence; prevent with tests, alerts, and design (outbox, idempotency, bulkheads).
  `,
  summary:
    'Senior scenario interviews reward a repeatable incident method and a few deep production stories — not a memorized list of tool names. This module gives you both the method and 100+ named cases.',
};
