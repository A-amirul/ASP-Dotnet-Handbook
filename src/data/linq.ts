export const linqData = {
  id: 'linq',
  title: 'LINQ Internals for Senior Interviews',
  description:
    'How LINQ actually executes: deferred iterators, expression trees, operator semantics, and the production failures that show up when IEnumerable and IQueryable are mixed.',
  sections: [
    {
      topic: 'Deferred vs immediate execution and multiple enumeration',
      difficulty: 'senior',
      english:
        'LINQ is a query description, not a result. Operators such as Where and Select return an iterator object that stores the source and the delegate; nothing walks the source until GetEnumerator/MoveNext, foreach, or an aggregating terminal operator runs. Immediate operators (ToList, ToArray, Count, First, Single, Any, Average) enumerate internally and return a value. The trade-off of deferral is composition: you can keep adding operators without extra passes, but the same IEnumerable can be walked twice and redo all work, including a second SQL round-trip if the source is IQueryable. Failure mode in production is a method that returns IQueryable or a lazy IEnumerable from a using-disposed context, or a query with a side-effecting Select that runs twice because two consumers each foreach it. When you need a stable snapshot, materialize once with ToListAsync and share the list.',
      bangla:
        'LINQ কুয়েরি লিখলেই চলে না — foreach, ToList, First, Any এগুলো চালু হলে তবেই এক্সিকিউট হয়। একই IEnumerable দুবার ঘোরালে কাজও দুবার হয়, ডাটাবেজ কুয়েরি হলে দুবার হিট করে।',
      details: `
### When does LINQ actually run?

| Trigger | Deferred or immediate | What happens |
| :--- | :--- | :--- |
| \`Where\` / \`Select\` / \`SelectMany\` / \`OrderBy\` | Deferred | Allocates an iterator; source is untouched |
| \`foreach\`, \`GetEnumerator\` | Starts execution | Pulls items one by one |
| \`ToList\` / \`ToArray\` / \`ToDictionary\` | Immediate | Full enumeration into a collection |
| \`Count\` / \`Sum\` / \`Average\` / \`Aggregate\` | Immediate | Full (or until done) enumeration |
| \`Any()\` / \`First\` / \`Single\` | Immediate | Enumerates until the answer is known |
| \`ToListAsync\` / \`FirstAsync\` (EF) | Immediate I/O | Sends SQL, then materializes |

### Multiple enumeration
- \`IEnumerable<T>\` has no cache. Two \`foreach\` loops mean two full walks.
- An EF \`IQueryable\` enumerated twice typically executes SQL twice.
- A C# iterator method (\`yield return\`) re-runs the generator, including any side effects.
- \`IQueryable\` that outlives its \`DbContext\` throws on the second (or first late) enumeration.

### When NOT to stay deferred
- You will enumerate more than once (validation + mapping + logging).
- The source is a live database query or a non-repeatable stream.
- You need a consistent snapshot under concurrent mutation of the source list.
      `,
      code: `public sealed class InvoiceQuery(AppDbContext db)
{
    // BAD: returns a live query. Two consumers = two SQL executions.
    public IEnumerable<Invoice> OpenInvoices(int customerId) =>
        db.Invoices.Where(i => i.CustomerId == customerId && i.IsOpen);

    public async Task<IReadOnlyList<InvoiceDto>> GetOpenOnceAsync(
        int customerId,
        CancellationToken ct)
    {
        var rows = await db.Invoices
            .AsNoTracking()
            .Where(i => i.CustomerId == customerId && i.IsOpen)
            .Select(i => new InvoiceDto(i.Id, i.Total))
            .ToListAsync(ct);

        var hasOverdue = rows.Any(r => r.Total > 0);
        var count = rows.Count;
        return hasOverdue ? rows : rows;
    }
}`,
      commonMistakes: [
        'Returning IQueryable from a repository and letting the controller enumerate it after the context is disposed.',
        'Calling Any() and then ToList() on the same IQueryable, doubling the database round-trip.',
        'Putting logging or HTTP calls inside a Select and then enumerating the sequence twice.',
      ],
      bestPractices: [
        'Materialize at the application boundary with ToListAsync/ToArrayAsync and a CancellationToken.',
        'If a sequence must be reused, store the list; do not reuse the query object.',
        'Treat "the query variable" and "the results" as different lifetimes in code review.',
      ],
      interviewQs: [
        {
          q: 'When does LINQ execute?',
          a: 'Composition operators do not execute. Where, Select, OrderBy, GroupBy, Join, Skip, and Take return a new query object that captures the source and the lambda. Execution starts when something pulls on the enumerator: foreach, GetEnumerator, or a terminal operator that enumerates internally. ToList, Count, First, Single, Any, Sum, and the EF *Async counterparts all force execution. For IQueryable, that pull is what makes EF translate the expression tree to SQL and open a database round-trip. If nobody enumerates, no SQL is sent and no in-memory loop runs. That is why a query assigned to a variable in a debugger looks "empty" until you expand it, and why expanding it in the debugger can itself execute the query.',
          bangla: 'Where/Select শুধু কুয়েরি অবজেক্ট তৈরি করে। foreach, ToList, First, Any চালু হলে তবেই এক্সিকিউট — IQueryable হলে তখনই SQL যায়।',
          followUp: 'What happens if you enumerate the same IQueryable twice in one request?',
          difficulty: 'senior',
        },
        {
          q: 'Why is multiple enumeration a production bug rather than a style issue?',
          a: 'Each enumeration repeats the entire pipeline. For an in-memory iterator that is only CPU, you pay CPU and allocations twice. For EF, you pay two SQL executions, two result sets, and two materializations — often with different data if rows changed between the two calls. If the lambda has side effects (lazy loading, logging, incrementing a counter), those effects run twice and violate "exactly once" business rules. A classic ASP.NET failure is checking query.Any() for 404 and then returning query.ToList(), which doubles load on a hot endpoint. The fix is one materialization, then in-memory Any/Count on the list.',
          bangla: 'দুবার enumerate মানে দুবার কাজ — EF হলে দুবার SQL। Any() তারপর ToList() একই কুয়েরিতে ক্লাসিক প্রোডাকশন বাগ।',
          followUp: 'How would you detect this in Application Insights or SQL Profiler?',
          difficulty: 'senior',
        },
        {
          q: 'Is Any() deferred or immediate? Why does that matter versus Count() > 0?',
          a: 'Any() is a terminal operator: it starts enumeration immediately and stops at the first matching element (or at the first element for Any() with no predicate). Count() walks the whole sequence unless the source implements ICollection<T> and can return Count in O(1). On IQueryable, Any() should translate to EXISTS / SELECT TOP(1), while Count() > 0 translates to COUNT(*) which is more expensive on large tables. Using Count() > 0 on a database query is a senior-level smell: you asked the engine to count every matching row just to learn whether one exists. Prefer AnyAsync(ct) at the database, and after materialization prefer list.Count > 0 which is O(1).',
          bangla: 'Any() সাথে সাথে চলে এবং প্রথম ম্যাচে থামে; Count() পুরো সেট গণে। ডাটাবেজে existence চেক এ Always Any, Count() > 0 নয়।',
          followUp: 'What SQL do you expect for Any vs Count on IQueryable?',
          difficulty: 'mid',
        },
      ],
      practice:
        'Find a service method that returns IQueryable. Change it to ToListAsync once, then perform Any/Count on the list. Prove with a logger that SQL runs once.',
    },
    {
      topic: 'IEnumerable vs IQueryable vs expression trees',
      difficulty: 'expert',
      english:
        'IEnumerable<T> is an in-memory pull sequence: the lambda is a compiled Func, and every operator runs in the CLR after objects already exist. IQueryable<T> is a provider query: the lambda is an Expression tree, an object model of the code, which EF Core (or another provider) translates to SQL. That is why the same Where looks identical in C# but one filters a List and the other adds a WHERE clause. The trade-off is power versus opacity: IQueryable can push work to the database, but any untranslatable method silently (or loudly, depending on EF version) becomes client evaluation. Failure mode: calling AsEnumerable() too early, or passing an IEnumerable repository API that forces the whole table into memory. IEnumerable causes performance problems because filtering, joining, and paging happen after the data is already loaded — you paid for rows you will throw away. IQueryable is dangerous because the query is not the SQL you imagine; it is whatever the translator emits, including cartesian joins and unexpected client eval.',
      bangla:
        'IEnumerable মেমোরিতে Func চালায়; IQueryable এক্সপ্রেশন ট্রি SQL এ অনুবাদ করে। তাড়াতাড়ি AsEnumerable করলে পুরো টেবিল মেমোরিতে আসে। IQueryable বিপজ্জনক কারণ জেনারেটেড SQL আপনি না দেখলে ভুল জয়েন/ক্লায়েন্ট ইভ্যাল ধরা পড়ে না।',
      details: `
### The real difference is the delegate type

| | \`IEnumerable<T>\` | \`IQueryable<T>\` |
| :--- | :--- | :--- |
| Lambda compiled as | \`Func<T, bool>\` | \`Expression<Func<T, bool>>\` |
| Where work runs | CLR, after objects exist | Database (if translated) |
| Provider | LINQ to Objects | EF Core, LINQ to SQL, custom |
| Failure | Load too much, then filter | Bad SQL, client eval, two queries |

### Expression trees
- An expression tree is data: \`x => x.Price > 10\` becomes a tree of \`Parameter\`, \`Property\`, \`Constant\`, \`GreaterThan\`.
- EF walks that tree and emits SQL parameters. It cannot emit SQL for arbitrary C# (DateTime.Now.ToString("MMMM"), a local method, a field of a non-mapped type).
- \`AsEnumerable()\` / \`AsQueryable()\` switch the world. \`AsEnumerable()\` is the trap: everything after it is in-memory.

### Why IEnumerable APIs on repositories hurt
If the repository returns \`IEnumerable<Order>\`, the caller’s extra \`Where\` cannot become SQL. The database already sent the full set. That is the performance problem interviewers mean — not that IEnumerable is "slow" in the abstract.
      `,
      code: `public interface IOrderReadStore
{
    IQueryable<Order> Query();
}

public sealed class OrderReadStore(AppDbContext db) : IOrderReadStore
{
    public IQueryable<Order> Query() => db.Orders.AsNoTracking();
}

public sealed class OrderService(IOrderReadStore store)
{
    public async Task<IReadOnlyList<OrderListItem>> RecentPaidAsync(
        DateTimeOffset since,
        CancellationToken ct)
    {
        return await store.Query()
            .Where(o => o.PaidAt >= since && o.Status == OrderStatus.Paid)
            .OrderByDescending(o => o.PaidAt)
            .Take(50)
            .Select(o => new OrderListItem(o.Id, o.Total, o.PaidAt))
            .ToListAsync(ct);
    }

    public IEnumerable<Order> AccidentalFullTable(DateTimeOffset since)
    {
        IEnumerable<Order> alreadyInMemory = store.Query();
        return alreadyInMemory.Where(o => o.PaidAt >= since);
    }
}`,
      commonMistakes: [
        'Repository methods returning IEnumerable, which silently disables SQL translation for callers.',
        'Calling AsEnumerable() so a local C# helper can run, then paging with Skip/Take in memory.',
        'Assuming two identical-looking Where lambdas produce the same work on List vs DbSet.',
      ],
      bestPractices: [
        'Keep IQueryable inside the data layer; expose Task<IReadOnlyList<TDto>> at the service boundary.',
        'If you must use a local function, filter and project in SQL first, then AsEnumerable for the last mile.',
        'Log or inspect the SQL (ToQueryString, EF logging) for every hot IQueryable path.',
      ],
      interviewQs: [
        {
          q: 'Why does IEnumerable cause performance problems in a data-access stack?',
          a: 'IEnumerable means the data is already (or will be) pulled into the CLR before remaining operators run. If a repository materializes or types the query as IEnumerable, the caller’s Where, OrderBy, Skip, and Take cannot be translated. SQL Server then returns far more rows than the endpoint needs; the app allocates entities, then throws most of them away. Under load that becomes GC pressure, high ADO.NET throughput, and lock duration on the database that you never intended. IEnumerable is the right type for in-memory sequences you already own. It is the wrong type for a query that still has a chance to run remotely. The performance problem is not LINQ itself; it is losing composition against the provider.',
          bangla: 'IEnumerable মানে ফিল্টার/পেজ মেমোরিতে — রিপোজিটরি IEnumerable ফেরালে কলারের Where আর SQL হয় না, পুরো সেট নেটওয়ার্কে আসে।',
          followUp: 'How would you design a repository so callers cannot accidentally trigger this?',
          difficulty: 'senior',
        },
        {
          q: 'Why is IQueryable dangerous?',
          a: 'IQueryable delays both execution and translation. The SQL is whatever the current EF Core translator can emit from the expression tree, not what a human would write. Untranslatable methods used to silently client-evaluate in older EF; modern EF Core generally throws, which is safer but still a production incident if it ships. Callers can compose extra Includes, OrderBys, or navigations that explode into cartesian products. Leaking IQueryable past the DbContext lifetime throws ObjectDisposedException. Leaking it to a controller lets the UI dictate SQL, which breaks indexing assumptions and security (over-posting filters). Treat IQueryable as an internal compiler IR, not as a public API.',
          bangla: 'IQueryable-এর SQL আপনি লেখেননি — ট্রান্সলেটর লেখে। লিক করলে কনটেক্সট ডিসপোজ, কার্টেসিয়ান জয়েন, বা ক্লায়েন্ট ইভ্যাল — পাবলিক API হিসেবে ব্যবহার করবেন না।',
          followUp: 'When is leaking IQueryable acceptable, if ever?',
          difficulty: 'expert',
        },
        {
          q: 'What is an expression tree and why does EF need one instead of a Func?',
          a: 'A Func is already compiled IL. The database cannot run IL; it needs a relational expression. Expression<Func<T,bool>> is an inspectable graph of nodes: which property, which constant, which comparison. EF Core’s query pipeline visits that graph, maps CLR members to columns, and generates parameterized SQL. That is also why you cannot put an arbitrary local function in a Where on IQueryable: there is no SQL equivalent in the tree unless EF knows the method. The same lambda written against IEnumerable never builds a tree; the compiler emits a delegate and LINQ to Objects just invokes it per element.',
          bangla: 'Func হলো কম্পাইল্ড IL; Expression হলো কোডের ডাটা মডেল যা EF SQL এ অনুবাদ করে। তাই IQueryable Where-এ ইচ্ছেমতো লোকাল মেথড চলে না।',
          followUp: 'How does this relate to Expression.Compile() and why you should not Compile in a hot EF path?',
          difficulty: 'expert',
        },
        {
          q: 'AsEnumerable vs AsQueryable vs ToList — which switches evaluation?',
          a: 'AsEnumerable() casts an IQueryable to IEnumerable without executing. The next operator binds to Enumerable.* and runs in memory after the provider enumerates the current query. AsQueryable() wraps an in-memory sequence in EnumerableQuery; further operators build expression trees that usually still execute in memory, not in SQL Server. ToList() executes immediately and returns a List; further LINQ is definitely in memory. The dangerous one in APIs is AsEnumerable() in the middle of a chain that still had Skip/Take or a heavy Where left — those now cannot use indexes.',
          bangla: 'AsEnumerable() এক্সিকিউট করে না, শুধু পরের অপারেটর মেমোরিতে নিয়ে যায়। ToList() সাথে সাথে চালায়। পেজিনেশনের আগে AsEnumerable করাই আসল ফাঁদ।',
          followUp: 'Show a chain where AsEnumerable before Take pages the whole table.',
          difficulty: 'senior',
        },
      ],
      practice:
        'Take a query that uses a local C# method in Where. Split it: SQL-translatable filter + Select, then AsEnumerable for the local method. Compare SQL before and after.',
    },
    {
      topic: 'Core operators: Where, Select, SelectMany, Join, GroupBy, Any, All, First, Single, Skip, Take',
      difficulty: 'senior',
      english:
        'Operators are not interchangeable synonyms; they differ in cardinality, exception behavior, and SQL shape. Where filters; Select projects; SelectMany flattens nested sequences and is how you express nested collections without a cartesian Include. Join is an inner equijoin; GroupBy in LINQ to Objects builds an in-memory lookup, while GroupBy in EF becomes GROUP BY only if you aggregate — grouping entities often becomes a heavy client-side grouping. First returns one or throws; FirstOrDefault returns default; Single throws if the count is not exactly one — that is a correctness operator, not a performance shortcut. Skip/Take implement offset pagination, which gets slower as the offset grows because the engine still walks skipped rows. Trade-off: FirstOrDefault is convenient but hides "zero rows" versus "row exists with default values". Failure: using Single on a unique-looking column that is not actually constrained, then catching InvalidOperationException as control flow.',
      bangla:
        'First/Single/FirstOrDefault-এর থ্রো আচরণ আলাদা — Single মানে ঠিক একটা সারি, নাহলে এক্সসেপশন। Skip/Take অফসেট পেজিনেশন বড় পেজে স্লো হয়। SelectMany নেস্টেড কালেকশন ফ্ল্যাট করে।',
      details: `
### Cardinality and exceptions (LINQ to Objects and EF)

| Operator | 0 rows | 1 row | Many rows |
| :--- | :--- | :--- | :--- |
| \`First\` | throws | returns it | returns first |
| \`FirstOrDefault\` | default | returns it | returns first |
| \`Single\` | throws | returns it | throws |
| \`SingleOrDefault\` | default | returns it | throws |
| \`Any\` | false | true | true |
| \`All(pred)\` | true (vacuous) | pred | all must match |

### Select vs SelectMany
- \`Select\` keeps cardinality: N in, N out (one result per input).
- \`SelectMany\` is bind/flatten: each input produces a sequence, results are concatenated.
- In EF, \`SelectMany\` on a collection navigation often becomes a JOIN.

### Skip/Take
- Offset pagination: \`ORDER BY ... OFFSET @skip ROWS FETCH NEXT @take\`.
- Deep pages (skip 100_000) are O(skip + take) at the engine. Keyset pagination (\`WHERE Id > lastId ORDER BY Id TAKE n\`) is the senior alternative.
      `,
      code: `public sealed class CatalogQueries(AppDbContext db)
{
    public async Task<ProductDto?> GetBySkuAsync(string sku, CancellationToken ct)
    {
        return await db.Products
            .AsNoTracking()
            .Where(p => p.Sku == sku)
            .Select(p => new ProductDto(p.Id, p.Sku, p.Name))
            .SingleOrDefaultAsync(ct);
    }

    public async Task<IReadOnlyList<string>> TagsForProductsAsync(
        IReadOnlyList<int> productIds,
        CancellationToken ct)
    {
        return await db.Products
            .AsNoTracking()
            .Where(p => productIds.Contains(p.Id))
            .SelectMany(p => p.Tags.Select(t => t.Name))
            .Distinct()
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<ProductDto>> PageKeysetAsync(
        int lastId,
        int pageSize,
        CancellationToken ct)
    {
        return await db.Products
            .AsNoTracking()
            .Where(p => p.Id > lastId)
            .OrderBy(p => p.Id)
            .Take(pageSize)
            .Select(p => new ProductDto(p.Id, p.Sku, p.Name))
            .ToListAsync(ct);
    }
}`,
      commonMistakes: [
        'Using FirstOrDefault for a unique business key, then treating null as "not found" when duplicates silently hide.',
        'Using Skip((page-1)*size).Take(size) on huge tables without a stable OrderBy.',
        'Using Count() to decide between empty and one row instead of Any/First.',
      ],
      bestPractices: [
        'Single/SingleOrDefault only when the database has a unique constraint that matches the filter.',
        'Always OrderBy before Skip/Take; undefined order makes pages overlap or skip rows.',
        'Prefer keyset pagination for infinite scroll and large offsets.',
      ],
      interviewQs: [
        {
          q: 'First vs Single vs FirstOrDefault — which do you use for GetById?',
          a: 'GetById against a primary key should find zero or one row. SingleOrDefaultAsync is the honest operator: null means not found, two rows means your invariant is broken and you want to throw. FirstOrDefault also returns null for zero rows but hides duplicates by returning an arbitrary row — that is a data-corruption blind spot. First throws on zero rows, which is the wrong HTTP mapping (you want 404, not 500). I use SingleOrDefault for unique keys, FirstOrDefault only when the domain truly allows many and I have a deterministic OrderBy, and I never use Single as a substitute for validation in a loop.',
          bangla: 'PK/unique কি-তে SingleOrDefault — না থাকলে null (404), দুইটা থাকলে থ্রো। FirstOrDefault ডুপ্লিকেট লুকিয়ে দেয়।',
          followUp: 'What HTTP status do you map each exception to?',
          difficulty: 'senior',
        },
        {
          q: 'What does SelectMany do that nested foreach does, and how does EF translate it?',
          a: 'SelectMany is the monadic bind of sequences: for each outer element you produce an inner sequence and concatenate. Nested foreach with yield return is the same control flow. In EF Core, SelectMany over a collection navigation typically becomes an INNER JOIN (or a correlated subquery depending on projection). That is often cheaper and clearer than Include of a huge graph when you only need inner rows. The failure is SelectMany followed by a client-only projection that forces the join result into memory before filtering. Also, SelectMany does not preserve outer rows with empty inners — that is a left join, which needs GroupJoin + DefaultIfEmpty or a filtered Include pattern.',
          bangla: 'SelectMany নেস্টেড সিকোয়েন্স ফ্ল্যাট করে; EF-এ সাধারণত JOIN হয়। খালি ইনার রাখতে হলে এটা left join নয় — DefaultIfEmpty লাগে।',
          followUp: 'How do you express a left outer join in method syntax?',
          difficulty: 'senior',
        },
        {
          q: 'Why is Skip/Take pagination a performance trap at page 5000?',
          a: 'OFFSET n still requires the storage engine to walk n ordered rows and discard them. Cost grows with n even if TAKE is small. Plans often cannot seek to the 5000th row; they scan the ordered index from the start. Under concurrency, offset pages also drift: inserts/deletes between requests duplicate or skip items. Keyset pagination seeks on the last seen key and is O(page size) with a proper index. Cursor APIs are the production pattern for large catalogs. Skip/Take is fine for admin UI page 1–20 on a modest table.',
          bangla: 'OFFSET বড় হলে ইঞ্জিন স্কিপ করা সারিগুলোও হাঁটে। বড় ক্যাটালগে last-seen key দিয়ে keyset পেজিনেশন ব্যবহার করুন।',
          followUp: 'What index do you need for WHERE Id > @last ORDER BY Id?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Replace a Skip/Take product grid with keyset pagination. Compare SET STATISTICS IO for page 1 vs page 2000 on both versions.',
    },
    {
      topic: 'Set operators and Aggregate',
      difficulty: 'senior',
      english:
        'Set operators (Distinct, Union, Intersect, Except) are hash-based in LINQ to Objects: they build a Set<T> using EqualityComparer<T>.Default, which for reference types is reference equality unless you pass an IEqualityComparer or override Equals/GetHashCode. Union is set-union (deduped); Concat is bag-union (preserves duplicates and is cheaper). Intersect/Except similarly use hashing and are eager in the sense that they must fully consume the first sequence to build the set before yielding. Aggregate is a left fold: it threads an accumulator through every element and is the primitive behind Sum/Count in LINQ to Objects. Trade-off: Distinct on IQueryable becomes SQL DISTINCT, which may sort or hash on the server and can kill a plan if the projection is wide. Failure: Distinct() on entities without a value comparer does nothing useful because each tracked entity is a unique reference; DistinctBy(x => x.Id) is what people actually meant.',
      bangla:
        'Union ডুপ্লিকেট কাটে, Concat কাটে না। Distinct রেফারেন্স টাইপে Equals না থাকলে কাজ করে না — সাধারণত DistinctBy Id লাগে। Aggregate হলো ফোল্ড, প্রতিটা এলিমেন্টে অ্যাকুমুলেটর চালায়।',
      details: `
### Set operators

| Operator | Meaning | Typical SQL | Notes |
| :--- | :--- | :--- | :--- |
| \`Distinct\` | Unique elements | \`SELECT DISTINCT\` | Needs comparer for objects |
| \`Union\` | Set union | \`UNION\` | Dedupes; extra sort/hash |
| \`Concat\` | Bag concatenation | \`UNION ALL\` | Faster; keeps duplicates |
| \`Intersect\` | Set intersection | \`INTERSECT\` | Hash the first sequence |
| \`Except\` | Set difference | \`EXCEPT\` | Hash the first sequence |
| \`DistinctBy\` | Unique by key (.NET 6+) | depends | Prefer over Distinct on entities |

### Aggregate
- \`source.Aggregate(seed, (acc, x) => acc + x.Amount)\` is a fold.
- Empty sequence without a seed throws; with a seed returns the seed.
- On IQueryable, custom Aggregate often cannot translate — Sum/Count/Max will.
- Do not use Aggregate to reinvent Where/Select; readability and translation both suffer.
      `,
      code: `public sealed class SetQueries(AppDbContext db)
{
    public async Task<IReadOnlyList<int>> UniqueBuyerIdsAsync(
        IReadOnlyList<int> campaignA,
        IReadOnlyList<int> campaignB,
        CancellationToken ct)
    {
        var a = db.Orders.AsNoTracking()
            .Where(o => campaignA.Contains(o.CampaignId))
            .Select(o => o.CustomerId);

        var b = db.Orders.AsNoTracking()
            .Where(o => campaignB.Contains(o.CampaignId))
            .Select(o => o.CustomerId);

        return await a.Union(b).ToListAsync(ct);
    }

    public static Money TotalOrZero(IEnumerable<OrderLine> lines) =>
        lines.Aggregate(Money.Zero, (sum, line) => sum.Add(line.Net));

    public static IReadOnlyList<Order> DistinctById(IEnumerable<Order> orders) =>
        orders.DistinctBy(o => o.Id).ToList();
}`,
      commonMistakes: [
        'Calling Distinct() on a list of entities and expecting uniqueness by primary key.',
        'Using Union where UNION ALL / Concat is enough, paying for a hash/sort.',
        'Using Aggregate on IQueryable with a lambda EF cannot translate, forcing client eval of the whole table.',
      ],
      bestPractices: [
        'Project to keys (ids) before Distinct/Union so SQL can use narrow indexes.',
        'Prefer Concat/UNION ALL when duplicates are impossible or acceptable.',
        'Use DistinctBy / GroupBy(key).Select(g => g.First()) with a documented comparer.',
      ],
      interviewQs: [
        {
          q: 'Union vs Concat — which maps to UNION vs UNION ALL and why care?',
          a: 'Concat is concatenation: all rows from A then all rows from B, duplicates kept. In SQL this is UNION ALL. Union is a set operator: duplicates across both sequences are removed, which is UNION in SQL and a hash set in LINQ to Objects. UNION ALL can use a simple concatenation of two cheap plans. UNION must detect uniqueness, often via a hash or sort, which allocates and may spill. If you already know the two queries are disjoint (different years, different tenants), Concat is both faster and clearer. Using Union "to be safe" on large result sets is a hidden sort tax.',
          bangla: 'Concat = UNION ALL (ডুপ্লিকেট থাকে, সস্তা)। Union = UNION (ডুপ্লিকেট কাটে, হ্যাশ/সর্ট খরচ)। ডিসজয়েন্ট সেটে Concat নিন।',
          followUp: 'How does Distinct interact with a wide SELECT * projection?',
          difficulty: 'senior',
        },
        {
          q: 'Why does Distinct() often appear to do nothing on a List<Entity>?',
          a: 'Default equality for classes is reference equality. Two Order instances with the same Id are still two objects, so Distinct keeps both. EF may return distinct rows from SQL DISTINCT, but once materialized as different CLR objects, in-memory Distinct will not collapse them. You need DistinctBy(o => o.Id), a custom IEqualityComparer, or a record/struct with value equality. This is a frequent source of "I already called Distinct" bugs in merge APIs. Also Distinct() without OrderBy makes the remaining order undefined.',
          bangla: 'ক্লাসের ডিফল্ট ইকুয়ালিটি রেফারেন্স — একই Id-এর দুই অবজেক্ট Distinct-এ দুইটাই থাকে। DistinctBy(o => o.Id) ব্যবহার করুন।',
          followUp: 'Would making Order a record fix Distinct? What is the trade-off?',
          difficulty: 'mid',
        },
        {
          q: 'Explain Aggregate as a fold and when you must not use it on IQueryable.',
          a: 'Aggregate threads an accumulator: start with seed, then acc = func(acc, element) for each element, left to right. It can express Sum, but also things SQL cannot, like building a string or a dictionary. On IEnumerable that is fine if the sequence is already in memory and small. On IQueryable, a custom accumulator almost never translates; EF must pull every row and fold in the app. That is how a "simple Aggregate" becomes a full table download. Use database Sum/Count/GroupBy for numeric folds, and Aggregate only after a narrow projection is materialized.',
          bangla: 'Aggregate ফোল্ড — IQueryable-এ কাস্টম অ্যাকুমুলেটর সাধারণত SQL হয় না, পুরো টেবিল অ্যাপে আসে। নাম্বার হলে Sum/GroupBy ব্যবহার করুন।',
          followUp: 'How would you implement a running total in SQL instead of Aggregate?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Rewrite a Union of two projections as Concat after proving disjointness with a unique constraint. Compare actual plans.',
    },
    {
      topic: 'LINQ performance, N+1, and IQueryable misuse',
      difficulty: 'expert',
      english:
        'Most "LINQ is slow" incidents are query-shape bugs, not iterator overhead. N+1 is the classic: a query materializes parents, then a loop touches a navigation or runs another query per row. IQueryable misuse is composing untranslatable methods, calling ToList too late after a huge join, or calling ToList too early and then filtering in memory. Mixing IEnumerable operators into an IQueryable chain (foreach with .Result, or a Select that calls a repository) hides extra round-trips. Trade-off: Include is easy and causes cartesian explosion on multiple collections; Select to a DTO is more work and generates one tight SQL query. Failure under load: an endpoint that was 40ms with 10 rows becomes 4s with 200 rows because each row fires a lazy SQL. Parallel.ForEach over IQueryable is not a fix — it multiplies connections and deadlocks. Measure with EF logs, MiniProfiler, or SQL duration, not with Stopwatch around a ToList that already includes network.',
      bangla:
        'LINQ স্লো মানে সাধারণত N+1 বা তাড়াতাড়ি/দেরিতে ToList। লুপের ভিতরে নেভিগেশন বা কুয়েরি চালালে প্রতি সারিতে SQL। Include-এর বদলে DTO Select করলে একটাই টাইট কুয়েরি হয়।',
      details: `
### Failure catalog

| Symptom | Likely cause | Fix |
| :--- | :--- | :--- |
| 1 + N SQL per request | Lazy load or query in a loop | \`Select\` DTO, or one \`Include\`, or join |
| Huge memory, fast SQL | \`ToList\` then \`Where\` | Filter before materialize |
| Slow SQL, missing index | \`WHERE\` on expression, not column | Make it SARGable; see SQL module |
| Cartesian row explosion | Multiple collection \`Include\` | \`AsSplitQuery\` or two queries + \`Select\` |
| Client evaluation exception | Untranslatable method | Reshape query or SQL function |

### IQueryable misuse
- Building queries in a foreach that appends \`Or\` without \`PredicateBuilder\` can create enormous expression trees.
- \`Contains\` on a 10k id list can exceed SQL parameter / plan limits — use a TVP or temp table.
- Compiling a new expression per request without cache (EF compiled queries exist for a reason on ultra-hot paths).
      `,
      code: `public sealed class BoardQueries(AppDbContext db)
{
    public async Task<IReadOnlyList<BoardDto>> GetBoardsBadAsync(CancellationToken ct)
    {
        var boards = await db.Boards.AsNoTracking().ToListAsync(ct);
        var result = new List<BoardDto>();
        foreach (var b in boards)
        {
            var itemCount = await db.Items.CountAsync(i => i.BoardId == b.Id, ct);
            result.Add(new BoardDto(b.Id, b.Name, itemCount));
        }
        return result;
    }

    public async Task<IReadOnlyList<BoardDto>> GetBoardsGoodAsync(CancellationToken ct)
    {
        return await db.Boards
            .AsNoTracking()
            .Select(b => new BoardDto(b.Id, b.Name, b.Items.Count))
            .ToListAsync(ct);
    }
}`,
      commonMistakes: [
        'Lazy loading enabled in a Web API; serializers walk navigations and detonate N+1.',
        'ToList() on a DbSet, then LINQ-to-Objects Where for a "quick filter".',
        'Using Include for three collections in one query and wondering why the result set exploded.',
      ],
      bestPractices: [
        'Project to DTOs in IQueryable so SQL returns only needed columns.',
        'Disable lazy loading in ASP.NET; prefer explicit queries.',
        'Budget round-trips: one query per HTTP request is a useful default, not a religion.',
      ],
      interviewQs: [
        {
          q: 'Walk through an N+1 caused by LINQ, not by an ORM "bug".',
          a: 'You load boards with ToListAsync. Then in C# you do boards.Select(b => b.Items.Count) or you await a CountAsync per board. Each iteration is a new SQL. LINQ did exactly what you asked: the inner query is a separate IQueryable executed immediately. EF Include can hide this for navigations, but a hand-written query in a loop is still N+1. The senior fix is a single grouped query or a projection that lets EF emit a JOIN or a scalar subquery. Adding AsNoTracking does not reduce round-trips; it only reduces tracking cost per round-trip. Logging RelationalEventId.CommandExecuted is how you prove N+1 in review.',
          bangla: 'ToList করে তারপর লুপে CountAsync/নেভিগেশন — প্রতি ইটারেশনে SQL। এক Select প্রজেকশনে JOIN বা সাবকুয়েরি করুন। AsNoTracking রাউন্ড-ট্রিপ কমায় না।',
          followUp: 'How does JSON serialization trigger N+1 with lazy loading?',
          difficulty: 'senior',
        },
        {
          q: 'Where is the worst place to call AsEnumerable in a LINQ chain?',
          a: 'Immediately after DbSet, before Where/OrderBy/Skip/Take/Select. That downloads the table (or the unfiltered set) and turns every subsequent operator into LINQ to Objects. The second-worst place is after a wide Include and before a filter that could have been a SQL WHERE. The acceptable place is after a selective SQL projection when you need a CLR-only function on a small in-memory set. Interviewers look for you to say: push predicates and pagination to SQL, then AsEnumerable as a last-mile escape hatch, never as a default.',
          bangla: 'Where/Skip/Take-এর আগে AsEnumerable মানে পুরো সেট মেমোরিতে। আগে SQL-এ ফিল্টার ও পেজ, শেষে ছোট সেটে AsEnumerable।',
          followUp: 'How do you find accidental client evaluation in EF Core 8?',
          difficulty: 'expert',
        },
        {
          q: 'Does Parallel.ForEach on a LINQ query make it faster?',
          a: 'For IQueryable, almost never in a web request. You will open many database connections, fight the pool, and risk thread-pool starvation if the body is sync-over-async. For CPU-bound LINQ to Objects on a large in-memory array, PLINQ (AsParallel) or Parallel.ForEach can help, but you must not share a DbContext across threads — it is not thread-safe. The usual win is a better query shape, an index, and a projection, not more threads. If you need fan-out I/O, that is Task.WhenAll on independent queries with separate scopes, not Parallel.ForEach.',
          bangla: 'IQueryable-এ Parallel.ForEach কানেকশন মাল্টিপ্লাই করে, DbContext থ্রেড-সেফ নয়। ওয়েব রিকোয়েস্টে কুয়েরি শেপ ও ইনডেক্সই আসল অপটিমাইজেশন।',
          followUp: 'Contrast this with Task.WhenAll for independent HTTP calls.',
          difficulty: 'expert',
        },
      ],
      practice:
        'Enable EF command logging on a board endpoint. Confirm N+1, then replace the loop with a single Select projection. Record SQL count before/after.',
    },
    {
      topic: 'How Select works internally and optimizing a slow LINQ query',
      difficulty: 'expert',
      english:
        'When you call Select, LINQ to Objects allocates a specialized iterator (SelectEnumerableIterator, or a list/array-optimized variant) that stores the source and the selector Func. It does not walk items and it does not call your lambda. MoveNext pulls one source item and invokes the selector; yield-style pipelines therefore allocate one iterator per operator and can be slower than a fused foreach in a tight CPU loop. On IQueryable, Select does not allocate that iterator; it appends a MethodCallExpression to the expression tree. Execution still waits for a terminal operator, at which point EF translates projection into a SELECT list — this is why Select to an anonymous type/DTO is the main optimization: fewer columns, no tracked entities, often no JOIN to unused navigations. Optimizing a slow LINQ query is a sequence: capture SQL, read the plan, check whether work is in SQL or in CLR, then fix shape (filter, project, page) before adding indexes. When NOT to use LINQ: micro-hot loops over arrays where you already know the shape; a for loop with no delegate allocation wins. When NOT to "optimize" Select: replacing a clear query with a 40-line manual mapper that still runs the same SQL.',
      bangla:
        'Select কল করলেই ল্যাম্বডা চলে না — ইটারেটর বা এক্সপ্রেশন ট্রি তৈরি হয়। MoveNext/SQL এক্সিকিউশনে প্রজেকশন হয়। স্লো কুয়েরিতে আগে SQL ও প্ল্যান দেখুন, তারপর ফিল্টার-প্রজেক্ট-পেজ, তারপর ইনডেক্স।',
      details: `
### What happens when Select is called?

| Stack | \`Select\` return | Work done at call time | Work done at enumeration |
| :--- | :--- | :--- | :--- |
| LINQ to Objects | Iterator object | Allocate iterator, capture source + selector | \`selector(item)\` per \`MoveNext\` |
| LINQ to Entities | New \`IQueryable\` | Grow expression tree | Translate + SQL + materialize |

### Optimization playbook (slow endpoint)
1. Confirm it is this query (trace id, MiniProfiler, \`ToQueryString\`).
2. Is SQL slow or is CLR slow after a huge materialize?
3. Push \`Where\` and pagination before \`Select\` of large graphs.
4. Replace \`Include\` trees with DTO \`Select\`.
5. \`AsNoTracking\` for read-only.
6. Only then: indexes, compiled query, split query.
7. Last: raw SQL / Dapper for a plan EF cannot shape.

### When LINQ is the wrong tool
- Inner loop of a serializer/parser over \`Span<T>\`.
- You need a single pass with three aggregations and no extra allocations — write the loop.
      `,
      code: `public sealed class SlowOrderSearch(AppDbContext db)
{
    public async Task<IReadOnlyList<OrderSearchRow>> SearchAsync(
        OrderSearchQuery q,
        CancellationToken ct)
    {
        var query = db.Orders.AsNoTracking().Where(o => o.TenantId == q.TenantId);

        if (!string.IsNullOrWhiteSpace(q.Status))
            query = query.Where(o => o.Status == q.Status);

        if (q.From is { } from)
            query = query.Where(o => o.CreatedAt >= from);

        return await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderSearchRow(
                o.Id,
                o.Number,
                o.Status,
                o.CreatedAt,
                o.Customer.Name))
            .Skip((q.Page - 1) * q.PageSize)
            .Take(q.PageSize)
            .ToListAsync(ct);
    }
}`,
      commonMistakes: [
        'Assuming Select executes immediately because it is named like a transformation.',
        'Optimizing C# iterator allocations when the SQL plan is a table scan.',
        'Selecting full entities then mapping to DTOs in memory (double allocation, wide SQL).',
      ],
      bestPractices: [
        'Answer "what happens when Select is called?" with: capture, do not execute.',
        'Optimize by changing what SQL is generated, not by micro-tuning lambdas first.',
        'Keep a ToQueryString dump in the PR for any query you had to tune.',
      ],
      interviewQs: [
        {
          q: 'What happens when Select is called?',
          a: 'Nothing walks the source. In LINQ to Objects, Enumerable.Select constructs an iterator that holds a reference to the source sequence and the selector delegate. Your lambda has not run; no items have been read. The first MoveNext of that iterator reads one source item and invokes the selector, then yields the result. Additional operators wrap another iterator around this one, which is why a long chain allocates several small objects. In EF, Queryable.Select does not build that iterator; it builds an expression tree node representing the projection. SQL is generated later when you enumerate or call ToListAsync. This is the core interview answer: Select is composition, not execution.',
          bangla: 'Select সোর্স ঘোরে না — LINQ to Objects-এ ইটারেটর, EF-এ এক্সপ্রেশন নোড। ল্যাম্বডা চলে MoveNext বা ToListAsync-এ।',
          followUp: 'Then when does the selector lambda actually run for a List vs a DbSet?',
          difficulty: 'expert',
        },
        {
          q: 'How do you optimize a LINQ query that went from 80ms to 3s in production?',
          a: 'First prove where the 3s is: SQL duration vs app CPU vs extra round-trips. If SQL: look at the plan for scans, implicit conversions, and row estimates; check whether a new filter disabled SARGability. If N+1: count commands per request. If a huge Include: cartesian product. Then reshape: filter by tenant/date first, project to a DTO, page with a seekable OrderBy, AsNoTracking. Indexes come after you know the predicate. Compiled queries help only when the shape is fixed and CPU of compilation shows up — rare compared to bad SQL. I would not start by rewriting LINQ into foreach; that does not change the database work.',
          bangla: 'আগে মাপুন: SQL, CPU, নাকি N+1। তারপর ফিল্টার-প্রজেক্ট-পেজ-AsNoTracking, তারপর ইনডেক্স। foreach-এ রিরাইট ডাটাবেজ কাজ বদলায় না।',
          followUp: 'What if ToQueryString looks fine but the app still allocates 2 GB?',
          difficulty: 'expert',
        },
        {
          q: 'When would you refuse to use LINQ for a transformation?',
          a: 'When the hot path is already in memory, the operation is a single pass, and profiler shows delegate and iterator allocations matter — image processing, parsers, tight numeric loops. LINQ’s extra virtual calls and heap iterators are real there. I also refuse LINQ when the team cannot read the query and the SQL it implies; a verbose join in SQL or a compiled Dapper query is safer. I do not refuse LINQ for ordinary business filters; readability and translation to SQL are the point. The senior move is to know which layer is hot before rewriting style.',
          bangla: 'টাইট CPU লুপ বা প্রোফাইলে ইটারেটর অ্যালোকেশন দেখা গেলে foreach। সাধারণ বিজনেস ফিল্টারে LINQ-ই ঠিক — আগে হট লেয়ার জানুন।',
          followUp: 'How do you explain this to a junior who was told "never use foreach"?',
          difficulty: 'senior',
        },
        {
          q: 'Why can Select to a DTO be faster than Include + map?',
          a: 'Include materializes full tracked (or even untracked) entities for the graph, including columns you will discard, and may JOIN in a way that duplicates parent rows. Select to a DTO tells EF the exact columns and lets it emit a JOIN or subquery only for those. No change tracker snapshots, smaller network payload, less GC. The trade-off is you cannot then mutate those DTOs with SaveChanges; they are not entities. For read APIs that is the desired design. For an update workflow you load a tracked entity with a narrow query, not a 12-Include graph.',
          bangla: 'Include পুরো এন্টিটি গ্রাফ আনে; DTO Select শুধু দরকারি কলাম। রিড API-তে এটাই দ্রুত — আপডেটে ট্র্যাকড এন্টিটি আলাদা কুয়েরি।',
          followUp: 'Does AsNoTracking plus Include close the gap? Why not fully?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Take a slow search query. Dump ToQueryString, read the plan, convert Include to DTO Select, add AsNoTracking, and write the before/after duration in a comment.',
    },
  ],
  quickRevision: {
    concepts: [
      'Deferred: Where/Select compose; they do not run',
      'Immediate: ToList, First, Any, Count, aggregates',
      'Multiple enumeration repeats SQL and side effects',
      'IEnumerable = Func in CLR; IQueryable = Expression → SQL',
      'AsEnumerable too early downloads the table',
      'First vs Single vs *OrDefault cardinality',
      'SelectMany flattens; Join is inner; left join needs DefaultIfEmpty',
      'Union dedupes (UNION); Concat keeps bags (UNION ALL)',
      'N+1 is a query in a loop, not an EF mystery',
      'Select call time = capture iterator or expression, not execution',
    ],
    questions: [
      'When does LINQ execute?',
      'What happens when Select is called?',
      'Why does IEnumerable cause performance problems?',
      'Why is IQueryable dangerous as a public API?',
      'First vs Single vs FirstOrDefault for GetById?',
      'Any() vs Count() > 0 on a DbSet?',
      'Union vs Concat / UNION vs UNION ALL?',
      'How do you kill N+1 with a projection?',
      'Why is Skip/Take on page 5000 slow?',
      'How do you optimize a LINQ query that became 3s?',
    ],
    mistakes: [
      'Enumerating the same IQueryable twice (Any then ToList)',
      'Repository returns IEnumerable so caller filters in memory',
      'Distinct() on entities expecting Id uniqueness',
      'Lazy loading + JSON serializer = N+1',
      'Offset pagination without OrderBy',
    ],
    scenarios: [
      'Endpoint hits SQL twice per request after a null check',
      'Report API loads 2 million rows then Take(50) in memory',
      'Single() throws in production because a unique index was never added',
      'Include of two collections explodes row count',
      'Select with a local method throws TranslationFailedException',
    ],
  },
  revisionSummary: `
- LINQ executes on enumeration, not on Where/Select. Select captures an iterator or an expression tree.
- IEnumerable filters in memory (perf trap at the repository boundary). IQueryable is powerful and dangerous: leaked queries, bad SQL, client eval.
- Optimize by shaping SQL (filter, project, page, AsNoTracking), proving N+1 with logs, then indexing — not by sprinkling ToList or Parallel.ForEach.
  `,
  summary:
    'Senior LINQ is about when work runs, which engine runs it, and how a one-line operator change becomes a production incident.',
};
