export const databaseData = {
  id: 'database',
  title: 'Entity Framework & SQL Server',
  description: 'Master Object-Relational Mapping (ORM) and low-level SQL optimization for high-performance applications.',
  sections: [
    {
      topic: "DbContext & Change Tracking",
      english: "DbContext is the bridge to the DB. Change Tracking allows EF to know which objects were modified and generate optimized SQL Updates. Use .AsNoTracking() for Read-only queries to save memory.",
      bangla: "ডিবি-কন্টেক্সট হলো ডাটাবেজের প্রবেশদ্বার। চেঞ্জ ট্র্যাকিং এর মাধ্যমে ইএফ বুঝতে পারে কোন ডাটা আপডেট হয়েছে। রিড-অনলি কুয়েরির জন্য ‘AsNoTracking’ ব্যবহার করা পারফরম্যান্সের জন্য দারুণ।",
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
        "What is the difference between .ToList() and .AsEnumerable()?",
        "Explain the 'Unit of Work' pattern in EF Core.",
        "How does EF Core track changes?"
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
      bangla: "এন-প্লাস-ওয়ান সমস্যা ডাটাবেজকে অনেক স্লো করে দেয়। লুপের ভেতর কুয়েরি না করে .Include বা .ThenInclude ব্যবহার করে একবারে সব ডাটা নিয়ে আসা উচিত।",
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
        "What is the Cartesian Product problem in EF Core 5+?",
        "How do you solve the N+1 issue?",
        "Eager vs Lazy vs Explicit loading differences?"
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
      bangla: "ড্যাপার (Dapper) অনেক ফাস্ট কারণ এটি সরাসরি SQL কুয়েরি চালায়। যেখানে পারফরম্যান্স খুব বেশি দরকার সেখানে ইএফ এর বদলে ড্যাপার ব্যবহার করা ভালো।",
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
        "Why is Dapper faster than EF Core?",
        "Does Dapper support change tracking?",
        "How do you handle SQL Injection in Dapper?"
      ],
      practice: "Execute a stored procedure that returns a list of Users using Dapper.",
      code: `using var db = new SqlConnection(conn);
var users = await db.QueryAsync<User>("GetUsers", 
    new { status = 1 }, 
    commandType: CommandType.StoredProcedure);`
    }
  ],
  revisionSummary: `
- **Performance**: Use .AsNoTracking() and Projection (.Select).
- **Relational**: Solve N+1 with .Include() or .AsSplitQuery().
- **Hybrid**: Use Dapper for high-speed reads, EF for standard CRUD.
- **Security**: Never use string interpolation for SQL; use Parameters.
  `,
  summary: "ডাটাবেজ ম্যানেজমেন্টে ইএফ কোর এবং ড্যাপারের সঠিক কম্বিনেশন ব্যবহার করা একজন প্রফেশনাল ডেভেলপারের বড় গুণ।"
};
