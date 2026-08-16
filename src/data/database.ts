export const databaseData = {
  id: 'database',
  title: 'Entity Framework Core',
  description: 'Tracking, N+1, concurrency, ExecuteUpdate, Dapper, and the EF decisions seniors make in production.',
  sections: [
    {
      topic: "DbContext & Change Tracking",
      english: "DbContext is the bridge to the DB. Change Tracking allows EF to know which objects were modified and generate optimized SQL Updates. Use .AsNoTracking() for Read-only queries to save memory.",
      bangla: "ডিবি-কন্টেক্সট হলো ডাটাবেজের প্রবেশদ্বার। চেঞ্জ ট্র্যাকিং এর মাধ্যমে ইএফ বুঝতে পারে কোন ডাটা আপডেট হয়েছে। রিড-অনলি কুয়েরির জন্য 'AsNoTracking' ব্যবহার করা পারফরম্যান্সের জন্য দারুণ।",
      details: `
| Tracking Mode | Usage | Performance Effect |
| :--- | :--- | :--- |
| **Tracking** | CRUD operations (Update/Insert/Delete) | High memory usage inside context. |
| **No-Tracking** | Fetching data for UI (Read-only) | Much faster & lower memory footprint. |
      `,
      commonMistakes: [
        "Using Tracking for data that only needs to be displayed.",
        "Creating a new DbContext inside a loop.",
        "Forgetting to call .SaveChangesAsync()."
      ],
      bestPractices: [
        "Use .AsNoTracking() by default for GET requests.",
        "Use IDbContextFactory for long-lived background workers.",
        "Keep DbContext scope matching the HTTP request (Scoped)."
      ],
      interviewQs: [
        {
          q: "What is the difference between .ToList() and .AsEnumerable()?",
          a: "ToList() immediately executes the SQL query and loads all results into a List<T> in memory — the database round trip happens right there. AsEnumerable() switches evaluation from IQueryable (database-side) to IEnumerable (memory-side) without executing immediately — the SQL runs when the sequence is first iterated, but all subsequent LINQ operators execute in memory rather than being translated to SQL. Use AsEnumerable() when you need LINQ operators that EF Core cannot translate to SQL. Use ToList() when you need the data eagerly available.",
          bangla: "ToList() সাথে সাথে SQL চালায়, AsEnumerable() DB থেকে memory তে switch করে — পরের LINQ operators গুলো তখন memory তে চলে, SQL এ translate হয় না।"
        },
        {
          q: "Explain the 'Unit of Work' pattern in EF Core.",
          a: "Unit of Work tracks all changes made during a business operation and commits them as a single atomic transaction. In EF Core, DbContext itself is the Unit of Work — it tracks entity states (Added, Modified, Deleted) via Change Tracking, and SaveChangesAsync() wraps all pending changes in one database transaction. A custom IUnitOfWork interface typically exposes SaveChangesAsync() and optionally BeginTransactionAsync() for scenarios requiring explicit multi-step transaction control across multiple repositories.",
          bangla: "DbContext নিজেই Unit of Work — সব change track করে SaveChangesAsync() এ একটি atomic transaction এ commit করে।"
        },
        {
          q: "How does EF Core track changes?",
          a: "When an entity is loaded from the database, EF Core's Change Tracker stores a snapshot of its property values. On SaveChanges(), it calls DetectChanges() to compare current values against the snapshot and identifies which properties changed. It then generates UPDATE statements only for those specific columns. New entities are in Added state and generate INSERT. Detached or explicitly removed entities generate DELETE. Using AsNoTracking() bypasses the entire snapshot mechanism, which is why it is significantly faster for read-only queries.",
          bangla: "Load করার সময় snapshot নেয়, SaveChanges() এ compare করে শুধু changed column এর UPDATE তৈরি করে — AsNoTracking() snapshot skip করে বলে দ্রুত।"
        }
      ],
      practice: "Optimize a query that fetches 5,000 product records for a report.",
      code: `var products = await _context.Products
    .AsNoTracking()
    .Where(p => p.IsActive)
    .ToListAsync();`
    },
    {
      topic: "The N+1 Problem & .Include()",
      english: "N+1 happens when related data is fetched inside a loop, causing N separate DB queries. Use Eager Loading (.Include) to fetch everything in one join query.",
      bangla: "এন-প্লাস-ওয়ান সমস্যা ডাটাবেজকে অনেক স্লো করে দেয়। লুপের ভেতর কুয়েরি না করে .Include বা .ThenInclude ব্যবহার করে একবারে সব ডাটা নিয়ে আসা উচিত।",
      details: `
- **Eager Loading**: Fetch related data along with the main entity using \`.Include()\`.
- **Explicit Loading**: Fetch related data manually later using \`.Entry().Collection().Load()\`.
- **Lazy Loading**: Automatic fetching on access (Avoid in Web APIs due to serialization traps).
      `,
      commonMistakes: [
        "Accessing navigation properties inside a foreach loop without eager loading.",
        "Over-including (Global Include) leading to giant SQL result sets.",
        "Enabling Lazy Loading globally for APIs."
      ],
      bestPractices: [
        "Project only the columns you need using .Select(x => new DTO { ... }).",
        "Use .AsSplitQuery() for giant Includes to prevent Cartesian product impact.",
        "Avoid multi-level deep includes if possible."
      ],
      interviewQs: [
        {
          q: "What is the Cartesian Product problem in EF Core 5+?",
          a: "When eager-loading multiple one-to-many collections using Include and ThenInclude in a single JOIN query, SQL multiplies rows — one blog with 10 posts and 5 tags per post produces 50 result rows for a single blog record. EF Core emits a warning for this and recommends AsSplitQuery(), which executes one separate SQL query per Include instead of one giant JOIN. This trades multiple round trips for avoiding the exponential row explosion that degrades both database and network performance.",
          bangla: "Multiple collection Include করলে row multiplication হয় — AsSplitQuery() দিয়ে আলাদা আলাদা query তে ভাগ করুন, giant JOIN এর চেয়ে ভালো।"
        },
        {
          q: "How do you solve the N+1 issue?",
          a: "Use Include() for eager loading to fetch related data in one JOIN query. For multi-collection includes that cause Cartesian explosion, use AsSplitQuery() to split into separate queries. For read-heavy projections, use Select(x => new DTO { ... }) — EF generates a single query fetching only the needed columns with no navigation property materialization. For complex reporting where EF's query translator is limiting, drop to Dapper with explicit SQL JOINs for full control.",
          bangla: "Include() দিয়ে eager loading করুন, Cartesian explosion এ AsSplitQuery() — complex reporting এ EF এর limit হলে Dapper দিয়ে raw SQL।"
        },
        {
          q: "Eager vs Lazy vs Explicit loading differences?",
          a: "Eager Loading via Include() fetches related data in the same SQL query using a JOIN — best when you know upfront that related data is always needed. Lazy Loading uses proxy objects that issue a separate database query the moment a navigation property is accessed — simple but causes N+1 in loops and triggers unexpected queries during JSON serialization. Explicit Loading via Entry(entity).Collection(x => x.Items).LoadAsync() gives precise on-demand control without the serialization trap risk of lazy loading.",
          bangla: "Eager সব এক query তে নিয়ে আসে, Lazy access করার মুহূর্তে query চালায় (N+1 risk), Explicit নিজে control করা — API তে Lazy Loading avoid করুন।"
        }
      ],
      practice: "Write a query that fetches Blogs, their Posts, and the Post Authors in one SQL hit.",
      code: `var blogs = await _context.Blogs
    .Include(b => b.Posts)
        .ThenInclude(p => p.Author)
    .AsNoTracking()
    .ToListAsync();`
    },
    {
      topic: "Dapper for Micro-ORM Performance",
      english: "Dapper is a micro-ORM that provides raw SQL performance with C# object mapping. It's often used for complex reporting or high-traffic read operations.",
      bangla: "ড্যাপার (Dapper) অনেক ফাস্ট কারণ এটি সরাসরি SQL কুয়েরি চালায়। যেখানে পারফরম্যান্স খুব বেশি দরকার সেখানে ইএফ এর বদলে ড্যাপার ব্যবহার করা ভালো।",
      commonMistakes: [
        "String concatenation leading to SQL Injection (Always use parameters).",
        "Opening connections but forgetting to close them.",
        "Manual mapping when Dapper does it automatically."
      ],
      bestPractices: [
        "Use Dapper for Read operations and EF for complex Writes (CQRS approach).",
        "Always use 'using' statements for IDbConnection.",
        "Use QueryMultiple for multiple result sets in one database trip."
      ],
      interviewQs: [
        {
          q: "Why is Dapper faster than EF Core?",
          a: "Dapper executes raw SQL directly and maps result rows to objects using IL-emitted property setters with almost zero overhead. EF Core adds multiple layers on top: expression tree compilation, Change Tracking snapshot allocation, identity map resolution, query caching infrastructure, and entity materialization pipeline. For read-only queries none of this tracking overhead adds value — it is pure cost. Benchmarks typically show Dapper being 2-5x faster than EF Core for complex read queries.",
          bangla: "Raw SQL সরাসরি চালায়, Change Tracking বা identity map নেই — read-only query তে EF এর সব overhead বাদ যায়, সাধারণত 2-5x দ্রুত।"
        },
        {
          q: "Does Dapper support change tracking?",
          a: "No. Dapper is a thin SQL mapper — it executes your SQL and maps rows to objects with no awareness of object state, no identity map, no unit of work, and no automatic SQL generation. Every data modification requires an explicit parameterized INSERT, UPDATE, or DELETE command. This is why Dapper pairs well with EF Core in CQRS architecture: Dapper handles the read side where tracking adds nothing, EF Core handles the write side where change tracking adds genuine value.",
          bangla: "Dapper তে change tracking নেই — প্রতিটা modification এ explicit SQL লিখতে হয়। CQRS এ Dapper read side, EF Core write side handle করে।"
        },
        {
          q: "How do you handle SQL Injection in Dapper?",
          a: "Always use parameterized queries — pass parameters via anonymous objects: db.QueryAsync<User>(\"SELECT * FROM Users WHERE Id = @Id\", new { Id = id }). Dapper maps the object properties to SQL parameters, never interpolating them into the query string. Never use C# string interpolation or concatenation to build SQL from user input. For dynamic query building (e.g., optional WHERE clauses), use Dapper's DynamicParameters class to add parameters programmatically while keeping the SQL itself a fixed template.",
          bangla: "Anonymous object দিয়ে parameterized query ব্যবহার করুন — string interpolation বা concatenation দিয়ে SQL build করলে SQL injection এর risk থাকে।"
        }
      ],
      practice: "Execute a stored procedure that returns a list of Users using Dapper.",
      code: `using var db = new SqlConnection(conn);
var users = await db.QueryAsync<User>("GetUsers",
    new { status = 1 },
    commandType: CommandType.StoredProcedure);`
    },
    {
      topic: "Relationships, Include vs Projection, Concurrency",
      difficulty: 'senior',
      english: "EF Core maps one-to-one, one-to-many, and many-to-many with navigation properties. Include/ThenInclude loads full graphs and is easy to over-fetch. Projection (Select to DTO) is usually faster for reads. Optimistic concurrency uses a RowVersion/xmin token so two users updating the same row do not silently overwrite. SaveChanges generates tracked INSERT/UPDATE/DELETE; ExecuteUpdate/ExecuteDelete run set-based SQL without loading entities.",
      bangla: 'Include পুরো গ্রাফ লোড করে। রিডে DTO প্রজেকশন ভালো। দুই ইউজার এক রো আপডেটে RowVersion লাগে। ExecuteUpdate ট্র্যাকিং ছাড়া সেট-বেসড SQL।',
      details: `
| Technique | Loads entities | Tracking | Best for |
| :--- | :--- | :--- | :--- |
| Include | Yes, full graph | Default on | Updating a graph |
| Select DTO | Only chosen columns | No | API GET |
| Explicit Load | On demand | Yes | Rare branches |
| Lazy loading | Hidden queries | Yes | Often N+1 — avoid in APIs |
| ExecuteUpdate | No | No | Bulk update |

### Also know
- Global query filters (soft delete, tenant)
- Shadow properties, value converters, owned entities
- Compiled queries for hot paths
- Fluent API over data annotations for non-trivial mapping
- DbContext: Scoped per request; IDbContextFactory for workers
      `,
      commonMistakes: [
        'Lazy loading enabled in a web API — silent N+1.',
        'Include of huge collections then serializing entities (circular refs).',
        'Catching DbUpdateConcurrencyException and retrying blindly without reload.',
      ],
      bestPractices: [
        'AsNoTracking + projection for reads.',
        'RowVersion on every concurrently edited aggregate.',
        'Transactions around multi-entity invariants; do not open a transaction per row in a loop.',
      ],
      interviewQs: [
        {
          q: 'Include vs projection — which should an API GET use?',
          a: 'Projection. Include materializes full entities, tracks them unless AsNoTracking, and often over-fetches columns and graphs you will not return. Select to a DTO translates to a narrow SQL SELECT, skips tracking, and avoids circular JSON. Use Include when you intend to mutate the graph and SaveChanges.',
          bangla: 'GET এ DTO Select করুন। Include আপডেটের জন্য।',
          followUp: 'When is AsSplitQuery necessary?',
          difficulty: 'senior',
        },
        {
          q: 'SaveChanges vs ExecuteUpdate?',
          a: 'SaveChanges is the Unit of Work: it sends changes EF already tracked, runs interceptors, and updates tracked instances. ExecuteUpdate is a LINQ-to-SQL bulk statement — no tracking, no per-entity events, immediate SQL. Use ExecuteUpdate for "deactivate all expired sessions". Do not mix assuming tracked entities are updated in memory — they are not.',
          bangla: 'SaveChanges ট্র্যাক করা চেঞ্জ। ExecuteUpdate সরাসরি SQL, মেমোরিতে এন্টিটি আপডেট হয় না।',
          difficulty: 'senior',
        },
        {
          q: 'How do you stop lost updates when two users edit the same order?',
          a: 'Optimistic concurrency: a RowVersion column. EF adds it to the UPDATE WHERE clause. If rows affected is 0, DbUpdateConcurrencyException. Reload, merge or reject, retry. Pessimistic locking (UPDLOCK) is for short critical sections and can deadlock under load. For checkouts, also use idempotency keys so retries do not double-charge.',
          bangla: 'RowVersion দিয়ে optimistic concurrency। কনফ্লিক্টে রিলোড বা রিজেক্ট।',
          difficulty: 'expert',
        },
      ],
      practice: 'Add a byte[] RowVersion to Order, handle DbUpdateConcurrencyException in an update endpoint.',
      code: `public class Order
{
    public int Id { get; set; }
    public decimal Total { get; set; }
    [Timestamp] public byte[] RowVersion { get; set; } = [];
}

await _db.Orders
    .Where(o => o.Status == Status.Expired)
    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, Status.Closed), ct);`,
      sql: `-- Optimistic concurrency token
ALTER TABLE Orders ADD RowVersion rowversion NOT NULL;`,
    }
  ],
  quickRevision: {
    concepts: [
      'DbContext is Unit of Work + identity map',
      'AsNoTracking for reads',
      'N+1 vs Include vs projection vs SplitQuery',
      'Change tracker snapshots',
      'RowVersion / DbUpdateConcurrencyException',
      'ExecuteUpdate vs SaveChanges',
      'Global query filters',
      'Dapper for heavy reads',
      'Parameterized SQL only',
      'Scoped DbContext, never Singleton',
    ],
    questions: [
      'ToList vs AsEnumerable?',
      'How does change tracking work?',
      'Why is Dapper faster?',
      'Include vs Select DTO?',
      'SaveChanges vs ExecuteUpdate?',
      'How do you fix N+1?',
      'What is a global query filter?',
      'Why not lazy loading in APIs?',
      'How do you handle lost updates?',
      'EF Core vs Dapper — when each?',
    ],
    mistakes: [
      'Tracking for display-only queries',
      'New DbContext inside a loop',
      'String-concatenated SQL',
      'Serializing tracked entity graphs',
      'Ignoring concurrency tokens',
    ],
    scenarios: [
      'GET /orders became 10x slower after adding Include',
      'Two admins overwrite each other\'s edits',
      'Soft-delete filter hiding rows in admin reports',
      'Worker using a disposed scoped context',
      'Bulk deactivate 2 million rows via tracked SaveChanges',
    ],
  },
  revisionSummary: `
- **Performance**: Use .AsNoTracking() and Projection (.Select).
- **Relational**: Solve N+1 with .Include() or .AsSplitQuery().
- **Hybrid**: Use Dapper for high-speed reads, EF for standard CRUD.
- **Security**: Never use string interpolation for SQL; use Parameters.
- **Concurrency**: RowVersion on aggregates people edit concurrently.
  `,
  summary: "ডাটাবেজ ম্যানেজমেন্টে ইএফ কোর এবং ড্যাপারের সঠিক কম্বিনেশন ব্যবহার করা একজন প্রফেশনাল ডেভেলপারের বড় গুণ।"
};
