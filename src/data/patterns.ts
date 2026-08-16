export const patternsData = {
  id: 'patterns',
  title: 'Design Patterns for Senior .NET',
  description:
    'GoF patterns as production decisions in C#: the problem, the bad design, the modern solution, when NOT to use them, and how they fail at 2am.',
  sections: [
    {
      topic: 'Creational Patterns',
      difficulty: 'senior',
      english:
        'Creational patterns exist because new is a design decision. Uncontrolled construction couples callers to concrete types, hides lifetime, and makes tests lie. A senior names the construction problem first, then picks Singleton, Factory, Abstract Factory, Builder, or Prototype — and can say when each is ceremony.',
      bangla:
        'ক্রিয়েশনাল প্যাটার্ন মানে অবজেক্ট তৈরির নিয়ন্ত্রণ। সমস্যা না বুঝে Singleton/Factory লাগালে সেটা ওভারইঞ্জিনিয়ারিং। কখন ব্যবহার করবেন না — এটাই সিনিয়র প্রশ্ন।',
      details: `
### The shared problem
Call sites that \`new\` concrete types cannot be tested, cannot swap implementations, and cannot control lifetime (scoped DbContext vs process-wide cache). The bad design is a god constructor or a static \`GetInstance()\` that everyone reaches into.

### Singleton
**Problem:** expensive shared resource (memory cache, feature-flag snapshot). **Bad design:** \`public static readonly Foo Instance = new()\` plus mutable state. **C# solution:** register as DI Singleton, or \`Lazy<T>\` if you truly need a process-wide instance without a container.

**When NOT:** anything with a Scoped dependency (DbContext). **Production failure:** captive dependency — Singleton holds a disposed Scoped context; later requests throw \`ObjectDisposedException\` or leak connections.

### Factory Method / Simple Factory
**Problem:** caller should not know which concrete type to build (payment gateway by country). **Bad design:** \`if (type == "A") new A()\` copied in 12 controllers. **Solution:** one factory (or keyed DI) that returns an interface.

**When NOT:** there is only one implementation. **Failure:** factory that takes \`string type\` and becomes an untyped service locator.

### Abstract Factory
**Problem:** objects that must be created together (SQL repository + SQL lock vs Redis family). **When NOT:** you only ever have one stack — then you paid for a matrix of types.

### Builder
**Problem:** 8 optional parameters, invalid combinations. **Bad design:** constructor with 12 overloads. **Solution:** fluent builder that validates in \`Build()\`, or a required-property record.

**When NOT:** a DTO with 3 required fields. **Failure:** builder that emits half-initialized objects because \`Build()\` does not validate.

### Prototype
**Problem:** object graph is expensive to build. **Solution:** prefer \`Clone()\` that documents depth, or \`record with { }\`. **When NOT:** mutable shared children — shallow clone then two threads mutate the same list. **Failure:** "copy" that still shares a \`DbContext\`.
      `,
      commonMistakes: [
        'Implementing GoF Singleton (static Instance) inside ASP.NET Core instead of DI Singleton.',
        'Injecting Scoped services into a Singleton (captive dependency).',
        'Factory that returns concrete classes, so callers still switch on type.',
        'Builder that skips invariant checks in Build().',
        'Shallow Prototype clone of a graph that contains mutable collections.',
      ],
      bestPractices: [
        'Prefer the DI container as the composition root.',
        'Make factories return interfaces; register lifetimes explicitly.',
        'Use Lazy<T> or immutable snapshots for true process-wide state.',
        'Validate Builder output; prefer records for simple immutable data.',
        'Document clone depth. Prefer immutable records over ICloneable.',
      ],
      interviewQs: [
        {
          q: 'How do you implement a thread-safe Singleton in modern .NET, and when would you refuse to use one?',
          a: 'I would not write a classic locked GetInstance. I register the type as Singleton in the container, or use Lazy<T> if there is no container. I refuse Singleton when the type needs per-request data, holds DbContext, or is mutated by every request — that is a disguised global variable. The production failure is a captive dependency: the singleton outlives the scoped service and uses a disposed context.',
          bangla: 'DI Singleton বা Lazy<T> ব্যবহার করব। DbContext বা per-request স্টেট থাকলে Singleton নিষেধ — captive dependency-তে disposed context ধরে রাখে।',
          followUp: 'Show how a static Singleton plus a scoped EF Core context fails under concurrent requests.',
          difficulty: 'senior',
        },
        {
          q: 'Factory vs Abstract Factory — when is the extra type family worth it?',
          a: 'Factory Method/simple factory picks one product. Abstract Factory picks a consistent family (storage + outbox + lock that all talk to SQL, vs all talk to Redis). It is worth it when swapping the family is a real deployment axis. It is not worth it when you have one database and one cache. Keyed DI in .NET 8 often replaces hand-rolled factories.',
          bangla: 'একটা প্রোডাক্ট = Factory। একসাথে মিল রাখা পরিবার = Abstract Factory। একটি স্ট্যাক থাকলে Abstract Factory ওভারকিল; keyed DI যথেষ্ট।',
          followUp: 'How would you register two payment gateway families in .NET 8 without a custom factory class?',
          difficulty: 'senior',
        },
        {
          q: 'When is Builder the wrong tool compared to a record constructor?',
          a: 'Builder pays for itself when construction has stages, optional clusters of options, or cross-field invariants. For a command with three required fields, a positional record is clearer. Production failure of a sloppy builder: APIs that accept a half-built object and persist invalid aggregates.',
          bangla: 'জটিল invariant আর অপশনাল ক্লাস্টার থাকলে Builder। তিনটা required ফিল্ডে record constructor-ই যথেষ্ট।',
          followUp: 'How do you make Build() fail fast without throwing from every fluent method?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Replace a static Logger.Instance that new-s a DbContext with DI lifetimes. Write a failing test that proves a Singleton cannot safely consume a Scoped context.',
      code: `public sealed class GatewayFactory(IEnumerable<IPaymentGateway> gateways) : IGatewayFactory
{
    public IPaymentGateway Create(string country) =>
        gateways.FirstOrDefault(g => g.Supports(country))
        ?? throw new InvalidOperationException($"No gateway for {country}");
}

public sealed class FeatureSnapshot
{
    private static readonly Lazy<FeatureSnapshot> Cache =
        new(() => new FeatureSnapshot(), LazyThreadSafetyMode.ExecutionAndPublication);
    public static FeatureSnapshot Instance => Cache.Value;
    private FeatureSnapshot() { }
}

public sealed class ReportBuilder
{
    private string? _title;
    public ReportBuilder WithTitle(string title) { _title = title; return this; }
    public Report Build() =>
        string.IsNullOrWhiteSpace(_title)
            ? throw new InvalidOperationException("Title required")
            : new Report(_title);
}`,
    },
    {
      topic: 'Structural Patterns',
      difficulty: 'senior',
      english:
        'Structural patterns change how types are composed without changing the business algorithm. Adapter makes foreign APIs look like yours. Decorator adds behavior at the edges. Facade hides a subsystem. Proxy controls access or lifetime. Composite treats a tree as one object. Seniors pick composition over inheritance and know the failure mode of each wrapper.',
      bangla:
        'স্ট্রাকচারাল প্যাটার্ন অবজেক্টকে মোড়ানো বা মিলিয়ে API ঠিক করে। Decorator vs inheritance, Proxy-র serialization বাগ, Facade যে গড-ক্লাস হয়ে যায় — এগুলোই ইন্টারভিউতে কাটে।',
      details: `
### Adapter
**Problem:** you do not own StripeClient but your domain speaks IPaymentPort. **Bad design:** Stripe types leak into Application/Domain. **Solution:** an adapter in Infrastructure that implements your port.

**When NOT:** you own both sides — change the interface. **Failure:** adapter that maps exceptions poorly, so domain catches StripeException.

### Decorator
**Problem:** add retry, metrics, or caching around IOrderRepository without editing it. **Bad design:** LoggedCachedRetryOrderRepository inheritance pile. **Solution:** decorate the interface; DI can chain them. ASP.NET middleware and DelegatingHandler are decorators on a pipeline.

**When NOT:** 6 decorators whose order is load-bearing (auth after caching = cache poisoning). **Failure:** decorator that swallows exceptions or double-disposes HttpResponseMessage.

### Facade
**Problem:** checkout needs inventory, pricing, tax, and payment. **Solution:** a narrow application service/facade.

**When NOT:** the facade becomes the new monolith — 40 methods. That is a god class.

### Proxy
**Problem:** control access, delay cost, or stand in for a remote object. EF Core lazy-loading proxies subclass your entity. **When NOT:** you serialize entities and get proxy types, or lazy load after the context is disposed (ObjectDisposedException / hidden N+1).

### Composite
**Problem:** a menu or rule tree should share one Execute(). **When NOT:** the structure is a flat list. **Failure:** stack overflow on cyclic graphs that were never validated.
      `,
      commonMistakes: [
        'Inheritance instead of Decorator, so you cannot compose retry + cache independently.',
        'Facade that grows into a god service with every use case.',
        'EF lazy-loading proxies enabled, then serializing entities or querying after Dispose.',
        'Adapter in the domain layer, pulling vendor SDKs inward.',
        'Decorator order undefined, so caching wraps authorization.',
      ],
      bestPractices: [
        'Keep ports in the inside; adapters live in Infrastructure.',
        'Register decorator chains explicitly; document order (auth → cache → impl).',
        'Prefer composition: wrap IFoo, do not subclass Foo.',
        'Disable EF proxies unless you have a measured reason; use explicit Include.',
        'Facades should be use-case sized, not IEverythingService.',
      ],
      interviewQs: [
        {
          q: 'Decorator vs inheritance for cross-cutting concerns in ASP.NET Core — which do you choose and why?',
          a: 'Decorator (or middleware / DelegatingHandler) composes behaviors independently and keeps the original class closed for modification. Inheritance forces a single linear hierarchy. Production failure of inheritance: a subclass that overrides Save and forgets to call base, dropping audit. Decorator failure: wrong order — cache before auth serves another user\'s response.',
          bangla: 'ক্রস-কাটিং-এ Decorator/middleware — inheritance হায়ারার্কি লক করে। অর্ডার ভুল হলে ক্যাশে অথরাইজেশনের আগে বসে যায়।',
          followUp: 'How would you register a decorating IDistributedCache that adds metrics without a third-party library?',
          difficulty: 'senior',
        },
        {
          q: 'Where does Adapter belong in Clean Architecture, and what leaks if you get it wrong?',
          a: 'The adapter implements an application/domain port and lives in Infrastructure. If you put Stripe types on the port, the inner layers compile against a vendor — you cannot test without Stripe, and upgrading the SDK becomes a domain change. Exception types and DTOs leak until every handler has a using Stripe.',
          bangla: 'Adapter অবশ্যই Infrastructure-এ, পোর্ট ডোমেইনে। ভেন্ডর টাইপ পোর্টে ঢুকলে ইনার লেয়ার SDK-র ওপর নির্ভর করে।',
          followUp: 'How do you map vendor errors to domain errors without losing trace ids?',
          difficulty: 'senior',
        },
        {
          q: 'When are EF Core proxies a Proxy pattern you should turn off?',
          a: 'Lazy-loading proxies are virtual proxies: they intercept property access to load related data. They fail in production when the DbContext is gone (background mapper, serializer) or when they hide N+1 queries. I turn them off by default, use explicit Include/projections, and never return proxy entities from an API.',
          bangla: 'EF proxy লেজি লোড করে — context dispose হলে বা API-তে serialize করলে ভাঙে, N+1 লুকিয়ে রাখে। ডিফল্টে বন্ধ রাখি।',
          followUp: 'What is the difference between a remote proxy and a protection proxy in a .NET API?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Wrap IUserRepository with a caching decorator and an audit decorator. Prove via a test that swapping registration order changes whether unauthorized reads hit the cache.',
      code: `public sealed class CachingUserRepository(IUserRepository inner, IMemoryCache cache) : IUserRepository
{
    public async Task<User?> GetAsync(UserId id, CancellationToken ct)
    {
        var key = $"user:{id}";
        if (cache.TryGetValue(key, out User? cached)) return cached;
        var user = await inner.GetAsync(id, ct);
        if (user is not null) cache.Set(key, user, TimeSpan.FromMinutes(2));
        return user;
    }
}

public sealed class StripePaymentAdapter(StripeClient client) : IPaymentPort
{
    public async Task CaptureAsync(OrderId id, Money amount, CancellationToken ct) =>
        await client.CaptureAsync(id.Value, amount.Cents, ct);
}`,
    },
    {
      topic: 'Behavioral Patterns',
      difficulty: 'senior',
      english:
        'Behavioral patterns are about who knows whom and when work runs. Strategy replaces if/else families. Observer pushes change. Chain of Responsibility is the ASP.NET pipeline. Command turns intent into an object. Mediator stops every object talking to every other object. Template Method freezes an algorithm skeleton. State makes transitions explicit. Seniors also know the memory leak, the god mediator, and the class explosion.',
      bangla:
        'বিহেভিয়ারাল প্যাটার্ন কন্ট্রোল ফ্লো বদলায়। Strategy, Observer-এর leak, MediatR vs in-process, middleware-ই Chain of Responsibility — সিনিয়র এগুলোর ফেইলিউর মোড বলে।',
      details: `
### Strategy
**Problem:** shipping cost rules differ by carrier. **Bad design:** switch (carrier) in a 400-line service. **Solution:** IShippingStrategy selected by factory or keyed DI. **When NOT:** two branches that have not changed in three years. **Failure:** strategy that still calls a shared god service.

### Observer
**Problem:** many listeners need "order placed". **Bad design:** OrderService new-s EmailService, SmsService, SearchIndexer. **Solution:** domain events, event, IObservable, or MediatR notifications.

**When NOT / failure:** C# events without unsubscribe = memory leak (handler captures HttpContext). Sync observers on the request thread make checkout wait for SMTP. Never do I/O in an observer without an outbox or queue.

### Chain of Responsibility
ASP.NET Core middleware **is** CoR. Exception handler must run early; authentication before authorization.

**When NOT:** business rules hidden in a 12-step chain. **Failure:** middleware order wrong — CORS after auth, or exception handler registered too late.

### Command
**Problem:** queue, audit, or undo an action. **Solution:** an immutable command object + handler. MediatR IRequest is Command/Query.

**When NOT:** every 3-line method becomes GetUserByIdQuery. **Failure:** command that is not idempotent, retried by a bus, double-charges a card.

### Mediator
**Problem:** N services call N others. **Solution:** in-process mediator so colleagues talk through one hub. **When NOT:** the mediator is a pass-through to one service.

### Template Method
Abstract class defines steps; subclasses fill gaps. **When NOT:** you need to reuse steps independently — Strategy/composition is more C#-idiomatic. **Failure:** subclasses that skip base.Step() and break the invariant.

### State
**Problem:** order Placed → Paid → Shipped with illegal transitions. **Bad design:** booleans IsPaid && !IsShipped. **Solution:** explicit state type or a real state machine.

**When NOT:** a flag with two values. **Failure:** two servers apply transitions without concurrency control — lost update ships an unpaid order. Use rowversion / expected-state UPDATE.
      `,
      commonMistakes: [
        'C# events that capture scoped services and never unsubscribe.',
        'Doing SMTP/HTTP inside an observer on the request thread.',
        'MediatR handler that is a 1-line wrapper around a service.',
        'Commands without idempotency keys on a retried bus.',
        'State transitions without optimistic concurrency.',
      ],
      bestPractices: [
        'Prefer domain events + outbox over in-process Observer for anything that can fail or must not be lost.',
        'Keep Strategy objects pure; select them in the composition root.',
        'Treat middleware order as a reviewed contract.',
        'Commands: immutable, named after intent, idempotent at the handler.',
        'Encode illegal states as unrepresentable, not as boolean soup.',
      ],
      interviewQs: [
        {
          q: 'ASP.NET Core middleware is which pattern, and what production bug does wrong order cause?',
          a: 'Chain of Responsibility. Each middleware can handle, pass, or short-circuit. Wrong order is a class of security bugs: UseAuthentication after UseAuthorization, exception handling after the endpoint so 500s leak stack traces, CORS after auth so browsers never get the header. I treat the pipeline as a reviewed artifact and test it with WebApplicationFactory.',
          bangla: 'Middleware = Chain of Responsibility। অর্ডার ভুল হলে অথ, CORS, exception handler — সব প্রোডাকশন বাগ। পাইপলাইন রিভিউ করতে হয়।',
          followUp: 'Where must UseExceptionHandler sit relative to routing?',
          difficulty: 'senior',
        },
        {
          q: 'How do you implement Observer in .NET without leaking memory or losing emails?',
          a: 'In-process events are fine for in-memory reactions that cannot fail critically. For email/search I raise a domain event, persist it in an outbox in the same transaction as the aggregate, and a background dispatcher publishes. That survives process crash. I never subscribe a lambda that captures a scoped DbContext on a static event.',
          bangla: 'ইমেইল/সার্চ = domain event + outbox, রিকোয়েস্ট থ্রেডে SMTP নয়। Static event-এ scoped DbContext ক্যাপচার করলে মেমরি লিক।',
          followUp: 'What happens if the observer throws after SaveChanges succeeded?',
          difficulty: 'expert',
        },
        {
          q: 'Command vs Mediator — are they the same because of MediatR?',
          a: 'No. Command is an object representing intent. Mediator is a routing hub so senders do not know handlers. MediatR implements both: IRequest is Command/Query, IMediator is the hub. You can have commands without a mediator (a method on an application service). The interview trap is treating "we use MediatR" as an architecture.',
          bangla: 'Command = ইনটেন্ট অবজেক্ট। Mediator = রাউটিং হাব। MediatR দুটোই দেয়, কিন্তু MediatR ব্যবহার করা মানে আর্কিটেকচার নয়।',
          followUp: 'When does a Command handler need a Unit of Work besides DbContext.SaveChanges?',
          difficulty: 'senior',
        },
        {
          q: 'When is Template Method a smell in modern C#?',
          a: 'When subclasses only exist to swap one step — that is Strategy with extra inheritance. Template Method still fits a fixed algorithm with a few hooks (file import: open → parse → validate → save). If hooks multiply or callers need to reorder steps, composition wins. Production smell: abstract base in a shared library that every service must inherit.',
          bangla: 'একটা স্টেপ বদলাতে abstract base = Strategy-ই ভালো। ধাপের ক্রম বদলাতে হলে composition। শেয়ার্ড abstract base সার্ভিস লক করে।',
          followUp: 'Rewrite a Template Method import pipeline as Strategy + orchestrator.',
          difficulty: 'mid',
        },
      ],
      practice:
        'Model Order states so Paid→Shipped is legal and Shipped→Paid throws a domain exception. Add a rowversion check on transition.',
      code: `public interface IShippingStrategy { Money Quote(Shipment s); }

public sealed class Checkout(IShippingStrategy shipping)
{
    public Money Total(Cart cart, Shipment s) => cart.Subtotal + shipping.Quote(s);
}

public abstract class ImportTemplate
{
    public async Task RunAsync(Stream input, CancellationToken ct)
    {
        var rows = Parse(input);
        Validate(rows);
        await SaveAsync(rows, ct);
    }
    protected abstract IReadOnlyList<Row> Parse(Stream input);
    protected virtual void Validate(IReadOnlyList<Row> rows) { }
    protected abstract Task SaveAsync(IReadOnlyList<Row> rows, CancellationToken ct);
}

public sealed class Order
{
    public OrderStatus Status { get; private set; }
    public void Ship()
    {
        if (Status != OrderStatus.Paid) throw new InvalidOperationException("Pay first");
        Status = OrderStatus.Shipped;
    }
}`,
    },
    {
      topic: 'Pattern Selection and Overengineering',
      difficulty: 'expert',
      english:
        'A senior does not collect patterns; they buy indirection only when a real axis of change or a real test seam exists. The interview is: how you choose, MediatR vs a direct method call, decorator vs inheritance, and how to stop a team from turning a CRUD app into a pattern zoo.',
      bangla:
        'সিনিয়র প্যাটার্ন জমা করে না — পরিবর্তনের অক্ষ আর টেস্ট সিম থাকলেই ইনডাইরেকশন কেনে। MediatR vs সরাসরি কল, Decorator vs inheritance, কখন প্যাটার্ন ওভারইঞ্জিনিয়ারিং।',
      details: `
### How a senior chooses
1. Name the pain: untestable construction, exploding switches, vendor leak, illegal states, N-to-N coupling.
2. Name the axis of change: "we will add gateways" vs "we might someday".
3. Pick the smallest pattern that removes that pain.
4. Write the when-NOT sentence in the PR.
5. If the alternative is a function and a test, do not add a library.

### MediatR vs in-process call
**MediatR pays** when you have many handlers and pipeline behaviors (validation, logging, transactions) that would otherwise be copy-paste. **In-process method call pays** when one application service owns the use case and the team is small.

**Failure of MediatR:** 80 handlers that each call one service method — you cannot find the flow, and pipeline behaviors hide transactions so people double-SaveChanges. **Failure of no mediator:** a 2,000-line OrderService.

### Decorator vs inheritance
- Need to stack independent behaviors (cache, retry, auth)? **Decorator.**
- Need to specialize a stable IS-A with shared protected invariants? **Inheritance**, rarely, and never across service boundaries.
- Need to swap algorithms? **Strategy**, not a subclass per algorithm.

### Overengineering signals
Interface with one implementation that will not be replaced (except tests). Abstract factory for a single family. CQRS + MediatR + generic repository + UoW + specification for a 4-table app. Pattern names in folder names but business language missing.

### Production story
A team wrapped every EF query in Specification + generic repository + mapper + MediatR. A hotfix took 9 files. They collapsed to DbContext in the handler for that bounded context and kept MediatR only where pipeline behaviors were real.
      `,
      commonMistakes: [
        'Adding MediatR because a blog post said Clean Architecture requires it.',
        'Interface + wrapper around DbContext that only forwards SaveChanges.',
        'Using every GoF pattern in a take-home to look senior.',
        'Inheritance for retry/logging because we already have a base repository.',
      ],
      bestPractices: [
        'Justify each abstraction with a second implementation or a documented future axis.',
        'Prefer pipeline behaviors only for truly cross-cutting handler concerns.',
        'Keep the happy-path readable in one file for simple features (vertical slice).',
        'Delete patterns that no longer pay; architecture is not a museum.',
      ],
      interviewQs: [
        {
          q: 'Walk me through how you decide whether to introduce MediatR.',
          a: 'I ask what cross-cutting I would otherwise duplicate: validation, logging, transactions, authorization. If I have many independent use cases and those behaviors are real, MediatR is cheaper than copy-paste. If I have six features and one service, I call the service. I never use MediatR to hide EF — handlers may use DbContext directly. The failure mode is navigation hell plus hidden SaveChanges in a behavior.',
          bangla: 'ক্রস-কাটিং সত্যি থাকলে MediatR। ছয়টা ফিচারে সরাসরি সার্ভিস কল। EF লুকাতে MediatR নয় — হ্যান্ডলার DbContext ব্যবহার করতে পারে।',
          followUp: 'How do you debug a lost transaction when a pipeline behavior wraps SaveChanges?',
          difficulty: 'expert',
        },
        {
          q: 'A junior wants a new interface for every class. How do you coach them?',
          a: 'I ask: what second implementation exists, or what will change independently? Test doubles count. If the answer is "maybe later", we skip the interface and keep the class internal. We extract when a second consumer appears. That is YAGNI with an escape hatch, not anti-abstraction religion.',
          bangla: 'দ্বিতীয় ইমপ্লিমেন্টেশন বা আলাদা পরিবর্তনের অক্ষ আছে কি? না থাকলে ইন্টারফেস নয়। দ্বিতীয় কনজিউমার এলে এক্সট্রাক্ট করব।',
          followUp: 'When is a single-implementation interface still correct in Clean Architecture?',
          difficulty: 'senior',
        },
        {
          q: 'Give an example where applying a pattern made production worse.',
          a: 'Generic repository over EF Core that exposed IQueryable leaked the ORM, prevented Include control, and made N+1 undebuggable. The pattern promised persistence ignorance and delivered the worst of both worlds. Another: Singleton cache of user permissions without invalidation — revoked admins stayed admin until recycle.',
          bangla: 'Generic repository + IQueryable EF লিক করে N+1 লুকিয়ে রাখে। পারমিশন Singleton ক্যাশে revoke পরেও অ্যাডমিন থেকে যায়।',
          followUp: 'What metric would you use to decide a pattern is overengineering?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Take a 4-entity CRUD API. List patterns you would NOT add, with one sentence each. Add only the abstractions a second payment provider would actually need.',
      code: `public sealed class PlaceOrderHandler(AppDbContext db, IPaymentPort payments)
{
    public async Task<OrderId> Handle(PlaceOrder cmd, CancellationToken ct)
    {
        var order = Order.Place(cmd.Lines);
        db.Orders.Add(order);
        await payments.AuthorizeAsync(order.Id, order.Total, ct);
        await db.SaveChangesAsync(ct);
        return order.Id;
    }
}

public sealed class RetryPaymentPort(IPaymentPort inner) : IPaymentPort
{
    public async Task AuthorizeAsync(OrderId id, Money total, CancellationToken ct)
    {
        for (var i = 0; ; i++)
        {
            try { await inner.AuthorizeAsync(id, total, ct); return; }
            catch (HttpRequestException) when (i < 2) { await Task.Delay(200 * (i + 1), ct); }
        }
    }
}`,
    },
  ],
  quickRevision: {
    concepts: [
      'new is a design decision; composition root owns lifetimes',
      'DI Singleton ≠ GoF static Instance; captive dependencies',
      'Factory = one product; Abstract Factory = consistent family',
      'Builder for invariants; records for simple data',
      'Adapter at the boundary; vendor types stay in Infrastructure',
      'Decorator stacks behavior; inheritance does not compose',
      'Middleware is Chain of Responsibility; order is security',
      'Observer + outbox for I/O; events leak if they capture scoped services',
      'Command = intent; Mediator = routing; MediatR is both, not an architecture',
      'Buy indirection only for a real axis of change or test seam',
    ],
    questions: [
      'Thread-safe Singleton in .NET — and when do you refuse it?',
      'Captive dependency: what throws in production?',
      'Factory vs Abstract Factory vs keyed DI?',
      'Decorator vs inheritance for caching/retry?',
      'Where does Adapter live in Clean Architecture?',
      'Why turn off EF lazy-loading proxies?',
      'Which pattern is the ASP.NET pipeline?',
      'How do you Observer without losing emails on crash?',
      'MediatR vs calling an application service?',
      'When is a pattern zoo a firing offense in a take-home?',
    ],
    mistakes: [
      'Static Singleton holding DbContext',
      'MediatR on every one-line method',
      'Generic repository that leaks IQueryable',
      'Decorator cache wrapping before authorization',
      'In-process Observer doing SMTP on the request thread',
    ],
    scenarios: [
      'Revoked admin still authorized because of a Singleton permission cache',
      'ObjectDisposedException from a Singleton that captured Scoped context',
      'Checkout latency spike: email SMTP inside OrderPlaced event',
      'Double charge: Command handler not idempotent under bus retry',
      'Hotfix needs 9 files because every query is Specification + MediatR + mapper',
    ],
  },
  revisionSummary: `
- Construction: DI lifetimes first; Singleton/Factory/Builder only for a named problem; never captive dependencies.
- Structure: Adapter at the edge, Decorator for stackable concerns, Facade use-case sized, Proxy (EF) off by default.
- Behavior: Strategy over switch, CoR = middleware order, Command+idempotency, Observer+outbox, State+concurrency.
- Senior bar: MediatR is optional; inheritance vs decorator is a composition question; delete patterns that do not pay.
  `,
  summary:
    'Design patterns in senior .NET interviews are judged by the problem, the C# shape, when you would not use them, and the production failure — not by reciting GoF names.',
};
