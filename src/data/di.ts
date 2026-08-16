export const diData = {
  id: 'di',
  title: 'Dependency Injection Deep Dive',
  description:
    'IoC, lifetimes, captive dependencies, and how a senior designs composition in a large .NET system without turning the container into a service locator.',
  sections: [
    {
      topic: 'IoC vs DI vs DIP, and constructor injection',
      difficulty: 'senior',
      english:
        'Dependency Inversion (DIP) is the SOLID rule: high-level policy depends on abstractions, not on concrete infrastructure. Inversion of Control (IoC) is the broader style: your code does not new up the object graph; a composer does. Dependency Injection (DI) is the technique that implements that inversion by passing dependencies in — usually via the constructor. Constructor injection is the default in ASP.NET Core because required dependencies become unrepresentable as a half-built object; the compiler and the container both fail fast. Trade-off: constructor lists grow, which is a signal the type has too many responsibilities, not a signal to switch to service locator. Failure: new SqlOrderRepository() inside a domain service, which makes the class untestable and hides the lifetime of DbContext. Method injection is for optional or per-call dependencies (CancellationToken). Property injection is for optional framework hooks, not for required services.',
      bangla:
        'DIP নীতি (অ্যাবস্ট্রাকশনে depend), IoC স্টাইল (গ্রাফ নিজে new নয়), DI কৌশল (কনস্ট্রাক্টরে পাস)। কনস্ট্রাক্টর ইনজেকশন ডিফল্ট — সার্ভিস লোকেটর দিয়ে লুকানো new নয়।',
      details: `
### Three terms interviewers treat as synonyms (they are not)

| Term | Kind | One-line |
| :--- | :--- | :--- |
| **DIP** | Principle | Depend on abstractions |
| **IoC** | Style | Control of creation is inverted to a composer |
| **DI** | Technique | Composer supplies dependencies through parameters |

### Constructor injection rules
- All required collaborators are constructor parameters stored in \`readonly\` fields.
- If the constructor has 8 infrastructure types, split the class (SRP), do not inject \`IServiceProvider\`.
- \`CancellationToken\` is a method argument, not a constructor argument — it is per operation.

### When NOT to inject
- Pure functions, DTOs, value objects.
- \`HttpContext\` — use \`IHttpContextAccessor\` sparingly; prefer passing values.
      `,
      code: `public interface IInvoiceCalculator
{
    Money Total(IReadOnlyList<Line> lines);
}

public sealed class InvoiceService(
    IInvoiceCalculator calculator,
    IInvoiceStore store,
    TimeProvider clock)
{
    public async Task<Invoice> IssueAsync(IssueInvoice cmd, CancellationToken ct)
    {
        var total = calculator.Total(cmd.Lines);
        var invoice = new Invoice(cmd.CustomerId, total, clock.GetUtcNow());
        await store.SaveAsync(invoice, ct);
        return invoice;
    }
}

public static class InvoiceRegistration
{
    public static IServiceCollection AddInvoiceModule(this IServiceCollection services)
    {
        services.AddSingleton<IInvoiceCalculator, StandardInvoiceCalculator>();
        services.AddScoped<IInvoiceStore, EfInvoiceStore>();
        services.AddScoped<InvoiceService>();
        return services;
    }
}`,
      commonMistakes: [
        'Calling GetRequiredService inside business methods because the constructor is too long.',
        'Treating DIP as "an interface for every class" including DTOs.',
        'Property injection for required services so the object can exist in an invalid state.',
      ],
      bestPractices: [
        'Composition root (Program.cs / module extensions) is the only place that mentions most concretes.',
        'Prefer constructor injection; use IServiceProvider only in factories and middleware that create scopes.',
        'Inject TimeProvider, not DateTime.UtcNow, when time must be testable.',
      ],
      interviewQs: [
        {
          q: 'Explain IoC vs DI vs DIP without mixing them.',
          a: 'DIP is the design rule: the invoice policy should depend on IInvoiceStore, not on SqlInvoiceStore. IoC means the application does not control the new graph — something outside constructs InvoiceService. DI is how that something passes SqlInvoiceStore into the constructor. You can practice DIP with poor-man DI (new in Main) and never use Microsoft.Extensions.DependencyInjection. You can also use a container and still violate DIP by injecting concretes everywhere. Seniors keep the principle and the mechanism separate so they can explain why a container exists.',
          bangla: 'DIP = অ্যাবস্ট্রাকশনে depend। IoC = গ্রাফ বাইরে তৈরি। DI = কনস্ট্রাক্টরে সেই ডিপেন্ডেন্সি দেওয়া। কন্টেইনার ছাড়াও DIP করা যায়।',
          followUp: 'Can you have DI without an IoC container? When would you?',
          difficulty: 'senior',
        },
        {
          q: 'Why is constructor injection preferred over service locator?',
          a: 'The constructor makes dependencies explicit and required. Tests pass fakes without a container. The class cannot be constructed in an invalid state. Service locator (IServiceProvider.GetService inside the class) hides what the class needs, pushes failures to runtime at a random line, and makes lifetimes easy to get wrong (resolving scoped from root). It also breaks the one composition root story: every class becomes a mini composer. The only legitimate locators are the framework (controllers) and factories that exist to delay or vary creation. Constructor bloat is a design smell to refactor, not a license for locator.',
          bangla: 'কনস্ট্রাক্টর ডিপেন্ডেন্সি স্পষ্ট ও টেস্টেবল রাখে। সার্ভিস লোকেটর রানটাইমে লুকিয়ে ফেলে এবং স্কোপড সার্ভিস রুট থেকে রেজলভ করার ফাঁদ তৈরি করে।',
          followUp: 'Is IHttpContextAccessor a service locator? When is it acceptable?',
          difficulty: 'senior',
        },
        {
          q: 'When would you use method injection instead of constructor injection?',
          a: 'When the dependency varies per call or is optional for that operation. CancellationToken, a user-specific strategy passed into a single method, or an optional formatter are method injection. If every method needs the same store, it belongs in the constructor. Putting IServiceProvider in the constructor and resolving different services per method is not method injection; it is locator. Ambient statics (HttpContext.Current) are the anti-pattern we left behind. Framework examples of method injection include action filters receiving services via context when the filter itself is constructed earlier.',
          bangla: 'প্রতি কলে বদলায় এমন কিছু (CancellationToken, স্ট্র্যাটেজি) মেথড প্যারামিটার। একই স্টোর সব মেথডে লাগলে কনস্ট্রাক্টর।',
          followUp: 'Where does CancellationToken belong in a typical service?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Take a class that news a repository internally. Invert it: interface, constructor injection, module extension method, and a unit test with a fake store.',
    },
    {
      topic: 'Transient, Scoped, Singleton, and captive dependencies',
      difficulty: 'expert',
      english:
        'Transient: a new instance every resolve. Scoped: one instance per scope (in ASP.NET Core, per HTTP request). Singleton: one instance for the process. Captive dependency is the lifetime bug seniors must name: a long-lived object holds a short-lived object. The usual form is Singleton depending on Scoped. The captive instance is reused across requests, so you share DbContext, leak memory, or use a disposed object. Trade-off: Singleton is cheap and dangerous for anything with request state or that is not thread-safe. Transient is safe from capture into Singleton only if the transient is stateless; a transient IDisposable resolved from root can leak until process exit if the container tracks it. Failure: a Singleton cache service that takes DbContext in its constructor — first request may work, the second uses a disposed or dirty context. ValidateOnBuild and ValidateScopes exist to catch this in Development.',
      bangla:
        'Transient প্রতিবার নতুন, Scoped রিকোয়েস্টে এক, Singleton প্রসেসে এক। ক্যাপটিভ ডিপেন্ডেন্সি = সিঙ্গেলটন স্কোপড/শর্ট-লিভড ধরে রাখে। DbContext সিঙ্গেলটনে ধরলে দ্বিতীয় রিকোয়েস্ট ভাঙে।',
      details: `
### Lifetimes

| Lifetime | Instance count | Thread-safety required? | Typical types |
| :--- | :--- | :--- | :--- |
| Transient | Per resolve | No (usually not shared) | Lightweight stateless services |
| Scoped | Per scope / request | Not across requests | \`DbContext\`, unit of work |
| Singleton | Per container | **Yes** | Options, mappers, true caches |

### Captive dependency
- Singleton → Scoped: scoped instance lives forever (or is disposed while still referenced).
- Singleton → Transient disposable: container may hold the transient for app lifetime (leak).
- Scoped → Singleton: fine (the singleton outlives the scope).
- Root provider \`GetService<ScopedThing>()\`: in Development with ValidateScopes this throws.

### Scoped vs Transient (the comparison they always ask)
- Scoped: same instance injected into all services in that request — two repositories share one DbContext and one transaction.
- Transient: new instance each time — two injections in the same request are two objects; fine for stateless helpers, wrong for a unit of work.
      `,
      code: `public sealed class CaptiveBug(AppDbContext db)
{
    public Task<int> CountAsync(CancellationToken ct) => db.Orders.CountAsync(ct);
}

public static class LifetimeDemo
{
    public static void RegisterBadly(IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>(o => o.UseSqlServer("..."));
        services.AddSingleton<CaptiveBug>();
    }

    public static void RegisterCorrectly(IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>(o => o.UseSqlServer("..."));
        services.AddScoped<OrderService>();
        services.AddSingleton<TimeProvider>(TimeProvider.System);
    }
}`,
      commonMistakes: [
        'Registering a service as Singleton because it is faster without asking if it holds request state.',
        'Resolving scoped services from IServiceProvider injected into a Singleton.',
        'Forgetting ValidateScopes and only discovering captive dependencies in production.',
      ],
      bestPractices: [
        'Default to Scoped for anything that touches a request or a DbContext.',
        'Singleton only for thread-safe, stateless, or explicitly shared immutable state.',
        'Enable ValidateOnBuild and ValidateScopes in Development; consider them in Staging.',
      ],
      interviewQs: [
        {
          q: 'Scoped vs Transient — when does the difference actually matter?',
          a: 'It matters when identity of the instance is part of the correctness story. DbContext, an in-memory unit of work, a request-level cache, or a database transaction must be Scoped so every collaborator in that request sees the same tracked entities and the same SaveChanges. Transient would give each repository a different DbContext: entities loaded in A are unknown to B, and you get two connections. Transient is right for a stateless parser or a lightweight calculator with no shared identity. If you inject a Transient into a Singleton, you accidentally make it a Singleton — that is captivity, not a third lifetime. Performance is almost never the reason to pick Transient over Scoped for a cheap object.',
          bangla: 'একই রিকোয়েস্টে একই DbContext/ট্রানজ্যাকশন লাগলে Scoped। স্টেটলেস হেল্পারে Transient। Transient-কে Singleton-এ ঢোকালে সেটাই ক্যাপটিভ সিঙ্গেলটন।',
          followUp: 'What happens if two repositories in one request are Transient and each take DbContext?',
          difficulty: 'senior',
        },
        {
          q: 'What is a captive dependency? Give a production failure.',
          a: 'A captive dependency is when a longer-lived service holds a shorter-lived one. Classic: Singleton OrderCache(AppDbContext db). The context is created when the singleton is first resolved, then reused for the app lifetime. After the original scope disposes, the context is disposed and later requests throw ObjectDisposedException. If it is not disposed, it accumulates tracked entities until memory dies, and it is accessed from many request threads — DbContext is not thread-safe, so you also get races. Another form: Singleton consuming IServiceProvider and resolving Scoped without CreateScope. Development ValidateScopes throws; Production may silently share.',
          bangla: 'লম্বা লাইফটাইম ছোটটাকে ধরে রাখা — Singleton(DbContext)। ডিসপোজড কনটেক্সট, মেমোরি গ্রোথ, মাল্টিথ্রেড রেস। ValidateScopes ডেভে থ্রো করে।',
          followUp: 'How does the container detect this at build time?',
          difficulty: 'expert',
        },
        {
          q: 'Is Transient always safe to inject into Singleton?',
          a: 'Only if the transient is stateless, thread-safe, and not IDisposable in a way the root container will track forever. A Transient that holds a socket or a DbContext is still captive: the singleton keeps that one instance. The container’s tracking of IDisposable transients resolved from the root can pin them until shutdown (memory leak). The safe pattern is: Singleton depends only on other Singletons, or on IServiceScopeFactory to create short scopes. If you need per-call scoped work from a singleton hosted service, factory.CreateScope() every iteration.',
          bangla: 'স্টেটলেস হলে ঠিক। Transient-এর ভিতরে DbContext/সকেট থাকলে তবু ক্যাপটিভ। সিঙ্গেলটন থেকে স্কোপড কাজ করতে IServiceScopeFactory.CreateScope।',
          followUp: 'Why do hosted services need IServiceScopeFactory?',
          difficulty: 'senior',
        },
        {
          q: 'Why might a Transient IDisposable leak?',
          a: 'The built-in container tracks IDisposable instances it creates so it can dispose them with the scope. A Transient resolved from a request scope is disposed at the end of the request. The same Transient resolved from the root provider is tracked by the root and disposed only when the app shuts down. A Singleton that resolves many transients from the root (or a bug that uses app.Services in a loop) accumulates disposables. Scoped IDisposable is disposed with the request, which is why DbContext is Scoped. This is why "just make it Transient" does not fix resource lifetime.',
          bangla: 'রুট প্রোভাইডার থেকে Transient IDisposable রেজলভ করলে অ্যাপ শাটডাউন পর্যন্ত জমে। রিকোয়েস্ট স্কোপে রেজলভ করলে রিকোয়েস্ট শেষে ডিসপোজ।',
          followUp: 'Should your services implement IDisposable just because they have a field?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Enable ValidateScopes, register a Singleton that takes DbContext, and show the exception. Fix it with a Scoped service or IServiceScopeFactory.',
    },
    {
      topic: 'Why DbContext must not be Singleton; Singleton depending on Scoped',
      difficulty: 'expert',
      english:
        'DbContext is a unit of work plus an identity map. It is not thread-safe, it caches tracked entities, it holds a connection, and it is designed to be disposed after a business operation. A Singleton DbContext is shared by every request and every thread: ChangeTracker grows without bound, concurrent SaveChanges races, and a dispose on one path poisons all others. Scoped matches the HTTP request: one unit of work, one SaveChanges, dispose at the end. Singleton depending on Scoped is illegal in the same way: even if DbContext is registered Scoped, the Singleton constructor captures one instance (or the resolve throws with ValidateScopes). Trade-off: context pooling (AddDbContextPool) reuses instances for performance but still gives you a distinct logical context per scope — it is not Singleton. Failure: a background singleton timer that uses the injected request DbContext from the last HTTP request. When NOT to use a new context per repository method either: you lose the unit of work and transaction across repositories.',
      bangla:
        'DbContext ইউনিট অব ওয়ার্ক — থ্রেড-সেফ নয়, ট্র্যাকড এন্টিটি জমায়। সিঙ্গেলটন হলে সব রিকোয়েস্ট শেয়ার করে, রেস ও মেমোরি লিক। Scoped = এক রিকোয়েস্ট, এক SaveChanges।',
      details: `
### Why Singleton DbContext fails

| Mechanism | What goes wrong |
| :--- | :--- |
| Identity map | Entities from tenant A leak into tenant B’s request |
| Change tracker | Unbounded memory; DetectChanges CPU grows |
| Thread safety | Two requests call SaveChanges → undefined |
| Dispose | First scope dispose kills the singleton’s context |
| Connection | Long-lived connection, temp tables, SET options leak |

### Legal ways to use DbContext from a Singleton
- \`IServiceScopeFactory.CreateScope()\` then resolve \`DbContext\` inside \`using\`.
- \`IDbContextFactory<TContext>.CreateDbContext()\` for parallel or long-running work.
- Never store the instance on the singleton field.

### AddDbContext vs AddDbContextPool
- Pooling rents a context, resets it, returns it — still Scoped from the app’s point of view.
- Do not keep pooled contexts across parallel awaits on the same instance.
      `,
      code: `public sealed class OrderProjectionJob(
    IServiceScopeFactory scopes,
    IDbContextFactory<AppDbContext> factory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await using var scope = scopes.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Orders.Where(o => o.IsDirty).ExecuteUpdateAsync(
                s => s.SetProperty(o => o.IsDirty, false),
                stoppingToken);

            await using var parallel = await factory.CreateDbContextAsync(stoppingToken);
            _ = await parallel.Orders.CountAsync(stoppingToken);

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}`,
      commonMistakes: [
        'AddSingleton<AppDbContext>() because we only have one database.',
        'Injecting DbContext into a Singleton cache just for warmup.',
        'Using the same DbContext instance in Task.WhenAll without a factory.',
      ],
      bestPractices: [
        'AddDbContext / AddDbContextPool as Scoped; factory for parallel and workers.',
        'One DbContext per unit of work; do not share across threads.',
        'Hosted services always create a scope (or factory instance) per iteration.',
      ],
      interviewQs: [
        {
          q: 'Why must DbContext not be a Singleton?',
          a: 'Because it is a mutable, non-thread-safe unit of work. Sharing it across requests mixes identity maps (you can return another tenant’s tracked entity), lets ChangeTracker grow forever, and lets two threads call SaveChanges concurrently. Disposal is tied to scope; a singleton outlives that dispose. Connection-level state leaks across requests. The performance instinct — creating a context is expensive — is addressed by pooling, not by Singleton. Interviewers want this as a lifetime + thread-safety + unit-of-work answer, not "Microsoft says so".',
          bangla: 'DbContext মিউটেবল ও নন-থ্রেড-সেফ ইউনিট অব ওয়ার্ক। সিঙ্গেলটন মানে টেনান্ট মিক্স, আনবাউন্ডেড ট্র্যাকিং, কনকারেন্ট SaveChanges। পুলিং সমাধান, সিঙ্গেলটন নয়।',
          followUp: 'Does AsNoTracking make a Singleton context safe? Why not?',
          difficulty: 'expert',
        },
        {
          q: 'A Singleton service needs data from SQL. How do you design it?',
          a: 'Do not inject DbContext. Inject IServiceScopeFactory or IDbContextFactory and open a short-lived context inside the method or timer tick, then drop it. If the data is reference data, load it into an immutable snapshot and swap with Interlocked.Exchange on a refresh loop. If the service is a true cache, use IMemoryCache with a Scoped/Transient loader, not a captured context. For EF, compiled queries plus pooling keep the per-call cost acceptable. The singleton remains thread-safe because it does not hold the context.',
          bangla: 'DbContext ইনজেক্ট নয় — প্রতি কাজে CreateScope বা IDbContextFactory। রেফারেন্স ডাটা হলে immutable snapshot সোয়াপ করুন।',
          followUp: 'Where do you put the refresh loop — in the singleton or a hosted service?',
          difficulty: 'senior',
        },
        {
          q: 'What happens if two parallel tasks share one scoped DbContext in a request?',
          a: 'Undefined behavior: the context is not thread-safe. You can get InvalidOperationException ("A second operation was started on this context"), corrupted tracking, or a torn connection. The request scope does not mean safe to use in WhenAll. Parallel queries need separate contexts from IDbContextFactory, or you must await them sequentially on one context. This is a common bug when someone optimizes a controller with WhenAll on two repository calls that hide the same injected context.',
          bangla: 'এক DbContext দুই প্যারালেল টাস্কে নয় — InvalidOperation বা করাপ্ট ট্র্যাকিং। WhenAll হলে IDbContextFactory দিয়ে আলাদা ইনস্ট্যান্স।',
          followUp: 'Is ExecuteUpdateAsync on one context while another query runs any safer?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Write a BackgroundService that processes dirty orders using CreateAsyncScope each tick. Add a test that resolving DbContext from the host IServiceProvider throws with ValidateScopes.',
    },
    {
      topic: 'IServiceProvider, keyed services, multiple implementations, factories',
      difficulty: 'senior',
      english:
        'IServiceProvider is the resolve API; IServiceScopeFactory creates nested scopes. Injecting IServiceProvider into application services is a smell except at true factories. Multiple implementations of one interface are resolved with IEnumerable<T>: the container injects all registrations in order. That is the standard answer to "how do you resolve multiple implementations". Keyed services (.NET 8+) attach a key to a registration so you can ask for FromKeyedServices("sql") without a custom factory. Factories (Func<T>, IDbContextFactory, typed HttpClient) exist when creation needs runtime data or a shorter lifetime than the consumer. Trade-off: keyed services reduce boilerplate but make keys magic strings unless you use constants. Failure: GetRequiredService<IEnumerable<IHandler>>() then picking with if-else in every caller instead of a composed pipeline. When NOT to use keyed: if a strategy pattern with a single dispatcher is clearer. Never call BuildServiceProvider inside a module — that creates a second container.',
      bangla:
        'একাধিক ইমপ্লিমেন্টেশন = IEnumerable<T> ইনজেক্ট। .NET 8-এ keyed services নাম দিয়ে আলাদা। IServiceProvider বিজনেস ক্লাসে নয়, ফ্যাক্টরিতে।',
      details: `
### Resolving multiple implementations

| Need | Mechanism |
| :--- | :--- |
| All handlers (pipeline) | \`IEnumerable<IHandler>\` |
| One of many by name at runtime | Keyed services, or \`IEnumerable\` + metadata |
| One of many by generic | Open generics \`IHandler<T>\` |
| Different HttpClients | Named/typed \`IHttpClientFactory\` |
| Conditional at startup | Register only the implementation for that environment |

### Keyed services (.NET 8+)
- \`services.AddKeyedSingleton<ICache, RedisCache>("redis")\`
- Consume with \`[FromKeyedServices("redis")] ICache cache\`
- Keys should be constants; typos fail at runtime unless tests cover resolve.

### Factories
- \`IServiceScopeFactory\` for nested scopes.
- Do not use \`BuildServiceProvider()\` inside a module — second container, duplicate singletons.
      `,
      code: `public interface ITaxStrategy
{
    string Country { get; }
    Money Apply(Money net);
}

public sealed class TaxDispatcher(IEnumerable<ITaxStrategy> strategies)
{
    public Money Apply(string country, Money net)
    {
        var strategy = strategies.FirstOrDefault(s => s.Country == country)
            ?? throw new InvalidOperationException($"No tax strategy for {country}");
        return strategy.Apply(net);
    }
}

public static class TaxRegistration
{
    public static IServiceCollection AddTaxes(this IServiceCollection services)
    {
        services.AddSingleton<ITaxStrategy, BdTaxStrategy>();
        services.AddSingleton<ITaxStrategy, UsTaxStrategy>();
        services.AddSingleton<TaxDispatcher>();
        services.AddKeyedSingleton<ICache, MemoryCacheAdapter>("memory");
        services.AddKeyedSingleton<ICache, RedisCacheAdapter>("redis");
        return services;
    }
}

public sealed class CheckoutService([FromKeyedServices("redis")] ICache cache, TaxDispatcher tax)
{
    public Money Quote(string country, Money net) => tax.Apply(country, net);
}`,
      commonMistakes: [
        'Calling BuildServiceProvider() in a library registration, duplicating singletons.',
        'Switching on strings in every controller instead of IEnumerable<T> + dispatcher.',
        'Injecting a single T and expecting all registrations — you only get the last one.',
      ],
      bestPractices: [
        'Resolve many with IEnumerable<T> and a single dispatcher at the boundary.',
        'Use keyed services when the key is a stable infrastructure choice (redis vs memory).',
        'Typed HttpClient and IDbContextFactory over manual new.',
      ],
      interviewQs: [
        {
          q: 'How do you resolve multiple implementations of the same interface?',
          a: 'Register each implementation with AddTransient/Scoped/Singleton against the same interface. Inject IEnumerable<ITaxStrategy> — the built-in container supplies all of them; last registration does not replace the others when you resolve the enumerable. A dispatcher picks by metadata (country, message type) or you run all as a pipeline. If you inject a single ITaxStrategy, you get the last registered one only. .NET 8 keyed services are for when the caller already knows the key (redis vs memory) rather than scanning. Decorators can be registered by wrapping in a factory. This is a standard senior question; the keyword they want is IEnumerable<T>.',
          bangla: 'একই ইন্টারফেসে একাধিক Add* করুন, IEnumerable<T> ইনজেক্ট করুন — সব ইনস্ট্যান্স পাবেন। সিঙ্গেল T ইনজেক্ট করলে শেষ রেজিস্ট্রেশন।',
          followUp: 'What if you need them in a specific order?',
          difficulty: 'senior',
        },
        {
          q: 'When do keyed services beat IEnumerable + filter?',
          a: 'When the consumer knows the identity up front and you do not want to construct every implementation. A Redis cache vs memory cache should not both be created just so you can filter. Keyed resolve is O(1) by key and expresses intent in the constructor. IEnumerable is better for open-ended plugins (all tax rules, all validators) where the set is the design. Avoid keyed for business strategies that change per user — that is data, not a DI key. Mixing is fine: a keyed factory that itself uses IEnumerable internally.',
          bangla: 'কনজিউমার আগে থেকে জানে (redis vs memory) → keyed, সব ইনস্ট্যান্স তৈরি নয়। প্লাগইন সেট (সব ট্যাক্স রুল) → IEnumerable।',
          followUp: 'How do you test a class that uses FromKeyedServices?',
          difficulty: 'mid',
        },
        {
          q: 'Why is BuildServiceProvider inside AddMyModule a bug?',
          a: 'It builds a second container from a snapshot of IServiceCollection that may be incomplete (later registrations missing) and that has its own singleton instances. Options, IHttpClientFactory, and hosted services then exist twice. Captive dependencies become undiagnosable. The method should only add descriptors to IServiceCollection. If you need to resolve something at startup, do it after the host is built, on the real provider, once. This bug shows up as "my singleton is not the same instance" and as duplicate hosted service loops.',
          bangla: 'BuildServiceProvider দ্বিতীয় কন্টেইনার বানায় — সিঙ্গেলটন দুইবার, Options আলাদা। রেজিস্ট্রেশন মেথড শুধু Add করবে, রেজলভ নয়।',
          followUp: 'Where is the correct place to run one-time startup resolution?',
          difficulty: 'expert',
        },
        {
          q: 'How do you register a factory that needs runtime data (tenant id)?',
          a: 'You cannot put tenant id in the constructor of a Singleton. Pass tenant on the method, or resolve a Scoped ITenantContext populated by middleware, or use a factory method Create(tenantId) that is not itself a long-lived captured context. IHttpClientFactory named clients can vary by name, not by arbitrary runtime strings unless you use a typed handler. For EF, a scoped interceptor reads ITenantContext. If you try to resolve a new service graph per tenant as Singleton dictionaries of providers, you have reinvented a container inside a container — usually wrong.',
          bangla: 'টেন্যান্ট আইডি সিঙ্গেলটন কনস্ট্রাক্টরে নয় — মেথডে পাস বা Scoped ITenantContext (মিডলওয়্যার সেট করে)। টেন্যান্টপ্রতি আলাদা কন্টেইনার সাধারণত ভুল।',
          followUp: 'How should multi-tenant DbContext get the connection string?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Register three INotificationSender implementations, inject IEnumerable<INotificationSender> into a dispatcher, and add a keyed ICache for redis used by one service.',
    },
    {
      topic: 'Designing DI for a large enterprise app',
      difficulty: 'expert',
      english:
        'A large solution does not put 400 AddX calls in Program.cs. Each bounded context owns an AddOrdersModule(IServiceCollection, IConfiguration) extension that registers only its services, and the host composes modules. Lifetimes are a published convention: DbContext scoped, domain services scoped, true stateless domain logic singleton, hosted workers use factories. Avoid circular constructor graphs; they are usually SRP violations. Feature flags swap implementations at registration time, not with if (flag) GetService inside methods. Trade-off: too many interfaces slow navigation; too few concretes couple tests to SQL. Failure: a God composition project that references every assembly, or the opposite — service locator in each microservice copy-pasted. Seniors also plan for tests: a test host that replaces IClock and IBus, and integration tests that use the real container with ValidateScopes. When NOT to add another lifetime or a custom container: the built-in one is enough until you need decorate-by-convention at scale, and even then Scrutor-style registration is simpler than a new IoC product.',
      bangla:
        'বড় অ্যাপে প্রতি বাউন্ডেড কনটেক্সটের AddXxxModule। কনভেনশন: DbContext scoped, স্টেটলেস সিঙ্গেলটন, ওয়ার্কারে ফ্যাক্টরি। Program.cs-এ ৪০০টা Add নয়, সার্ভিস লোকেটরও নয়।',
      details: `
### Composition rules for a large codebase

| Rule | Why |
| :--- | :--- |
| One composition root per process | Avoid duplicate containers |
| Module extension methods | Keep Program.cs readable; enforce boundaries |
| No reference from Domain to DI package | Domain stays testable |
| Replace in tests via \`ConfigureTestServices\` | Do not fork production registrations |
| ValidateScopes on in non-prod | Catch captives before production |
| Explicit lifetimes in code review | "Just Singleton" is a defect |

### Growth pains
- Circular dependencies: extract an interface, or use events/mediator for cross-feature calls.
- Slow startup: profile before replacing the container.
- Multi-host (API + worker): share AddApplication() but not web-only services.

### When NOT to use DI
- Newing a \`List<T>\` or a DTO. A 5-line script. A static helper that is truly pure.
      `,
      code: `public static class CatalogModule
{
    public static IHostApplicationBuilder AddCatalog(this IHostApplicationBuilder builder)
    {
        builder.Services.AddDbContextPool<CatalogDbContext>(o =>
            o.UseSqlServer(builder.Configuration.GetConnectionString("Catalog")));

        builder.Services.AddScoped<IProductReadStore, ProductReadStore>();
        builder.Services.AddScoped<ProductAppService>();
        builder.Services.AddSingleton<ISkuNormalizer, SkuNormalizer>();
        builder.Services.AddHostedService<CatalogIndexHostedService>();
        return builder;
    }
}

public static class CatalogTestHost
{
    public static void ReplaceClock(IServiceCollection services) =>
        services.AddSingleton<TimeProvider>(new FakeTimeProvider());
}`,
      commonMistakes: [
        'A shared Infrastructure registration dump that every feature depends on, recreating a monolith inside DI.',
        'Using Autofac because of one decorator, then losing ValidateScopes discipline.',
        'Registering MVC controllers as Singleton to save allocations.',
      ],
      bestPractices: [
        'Bounded-context module methods; Program.cs only calls AddX().',
        'Document lifetime conventions and enforce them in review.',
        'Integration tests boot the real host with ValidateOnBuild.',
      ],
      interviewQs: [
        {
          q: 'How do you structure DI registration in a solution with 20 projects?',
          a: 'Each deployable has one composition root. Each bounded context project exposes AddContext(IServiceCollection) and does not resolve services. The API host calls AddOrders().AddBilling().AddIdentity(). Shared kernel registers only truly shared abstractions (TimeProvider, IIdGenerator). Workers call the same AddApplication() minus MVC. I do not create a mega Infrastructure.DI project that references everything — that becomes an implicit monolith and circular-reference magnet. Tests use WebApplicationFactory and replace a few singletons. This keeps lifetimes local to the people who own the context.',
          bangla: 'প্রতি প্রসেসে এক কম্পোজিশন রুট, প্রতি কনটেক্সটে AddXxxModule। সব প্রজেক্ট রেফার করে এমন mega DI প্রজেক্ট বানাবেন না।',
          followUp: 'How do you stop Feature A from resolving Feature B’s internal repository?',
          difficulty: 'expert',
        },
        {
          q: 'When would you replace the built-in container?',
          a: 'When you have a demonstrated need: convention-based decorator chains across many types, property injection for a legacy library you cannot change, or child containers with semantics the built-in provider lacks. Cost: another mental model, worse integration with generic host, easy to lose scope validation. For most enterprise ASP.NET Core apps, IEnumerable, keyed services, and a factory delegate are enough. We used Autofac at my last job is not a need. If you switch, keep the composition root thin and still think in Microsoft lifetimes.',
          bangla: 'প্রমাণিত প্রয়োজন ছাড়া Autofac নয় — ডেকোরেটর কনভেনশন বা লেগাসি property injection। বেশিরভাগ অ্যাপে বিল্ট-ইন + keyed যথেষ্ট।',
          followUp: 'What built-in feature replaced the most common Autofac use case in .NET 8?',
          difficulty: 'senior',
        },
        {
          q: 'How do you keep DI testable without mocking the container in every unit test?',
          a: 'Unit tests new the class and pass fakes through the constructor — no container. Integration tests use the real container via WebApplicationFactory, replacing only I/O boundaries. If a class cannot be constructed without a container, it is using locator and should be refactored. Snapshot tests of GetServices<IHostedService>() catch duplicate registrations. I avoid mocking IServiceProvider. The container is an implementation detail of the composition root, not of the domain.',
          bangla: 'ইউনিট টেস্টে new + ফেক, কন্টেইনার নয়। ইন্টিগ্রেশন টেস্টে WebApplicationFactory। IServiceProvider মক করা মানে ক্লাসটা লোকেটর ব্যবহার করছে।',
          followUp: 'What would you replace in ConfigureTestServices for a billing test?',
          difficulty: 'senior',
        },
        {
          q: 'Controllers as Singleton — why is that a disaster?',
          a: 'Controller instances would be shared across requests. Any field becomes cross-request state (races, leaked user data). Injected Scoped services would be captive. Filters and model binding assume per-request instances. The allocation of a controller is negligible next to IO. This is the same class of bug as Singleton DbContext, applied to the MVC layer. Keep controllers Transient (the default). Minimal API handlers that close over scoped services captured at startup have the same smell.',
          bangla: 'সিঙ্গেলটন কন্ট্রোলার রিকোয়েস্টজুড়ে ফিল্ড শেয়ার করে, স্কোপড সার্ভিস ক্যাপটিভ হয়। ডিফল্ট Transient-ই সঠিক।',
          followUp: 'Are minimal API endpoint handlers captured as singletons? What must they not close over?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Split a 200-line Program.cs into two module extensions (Catalog, Billing) with documented lifetimes, and add a WebApplicationFactory test that asserts ValidateOnBuild succeeds.',
    },
  ],
  quickRevision: {
    concepts: [
      'DIP principle vs IoC style vs DI technique',
      'Constructor injection is the default; locator is a smell',
      'Transient = per resolve; Scoped = per request; Singleton = per process',
      'Captive dependency: long-lived holds short-lived',
      'Scoped vs Transient: identity of DbContext/unit of work',
      'DbContext is not thread-safe and must not be Singleton',
      'Hosted services use IServiceScopeFactory / IDbContextFactory',
      'Multiple implementations: IEnumerable<T>',
      'Keyed services for known infrastructure keys (.NET 8+)',
      'One composition root; module AddX methods; no BuildServiceProvider in modules',
    ],
    questions: [
      'IoC vs DI vs DIP?',
      'Scoped vs Transient — when does it matter?',
      'What is a captive dependency?',
      'Why must DbContext not be Singleton?',
      'How do you resolve multiple implementations?',
      'When do you use keyed services vs IEnumerable?',
      'Why is BuildServiceProvider in AddModule a bug?',
      'How does a Singleton hosted service talk to SQL?',
      'Can two tasks share one scoped DbContext?',
      'How do you structure DI across 20 projects?',
    ],
    mistakes: [
      'Singleton depending on DbContext / Scoped',
      'Service locator to hide constructor bloat',
      'BuildServiceProvider inside registration',
      'Parallel WhenAll on one DbContext',
      'Controllers or DbContext registered Singleton for performance',
    ],
    scenarios: [
      'ObjectDisposedException on DbContext after the first request',
      'Two repositories in one request do not see each other’s tracked entities',
      'Background timer uses a disposed context',
      'Duplicate hosted service after a module called BuildServiceProvider',
      'Need redis vs memory cache without constructing both',
    ],
  },
  revisionSummary: `
- DIP is the rule, DI is the mechanism, constructor injection is the default. IEnumerable<T> resolves many implementations; keyed services pick one by name.
- Lifetimes are correctness: Scoped for unit of work, Singleton only if thread-safe. Captive dependency (Singleton → Scoped/DbContext) is the classic production failure.
- Large apps: module registration, one composition root, factories for workers — never a second container or a locator in domain classes.
  `,
  summary:
    'Senior DI is lifetime design: who owns the instance, how long it lives, and whether it can be shared — not memorizing AddTransient syntax.',
};
