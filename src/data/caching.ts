export const cachingData = {
  id: 'caching',
  title: 'Caching & Redis',
  description:
    'Cache-aside through write-behind, TTL and invalidation, IMemoryCache vs Redis, stampede/penetration/avalanche, distributed locks, and when Redis is the wrong database.',
  sections: [
    {
      topic: 'Cache-Aside, Read-Through, Write-Through, Write-Behind',
      difficulty: 'senior',
      english:
        'Caching is a consistency decision, not a Dictionary. Cache-aside is the ASP.NET default: the app reads cache, on miss loads DB, then fills cache. Read-through hides that in a library. Write-through updates cache and DB in the request. Write-behind updates cache and flushes DB later — fastest writes, easiest to lose data. Seniors pick the pattern from the failure they can tolerate.',
      bangla:
        'ক্যাশ কনসিস্টেন্সি ডিসিশন। Cache-aside ডিফল্ট: মিসে DB। Write-through একসাথে। Write-behind পরে DB — দ্রুত, ডেটা হারানোর ঝুঁকি। সহ্য করতে পারবেন যে ফেল, সেই প্যাটার্ন।',
      details: `
### Cache-aside (lazy / look-aside)
**Flow:** get → miss → DB → set. **Why:** simple; cache can die and the app still works (degraded). **When NOT:** huge stampede on a hot key without a lock/singleflight. **Failure:** you update DB and forget to invalidate — stale price for hours.

### Read-through
Same as cache-aside but a cache provider loads the DB on miss. **When NOT:** the loader hides SQL in a black box you cannot tune. Rarely worth a framework in .NET; you write cache-aside in the slice.

### Write-through
Request writes DB and cache. Read path always warm after write. **Cost:** write latency = DB + Redis. **When NOT:** write-heavy telemetry. **Failure:** DB commit succeeds, Redis set fails — next read misses and reloads (OK). Redis first then DB failed — cache lies until TTL.

**Order:** commit DB then set/invalidate cache. Never the reverse without a compensating delete.

### Write-behind (write-back)
Write hits cache; a worker persists to DB. **Why:** absorb spikes. **When NOT:** money, inventory, anything you cannot replay. **Failure:** Redis restart before flush — lost orders. If you must, write an append-only log first, not only RAM Redis.

### Production rule
Checkout totals, payments, stock: cache-aside + explicit invalidation, or no cache. Session-like read models: cache-aside with short TTL.
      `,
      commonMistakes: [
        'Updating SQL and leaving the old Redis value until TTL.',
        'Write-behind for payments because it is faster.',
        'Setting cache before SaveChanges, then rolling back the transaction.',
        'Treating cache-aside miss path as rare — it is your DB load.',
      ],
      bestPractices: [
        'DB commit first, then invalidate or overwrite the key.',
        'Cache-aside for most .NET apps; measure before write-through.',
        'Never write-behind durable business state without a disk-backed outbox.',
        'Put the cache key and TTL next to the query in the vertical slice.',
      ],
      interviewQs: [
        {
          q: 'Which cache write pattern do you use for product price, and which for payment capture?',
          a: 'Price: cache-aside with invalidation on admin save (or short TTL plus invalidation). I would not write-behind prices if Redis can vanish. Payment capture: no cache as source of truth; maybe cache a read-only receipt after commit. Write-through is acceptable for a hot product DTO if Redis failure aborts the write or you invalidate on Redis failure. Write-behind payments is how you lose money on a failover.',
          bangla: 'দাম: cache-aside + ইনভ্যালিডেশন। পেমেন্ট: সোর্স অফ ট্রুথ ক্যাশ নয়, write-behind নয়। Redis হারালে অর্ডার হারানো চলবে না।',
          followUp: 'If Redis SET fails after SQL commit, what should the API return?',
          difficulty: 'senior',
        },
        {
          q: 'Why is write-through slower but still chosen sometimes?',
          a: 'Every write pays Redis + DB, so p95 write latency rises. You choose it when stale reads after write are user-visible (admin edits title, storefront must show it immediately) and the extra milliseconds are cheaper than invalidation bugs. Cache-aside plus delete-on-write is often the same consistency with a brief miss. I would not write-through a table that is written 10k/s.',
          bangla: 'রাইটে Redis+DB লাগে বলে ধীর। রাইটের পর স্টেল চলবে না এমন UI-তে। 10k/s টেবিলে নয়।',
          followUp: 'Compare delete-on-write vs set-on-write after SaveChanges.',
          difficulty: 'senior',
        },
      ],
      practice:
        'Implement cache-aside GetProduct. On UpdateProduct, SaveChanges then Remove the key. Add a test that a failed Redis set still returns 200 after a successful commit.',
      code: `public sealed class ProductReader(AppDbContext db, IDistributedCache cache)
{
    public async Task<ProductDto?> GetAsync(int id, CancellationToken ct)
    {
        var key = $"product:{id}";
        var cached = await cache.GetStringAsync(key, ct);
        if (cached is not null) return JsonSerializer.Deserialize<ProductDto>(cached);

        var dto = await db.Products.AsNoTracking()
            .Where(p => p.Id == id).Select(p => new ProductDto(p.Id, p.Name, p.Price))
            .FirstOrDefaultAsync(ct);
        if (dto is not null)
            await cache.SetStringAsync(key, JsonSerializer.Serialize(dto),
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) }, ct);
        return dto;
    }
}`,
    },
    {
      topic: 'TTL, Invalidation, IMemoryCache vs IDistributedCache vs Redis',
      difficulty: 'senior',
      english:
        'TTL is a safety net, not a substitute for invalidation on writes. IMemoryCache is per process — sticky and inconsistent across a farm. IDistributedCache is an abstraction; the Redis implementation is what you run in production for shared state. Seniors know sliding vs absolute expiration and that in-memory cache in a Singleton is a consistency bug under multiple instances.',
      bangla:
        'TTL সেফটি নেট; রাইটে ইনভ্যালিডেশন আলাদা। IMemoryCache প্রসেসভিত্তিক — ফার্মে অসঙ্গতি। IDistributedCache অ্যাবস্ট্রাকশন; প্রোডে Redis।',
      details: `
### TTL
- **Absolute:** dead after T regardless of hits. Use for data that must converge (permissions, prices).
- **Sliding:** idle timeout; hot keys live forever if traffic never stops — **danger** for stale authz. Combine sliding with a hard absolute cap.
- **Jitter:** add random seconds so keys do not expire together (avalanche).

**When NOT:** TTL of 24h on permissions because Redis is expensive to hit. Revoke will not apply.

### Invalidation
Key-per-entity (\`product:42\`) is easy to delete. Coarse keys (\`products:all\`) are easy to stampede. Version stamps (\`catalog:v:{n}\`) let you ignore old keys without scanning. Pub/sub can drop IMemoryCache L1 when L2 changes.

### IMemoryCache vs IDistributedCache vs Redis
| | IMemoryCache | IDistributedCache (Redis) | Redis native |
| :--- | :--- | :--- | :--- |
| **Scope** | One process | All instances | All instances + extra commands |
| **Payload** | Objects (no serialize) | byte[] / string | hashes, sets, streams, Lua |
| **Good for** | Local L1, compiled trees | Session, shared DTOs | Locks, rate limits, counters |
| **Failure** | Farm inconsistency; memory growth | Serialization; Redis down | Treating it as SQL |

**When NOT IMemoryCache:** user permissions on a 10-instance farm — instance A revokes, instance B still allows. **When NOT Redis:** a 50 req/min app with one instance — memory cache is enough; Redis is another outage domain.

**Production:** IMemoryCache as L1 + Redis L2 with short L1 TTL. Eviction callbacks do not run on another machine. MemoryCache can OOM a pod if you cache unbounded query results.
      `,
      commonMistakes: [
        'Sliding expiration on security-sensitive entries with no absolute cap.',
        'IMemoryCache for shared user sessions behind a load balancer without affinity.',
        'Caching IQueryable or EF entities with proxies.',
        'One giant key for the whole catalog.',
      ],
      bestPractices: [
        'Absolute TTL + explicit invalidation on writes.',
        'Redis for multi-instance; MemoryCache as optional L1 with tiny TTL.',
        'Cache DTOs/records, never DbContext-tracked entities.',
        'Bound cache size; skip huge payloads.',
      ],
      interviewQs: [
        {
          q: 'IMemoryCache vs IDistributedCache — when is in-memory wrong?',
          a: 'Wrong when correctness depends on all instances seeing the same value: feature flags you toggle once, permission revoke, inventory held in cache. A load-balanced farm with IMemoryCache is a random sticky brain. In-memory is right for per-instance compiled regex, or L1 in front of Redis with a few seconds TTL. Production: it works on my instance after a Redis flush because that pod still has MemoryCache.',
          bangla: 'সব ইনস্ট্যান্সে একই মান লাগলে IMemoryCache ভুল — রিভোক/ফ্ল্যাগ। ফার্মে Redis। L1 হিসেবে ছোট TTL ঠিক।',
          followUp: 'How do you invalidate L1 on all pods when a Redis key is deleted?',
          difficulty: 'expert',
        },
        {
          q: 'Why is sliding expiration dangerous for authorization data?',
          a: 'Every hit extends life. A busy stolen session or a hot permission key never expires. Combined with no invalidation on role change, a demoted admin stays admin on that instance until idle. I use short absolute TTL for authz and invalidate on security stamp change. Sliding is for anonymous catalog pages where staleness is OK.',
          bangla: 'হিট হলে স্লাইডিং বাড়ে — ব্যস্ত কী মরে না। অথজ ডেটায় অ্যাবসলিউট TTL + ইনভ্যালিডেশন।',
          followUp: 'What is the difference between MemoryCache eviction and Redis eviction under memory pressure?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Cache permissions with 2-minute absolute TTL and invalidate on role change via a version key. Prove two WebApplicationFactory instances do not share IMemoryCache.',
      code: `services.AddMemoryCache();
services.AddStackExchangeRedisCache(o => o.Configuration = redisConn);

var options = new DistributedCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
    SlidingExpiration = TimeSpan.FromMinutes(1),
};

if (!memory.TryGetValue(key, out ProductDto? dto))
{
    dto = await distributed.GetAsync(key, ct) ?? await LoadDb(ct);
    memory.Set(key, dto, TimeSpan.FromSeconds(10));
}`,
    },
    {
      topic: 'Cache Stampede, Penetration, and Avalanche',
      difficulty: 'expert',
      english:
        'Three failure modes kill caches in production. Stampede: a hot key expires and N requests hit the DB together. Penetration: missing keys never stored, so attackers or empty ids hammer SQL. Avalanche: many keys share the same TTL and expire together. Seniors name the mitigation: singleflight/lock, negative caching or bloom, jittered TTL.',
      bangla:
        'Stampede: হট কী মরলে সবাই DB-তে। Penetration: মিসিং কী ক্যাশ না হওয়ায় SQL হ্যামার। Avalanche: একই TTL-এ সব কী একসাথে মরে। লক, নেগেটিভ ক্যাশ, জিটার।',
      details: `
### Stampede (dogpile / thundering herd)
Hot key \`product:1\` expires. 2,000 concurrent requests miss and run the same SQL. DB CPU spikes; the thread pool can starve.

**Mitigations:** in-process singleflight (\`SemaphoreSlim\` / \`Lazy<Task>\`); distributed lock only for the miss path; probabilistic early expiration / stale-while-revalidate; soft TTL + hard TTL.

**When NOT:** locking every miss globally — the lock becomes the bottleneck. Only coalesce hot keys.

### Penetration
Queries for id=999999 (never exists). Cache-aside stores nothing; every request hits DB. Bots scan ids.

**Mitigations:** cache negative entries (null with short TTL), Bloom filter of valid ids, reject invalid ids at the API, rate limit.

**Failure:** negative TTL too long — newly created product 404s; too short — penetration still works.

### Avalanche
Cron or deploy sets TTL=60m on all keys at 10:00 → 11:00 Redis empties, DB dies.

**Mitigations:** jitter (60m + random 0–5m), staggered warmup. Redis persistence does not fix TTL avalanche.

**When NOT to just increase TTL:** you hide invalidation bugs and serve wrong data longer.
      `,
      commonMistakes: [
        'No coalescing on the hottest key in a sale event.',
        'Never caching misses; scrapers walk the primary key space.',
        'Identical TTL on every key populated at startup.',
        'Distributed lock on all reads, not only on rebuild.',
      ],
      bestPractices: [
        'Coalesce loads per key; consider stale-while-revalidate for catalog.',
        'Negative cache with short TTL; bloom if scan attacks are real.',
        'Add jitter to every bulk TTL.',
        'Load-test expiry of the hottest key, not only the happy cache hit.',
      ],
      interviewQs: [
        {
          q: 'A flash sale starts and the product key expires. What happens and how do you stop it?',
          a: 'Stampede: all instances miss Redis and stampede SQL for the same row. I coalesce in-process with a single inflight Task per key, and optionally a Redis lock so only one instance rebuilds. I serve slightly stale data while rebuilding if the business allows. I do not put a global lock on every GET. Metrics: DB QPS for that query should stay ~1 during rebuild, not equal request QPS.',
          bangla: 'Stampede = সবাই এক SQL। ইন-প্রসেস singleflight + ছোট Redis লক। স্টেল সার্ভ করা যায়। গ্লোবাল লক নয়।',
          followUp: 'Show a Lazy<Task<T>> singleflight sketch and its deadlock risk.',
          difficulty: 'expert',
        },
        {
          q: 'How do you distinguish penetration from a normal miss ratio problem?',
          a: 'Penetration is a high rate of misses for keys that will never exist (random ids). Normal misses are cold start or low TTL. I look at top miss keys: if they are unique and 404, it is penetration. Fix negative caching and rate limits. If the same 50 keys miss, it is TTL/stampede. Wrong fix: caching all 404s for 24h and then wondering why new products do not appear.',
          bangla: 'কখনোই নেই এমন কী-র মিস = penetration। নেগেটিভ ক্যাশ ছোট TTL। নতুন প্রোডাক্ট 404 হলে TTL কমাতে হবে।',
          followUp: 'Where would you put a Bloom filter in a .NET shop API?',
          difficulty: 'expert',
        },
        {
          q: 'What is a cache avalanche after a Redis restart vs after a synchronized TTL?',
          a: 'Restart: all keys gone unless persistence/replica promotion. Every request is a miss. Mitigate with persistence, replica, coalescing, and maybe a warmup job. Synchronized TTL: Redis still up but keys expire together. Jitter and staggered fill. I would not solve restart by TTL=1 day on checkout data.',
          bangla: 'রিস্টার্ট = সব মিস (persistence না থাকলে)। সিঙ্ক TTL = একসাথে এক্সপায়ার। জিটার + কোয়েলেস।',
          followUp: 'Does Redis AOF stop stampede on a single hot key expiry?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Write a GetOrCreateAsync that shares one Task per key. Simulate 100 parallel misses and assert the DB factory ran once. Add TTL jitter of ±10%.',
      code: `public sealed class SingleFlightCache
{
    private readonly ConcurrentDictionary<string, Lazy<Task<string?>>> _inflight = new();

    public Task<string?> GetOrLoad(string key, Func<Task<string?>> load) =>
        _inflight.GetOrAdd(key, _ => new Lazy<Task<string?>>(async () =>
        {
            try { return await load(); }
            finally { _inflight.TryRemove(key, out var _); }
        })).Value;
}

static TimeSpan TtlWithJitter(TimeSpan baseTtl)
{
    var jitter = Random.Shared.NextDouble() * 0.1;
    return baseTtl + TimeSpan.FromMilliseconds(baseTtl.TotalMilliseconds * jitter);
}`,
    },
    {
      topic: 'Redis Distributed Lock',
      difficulty: 'expert',
      english:
        'A Redis lock is SET key NX PX token, then Lua compare-and-delete to unlock. It coordinates who may rebuild a cache or process a job — it is not a database transaction. Seniors know lock expiry vs work time, RedLock controversy, and what happens when the holder dies or GC pauses past the TTL.',
      bangla:
        'Redis লক = SET NX PX, আনলক Lua দিয়ে টোকেন মিলিয়ে। DB ট্রানজ্যাকশন নয়। TTL vs কাজের সময়, হোল্ডার ডাই, RedLock বিতর্ক — সিনিয়র এগুলো বলে।',
      details: `
### Why
Two instances must not run "charge this order" twice, or 50 instances must not rebuild the same stampede key. SQL unique constraints remain the source of truth for money; the lock is an optimization or a coordinator.

### How
\`SET lock:order:9 token NX PX 30000\` — only one winner. Unlock: Lua if GET==token then DEL so you never delete another holder's lock after your TTL expired.

**When NOT:** as the only idempotency for payments. Network partition + expired lock = two chargers. Use idempotency keys in SQL/payment provider.

### Failure modes
- **Work longer than PX:** lock expires, second worker starts, first still running — split brain. Fix: extend (watchdog) carefully, or fail the work.
- **GC pause:** same as expiry.
- **Unlock without token check:** instance A expires, B acquires, A wakes and DEL — B's lock gone.
- **RedLock:** Kleppmann's critique — pauses and clock issues. For most .NET shops, one Redis primary + SQL uniqueness is enough. Do not pretend RedLock is consensus like etcd.

### When a lock is the wrong tool
Cache stampede on one box: in-process singleflight is cheaper. Job processing: prefer queue visibility timeout over home-rolled locks.
      `,
      commonMistakes: [
        'DEL the lock key without checking the token.',
        'Lock TTL shorter than the slowest DB call with no extension.',
        'Using a lock instead of a unique idempotency row for payments.',
        'Assuming RedLock makes Redis a consensus system.',
      ],
      bestPractices: [
        'SET NX PX with a random token; Lua release.',
        'Keep critical sections tiny; idempotent work inside.',
        'SQL unique constraint / payment idempotency key as the real guard.',
        'Log lock wait time; a lock pile-up is an outage.',
      ],
      interviewQs: [
        {
          q: 'How do you implement a Redis lock in .NET, and when would you refuse to use one?',
          a: 'SET key uniqueToken NX PX milliseconds, release with Lua that matches the token. I refuse it as the sole safety for charging a card — I use an idempotency key persisted in SQL and at the provider. I use it to coalesce cache rebuilds or to stop duplicate background jobs when the queue cannot. I refuse RedLock as distributed consensus unless I can discuss the pause/expiry critique.',
          bangla: 'SET NX PX + Lua টোকেন চেক। পেমেন্টের একমাত্র গার্ড লক নয় — SQL আইডেমপোটেন্সি। RedLock = কনসেনসাস নয়।',
          followUp: 'What does a GC pause longer than PX do to two workers?',
          difficulty: 'expert',
        },
        {
          q: 'Why is unlocking with DEL key unsafe?',
          a: 'If your lock expired, another worker may own the key. DEL removes their lock. They think they are exclusive; a third worker can enter. Token compare-and-delete is mandatory. The same class of bug exists if you overwrite PX without owning the token.',
          bangla: 'TTL শেষে অন্য হোল্ডার থাকতে পারে। DEL তাদের লক মুছে দেয়। টোকেন মিলিয়ে মুছতে হয়।',
          followUp: 'How would you extend a lock safely while work is still running?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Implement acquire/release with StackExchange.Redis ScriptEvaluate. Write a test with two parallel tasks and a TTL shorter than the work — show double execution, then fix with idempotency.',
      code: `public sealed class RedisLock(IDatabase db)
{
    private static readonly LuaScript Release = LuaScript.Prepare(
        "if redis.call('get', @key) == @token then return redis.call('del', @key) else return 0 end");

    public async Task<string?> TryAcquire(string key, TimeSpan ttl)
    {
        var token = Guid.NewGuid().ToString("N");
        var ok = await db.StringSetAsync(key, token, ttl, When.NotExists);
        return ok ? token : null;
    }

    public Task Release(string key, string token) =>
        db.ScriptEvaluateAsync(Release, new { key = (RedisKey)key, token });
}`,
    },
    {
      topic: 'ASP.NET Core + Redis Examples and Redis vs Database',
      difficulty: 'senior',
      english:
        'In ASP.NET Core you usually inject IDistributedCache or IConnectionMultiplexer. Redis is not a second SQL Server: no joins, different durability, different cost model. Seniors cache expensive reads, use Redis for ephemeral coordination, and keep invariants in the database. The trade-off question is what you are willing to lose on failover.',
      bangla:
        'IDistributedCache বা IConnectionMultiplexer। Redis SQL নয় — জয়েন নেই, ডুরেবিলিটি আলাদা। ইনভেরিয়েন্ট DB-তে; Redis রিড ও কোঅর্ডিনেশন। ফেইলওভারে কী হারাতে রাজি?',
      details: `
### Wiring
\`AddStackExchangeRedisCache\` for IDistributedCache (sessions, simple GET/SET). \`AddSingleton<IConnectionMultiplexer>\` when you need locks, sets, increment, pub/sub. Do not create a multiplexer per request.

Hybrid: output caching of GETs with authorization-aware policies — never cache personalized JSON under a shared key.

### Redis vs database
| Need | Prefer |
| :--- | :--- |
| Invariants, money, audit | SQL (or main DB) |
| Hot read DTO, session, rate limit | Redis |
| Query by many filters / joins | SQL (or search index) |
| Exactly-once business process | DB transaction + outbox, not Redis TTL |

**When Redis wins:** microsecond GETs, built-in expiry, INCR for rate limits, pub/sub invalidation.

**When Redis loses:** you modeled orders as Redis hashes and then needed reporting, transactions across keys, or GDPR deletes. **Failure:** Redis used as the order store, AOF off, instance dies — empty shop.

### Production operations
Timeouts and abort on Redis failure: fail open (hit SQL) for catalog; fail closed for a lock you cannot take. Circuit breaker so a dead Redis does not thread-starve the app. Eviction \`allkeys-lru\` vs \`noeviction\` — noeviction + full Redis = write errors in the API.

### When NOT to introduce Redis
Single instance, SQL p95 already 5ms, team has no Redis on-call. Add it when you have a measured hot query or a farm that cannot share IMemoryCache.
      `,
      commonMistakes: [
        'New ConnectionMultiplexer per HTTP request.',
        'Output-caching authenticated responses with a shared key.',
        'Redis as the system of record for orders with no persistence.',
        'Failing the whole request when Redis GET times out on a non-critical cache.',
      ],
      bestPractices: [
        'One multiplexer; IDistributedCache for simple values; native API for locks/INCR.',
        'Fail open on cache read errors for non-critical data; still hit SQL.',
        'Keep money in SQL; use Redis for speed and coordination.',
        'Set timeouts, eviction policy, and persistence explicitly.',
      ],
      interviewQs: [
        {
          q: 'When would you refuse to put a piece of data in Redis instead of SQL Server?',
          a: 'When losing it or serving it stale violates money, law, or stock correctness — orders, ledgers, entitlements you cannot rebuild. Redis is a speed layer and a coordinator. I will cache a projection of an order, not the only copy. If the interviewer wants Redis for everything, I talk failover, backup, and query needs they just threw away.',
          bangla: 'হারালে বা স্টেল হলে টাকা/আইন ভাঙে এমন ডেটা Redis-এ একমাত্র কপি নয়। প্রজেকশন ক্যাশ করা যায়, লেজার নয়।',
          followUp: 'Could Redis persistence make it a valid primary store for a shopping cart?',
          difficulty: 'senior',
        },
        {
          q: 'How do you keep the ASP.NET app alive when Redis is down?',
          a: 'Cache-aside: catch Redis exceptions on GET/SET, log, and go to SQL (fail open) for catalog. Do not fail open for a distributed lock around a non-idempotent charge — fail the request or rely on SQL idempotency. Use timeouts so hung Redis does not exhaust the thread pool. A circuit breaker stops a retry storm. Health checks should show Redis degraded, not necessarily kill the pod if SQL still serves.',
          bangla: 'ক্যাটালগ GET ফেল ওপেন = SQL। নন-আইডেমপোটেন্ট চার্জের লক ফেল ওপেন নয়। টাইমআউট + সার্কিট ব্রেকার।',
          followUp: 'Where do you put the circuit breaker — IDistributedCache wrapper or the caller?',
          difficulty: 'expert',
        },
        {
          q: 'IDistributedCache vs IConnectionMultiplexer — how do you choose?',
          a: 'IDistributedCache is GET/SET/refresh with DI-friendly options — enough for DTO cache and session. Locks, Lua, sets, pub/sub, INCR need StackExchange.Redis. I do not wrap everything in IDistributedCache and then parse bytes into a lock protocol. Two registrations, one multiplexer underneath if I can share it.',
          bangla: 'GET/SET = IDistributedCache। লক/Lua/INCR = multiplexer। লক প্রোটোকল বাইটে লুকানোর দরকার নেই।',
          followUp: 'How does ASP.NET session in Redis fail if you store too much per user?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Register a shared ConnectionMultiplexer and IDistributedCache. Wrap GET in try/catch that falls back to SQL. Document fail-open vs fail-closed per endpoint on PlaceOrder vs GetProduct.',
      code: `builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect(redisConn));
builder.Services.AddStackExchangeRedisCache(o => o.Configuration = redisConn);

public sealed class ResilientProductCache(IDistributedCache cache, AppDbContext db, ILogger<ResilientProductCache> log)
{
    public async Task<ProductDto?> Get(int id, CancellationToken ct)
    {
        try
        {
            var json = await cache.GetStringAsync($"product:{id}", ct);
            if (json is not null) return JsonSerializer.Deserialize<ProductDto>(json);
        }
        catch (RedisConnectionException ex)
        {
            log.LogWarning(ex, "Redis down, fail open to SQL");
        }
        return await db.Products.AsNoTracking()
            .Where(p => p.Id == id).Select(p => new ProductDto(p.Id, p.Name, p.Price))
            .FirstOrDefaultAsync(ct);
    }
}`,
    },
  ],
  quickRevision: {
    concepts: [
      'Cache-aside: miss → DB → set; invalidate after commit',
      'Write-through vs write-behind: latency vs data-loss risk',
      'TTL is a net; writes still invalidate; jitter absolute expiry',
      'IMemoryCache per process; Redis for the farm',
      'Never cache tracked EF entities',
      'Stampede: singleflight / lock / stale-while-revalidate',
      'Penetration: negative cache or bloom',
      'Avalanche: jittered TTLs, not one expiry wall',
      'Redis lock: SET NX PX + Lua token delete; not a money transaction',
      'Fail open on catalog cache; fail closed on non-idempotent locks',
    ],
    questions: [
      'Cache-aside vs write-behind for payments?',
      'DB then cache, or cache then DB?',
      'When is IMemoryCache wrong behind a load balancer?',
      'Sliding vs absolute expiration for permissions?',
      'How do you stop a stampede on product:1?',
      'What is cache penetration vs a cold cache?',
      'Why add jitter to TTL?',
      'Why is DEL lock unsafe without a token?',
      'Redis vs SQL for orders?',
      'What does the app do when Redis is down?',
    ],
    mistakes: [
      'Write-behind checkout totals in RAM Redis',
      'SET cache before SaveChanges',
      'Farm-wide authz in IMemoryCache only',
      'Unlock with DEL after TTL expiry',
      'Output cache of personalized authenticated JSON',
    ],
    scenarios: [
      'Flash sale: hot key expires, SQL CPU to 100%',
      'Scraper walks ids, miss ratio 99%, SQL melts',
      'All keys TTL 60m from deploy, 11:00 outage',
      'Lock expired mid-charge, double capture',
      'Redis pod OOM, catalog API 500s instead of SQL fallback',
    ],
  },
  revisionSummary: `
- Patterns: cache-aside + invalidate after commit is the default; write-behind is for data you can lose or rebuild.
- TTL + jitter + explicit invalidation; MemoryCache is local; Redis is shared.
- Stampede/penetration/avalanche have named fixes: coalesce, negative cache, jitter.
- Locks coordinate; SQL idempotency still owns money. Fail open on reads, not on charges.
  `,
  summary:
    'Senior caching in .NET is choosing a consistency pattern, surviving stampede and Redis outages, and never treating Redis as a quieter SQL Server.',
};
