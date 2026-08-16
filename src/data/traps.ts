export const trapsData = {
  id: 'traps',
  title: 'Questions Senior Candidates Often Get Wrong',
  description:
    'Trap clusters that separate mid-level recall from senior judgment: the answer that sounds right, why it is wrong, the precise senior answer, and the follow-up interviewers use to finish you off.',
  sections: [
    {
      topic: 'IEnumerable vs IQueryable; First vs Single; AsNoTracking vs Tracking',
      difficulty: 'senior',
      english: `These three pairs look like trivia. They are production traps: accidental full-table loads, exceptions in production data, and silent write bugs or memory blow-ups. The wrong answer is a definition. The senior answer is where the query runs, how many rows the contract allows, and what SaveChanges will do.`,
      bangla: 'সংজ্ঞা নয় — কোয়েরি কোথায় চলে, কয়টা রো অ্যালাউড, SaveChanges কী করবে। এখানেই মিড আর সিনিয়র আলাদা।',
      details: `
### Trap cluster A — IEnumerable vs IQueryable

| | |
| :--- | :--- |
| **Wrong answer** | "They are both for looping. IQueryable is for databases." |
| **Why it fails** | You did not say *where* the filter runs. \`IEnumerable.Where\` after \`DbSet\` has been enumerated pulls rows into memory. |
| **Senior answer** | \`IQueryable\` builds an expression tree; the provider (EF) translates it to SQL. \`IEnumerable\` is in-memory LINQ on already-materialized objects. The trap is calling a method that takes \`IEnumerable\` (or using \`.ToList()\` too early) so \`Where\`/\`Select\` no longer hit SQL. Passing \`IQueryable\` across a repository boundary can also leak EF and make composition surprising. |
| **Follow-up** | "Show me a repository method signature that causes N+1 or a full table scan." |

| Symptom | Likely mistake |
| :--- | :--- |
| Huge memory, little SQL time | Filter after \`ToList\` / \`AsEnumerable\` |
| SQL missing your predicate | Method taking \`IEnumerable<T>\` |
| Cannot unit-test without EF | Public API returns \`IQueryable\` |

### Trap cluster B — First vs Single (and OrDefault)

| | |
| :--- | :--- |
| **Wrong answer** | "First is faster so I always use First." |
| **Why it fails** | Speed is not the contract. \`Single\` means *exactly one*. Using \`First\` on a unique business key hides duplicates until money is wrong. |
| **Senior answer** | \`First\` / \`FirstOrDefault\`: first row, order matters if you care which. \`Single\` / \`SingleOrDefault\`: 0 or >1 is an error (\`Single\` throws on 0 or >1; \`SingleOrDefault\` throws on >1). On a unique index, \`SingleOrDefault\` is the honesty check. \`First\` on unordered SQL is non-deterministic. EF translates \`Single\` to \`TOP 2\` so it can detect duplicates. |
| **Follow-up** | "What SQL does EF emit for Single vs First, and when is First correct?" |

| Method | 0 rows | 1 row | 2+ rows |
| :--- | :--- | :--- | :--- |
| \`First\` | throws | returns | returns first (silent) |
| \`FirstOrDefault\` | default | returns | returns first (silent) |
| \`Single\` | throws | returns | throws |
| \`SingleOrDefault\` | default | returns | throws |

### Trap cluster C — AsNoTracking vs Tracking

| | |
| :--- | :--- |
| **Wrong answer** | "AsNoTracking is always faster so I put it on DbContext globally." |
| **Why it fails** | Tracking is how \`SaveChanges\` knows what to UPDATE. Global no-tracking plus a later \`entity.Name = "x"; SaveChanges();\` is a silent no-op. |
| **Senior answer** | Tracked entities sit in the identity map; EF snapshots values and generates UPDATEs. \`AsNoTracking\` skips that — correct for read-only APIs and projections (projections are already untracked). \`AsNoTrackingWithIdentityResolution\` when you need identity without writes. Never track a huge graph "just in case." Never update an untracked instance without \`Attach\` + property marks or \`ExecuteUpdate\`. |
| **Follow-up** | "You load tracked, then the same key via a second query — what instance do you get?" |

| Mode | Reads | Writes | Identity map |
| :--- | :--- | :--- | :--- |
| Tracked (default) | Extra memory/CPU | \`SaveChanges\` works | Same key → same instance |
| \`AsNoTracking\` | Cheaper | No automatic UPDATE | Duplicates possible |
| Projection \`Select\` | Cheapest | N/A | DTOs, not entities |
      `,
      code: `// TRAP: IQueryable becomes IEnumerable — filter in memory
public IEnumerable<Order> GetOrders() => db.Orders;
var open = GetOrders().Where(o => o.Status == Status.Open); // SQL: SELECT *

// SENIOR: compose IQueryable inside the boundary, materialize at the edge
public Task<List<OrderListDto>> GetOpenAsync(CancellationToken ct) =>
    db.Orders.AsNoTracking()
      .Where(o => o.Status == Status.Open)
      .Select(o => new OrderListDto(o.Id, o.Total))
      .ToListAsync(ct);

// TRAP: First on a unique email hides duplicates
var user = await db.Users.FirstAsync(u => u.Email == email);

// SENIOR: contract is exactly one
var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);

// TRAP: untracked mutate
var p = await db.Products.AsNoTracking().SingleAsync(x => x.Id == id);
p.Price = 9;
await db.SaveChangesAsync(); // no UPDATE

// SENIOR read path vs write path explicitly
var p = await db.Products.SingleAsync(x => x.Id == id); // tracked
p.Price = 9;
await db.SaveChangesAsync();`,
      commonMistakes: [
        'Repository returns IEnumerable or IQueryable to "be flexible."',
        'First() everywhere because it "does not throw."',
        'Global AsNoTracking and a later silent SaveChanges.',
      ],
      bestPractices: [
        'Materialize at the application boundary with a DTO.',
        'Single/SingleOrDefault on unique business keys; First only with OrderBy.',
        'Tracking is a write-mode; AsNoTracking is a read-mode — set per query.',
      ],
      interviewQs: [
        {
          q: 'What is the difference between IEnumerable and IQueryable?',
          a: 'IQueryable is an expression tree translated by a provider (usually to SQL). IEnumerable LINQ runs in the CLR on in-memory objects. The senior trap is a method signature or AsEnumerable/ToList that silently moves the rest of the query into memory. I do not return IQueryable from a public repository unless the team explicitly owns that composition model.',
          bangla: 'IQueryable = SQL-এ অনুবাদ। IEnumerable = মেমোরিতে। ToList/AsEnumerable এর পর Where আর DB-তে যায় না।',
          followUp: 'Why is returning IQueryable from a repository controversial?',
          difficulty: 'senior',
        },
        {
          q: 'First vs Single — which do you use to load a user by Id?',
          a: 'Id is unique: SingleOrDefault (or Single if absence is exceptional). First would hide a duplicate-id catastrophe and is non-deterministic without OrderBy. First is for "any/top 1 of a sorted set" (latest order). Interviewers listen for the contract, not for "First is faster."',
          bangla: 'ইউনিক কি = Single/SingleOrDefault। First = সর্টেড টপ-১।',
          followUp: 'What SQL does EF generate for Single?',
          difficulty: 'mid',
        },
        {
          q: 'When is AsNoTracking the wrong choice?',
          a: 'When you intend to mutate and SaveChanges, or when you need the identity map to fix up graphs. It is also wrong as a thoughtless global default if write services share that context configuration. Reads and projections should be untracked; writes should be tracked or use ExecuteUpdate with an explicit filter.',
          bangla: 'মিউটেট + SaveChanges করতে হলে ট্র্যাকিং লাগবে। গ্লোবাল AsNoTracking সাইলেন্ট বাগ।',
          difficulty: 'senior',
        },
      ],
      practice: 'Find one API that returns entities. Convert to AsNoTracking + Select DTO. Then write a test that asserts SaveChanges does not UPDATE an AsNoTracking instance.',
    },
    {
      topic: 'Task vs Thread; Async vs Parallelism; ConfigureAwait',
      difficulty: 'senior',
      english: `Async is not a speed hack and a Task is not a thread. The wrong answers cause thread-pool starvation, reentrancy bugs, and library deadlocks. Seniors separate concurrency (overlapping waits) from parallelism (multiple CPUs) and know when ConfigureAwait actually matters.`,
      bangla: 'Async = অপেক্ষা ছাড়তে থ্রেড ফেরত। Parallel = অনেক CPU। Task ≠ Thread। ConfigureAwait লাইব্রেরিতে ম্যাটার করে।',
      details: `
### Trap cluster A — Task vs Thread

| | |
| :--- | :--- |
| **Wrong answer** | "A Task is a background thread." |
| **Why it fails** | Most I/O tasks have no thread while waiting. \`Thread.Sleep\` vs \`Task.Delay\` is the classic discriminator. |
| **Senior answer** | A \`Thread\` is an OS scheduled execution resource. A \`Task\` is a promise of a result. I/O-bound tasks use I/O completion; CPU-bound work needs \`Task.Run\` / \`Parallel\` / \`Channel\` consumers — which *do* use thread-pool threads. \`async void\` is an unobserved fire-and-forget (except event handlers). |
| **Follow-up** | "Does await start a new thread?" |

### Trap cluster B — Async vs parallelism

| | |
| :--- | :--- |
| **Wrong answer** | "I made it async so it uses all cores and goes faster." |
| **Why it fails** | Async reduces thread occupancy during waits. It does not magically parallelize CPU work. Sequential awaits are still sequential. |
| **Senior answer** | **Asynchrony:** overlap waiting (HTTP, SQL) on few threads — scalability. **Parallelism:** split CPU work across cores — throughput of compute. Combine with care: \`Task.WhenAll\` on I/O is concurrency; \`Parallel.ForEach\` / \`PLINQ\` is parallelism and can starve the ASP.NET pool if you run it on a request. On a web request, prefer async I/O; offload heavy CPU to a background queue. |
| **Follow-up** | "Should you Task.Run in an ASP.NET controller to 'be async'?" |

| Kind | Tool | On a web request? |
| :--- | :--- | :--- |
| I/O wait | \`async/await\`, \`WhenAll\` | Yes |
| CPU bound | \`Task.Run\`, Parallel | Usually **no** — queue it |
| Fake async | \`Task.Run\` wrapping sync SQL | Harmful (starvation) |

### Trap cluster C — ConfigureAwait

| | |
| :--- | :--- |
| **Wrong answer** | "Always ConfigureAwait(false) everywhere, including controllers." / "Never, ASP.NET Core has no SyncContext." |
| **Why it fails** | Both slogans are incomplete. ASP.NET Core has no UI SynchronizationContext, so missing ConfigureAwait in an app usually does not deadlock. Libraries still should not capture a context they do not need; UI apps (WPF/WinForms) still deadlock on \`.Result\` after an await that captured the UI context. |
| **Senior answer** | \`ConfigureAwait(false)\` means "do not marshal back to the captured SynchronizationContext / TaskScheduler." Use it in **reusable libraries**. In ASP.NET Core app code it is optional for deadlocks, still useful to avoid extra scheduling. Never mix \`.Result\` / \`.Wait()\` with async — that is the real deadlock/starvation. \`ConfigureAwait(true)\` is the default and needed if you must resume on a UI thread. |
| **Follow-up** | "Show a deadlock with ConfigureAwait(true) and .Result." |
      `,
      code: `// TRAP: Task = thread
Thread.Sleep(1000);          // occupies a thread
await Task.Delay(1000);      // does not

// TRAP: fake async — still blocks a pool thread
public Task<int> Bad() => Task.Run(() => db.Orders.Count()); // sync EF on pool

// SENIOR: real async I/O
public Task<int> Good(CancellationToken ct) => db.Orders.CountAsync(ct);

// TRAP: parallelism on the request path
public async Task<IActionResult> HashAll(List<byte[]> blobs)
{
    Parallel.ForEach(blobs, b => SHA256.HashData(b)); // steals pool threads
    return Ok();
}

// SENIOR: queue CPU work; WhenAll for I/O
var a = client.GetAsync(url1, ct);
var b = client.GetAsync(url2, ct);
await Task.WhenAll(a, b);

// Library code
await stream.ReadAsync(buf, ct).ConfigureAwait(false);

// DEADLOCK pattern (UI / old ASP.NET SyncContext)
var x = GetAsync().Result; // waiter holds context; GetAsync needs it to finish`,
      commonMistakes: [
        'Task.Run in controllers to "convert" sync EF to async.',
        'Parallel.ForEach on ASP.NET request threads.',
        'async void except for event handlers.',
      ],
      bestPractices: [
        'Async all the way for I/O; never .Result on ASP.NET.',
        'ConfigureAwait(false) in libraries; do not treat it as a performance cult in Core apps.',
        'CPU-heavy work off the request thread via a queue.',
      ],
      interviewQs: [
        {
          q: 'Is a Task a thread?',
          a: 'No. A Task is a promise. I/O tasks often have no thread while pending. Threads execute CPU work. Confusing them leads to Thread.Sleep in async code and to assuming await creates threads. Await schedules a continuation; it does not mean "run on a background thread."',
          bangla: 'Task = প্রমিস, Thread = এক্সিকিউশন রিসোর্স। Await নতুন থ্রেড চালু করে না।',
          followUp: 'Then how does Task.Run differ from await HttpClient.GetAsync?',
          difficulty: 'mid',
        },
        {
          q: 'Does async make my CPU-bound loop faster?',
          a: 'No. Async frees threads during waits. A CPU loop needs parallelism or a better algorithm. Putting async on a tight for-loop only adds state-machine overhead. On a web server, parallelizing CPU on the request path can reduce throughput by starving the pool.',
          bangla: 'Async অপেক্ষা ছাড়ে, CPU ভাগ করে না। রিকোয়েস্ট পাথে Parallel স্টারভেশন আনতে পারে।',
          difficulty: 'senior',
        },
        {
          q: 'Do you need ConfigureAwait(false) in ASP.NET Core?',
          a: 'Not to avoid the classic UI deadlock — there is no SyncContext. Still use it in libraries so they remain host-agnostic, and never use .Result. In app code it is a style/micro-optimization choice, not a correctness ritual. In WPF/WinForms it is still load-bearing.',
          bangla: 'Core অ্যাপে ডেডলক এড়াতে বাধ্যতামূলক নয়; লাইব্রেরিতে দিন। .Result ই এড়িয়ে চলুন।',
          difficulty: 'senior',
        },
      ],
      practice: 'Write two methods that wait 1s: Sleep vs Delay. Log thread id before/after. Then break a sample with .Result and explain the stack.',
    },
    {
      topic: 'Interface vs Abstract; Struct vs Class; Const vs Readonly; Ref vs Out vs In',
      difficulty: 'senior',
      english: `Language traps become design traps: wrong abstraction, accidental boxing, mutable "readonly" confusion, and APIs that lie about who owns a variable. Seniors pick the construct for the constraint (multiple inheritance of contract, value semantics, versioning, definite assignment), not from a cheat sheet.`,
      bangla: 'ইন্টারফেস = কন্ট্রাক্ট, অ্যাবস্ট্রাক্ট = শেয়ার্ড বেস। স্ট্রাক্ট = ভ্যালু সেমান্টিক্স। const vs readonly, ref/out/in — কে অ্যাসাইন করে।',
      details: `
### Trap cluster A — Interface vs abstract class

| | |
| :--- | :--- |
| **Wrong answer** | "Interface is what, abstract is how — and C# 8 default methods mean we do not need abstract classes." |
| **Why it fails** | Default interface methods are not instance fields. You still cannot share mutable state or non-public constructors via an interface. |
| **Senior answer** | **Interface:** capability / role; multiple; no fields (except static); versioning via DIM is limited and surprising. **Abstract class:** shared implementation + state + template method; single inheritance. Prefer interface at boundaries (DI, tests). Prefer abstract when you own a family of types and a protected skeleton. Do not use abstract as a fake interface "because I might add a field later." |
| **Follow-up** | "Can an abstract class implement an interface? When do you do both?" |

### Trap cluster B — Struct vs class

| | |
| :--- | :--- |
| **Wrong answer** | "Structs are faster because they live on the stack." |
| **Why it fails** | Large structs copy; they box when cast to interfaces; they can live on the heap inside arrays/classes. Stack vs heap is not the decision. |
| **Senior answer** | Struct = value semantics (copy), no inheritance, default zeroing. Use for small, immutable, short-lived data (Guid, decimal, coordinates). Class = identity, references, inheritance. Mutable structs are a bug factory (lost mutations on copies). \`readonly struct\` / \`record struct\` when you need values. Boxing to \`IEquatable<T>\` can erase the win. |
| **Follow-up** | "Why is a mutable struct in a List dangerous?" |

### Trap cluster C — const vs readonly

| | |
| :--- | :--- |
| **Wrong answer** | "They are the same: a value that cannot change." |
| **Why it fails** | \`const\` is a compile-time literal inlined into callers — changing it requires recompiling consumers. \`readonly\` is runtime, can be set in constructor, can be \`static readonly\` for reference types. |
| **Senior answer** | \`const\`: primitive/string, baked into IL of callers. \`readonly\` instance: per object, constructor. \`static readonly\`: once per type, including \`new object()\`. For public library versioning, prefer \`static readonly\` over public \`const\` for values that might change. \`readonly\` fields are not deeply immutable. |
| **Follow-up** | "You shipped a const MaxRetry = 3; then changed it to 5. Why do old plugins still retry 3 times?" |

### Trap cluster D — ref vs out vs in

| | |
| :--- | :--- |
| **Wrong answer** | "ref and out both pass by reference; in is const ref." |
| **Why it fails** | Incomplete: definite assignment and copy semantics for \`in\` on structs matter. |
| **Senior answer** | **ref:** bidirectional; caller must assign before call. **out:** callee must assign; used for TryParse. **in:** readonly reference to avoid copies of large structs; callee must not mutate; compiler may copy if it cannot prove safety. \`ref readonly\` returns. Do not use \`in\` on tiny structs as a cargo cult. \`ref struct\` (Span) cannot live on the heap. |
| **Follow-up** | "Why can Span<T> not be a field on a class?" |
      `,
      code: `public interface IClock { DateTimeOffset UtcNow { get; } }
public abstract class Handler
{
    public async Task RunAsync(CancellationToken ct)
    {
        await ValidateAsync(ct);
        await HandleAsync(ct); // template method
    }
    protected abstract Task HandleAsync(CancellationToken ct);
    protected virtual Task ValidateAsync(CancellationToken ct) => Task.CompletedTask;
}

public readonly struct Money
{
    public Money(decimal amount, string ccy) { Amount = amount; Ccy = ccy; }
    public decimal Amount { get; }
    public string Ccy { get; }
}

public const int CompiledIntoCallers = 3;
public static readonly TimeSpan CanChangeWithoutRecompile = TimeSpan.FromSeconds(3);

bool TryGet(string key, out User user) { user = default!; return false; }
void Swap(ref int a, ref int b) { (a, b) = (b, a); }
decimal Sum(in Money a, in Money b) => a.Amount + b.Amount;`,
      commonMistakes: [
        'Huge mutable structs "for performance."',
        'Public const in a shared library for a value you will change.',
        'Abstract class with no shared code — should have been an interface.',
      ],
      bestPractices: [
        'Interfaces at module boundaries; abstract for template + state you own.',
        'Small immutable structs; classes for identity.',
        'out for Try*; ref for true mutation; in only for large readonly structs.',
      ],
      interviewQs: [
        {
          q: 'Interface vs abstract class — when do you choose each?',
          a: 'Interface for roles and DI boundaries; multiple, no instance fields. Abstract when you need shared state and a sealed algorithm with hooks. C# 8 default methods do not replace abstract classes. If you have no shared implementation, do not introduce an abstract class "for the future."',
          bangla: 'ইন্টারফেস = রোল/ডিআই। অ্যাবস্ট্রাক্ট = শেয়ার্ড স্টেট + টেমপ্লেট। DIM অ্যাবস্ট্রাক্টের বিকল্প নয়।',
          followUp: 'How do default interface methods affect existing implementers?',
          difficulty: 'senior',
        },
        {
          q: 'Are structs always allocated on the stack?',
          a: 'No. They are values. They copy. They live where the variable lives — including on the heap as fields, in arrays, and boxed. The senior reason to use a struct is value semantics and copy size, not "stack is fast."',
          bangla: 'স্ট্রাক্ট = ভ্যালু/কপি, স্ট্যাক গ্যারান্টি নয়। অ্যারে/ফিল্ডে হিপেও থাকে।',
          difficulty: 'mid',
        },
        {
          q: 'const vs readonly — which for a public library timeout?',
          a: 'static readonly (or options). const inlines into callers; bumping the library does not update already-compiled consumers. readonly can be a TimeSpan and is not inlined that way.',
          bangla: 'পাবলিক লাইব্রেরিতে পরিবর্তনশীল মান const নয় — static readonly।',
          difficulty: 'senior',
        },
        {
          q: 'ref vs out vs in in one minute.',
          a: 'ref: must be assigned before, callee may read/write. out: callee must assign, caller need not. in: readonly alias to avoid big struct copies; not a mutation API. TryParse is out; Swap is ref; passing a large readonly struct can be in.',
          bangla: 'ref দুইদিক, out কলি অ্যাসাইন, in শুধু পড়া/কপি এড়ানো।',
          difficulty: 'mid',
        },
      ],
      practice: 'Break a mutable struct in a List<T> (modify a copy). Then replace with a class or a readonly struct + with-expression.',
    },
    {
      topic: 'Singleton vs Scoped; Captive Dependency',
      difficulty: 'expert',
      english: `DI lifetime traps are production outages: disposed DbContext, cross-request data leaks, and "it works on my machine" because tests use a single scope. The captive dependency is the senior question: a long-lived service holding a short-lived one.`,
      bangla: 'সিঙ্গেলটন যদি স্কোপড ধরে রাখে = captive dependency। DbContext সিঙ্গেলটন নয়। রিকোয়েস্ট ডেটা সিঙ্গেলটনে যাবে না।',
      details: `
### Trap cluster A — Singleton vs Scoped vs Transient

| | |
| :--- | :--- |
| **Wrong answer** | "Singleton is faster so I register everything Singleton. Scoped is for DbContext. Transient is for lightweight." |
| **Why it fails** | Lifetime is about *state and ownership*, not speed. A Singleton UserService will leak User A's data into User B's request. |
| **Senior answer** | **Singleton:** process lifetime; thread-safe; no per-request state (caches, clients, options monitors). **Scoped:** one per scope (HTTP request in ASP.NET); DbContext, current-user, UoW. **Transient:** new instance every resolve; stateless helpers, or lightweight services that should not hold state. Performance of resolve is rarely the bottleneck; correctness is. |
| **Follow-up** | "What is the scope in a Hangfire job or an IHostedService?" |

| Lifetime | Instance count | Typical | Forbidden |
| :--- | :--- | :--- | :--- |
| Singleton | 1 / process | Redis mux, HttpClient factory, memory cache | DbContext, HttpContext, "current user" |
| Scoped | 1 / request (or created scope) | DbContext, UoW | Captured by Singleton |
| Transient | every resolve | Stateless calculators | Expensive + stateful without care |

### Trap cluster B — Captive dependency

| | |
| :--- | :--- |
| **Wrong answer** | "The container will handle it" / "I inject IServiceProvider into the singleton and it is fine." |
| **Why it fails** | A Singleton that constructor-injects a Scoped service keeps that *one* instance forever. DbContext gets disposed at the end of the first request; later requests blow up — or worse, the context is not disposed and you leak. Service locator without a scope still captures or creates undisposed contexts. |
| **Senior answer** | Captive dependency = longer-lived service holding a shorter-lived service. Detect with \`ValidateScopes\` / \`ValidateOnBuild\` in Development. Fix: (1) make the consumer Scoped, or (2) inject \`IServiceScopeFactory\` and create a scope per operation, or (3) inject a Singleton-safe abstraction (factory, \`IDbContextFactory<T>\`). Never store \`HttpContext\` on a Singleton. \`IHttpContextAccessor\` is a trap if you cache the context reference. |
| **Follow-up** | "Show the bug with a Singleton cache that injects AppDbContext." |

| Consumer | Injects | Result |
| :--- | :--- | :--- |
| Singleton | Scoped | **Captive** — broken |
| Singleton | Transient | Captive (one transient forever) — usually wrong |
| Scoped | Singleton | OK |
| Scoped | Transient | OK (new transient per consumer instance) |
      `,
      code: `// Development: fail fast on captives
builder.Host.UseDefaultServiceProvider(o =>
{
    o.ValidateScopes = true;
    o.ValidateOnBuild = true;
});

// TRAP
services.AddSingleton<OrderCache>();
services.AddScoped<AppDbContext>();
public sealed class OrderCache(AppDbContext db) { } // captive

// SENIOR: factory per operation
public sealed class OrderCache(IDbContextFactory<AppDbContext> factory)
{
    public async Task<Order?> GetAsync(Guid id, CancellationToken ct)
    {
        await using var db = await factory.CreateDbContextAsync(ct);
        return await db.Orders.AsNoTracking().FirstOrDefaultAsync(o => o.Id == id, ct);
    }
}

// Background service: YOU create the scope
protected override async Task ExecuteAsync(CancellationToken ct)
{
    while (!ct.IsCancellationRequested)
    {
        await using var scope = _scopes.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Outbox.TakeAsync(ct);
    }
}`,
      commonMistakes: [
        'AddSingleton for a service that injects DbContext "because cache."',
        'IHostedService using a constructor-injected scoped DbContext.',
        'Turning off ValidateScopes because "startup failed."',
      ],
      bestPractices: [
        'ValidateScopes on in Development; treat failures as bugs.',
        'IDbContextFactory or IServiceScopeFactory for singletons and workers.',
        'HttpContext and current user are scoped — never fields on a singleton.',
      ],
      interviewQs: [
        {
          q: 'When do you register a service as Singleton vs Scoped?',
          a: 'Singleton if it is thread-safe and has no per-request state (connections multiplexers, caches, options). Scoped if it participates in a unit of work or request identity (DbContext, user). I do not pick Singleton for speed. A wrong Singleton is a data leak or a disposed context.',
          bangla: 'স্টেটলেস/থ্রেড-সেফ = সিঙ্গেলটন। DbContext/ইউজার = স্কোপড। স্পিডের জন্য সিঙ্গেলটন নয়।',
          followUp: 'What lifetime is IHttpClientFactory and what lifetime are typed clients?',
          difficulty: 'senior',
        },
        {
          q: 'What is a captive dependency?',
          a: 'A longer-lived service holding a shorter-lived one, typically Singleton → Scoped DbContext. The scoped instance is not per-request; it is disposed or shared incorrectly. Fix with a factory or by aligning lifetimes. ValidateScopes catches it at startup in Development.',
          bangla: 'লম্বা লাইফটাইম ছোটটাকে ধরে রাখে — Singleton→DbContext। Factory বা লাইফটাইম মিলান।',
          followUp: 'Is Singleton → Transient also captive?',
          difficulty: 'expert',
        },
        {
          q: 'How do you use EF Core inside IHostedService?',
          a: 'Do not inject DbContext into the hosted service constructor. Inject IServiceScopeFactory or IDbContextFactory, create a scope per iteration, dispose it. The root provider has no request scope.',
          bangla: 'হোস্টেড সার্ভিসে DbContext ইনজেক্ট নয় — প্রতি লুপে স্কোপ খুলুন।',
          difficulty: 'senior',
        },
      ],
      practice: 'Register a Singleton that takes DbContext. Enable ValidateScopes. Fix it with IDbContextFactory. Then use the factory in a BackgroundService loop.',
    },
    {
      topic: 'JWT vs Session; Redis vs Database; RabbitMQ vs Kafka',
      difficulty: 'senior',
      english: `Tool-choice traps: candidates recite features instead of failure modes. JWT is not "stateless so it is always better." Redis is not a database. Kafka is not a faster RabbitMQ. Seniors pick the consistency, retention, and operational model.`,
      bangla: 'JWT vs সেশন = রিভোকেশন ও স্টেট। Redis ≠ DB। Kafka ≠ দ্রুত RabbitMQ — রিটেনশন ও কনজিউমার মডেল আলাদা।',
      details: `
### Trap cluster A — JWT vs session (cookie)

| | |
| :--- | :--- |
| **Wrong answer** | "JWT is modern and stateless; sessions are old. We always use JWT for APIs." |
| **Why it fails** | Stateless sounds free until you need logout, password change, or permission revoke before \`exp\`. |
| **Senior answer** | **JWT access token:** self-contained claims; scales horizontally; revocation needs short TTL + denylist/version or a server session anyway. **Server session:** store id in cookie (or token), state on server/Redis; revoke is a delete. Browser apps often want cookie sessions with SameSite + CSRF strategy; SPAs/mobile often want JWT + refresh rotation. Hybrid: short JWT + refresh in HTTP-only cookie. The trap is a 24h JWT you cannot revoke. |
| **Follow-up** | "User is fired; their JWT is valid for 12 more hours. Now what?" |

| Need | Lean JWT | Lean session |
| :--- | :--- | :--- |
| Instant revoke | Hard | Natural |
| Horizontal scale | Easy | Needs shared store |
| CSRF | Bearer header helps | Cookie needs CSRF plan |
| Payload size | Claims bloat every request | Id only |

### Trap cluster B — Redis vs database

| | |
| :--- | :--- |
| **Wrong answer** | "Redis is faster so we store orders in Redis." |
| **Why it fails** | Durability, query, transaction, and audit live in the database unless you designed a Redis-backed system with persistence and backup. |
| **Senior answer** | **Database:** source of truth, complex queries, transactions, constraints. **Redis:** cache, session, locks, rate limits, ephemeral fan-out — with an explicit TTL and a fallback. Redis persistence (AOF/RDB) is not the same as your backup/restore story. If checkout dies when Redis dies, Redis was not a cache. |
| **Follow-up** | "Can Redis be the source of truth for inventory?" |

### Trap cluster C — RabbitMQ vs Kafka

| | |
| :--- | :--- |
| **Wrong answer** | "Kafka is for microservices; RabbitMQ is legacy. Kafka is exactly-once." |
| **Why it fails** | Different models. Kafka is a durable log with consumer groups and replay. RabbitMQ is a broker with queues, routing, and ack/nack. Neither gives you business exactly-once without idempotency. |
| **Senior answer** | **RabbitMQ:** flexible routing (topic/direct), competing consumers, classic work queues, shorter retention; ops model is broker + queues. **Kafka:** ordered log per partition, replay from offset, high throughput event streaming, longer retention, partitioning key design is the product. Choose Kafka when you need replay and many independent consumers of the same events. Choose Rabbit when you need work distribution and complex routing without a log. Both: at-least-once + inbox. |
| **Follow-up** | "How do you get ordering in each system?" |
      `,
      code: `// JWT: short access + rotatable refresh (revocation story)
// access: 10-15 min; refresh: server-side family id you can kill

// Session: cookie + server store
services.AddStackExchangeRedisCache(...);
services.AddSession(); // still CSRF + SameSite for browser

// Redis as cache, SQL as truth
var dto = await cache.GetAsync(id) ?? await db.LoadAsync(id);

// RMQ: work queue — ack after inbox
// Kafka: consume from offset, commit after inbox; replay by resetting offset`,
      commonMistakes: [
        'Long-lived JWTs with no denylist and calling it stateless security.',
        'Writing business records only to Redis.',
        'Picking Kafka to look senior for a 50 msg/s command queue.',
      ],
      bestPractices: [
        'State the revoke story before choosing JWT.',
        'Name the source of truth in the design sentence.',
        'Choose the broker for replay/routing/ops, not for resume keywords.',
      ],
      interviewQs: [
        {
          q: 'JWT vs session cookies — which for a bank dashboard?',
          a: 'I would not start with a long-lived JWT. A bank dashboard in a browser wants a server session or a very short access token plus a refresh you can revoke, CSRF protection, and step-up auth. Stateless JWT shines for service-to-service and mobile APIs with short TTL. The senior answer is the revoke and theft story, not "JWT is REST-ful."',
          bangla: 'ব্যাংক ড্যাশবোর্ডে রিভোক আর CSRF — লম্বা JWT নয়।',
          followUp: 'How do you revoke a JWT without storing every token?',
          difficulty: 'senior',
        },
        {
          q: 'When would you store data in Redis instead of SQL?',
          a: 'When it is derived, ephemeral, or a performance copy: sessions, rate-limit counters, cache of a SQL row, distributed locks with fencing. Not for the ledger. If you need Redis as a primary store, you are signing up for persistence, backup, and consistency work that SQL already solved.',
          bangla: 'ক্যাশ/সেশন/কাউন্টার — লেজার নয়। Redis প্রাইমারি মানে নিজেই DB অপস।',
          difficulty: 'senior',
        },
        {
          q: 'RabbitMQ vs Kafka — pick one for order-placed events that billing and search must both consume, and we may reprocess last week.',
          a: 'That is a log + replay problem: Kafka (or similar). Two consumer groups, retain a week, reset offsets to reprocess. Rabbit can fan out with extra queues but replay is not its native model. I still build idempotent consumers. If it were a single worker pulling jobs, Rabbit is simpler.',
          bangla: 'রিপ্লে + অনেক কনজিউমার = Kafka। শুধু ওয়ার্ক কিউ = Rabbit। দুটোতেই idempotency।',
          followUp: 'How is ordering guaranteed in Kafka and not globally in Rabbit?',
          difficulty: 'expert',
        },
      ],
      practice: 'Write three sentences: revoke story for your auth; source of truth for orders; why your last queue was RMQ or Kafka. Speak them in 90 seconds.',
    },
    {
      topic: 'Monolith vs Microservices; Vertical vs Horizontal Scaling',
      difficulty: 'expert',
      english: `The fashionable wrong answer is "microservices and scale out, always." Seniors scale the bottleneck and split only on team and data boundaries. A distributed monolith is the failure mode: network latency with a single deployment drumbeat.`,
      bangla: 'মাইক্রোসার্ভিস ডিফল্ট নয়। স্কেল আউট ডিফল্ট নয়। বটলনেক মাপুন, টিম ও ডেটা বাউন্ডারি ছাড়া স্প্লিট নয়।',
      details: `
### Trap cluster A — Monolith vs microservices

| | |
| :--- | :--- |
| **Wrong answer** | "Microservices for scale and independent deploy. Monoliths do not scale." |
| **Why it fails** | Instagram-scale monoliths exist. Microservices scale *teams* and *failure isolation* when boundaries are real. They add distributed transactions, tracing, and on-call. |
| **Senior answer** | Start with a **modular monolith** (clear modules, no cross-module table writes). Split a service when you have a stable bounded context, an independent data store, and a team that can own its SLOs. Do not split by layer (a "UserService" that every request must call). Consistency: you lose 2PC; you buy sagas. The trap is a distributed monolith: 12 repos, one database, one release. |
| **Follow-up** | "How do you split a module out without a big-bang?" |

| Signal | Monolith / modular | Microservices |
| :--- | :--- | :--- |
| Team | 1–2 teams | Many teams, clear owners |
| Data | One model still changing | Separate stores, stable contracts |
| Consistency | Single transaction helps | Eventual OK |
| Scale | One bottleneck you can scale | Independent scale per context |

### Trap cluster B — Vertical vs horizontal scaling

| | |
| :--- | :--- |
| **Wrong answer** | "Horizontal is cloud-native; vertical is outdated." |
| **Why it fails** | A bigger SQL box can be the right first move. Stateless APIs scale out; stateful primaries often scale up then out with read replicas / sharding. |
| **Senior answer** | **Vertical:** more CPU/RAM/IO on one node — simple, limited, great for CPU-bound or a SQL primary. **Horizontal:** more nodes — needs statelessness or partitioned state (sessions in Redis, sticky none). Scale **the bottleneck**: if SQL is the limit, 50 API pods make it worse. Pattern: scale out web, scale up SQL until you must shard or CQRS reads. Cost and failure domains differ: 1 fat box is a blast radius; 50 boxes need orchestration. |
| **Follow-up** | "Your API is at 10% CPU and p95 is 2s. Do you add pods?" |

| Bottleneck | First move | Later |
| :--- | :--- | :--- |
| App CPU (stateless) | Horizontal pods | Then profile allocations |
| SQL CPU / IO | Index, then vertical | Replicas, then shard |
| Memory leak | Fix leak | Not more pods forever |
| Chatty downstream | Bulkhead / cache | Not more replicas of you |
      `,
      code: `// Modular monolith seam — not a microservice yet
public sealed class BillingModule { } // own tables, own API surface
public sealed class CatalogModule { }
// Cross-module: domain events in-process → later replace with outbox + bus

// Horizontal API: no in-memory session, no sticky
services.AddStackExchangeRedisCache(...); // session / data protection keys

// Scaling question in one line:
// concurrency ≈ RPS × latency; if that concurrency is SQL, scale SQL, not Kestrel`,
      commonMistakes: [
        'Splitting services that still share one SQL database and one transaction.',
        'Adding API replicas when Query Store shows a table scan.',
        'In-memory session state then "we cannot scale out."',
      ],
      bestPractices: [
        'Modular monolith until a team+data boundary is obvious.',
        'Scale the measured bottleneck; do the RPS × latency math.',
        'Stateless app nodes; state in SQL/Redis with an explicit owner.',
      ],
      interviewQs: [
        {
          q: 'Should we start this product as microservices?',
          a: 'Usually no. Start modular monolith with seams (modules, events). Introduce a service when a team owns a bounded context and cannot release independently, or when scale/isolation demands a separate store. Microservices as a default for a 5-person team is an ops tax. I would ask about team topology before drawing Kubernetes.',
          bangla: '৫ জনের টিমে মাইক্রোসার্ভিস ডিফল্ট নয় — মডুলার মনোলিথ + সীম।',
          followUp: 'What is a distributed monolith?',
          difficulty: 'expert',
        },
        {
          q: 'Vertical vs horizontal scaling for a .NET API + SQL?',
          a: 'APIs: horizontal once they are stateless. SQL: vertical and indexes first; read replicas for read-heavy; shard last. If p95 is SQL, more API pods increase pool exhaustion. I measure, then scale the bottleneck. Horizontal is not a personality trait.',
          bangla: 'API স্টেটলেস হলে হরাইজন্টাল। SQL আগে ইনডেক্স/ভার্টিকাল। বটলনেক না মাপা পর্যন্ত পড বাড়াবেন না।',
          followUp: 'When is sharding the wrong answer?',
          difficulty: 'senior',
        },
        {
          q: 'Our Kubernetes HPA is adding pods but latency is worse. Why?',
          a: 'Classic: the bottleneck is downstream (SQL, Redis, HTTP) or you added cold-start/coordination cost. More pods → more connections → pool exhaustion / stampede. HPA on CPU when the wait is I/O will not help. I would freeze scale, look at dependency saturation, then scale the right tier or shed load.',
          bangla: 'পড বাড়ে, ডিপেন্ডেন্সি মরে — HPA CPU-তে I/O ওয়েট ধরে না।',
          difficulty: 'expert',
        },
      ],
      practice: 'Draw your current system. Mark the real bottleneck. Write one sentence why you would not split a service this quarter, and one metric that would change your mind.',
    },
  ],
  quickRevision: {
    concepts: [
      'IQueryable = SQL; IEnumerable after ToList = memory',
      'Single = exactly one; First needs OrderBy',
      'AsNoTracking = no SaveChanges UPDATEs',
      'Task ≠ thread; async ≠ parallelism',
      'ConfigureAwait(false) in libraries; never .Result',
      'Interface = role; abstract = template + state',
      'const inlines; readonly is runtime',
      'Captive: Singleton must not hold Scoped',
      'JWT revoke story; Redis is not the ledger; Kafka is a log',
      'Split on team+data; scale the bottleneck',
    ],
    questions: [
      'IEnumerable vs IQueryable in a repository?',
      'First vs Single for a unique email?',
      'When is AsNoTracking wrong?',
      'Does await create a thread?',
      'Task.Run in a controller — good idea?',
      'What is a captive dependency?',
      'How do you use EF in IHostedService?',
      'How do you revoke a JWT?',
      'RabbitMQ vs Kafka for replay?',
      'Why did HPA make latency worse?',
    ],
    mistakes: [
      'Filter after ToList',
      'Global AsNoTracking then mutate',
      'async for CPU loops / Parallel on request threads',
      'Singleton DbContext',
      'Microservices + one shared database',
    ],
    scenarios: [
      'SaveChanges does nothing after AsNoTracking',
      'Production duplicate emails, First() hid them',
      'Hosted service crashed on disposed context',
      'Fired employee still has a valid 12h JWT',
      '50 new pods, SQL pool timeouts',
    ],
  },
  revisionSummary: `
- LINQ/EF: where the query runs, cardinality contract, tracking vs writes.
- Async: promises vs threads; I/O concurrency vs CPU parallelism; no .Result.
- Language: pick constructs for versioning, semantics, and assignment rules.
- DI: lifetimes are ownership; captives fail in production.
- Tools: revoke, source of truth, log vs queue; scale and split with evidence.
  `,
  summary:
    'Senior trap questions are not definitions — they are failure modes. Answer with the wrong popular line, the precise contract, and the follow-up you expect next.',
};
