export const architectureData = {
  id: 'architecture',
  title: 'Clean Architecture & Application Design',
  description:
    'Repository, Unit of Work, Specification, CQRS, Clean/Onion/Hexagonal, and vertical slices — why they exist, what EF Core already gives you, and when extra layers become the incident.',
  sections: [
    {
      topic: 'Repository, Generic Repository, and Unit of Work',
      difficulty: 'senior',
      english:
        'Repository exists to hide persistence and give tests a seam. Unit of Work exists so one business action commits atomically. In EF Core, DbContext already is Unit of Work plus identity map. A second UoW wrapper and a generic repository that expose IQueryable usually add mapping noise without adding a boundary.',
      bangla:
        'Repository পার্সিস্টেন্স লুকাতে। Unit of Work এক ট্রানজ্যাকশনে কমিট করতে। EF Core-এ DbContext নিজেই UoW + identity map — আরেকটা র‍্যাপার প্রায়ই ওভারকিল।',
      details: `
### Why Repository existed
Before ORMs, ADO.NET lived in UI code. A repository collected queries for an aggregate, hid SQL, and allowed a fake in tests. That is still real with Dapper, multiple databases, or a store you might replace.

### What EF Core already is
- **Unit of Work:** \`SaveChangesAsync\` writes all tracked changes in one transaction.
- **Identity map:** the same key loaded twice in one context returns the same instance — deadly if you treat two contexts as one UoW.
- **Change tracker:** a custom UoW that only forwards \`SaveChanges\` is a cartoon of the real object.

### Generic repository — the trap
\`IRepository<T>.Get(Expression<Func<T,bool>>)\` plus Include strings leaks EF, hides N+1, and makes SQL invisible from the use case. **When OK:** identical CRUD for lookup tables, no aggregates.

### Custom UoW — when it is not overkill
Two DbContexts, or EF + Dapper in one business transaction. **When NOT:** one Scoped DbContext per HTTP request. **Production failure:** two repositories, two contexts, two SaveChanges — partial commits. Or a Singleton UoW sharing one context across requests.
      `,
      commonMistakes: [
        'Wrapping DbContext in IUnitOfWork that only calls SaveChanges.',
        'Generic repository returning IQueryable.',
        'One repository per table instead of per aggregate.',
        'Two DbContexts in one request both calling SaveChanges.',
      ],
      bestPractices: [
        'Treat DbContext as the UoW; inject it into handlers or a focused repository per aggregate.',
        'If you keep repositories, return domain types or DTOs, never IQueryable.',
        'One Scoped DbContext per request; IDbContextFactory for workers or parallel queries.',
        'Need two stores in one transaction? Make the transaction explicit.',
      ],
      interviewQs: [
        {
          q: 'Is DbContext a Unit of Work? Then why do so many codebases have IUnitOfWork?',
          a: 'Yes. DbContext tracks the identity map and commits with SaveChanges as one transaction. IUnitOfWork comes from pre-EF tutorials, from wanting to mock SaveChanges, or from coordinating multiple contexts. Mocking SaveChanges often tests nothing. With one EF context, inject DbContext (or a narrow interface) and skip the wrapper. Mock application ports, not the UoW.',
          bangla: 'DbContext-ই UoW। IUnitOfWork বেশিরভাগ সময় SaveChanges-এর অনর্থক র‍্যাপার। এক কনটেক্সটে র‍্যাপার বাদ; পোর্ট মক করি।',
          followUp: 'How does the identity map surprise you if you load the same entity two ways?',
          difficulty: 'senior',
        },
        {
          q: 'When is a generic repository overkill with EF Core?',
          a: 'When queries differ per screen: filters, paging, projections, split queries, AsNoTracking. A generic GetById/Add/Remove does not capture that, so people add Include parameters until the repository is an EF leak. Overkill also when the team cannot see the SQL. Keep generic CRUD only for simple reference data.',
          bangla: 'স্ক্রিনভেদে কোয়েরি আলাদা হলে generic repository Include/Expression লিক করে। রেফারেন্স ডেটার সিম্পল CRUD ছাড়া ওভারকিল।',
          followUp: 'How would you test a query without a generic repository?',
          difficulty: 'senior',
        },
        {
          q: 'What production failure comes from repository-per-table plus multiple SaveChanges?',
          a: 'Checkout that saves Order then Payment in two SaveChanges calls is two transactions. Payment can succeed after Order rolls back. You thought you had a UoW because each repository owns a table. Fix: one context, one SaveChanges at the end of the use case, or an explicit transaction. Outbox rows must be in that same commit.',
          bangla: 'টেবিলপ্রতি repository + দুইবার SaveChanges = দুই ট্রানজ্যাকশন। অর্ডার/পেমেন্ট আলাদা কমিট হলে ডেটা বিভক্ত হয়।',
          followUp: 'Where does the outbox row have to be written relative to SaveChanges?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Delete IUnitOfWork from an API that has one DbContext. Keep a single SaveChanges at the end of PlaceOrder. Prove a thrown payment exception leaves no order row.',
      code: `public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
}

public interface IOrderRepository
{
    Task AddAsync(Order order, CancellationToken ct);
    Task<Order?> GetAsync(OrderId id, CancellationToken ct);
}

public sealed class OrderRepository(AppDbContext db) : IOrderRepository
{
    public Task AddAsync(Order order, CancellationToken ct)
    { db.Orders.Add(order); return Task.CompletedTask; }

    public Task<Order?> GetAsync(OrderId id, CancellationToken ct) =>
        db.Orders.Include(o => o.Lines).FirstOrDefaultAsync(o => o.Id == id, ct);
}`,
    },
    {
      topic: 'Specification Pattern and the Service Layer',
      difficulty: 'senior',
      english:
        'Specification packages a business predicate so it can be reused in memory and in queries. Application services orchestrate use cases; domain services hold domain logic that does not sit on one entity. Specifications that cannot translate to SQL, and service layers that become transaction scripts, are failure modes.',
      bangla:
        'Specification ব্যবসায়িক শর্ত পুনর্ব্যবহার করে। অ্যাপ্লিকেশন সার্ভিস ইউজ-কেস চালায়; ডোমেইন সার্ভিস এন্টিটির বাইরের ডোমেইন লজিক রাখে। SQL-এ না গেলে Specification, গড সার্ভিস — দুটোই ফেল।',
      details: `
### Specification
**Why:** "active premium customers in EU" appears in query, validation, and a domain method. One named object beats copy-paste LINQ.

**How in EF:** \`ISpecification<T>\` with \`Expression<Func<T,bool>>\` so EF can translate. In-memory \`IsSatisfiedBy\` for loaded aggregates.

**When NOT:** every filter is unique to one endpoint — a local Where is clearer. **Failure:** specification that calls \`DateTime.Now\` or a method EF cannot translate. Composing specs into an unreadable AND-tree nobody can index.

### Application service vs domain service
- **Application service:** PlaceOrder — load, call domain, persist, call ports. Knows I/O.
- **Domain service:** pricing that needs two aggregates. No DbContext.
- **Anemic domain:** entities are property bags; all rules live in services. Fine for CRUD; painful when invariants get complex.

**When NOT to add a service layer:** a vertical-slice handler already is the application service. Handler → Service → Repository with zero logic is a pass-through.

**Production failure:** domain service injected with DbContext — persistence leaks inward. Or a 3,000-line application service after you "did DDD".
      `,
      commonMistakes: [
        'Specifications EF cannot translate (custom methods, DateTime.Now in the expression).',
        'One specification per column filter — no business name.',
        'Domain service that takes AppDbContext.',
        'Handler → Service → Repository pass-through with zero logic.',
      ],
      bestPractices: [
        'Name specifications after the business language, not columns.',
        'Keep expressions EF-translatable; test against a real provider.',
        'Put invariants on the aggregate; domain services only when a rule spans aggregates.',
        'Delete pass-through layers; a handler may be the service.',
      ],
      interviewQs: [
        {
          q: 'How does Specification interact with IQueryable and EF Core translation?',
          a: 'The specification must expose an Expression tree, not a Func, if you want SQL. Func forces client evaluation or an exception. I compose And/Or by combining expressions (parameter replacement). I still prefer a named query method on a repository or a slice when the spec is used once. Production failure: a spec that compiles in C# and blows up at query time.',
          bangla: 'SQL চাইলে Expression, Func নয়। একবারই ব্যবহার হলে স্লাইসে Where লিখি। রানটাইমে translate না হওয়াই প্রোডাকশন ফেল।',
          followUp: 'How do you unit-test a specification without spinning SQL Server?',
          difficulty: 'senior',
        },
        {
          q: 'What is the difference between an application service and a domain service?',
          a: 'Application services are use-case coordinators: they load aggregates, call domain, save, and talk to email/payment ports. Domain services are domain logic that does not belong on a single entity, still without I/O. If your domain service has HttpClient, it is an application service in disguise. Clean Architecture: domain has no EF; application depends on ports; infrastructure implements them.',
          bangla: 'অ্যাপ্লিকেশন সার্ভিস ইউজ-কেস ও I/O। ডোমেইন সার্ভিস শুধু ডোমেইন, DbContext/HttpClient নয়।',
          followUp: 'When is an anemic model the correct senior choice?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Extract an ActiveInRegion specification as Expression<Func<Customer,bool>> and use it in a query and on a loaded list. Prove DateTime.Now inside the expression fails translation.',
      code: `public sealed class ActivePremiumSpec : ISpecification<Customer>
{
    public Expression<Func<Customer, bool>> ToExpression() =>
        c => c.IsActive && c.Plan == Plan.Premium;
}

public sealed class PricingService : IDomainService
{
    public Money Quote(Order order, TaxTable tax) => order.Subtotal + tax.For(order.Region);
}

public sealed class PlaceOrderService(IOrderRepository orders, IPaymentPort payments, AppDbContext db)
{
    public async Task Handle(PlaceOrder cmd, CancellationToken ct)
    {
        var order = Order.Place(cmd.Lines);
        await orders.AddAsync(order, ct);
        await payments.AuthorizeAsync(order.Id, order.Total, ct);
        await db.SaveChangesAsync(ct);
    }
}`,
    },
    {
      topic: 'CQRS — When It Helps and When It Hurts',
      difficulty: 'expert',
      english:
        'CQRS splits writes (commands, invariants, transactions) from reads (queries, projections, denormalized views). It is not MediatR, and it is not event sourcing. Seniors use it when read and write models diverge in scale or shape — and refuse it when it only doubles the files of a CRUD app.',
      bangla:
        'CQRS লেখা ও পড়াকে আলাদা মডেল করে। MediatR বা event sourcing নয়। রিড/রাইট আলাদা স্কেল বা শেপ হলে কাজে লাগে; CRUD-এ ফাইল দ্বিগুণ করা নয়।',
      details: `
### Why
A normalized write model protects invariants. A read model wants joins, paging, and denormalized JSON. Forcing both through the same entities causes slow reads or a write model polluted with UI fields.

### When useful
Read load is an order of magnitude higher than writes. Different storage: SQL writes, Redis/Elastic/SQL views for reads. The team can own eventual consistency (projection lag).

### When NOT
Admin CRUD with the same DTO in and out. You only split IRequest vs IRequest<T> folders — that is naming, not CQRS. You cannot explain what happens if the projection is 3 seconds behind.

### Internals
Logical CQRS: two models, one database, same transaction for a projection table. Physical CQRS: separate store, async projector. **Failure:** UI reads the projection immediately after write and shows stale data. Fix: read-your-writes, version tokens, or synchronous projection in the same transaction.

**Event sourcing ≠ CQRS.** You can CQRS with CRUD tables. Event sourcing stores events as truth — replay, versioning, GDPR cost.
      `,
      commonMistakes: [
        'Calling MediatR "CQRS" because commands and queries are different types.',
        'Async projections with no stale-read story.',
        'Duplicating every entity into ReadDto/WriteDto with no shape difference.',
        'Event-sourcing a 5-table app because CQRS was on the job description.',
      ],
      bestPractices: [
        'Start with two models in one database (SQL views or query-side tables).',
        'Document consistency: sync vs eventual, and the UX for lag.',
        'Commands enforce invariants; queries never call SaveChanges.',
        'Add a second store only when a metric says the write DB cannot serve the read.',
      ],
      interviewQs: [
        {
          q: 'When would you introduce CQRS in a .NET modular monolith, and when would you reject it?',
          a: 'I introduce it when a read path needs a different schema or store than the transactional model — e.g. order history search vs order aggregate. I reject it when create/update/list share the same fields and volume. MediatR folders are not CQRS. Production failure: a dashboard that polls a projection that has not caught up, so operators "fix" data that is already correct in the write DB.',
          bangla: 'রিড মডেল আলাদা স্কিমা/স্টোর চাইলে CQRS। একই ফিল্ডের CRUD-এ নয়। প্রজেকশন পিছিয়ে থাকলে অপারেটর ভুল "ফিক্স" করে।',
          followUp: 'How do you implement read-your-writes after PlaceOrder without blocking on a Kafka projector?',
          difficulty: 'expert',
        },
        {
          q: 'Does CQRS require two databases?',
          a: 'No. The C is the split of responsibility and models. Two tables in one SQL database is already CQRS. Two databases add dual writes or messaging, backup, and consistency. I split stores when read QPS or query shape demands it, not for purity.',
          bangla: 'না। এক ডাটাবেজে দুই টেবিলও CQRS। দুই ডাটাবেজ অপারেশনাল খরচ — QPS/শেপ চাইলেই।',
          followUp: 'How do you keep a Redis read model honest after a failed SQL commit?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Keep Order aggregate for writes and an OrderListItem table updated in the same SaveChanges. Document one endpoint that must not use the list table.',
      code: `public sealed class PlaceOrderHandler(AppDbContext db) : IRequestHandler<PlaceOrder, OrderId>
{
    public async Task<OrderId> Handle(PlaceOrder cmd, CancellationToken ct)
    {
        var order = Order.Place(cmd.Lines);
        db.Orders.Add(order);
        db.OrderList.Add(OrderListItem.From(order)); // sync projection, same UoW
        await db.SaveChangesAsync(ct);
        return order.Id;
    }
}`,
    },
    {
      topic: 'Clean, Onion, and Hexagonal Architecture',
      difficulty: 'senior',
      english:
        'Clean, Onion, and Hexagonal are the same idea with different diagrams: the domain does not depend on frameworks, databases, or UI. Dependencies point inward. Ports are interfaces on the inside; adapters are implementations on the outside. Seniors can draw the dependency rule and name what happens when EF entities become the domain.',
      bangla:
        'Clean, Onion, Hexagonal — একই নিয়ম: ডোমেইন ফ্রেমওয়ার্ক চেনে না, ডিপেন্ডেন্সি ভিতরের দিকে। পোর্ট ভিতরে, অ্যাডাপ্টার বাইরে। EF এন্টিটিই ডোমেইন হয়ে গেলে নিয়ম ভাঙে।',
      details: `
### Similarities
| Name | Picture | Same rule |
| :--- | :--- | :--- |
| **Hexagonal** | Domain in the hexagon, ports on edges, adapters outside | I/O at the edges |
| **Onion** | Concentric rings, domain center | Inner rings know nothing of outer |
| **Clean** | Entities → Use cases → Interface adapters → Frameworks | Dependency rule |

All three: **business rules compile without ASP.NET, EF, or Redis.**

### The dependency rule
A class may only reference types in its layer or inward. Application defines \`IPaymentPort\`; Infrastructure implements it. Program.cs wires both — the one place allowed to know everything.

### What is not required
MediatR, a repository per entity, 8 projects. A single project with folders can still obey the rule if you enforce it (arch tests).

### When NOT / failure
Domain referencing Microsoft.EntityFrameworkCore. Use cases that return IQueryable. 15 projects for a 3-endpoint service. **Production:** domain entity \`[Table]\` attributes — you cannot change storage without rewriting rules.
      `,
      commonMistakes: [
        'EF Core entities used as domain aggregates.',
        'Application layer referencing ASP.NET ControllerBase.',
        'Creating 10 class libraries before the first use case.',
        'Calling it Hexagonal while new-ing SqlConnection inside a domain service.',
      ],
      bestPractices: [
        'Enforce inward dependencies with project references and architecture tests.',
        'Ports named after intent (IPaymentPort), not vendors.',
        'Map EF entities at the infrastructure boundary if the domain is rich.',
        'Keep the composition root thick and the domain small to compile.',
      ],
      interviewQs: [
        {
          q: 'Explain the dependency rule and how a .NET solution enforces it.',
          a: 'Inner layers never reference outer projects. Domain has no package refs to EF/ASP.NET. Application references Domain and defines interfaces. Infrastructure and Web implement ports. Program.cs registers DI. I enforce with project references plus NetArchTest: Domain must not depend on Infrastructure. The failure is a temporary using Infrastructure from Application that never leaves.',
          bangla: 'ইনার লেয়ার আউটার প্রজেক্ট রেফারেন্স করে না। Domain-এ EF নেই। Arch test দিয়ে lock করি।',
          followUp: 'Where do DTO mappings live, and why not in the domain?',
          difficulty: 'senior',
        },
        {
          q: 'Are Clean, Onion, and Hexagonal different architectures?',
          a: 'They are dialects of ports-and-adapters. Hexagonal emphasizes replaceable adapters. Onion emphasizes rings. Clean names use cases and the dependency rule. In an interview I map them to the same .NET structure and then talk about where I would break the diagram for a vertical slice. Claiming they are unrelated is a mid-level tell.',
          bangla: 'একই পোর্টস-অ্যান্ড-অ্যাডাপ্টার, ডায়াগ্রাম আলাদা। ইন্টারভিউতে .NET স্ট্রাকচারে ম্যাপ করি।',
          followUp: 'How does Vertical Slice still obey the dependency rule?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Draw solution projects and arrows. Add an architecture test that fails if Domain references EfCore. Move one leaking DbContext out of a domain service.',
      code: `public interface IPaymentPort
{
    Task AuthorizeAsync(OrderId id, Money amount, CancellationToken ct);
}

public sealed class StripePaymentAdapter(StripeClient client) : IPaymentPort
{
    public Task AuthorizeAsync(OrderId id, Money amount, CancellationToken ct) =>
        client.AuthorizeAsync(id.Value, amount.Cents, ct);
}

public sealed class Order
{
    public static Order Place(IReadOnlyList<Line> lines) => new(lines);
}`,
    },
    {
      topic: 'Vertical Slice Architecture',
      difficulty: 'senior',
      english:
        'Vertical Slice organizes by feature (PlaceOrder, SearchCatalog), not by technical layer (Controllers, Services, Repositories). Each slice owns its request, handler, validator, and SQL. Cross-slice sharing is a conscious kernel. Seniors use it to make change local — and know when a shared domain model is still required.',
      bangla:
        'ভার্টিকাল স্লাইস ফিচার ধরে ভাগে: PlaceOrder এক ফোল্ডারে। লেয়ার ফোল্ডার নয়। পরিবর্তন লোকাল থাকে; শেয়ার্ড কার্নেল সচেতন হতে হয়।',
      details: `
### Why
Layered folders make a feature touch Controller + DTO + Service + Repo + Profile. A slice puts those files together. Onboarding: open one folder.

### How in ASP.NET Core
\`Features/Orders/PlaceOrder/\` with endpoint, command, handler, validator. MediatR optional. EF queries written for that slice. Shared AppDbContext is normal — one database schema.

### When NOT
Deep shared invariants across many slices (billing law) — you still need a real domain model, or slices copy rules and diverge. Uncontrolled copy-paste until there is no kernel. Two slices in one HTTP request still need one UoW.

**Production failure:** "shared kernel" becomes 80 static helpers. Each slice has its own DbContext and migrations fight. API slice allows a state the domain slice rejects, only in production.
      `,
      commonMistakes: [
        'Feature folders that still call a 2,000-line shared OrderService.',
        'Zero shared kernel, so tax rules exist in four slices.',
        'One DbContext per slice with competing migrations.',
        'Confusing vertical slice with microservices.',
      ],
      bestPractices: [
        'Share schema and domain invariants; do not share random helpers.',
        'Keep slice-specific SQL in the slice; keep aggregates in Domain if rules are rich.',
        'Architecture tests so slices do not reference each other except via Domain.',
        'One migration project; many handlers.',
      ],
      interviewQs: [
        {
          q: 'How do you prevent vertical slices from becoming copy-paste architecture?',
          a: 'I extract only when duplication is the same business rule, not the same shape of mapping. Tax calculation goes to domain. AutoMapper profiles that differ per screen stay in the slice. If two slices must stay consistent, I add a test that both handlers reject the same illegal order. Folders do not replace a model.',
          bangla: 'একই ব্যবসায়িক নিয়ম ডুপ্লিকেট হলে ডোমেইনে তুলি। স্ক্রিন ম্যাপিং স্লাইসেই থাকে। ইনভেরিয়েন্ট এক টেস্টে বাঁধি।',
          followUp: 'When would you split a slice into its own microservice?',
          difficulty: 'expert',
        },
        {
          q: 'Does Vertical Slice violate Clean Architecture?',
          a: 'No if dependencies still point inward. A slice can contain an endpoint (outer) and a handler that uses a port (inner). The folder is a packaging choice. It violates Clean if the handler uses SqlConnection and the domain class lives next to it with EF attributes. Slice + dependency rule is the pragmatic senior default.',
          bangla: 'ফোল্ডার প্যাকেজিং; ডিপেন্ডেন্সি ভিতরের দিকে থাকলে Clean ভাঙে না। হ্যান্ডলারে সরাসরি SQL + EF অ্যাট্রিবিউট থাকলে ভাঙে।',
          followUp: 'Where do you put shared validation in a sliced app?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Move PlaceOrder files into Features/Orders/PlaceOrder. Delete the unused OrderService pass-through. Leave TaxPolicy in Domain referenced by two slices.',
      code: `public static class PlaceOrderEndpoint
{
    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/orders", async (PlaceOrder cmd, AppDbContext db, CancellationToken ct) =>
        {
            var order = Order.Place(cmd.Lines);
            db.Orders.Add(order);
            await db.SaveChangesAsync(ct);
            return Results.Created($"/orders/{order.Id}", order.Id);
        });
}`,
    },
    {
      topic: 'Enterprise Example and When Patterns Become Overengineering',
      difficulty: 'expert',
      english:
        'A catalog + cart + checkout + admin reporting system shows where each pattern earns its keep. Seniors walk a concrete modular monolith, then attack it: which layers they would delete tomorrow if traffic and team size shrank.',
      bangla:
        'ক্যাটালগ-কার্ট-চেকআউট-অ্যাডমিন দিয়ে প্যাটার্ন কখন কাজে লাগে আর কখন বাদ। সিনিয়র নিজের ডিজাইন নিজেই আক্রমণ করে।',
      details: `
### A realistic modular monolith
- **Catalog (read-heavy):** queries + Redis cache-aside; no generic repository. Optional CQRS read tables for search.
- **Checkout (write-heavy):** Order aggregate, one DbContext UoW, payment adapter, outbox for OrderPlaced.
- **Identity:** Identity/OIDC at the edge — not reinvented.
- **Admin reporting:** separate query slice, AsNoTracking, possibly replica connection string.

Ports: \`IPaymentPort\`, \`IInventoryPort\`. Not \`IRepository<Product>\` for every table.

### When this becomes overengineering
| Smell | Delete |
| :--- | :--- |
| MediatR handler → service → generic repo → EF | Call DbContext from handler |
| Specification for a single Where | Inline LINQ |
| IUnitOfWork + DbContext | DbContext only |
| Event sourcing for order status | State column + outbox |
| 12 projects, 3 engineers | 2–3 projects, slices |
| Microservice per slice, 50 req/s | Modular monolith |

### Production failures from "enterprise" layering
400ms p95 because every request runs 8 decorator layers. Payment captured, order not saved — two SaveChanges. Catalog cache never invalidated after admin price change. New engineers cannot find the SQL.

### Senior choice algorithm
Ship the use case with the fewest concepts that preserve: one transaction for checkout, a testable payment port, and a query path that will not melt the write DB. Add CQRS/cache/bus when a metric or a failure demands it.
      `,
      commonMistakes: [
        'Designing microservices before module boundaries are stable.',
        'Copying a FAANG folder structure for a 6-person team.',
        'Treating every tutorial pattern as mandatory for enterprise.',
        'Optimizing for a hypothetical second database on day one.',
      ],
      bestPractices: [
        'Modular monolith first; extract a service when a module has a different SLI/SLO or scale.',
        'One transactional boundary per use case; adapters for money and email.',
        'Measure before adding read replicas, Redis, or buses.',
        'Keep a kill-list of abstractions in an architecture decision record.',
      ],
      interviewQs: [
        {
          q: 'Design checkout for an enterprise shop in 10 minutes, then tell me what you would not build.',
          a: 'Modular monolith: Order aggregate, Scoped DbContext as UoW, payment port, outbox event, catalog reads AsNoTracking with cache-aside. I would not build generic repositories, a second UoW, event sourcing, or a pricing microservice. I would not use MediatR until I have repeated pipeline behaviors. Failure I design for: payment succeeds / DB fails — idempotency key and reconciliation, not more layers.',
          bangla: 'মডুলার মনোলিথ, DbContext UoW, পেমেন্ট পোর্ট, আউটবক্স। Generic repo, event sourcing বাদ। পেমেন্ট vs DB ফেল = আইডেমপোটেন্সি।',
          followUp: 'How do you reconcile a captured payment with a missing order row?',
          difficulty: 'expert',
        },
        {
          q: 'Your team added every pattern in this handbook. How do you de-layer without a rewrite?',
          a: 'Pick the hottest use case. Inline pass-through services, stop returning IQueryable, collapse UoW into DbContext, keep ports that have real second implementations (payment, email). Add characterization tests first. The metric is files touched per feature and p95, not how Clean it looks.',
          bangla: 'হটেস্ট ইউজ-কেস ধরে পাস-থ্রু সার্ভিস ইনলাইন, UoW তুলে DbContext, আসল পোর্ট রাখি। ফিচারে কয়টা ফাইল — এটাই মেট্রিক।',
          followUp: 'What do you say in a design review when a principal insists on a pattern you think is ceremony?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Write an ADR: "We will not use generic repository or IUnitOfWork." List the checkout components you keep. Add one metric that would justify CQRS later.',
      code: `public sealed class CheckoutModule
{
    public static void Register(IServiceCollection s)
    {
        s.AddScoped<AppDbContext>();
        s.AddScoped<IPaymentPort, StripePaymentAdapter>();
        s.AddScoped<PlaceOrderHandler>();
    }
}`,
    },
  ],
  quickRevision: {
    concepts: [
      'DbContext is UoW + identity map; extra UoW is often a forwarder',
      'Generic repository + IQueryable is a leaky ORM',
      'One SaveChanges per use case; two is two transactions',
      'Specification needs Expression for SQL translation',
      'Application service orchestrates; domain service has no I/O',
      'CQRS is model split, not MediatR and not event sourcing',
      'Stale projections need a read-your-writes story',
      'Clean/Onion/Hexagonal: dependencies inward, ports vs adapters',
      'Vertical slice = packaging by feature; still one UoW',
      'Modular monolith first; delete ceremony with a kill-list',
    ],
    questions: [
      'Is DbContext a Unit of Work?',
      'When is generic repository overkill?',
      'Why is repository-per-table plus two SaveChanges dangerous?',
      'Expression vs Func in specifications?',
      'Application vs domain service?',
      'When is CQRS the wrong split?',
      'Does CQRS need two databases?',
      'State the dependency rule in one sentence.',
      'Does Vertical Slice violate Clean Architecture?',
      'What would you not build in checkout week one?',
    ],
    mistakes: [
      'IUnitOfWork wrapping a single DbContext',
      'MediatR labeled as CQRS',
      'Domain project referencing EF Core',
      'Async projection with no stale-read UX',
      'Microservice per folder at 50 requests/second',
    ],
    scenarios: [
      'Payment captured, order row missing — two SaveChanges',
      'Admin sees old price — catalog cache / projection lag',
      'N+1 hidden behind generic Get with Include strings',
      'Architecture test fails: Domain → Infrastructure',
      'Hotfix touches 9 projects for one validation rule',
    ],
  },
  revisionSummary: `
- Persistence: DbContext is the UoW; repositories are per aggregate or per slice, not generic IQueryable wrappers.
- CQRS and Clean: split models and inward dependencies only when they remove a real pain; MediatR is optional.
- Vertical slices package features; they do not replace transactions or shared invariants.
- Enterprise default: modular monolith, ports for money/email, delete unused layers.
  `,
  summary:
    'Senior application design in .NET is the dependency rule plus transactional honesty — and the courage to skip generic repositories, extra UoW types, and CQRS until the problem shows up.',
};
