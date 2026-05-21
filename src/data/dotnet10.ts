export const dotnet10Data = {
  id: 'dotnet10',
  title: '.NET 10 & C# 14 — Advanced Platform Features',
  description: 'Production-grade patterns for C# 14 field-backed domain encapsulation, EF Core 10 Named Query Filters for multi-tenancy, and high-performance T-SQL batch processing.',
  sections: [
    {
      topic: "C# 14 Field Keyword: Clean DDD Entity Encapsulation",
      english: "C# 14 introduces the 'field' keyword inside property accessors. It refers to the compiler-generated backing store for that property, eliminating the need to manually declare a separate private field. For rich DDD entities where every property is guarded by an invariant, this is a genuine signal-to-noise upgrade — the guard logic stays, the boilerplate disappears.",
      bangla: "সি# ১৪ এর 'field' কীওয়ার্ড দিয়ে এখন প্রপার্টির setter-এর ভেতর সরাসরি ভ্যালিডেশন লেখা যায়, আলাদা ব্যাকিং ফিল্ড ডিক্লেয়ার না করেই। ডিডিডি এন্টিটিতে যেখানে প্রতিটা প্রপার্টি ইনভেরিয়েন্ট গার্ড দিয়ে প্রটেক্টেড, সেখানে এটি কোডকে অনেক পরিষ্কার করে।",
      details: `
### The Old Pain Point
In C# 13 and earlier, every property with custom accessor logic needed a separate private backing field declaration. A DDD entity with 8 validated properties had 8 redundant field declarations cluttering the top of the class.

### C# 14 \`field\` Keyword — Before vs After
| Aspect | Before C# 14 | After C# 14 (\`field\` keyword) |
| :--- | :--- | :--- |
| **Backing Field** | Manually declared (\`private string _name;\`) | Compiler-generated; accessed via \`field\` |
| **Boilerplate** | High — 2 lines of declaration per property | Zero — getter/setter only |
| **DDD Invariants** | Supported but verbose | Supported and concise |
| **Serialization** | Works as before | Works as before — no change |
| **EF Core Mapping** | Maps the manual backing field | Maps the compiler-generated field identically |

> **Key Rule:** \`field\` is ONLY valid inside a property accessor (\`get\`, \`set\`, or \`init\`). It always refers to the backing store for **that specific property** — it is not a free variable you can name anything.
      `,
      commonMistakes: [
        "Using 'field' outside a property accessor — it is meaningless there and will not compile.",
        "Applying 'field' to a pure auto-property with no custom body — those already have a compiler-generated store; 'field' is only needed when you add a custom get/set/init block.",
        "'field' is a soft keyword — a local variable named 'field' inside the accessor will shadow it silently, causing unexpected behavior."
      ],
      bestPractices: [
        "Replace every manual '_fieldName' backing field in your DDD entities with the 'field' keyword where the setter enforces a domain guard.",
        "Pair 'private set' with 'field' for full DDD encapsulation — public read, guarded write, no exposed backing field.",
        "Use 'init' + 'field' for Value Objects that require construction-time validation but must be immutable afterwards."
      ],
      interviewQs: [
        {
          q: "What problem does the C# 14 'field' keyword solve compared to manually declared backing fields in a DDD entity?",
          a: "In C# 13 and earlier, every property with custom validation in a domain entity required a separate private backing field declaration alongside the property. A DDD entity with 8 validated properties had 8 redundant field declarations adding noise above or below the properties. The field keyword provides direct access to the compiler-generated backing store from within the property accessor body, eliminating all manual field declarations while keeping all validation logic exactly where it belongs — in the property setter.",
          bangla: "Manual backing field declaration ছাড়াই property setter এ validation লেখা যায় — DDD entity অনেক পরিষ্কার হয়, noise বাদ যায়।"
        },
        {
          q: "Can you use the 'field' keyword inside an auto-property that has no custom accessor body?",
          a: "No. Auto-properties with no custom body (public string Name { get; set; }) already have a compiler-generated backing field, but field is only valid inside explicit accessor bodies. If the property has no custom logic there is no accessor body to write field = value inside. The field keyword is only needed and only valid when you add a custom get, set, or init block to a property. Attempting to use it in a pure auto-property is a compile error.",
          bangla: "Auto-property তে custom accessor body নেই, তাই field কীওয়ার্ড লেখার জায়গা নেই — custom set/init block থাকলে তখনই কাজ করে।"
        },
        {
          q: "How does 'field' interact with EF Core's shadow property and column mapping behavior?",
          a: "EF Core maps columns to properties, not to backing fields. Whether you use a manually declared _name backing field or the compiler-generated one accessed via field makes no difference to EF Core — the property is still Name, and EF still generates SELECT [Name] and maps the column to it. Shadow properties (columns with no corresponding C# property) are completely unaffected. The field keyword is a C# language-level concern; EF Core only sees the public property surface, not the backing store implementation.",
          bangla: "EF Core property দেখে, backing field এর implementation দেখে না — field keyword ব্যবহার করলেও SELECT [Name] একই থাকে।"
        }
      ],
      practice: "Refactor an existing 'Employee' domain entity — remove all private backing fields and replace them with C# 14 'field'-backed properties while keeping every domain guard validation intact and all EF Core mappings working.",
      code: `// ─── BEFORE C# 14: Noisy manual backing fields ───────────────────────────────
public sealed class Employee
{
    private string _name = string.Empty;       // noise
    private decimal _salary;                   // noise
    private string _department = string.Empty; // noise

    public string Name
    {
        get => _name;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Employee name cannot be empty.");
            _name = value;
        }
    }

    public decimal Salary
    {
        get => _salary;
        private set
        {
            if (value < 0)
                throw new DomainException("Salary cannot be negative.");
            _salary = value;
        }
    }

    public string Department
    {
        get => _department;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Department must be specified.");
            _department = value;
        }
    }
}

// ─── AFTER C# 14: field keyword — backing fields gone, guards remain ──────────
public sealed class Employee
{
    public string Name
    {
        get;
        private set  // domain guard lives here; 'field' is the compiler-generated store
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Employee name cannot be empty.");
            field = value;
        }
    } = string.Empty;

    public decimal Salary
    {
        get;
        private set
        {
            if (value < 0)
                throw new DomainException("Salary cannot be negative.");
            field = value;
        }
    }

    public string Department
    {
        get;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Department must be specified.");
            field = value;
        }
    } = string.Empty;

    // Factory method — only controlled entry point into the entity
    public static Employee Create(string name, decimal salary, string department)
    {
        var employee = new Employee();
        employee.Name = name;             // guard fires
        employee.Salary = salary;         // guard fires
        employee.Department = department; // guard fires
        return employee;
    }

    // Domain behaviour — raise with a business rule
    public void ApplyRaise(decimal percentage)
    {
        if (percentage is <= 0 or > 100)
            throw new DomainException("Raise percentage must be between 1 and 100.");
        Salary = Salary * (1 + percentage / 100m); // setter guard still fires on re-assignment
    }
}`
    },
    {
      topic: "EF Core 10 Named Query Filters: Stacked Multi-Tenancy & Soft Deletes",
      english: "EF Core 10 introduces Named Query Filters, replacing the single anonymous global filter with individually addressable, stackable filters per entity. You can now relax one specific filter at query time using .IgnoreQueryFilters(\"Name\") while leaving the rest active — solving the classic 'admin must see deleted records but must still respect the tenant boundary' challenge without resorting to raw SQL or a second DbContext.",
      bangla: "ইএফ কোর ১০ এর নেমড কুয়েরি ফিল্টার দিয়ে এখন প্রতিটা ফিল্টারকে আলাদা নাম দেওয়া যায় এবং প্রয়োজনে শুধু নির্দিষ্ট ফিল্টারটি ইগনোর করা যায়। আগে IgnoreQueryFilters() সব ফিল্টার একসাথে বাতিল করে দিত, এখন শুধু 'SoftDelete' বা শুধু 'TenantId' — যেকোনো একটি আলাদাভাবে বাইপাস করা সম্ভব।",
      details: `
| Scenario | EF Core ≤ 9 | EF Core 10 (Named Filters) |
| :--- | :--- | :--- |
| **Stack Multiple Filters** | One anonymous filter (last wins) | Multiple named filters, all active |
| **Ignore One Filter** | Not possible — must ignore ALL | \`.IgnoreQueryFilters("Name")\` |
| **Ignore All Filters** | \`.IgnoreQueryFilters()\` | \`.IgnoreQueryFilters()\` (still valid) |
| **Admin Sees Deleted** | Raw SQL or unsafe full-ignore | \`.IgnoreQueryFilters("SoftDelete")\` |
| **Cross-Tenant Report** | Two DbContext instances or raw SQL | \`.IgnoreQueryFilters("TenantId")\` |

> **Design Rule:** Name your filters to mirror business concepts — \`"SoftDelete"\`, \`"TenantId"\`, \`"ActiveOnly"\`. Any developer reading the query immediately understands which global rule is being relaxed, and why.
      `,
      commonMistakes: [
        "Capturing TenantId as a direct value in OnModelCreating — it bakes in the value at app start. Always capture it via an injected ITenantContext service so EF resolves it per request.",
        "Calling .IgnoreQueryFilters() with no arguments when you only need to bypass one filter — this silently exposes cross-tenant data in a multi-tenant system.",
        "Forgetting to add a composite index on (TenantId, IsDeleted) — every query gets both predicates and without the index it scans the full table on every request."
      ],
      bestPractices: [
        "Inject ITenantContext as a Scoped service and reference it inside the filter lambda so the TenantId is resolved per HTTP request, not per application start.",
        "Add a composite index on (TenantId, IsDeleted) for every multi-tenant soft-deletable entity — this is not optional at production scale.",
        "Only call .IgnoreQueryFilters(\"name\") inside repository methods that are explicitly designed for admin use cases; document that contract clearly."
      ],
      interviewQs: [
        {
          q: "What was the core limitation of EF Core's global query filter before EF Core 10, and how did Named Filters fix it?",
          a: "In EF Core 9 and earlier, each entity could have only one anonymous global query filter, and IgnoreQueryFilters() was all-or-nothing — calling it bypassed every filter simultaneously. If you needed to see soft-deleted records as an admin while still respecting tenant isolation, you had no clean option: bypassing the filter exposed all tenants' data, and keeping it blocked access to deleted records. Named Filters allow stacking multiple individually named filters and bypassing each one independently at query time.",
          bangla: "আগে IgnoreQueryFilters() সব filter bypass করত — Named Filter এ শুধু নির্দিষ্ট filter bypass সম্ভব, tenant isolation ঠিক রেখে deleted record দেখা যায়।"
        },
        {
          q: "How do you ensure the TenantId filter resolves the correct tenant per HTTP request and not a value baked in at application startup?",
          a: "Inject ITenantContext as a Scoped service into the DbContext constructor. The filter lambda captures the _tenantContext reference — a reference to the Scoped service instance, not its current value. Since DbContext is also Scoped, EF Core calls the filter lambda on each query, which reads _tenantContext.CurrentTenantId at that moment. The ITenantContext implementation reads the tenant claim from IHttpContextAccessor, so it resolves the correct tenant from the JWT on every individual HTTP request.",
          bangla: "ITenantContext Scoped inject করুন — lambda reference ধরে, startup এ value bake হয় না। প্রতিটা query তে JWT থেকে correct tenant resolve হয়।"
        },
        {
          q: "What is the real security risk of calling .IgnoreQueryFilters() with no arguments inside a multi-tenant system?",
          a: "Calling IgnoreQueryFilters() with no arguments disables ALL named filters simultaneously — including the TenantId filter. This means the query returns data across every tenant in the system. If this call is accidentally placed in a standard user-facing repository method rather than a deliberately admin-only one, it becomes a tenant data breach: one user sees every other tenant's data. Named Filters make the intent explicit and auditable — IgnoreQueryFilters(\"TenantId\") in code is a visible declaration that tenant boundaries are intentionally being crossed.",
          bangla: "Argument ছাড়া IgnoreQueryFilters() সব filter বাতিল করে — tenant data breach এর risk। সবসময় নাম দিয়ে call করুন, intent explicit হয়।"
        }
      ],
      practice: "Implement a multi-tenant soft-delete setup for an 'Invoice' entity using EF Core 10 Named Filters. Then write two separate repository methods: one that allows an admin to see soft-deleted invoices for the current tenant only, and one that allows a super-admin to see all invoices across all tenants.",
      code: `// ─── 1. Tenant Context — resolved per HTTP request via Claims ────────────────
public interface ITenantContext
{
    Guid CurrentTenantId { get; }
}

public sealed class HttpTenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _accessor;

    public HttpTenantContext(IHttpContextAccessor accessor)
        => _accessor = accessor;

    public Guid CurrentTenantId
        => Guid.Parse(_accessor.HttpContext!.User
            .FindFirstValue("tid") ?? throw new InvalidOperationException(
                "Tenant claim 'tid' is missing from the access token."));
}

// ─── 2. Entity with Soft Delete + Tenant ownership ────────────────────────────
public class Invoice
{
    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }
    public decimal Amount { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTimeOffset? DeletedAt { get; private set; }

    public void SoftDelete()
    {
        IsDeleted = true;
        DeletedAt = DateTimeOffset.UtcNow;
    }
}

// ─── 3. EF Core 10 Named Query Filters in DbContext ───────────────────────────
public sealed class AppDbContext : DbContext
{
    private readonly ITenantContext _tenantContext;

    public AppDbContext(DbContextOptions<AppDbContext> options, ITenantContext tenantContext)
        : base(options) => _tenantContext = tenantContext;

    public DbSet<Invoice> Invoices => Set<Invoice>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Invoice>(entity =>
        {
            // Named filter 1: Soft Delete — globally excludes logically deleted rows
            entity.HasQueryFilter("SoftDelete", i => !i.IsDeleted);

            // Named filter 2: Multi-Tenancy — scopes all queries to the current tenant
            // _tenantContext is Scoped: reads the claim on each request, never at startup
            entity.HasQueryFilter("TenantId", i => i.TenantId == _tenantContext.CurrentTenantId);

            entity.HasIndex(i => new { i.TenantId, i.IsDeleted }); // required for performance
        });
    }
}

// ─── 4. Repository — showing selective filter bypass ─────────────────────────
public sealed class InvoiceRepository
{
    private readonly AppDbContext _context;

    public InvoiceRepository(AppDbContext context) => _context = context;

    // Standard query — both filters active automatically (no bypass needed)
    public Task<List<Invoice>> GetActiveAsync(CancellationToken ct = default)
        => _context.Invoices.AsNoTracking().ToListAsync(ct);

    // Admin: view soft-deleted invoices — TenantId filter still active
    public Task<List<Invoice>> GetDeletedForCurrentTenantAsync(CancellationToken ct = default)
        => _context.Invoices
            .IgnoreQueryFilters("SoftDelete")  // only this one is relaxed
            .Where(i => i.IsDeleted)
            .AsNoTracking()
            .ToListAsync(ct);

    // Super-admin: full cross-tenant report — use only in admin-gated endpoints
    public Task<List<Invoice>> GetAllTenantsAsync(CancellationToken ct = default)
        => _context.Invoices
            .IgnoreQueryFilters()              // relax ALL — explicit and intentional
            .AsNoTracking()
            .ToListAsync(ct);
}`
    },
    {
      topic: "High-Performance T-SQL: Replacing Cursors with WHILE Loop Batches & .NET 10 JIT Loop Inversion",
      english: "Cursors are the performance nemesis of complex batch generation — payroll, salary sheets, financial period summaries. They operate RBAR (Row By Agonizing Row), issuing a round trip per record. A WHILE loop with a set-based batch INSERT processes hundreds of rows per iteration instead of one. On the .NET side, the .NET 10 JIT's Graph-Based Loop Inversion recompiles the SqlDataReader streaming while-loop into a do-while shape internally, eliminating the redundant first condition check and shaving measurable overhead from tight data-streaming paths.",
      bangla: "কার্সার (Cursor) ব্যবহার করলে প্রতিটা রো আলাদাভাবে প্রসেস হয় — বড় পেরোল ডাটার জন্য এটি ভয়াবহ স্লো। WHILE লুপে ব্যাচ INSERT দিয়ে একসাথে ৫০০ রো প্রসেস করা যায়। .NET ১০ এর JIT লুপ ইনভার্সন অপ্টিমাইজেশন ডাটা স্ট্রিমিংয়ের সময় লুপের প্রথম কন্ডিশন চেকের ওভারহেড কমিয়ে দেয়।",
      details: `
| Approach | Row Processing | Lock Behavior | Typical Cost (100K rows) |
| :--- | :--- | :--- | :--- |
| **CURSOR** | Row-by-row (RBAR) | Row-level lock held per iteration | ~45–90 seconds |
| **WHILE + Batch INSERT** | Set-based (500 rows per iteration) | Short-lived page lock per batch | ~2–5 seconds |
| **Single SET-based INSERT** | All rows in one pass | Table lock for the full duration | ~0.5–1 second |

> **Rule of Thumb:** A single set-based INSERT/SELECT is always the first choice. Use the WHILE batch pattern only when the aggregation logic is too complex (multi-step fiscal rules, variable pay components) to express in a single statement without making it unreadable.

### Why .NET 10 JIT Loop Inversion Matters for Streaming
The .NET 10 JIT's Graph-Based Loop Inversion rewrites a \`while (condition) { body }\` loop into the equivalent of \`if (condition) { do { body } while (condition); }\`. For SqlDataReader hot paths that always read at least one row, this eliminates the initial redundant condition check — a measurable gain when iterating over 100K+ records per request.
      `,
      commonMistakes: [
        "Using CURSOR with FAST_FORWARD and thinking it is optimized — FAST_FORWARD only disables scrolling; it is still row-by-row processing under the hood.",
        "Setting the WHILE batch size too large (e.g., 50,000 rows) — this causes excessive locking and can block concurrent transactions for the entire duration of payroll generation.",
        "Buffering the entire result set with .ToList() or .ToArray() before processing — this spikes memory on large payroll data; always stream with IAsyncEnumerable."
      ],
      bestPractices: [
        "Always wrap the WHILE batch loop in TRY/CATCH/ROLLBACK — a failure on batch 9 of 10 must not leave 90% partial salary data committed.",
        "Use a dedicated staging table (SalarySheet) with a PayRunId column; this enables retries, audit trails, and clean rollbacks without touching live financial records.",
        "Stream results from C# using IAsyncEnumerable<T> and CommandBehavior.SequentialAccess to keep memory consumption flat regardless of result set size."
      ],
      interviewQs: [
        {
          q: "Why is a T-SQL CURSOR slower than a WHILE loop with a batch INSERT, even when processing the exact same rows?",
          a: "A CURSOR maintains a server-side cursor object and performs a separate FETCH + SQL operation per row — for 50,000 employees that is 50,000 individual SQL operations within the same transaction, each with lock acquisition, log write, and context-switch overhead. A WHILE loop with a batch INSERT processes 500 rows in a single set-based operation per iteration — SQL Server optimizes the entire batch simultaneously using sorted index seeks, parallel execution plans, and minimal lock acquisitions. Set-based processing is the fundamental design principle of relational databases; cursors fight against it.",
          bangla: "Cursor প্রতি row আলাদা round trip, WHILE batch 500 rows একসাথে process — set-based SQL এর core principle, cursor এটির বিরুদ্ধে কাজ করে।"
        },
        {
          q: "What does RBAR stand for, and what SQL pattern specifically avoids it?",
          a: "RBAR stands for Row By Agonizing Row — a term for iterative, row-at-a-time processing in SQL that defeats the relational engine's set-based optimization capabilities. Cursors, row-by-row WHILE loops, and scalar user-defined functions called per row all exhibit RBAR behavior. Set-based operations — a single INSERT...SELECT, UPDATE with JOIN, MERGE, or a windowed aggregate — specifically avoid it by allowing SQL Server's query optimizer to process entire result sets at once using parallel plans and index range scans rather than sequential single-row operations.",
          bangla: "RBAR = Row By Agonizing Row — Cursor, scalar UDF সব RBAR। INSERT...SELECT, UPDATE with JOIN এগুলো set-based এবং RBAR এড়ায়।"
        },
        {
          q: "How does .NET 10's Graph-Based Loop Inversion improve the performance of a SqlDataReader streaming loop?",
          a: "Graph-Based Loop Inversion is a JIT optimization that rewrites while (condition) { body } into if (condition) { do { body } while (condition); } at the intermediate representation level. For a SqlDataReader loop, the initial ReadAsync() condition check before the first row represents the common path where at least one row exists. The inversion eliminates this redundant first check. On a streaming loop of 100,000+ rows processed without buffering, removing one condition evaluation per invocation is measurable in tight allocation-free streaming pipelines where every nanosecond of per-row overhead accumulates.",
          bangla: "while loop do-while এ rewrite হয় — প্রথম iteration এর unnecessary condition check বাদ যায়। 100K+ rows streaming এ measurable performance gain।"
        }
      ],
      practice: "Replace a salary-sheet CURSOR that processes 50,000 employees one at a time with a WHILE loop using 500-row batches. Then write a C# IAsyncEnumerable<SalaryRow> method that streams the generated results using CommandBehavior.SequentialAccess.",
      code: `-- ─── SQL: CURSOR (slow — RBAR, one round trip per employee) ────────────────
-- DECLARE SalaryCursor CURSOR FOR SELECT EmployeeId FROM Employees ...
-- Each FETCH processes exactly one row. 50,000 employees = 50,000 round trips.

-- ─── SQL: WHILE Loop with set-based batch INSERT (fast) ──────────────────────
CREATE PROCEDURE usp_GenerateSalarySheet
    @PayPeriodId INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BatchSize INT = 500;
    DECLARE @Offset    INT = 0;
    DECLARE @Total     INT = (SELECT COUNT(*) FROM Employees WHERE IsActive = 1);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Clear any previous failed run for this pay period before rebuilding
        DELETE FROM SalarySheet WHERE PayPeriodId = @PayPeriodId;

        WHILE @Offset < @Total          -- .NET 10 JIT equivalent: inverted to do-while
        BEGIN
            -- 500 employees per iteration — set-based, not row-by-row
            INSERT INTO SalarySheet (EmployeeId, Department, Gross, Deductions, Net, PayPeriodId)
            SELECT
                e.EmployeeId,
                e.Department,
                SUM(CASE WHEN t.TransactionType = 'Earning'   THEN t.Amount ELSE 0    END),
                SUM(CASE WHEN t.TransactionType = 'Deduction' THEN t.Amount ELSE 0    END),
                SUM(CASE WHEN t.TransactionType = 'Earning'   THEN t.Amount ELSE -t.Amount END),
                @PayPeriodId
            FROM (
                SELECT EmployeeId, Department
                FROM   Employees
                WHERE  IsActive = 1
                ORDER  BY EmployeeId
                OFFSET @Offset ROWS FETCH NEXT @BatchSize ROWS ONLY  -- sliding batch window
            ) AS e
            JOIN PayTransactions AS t
                ON  t.EmployeeId   = e.EmployeeId
                AND t.PayPeriodId  = @PayPeriodId
            GROUP BY e.EmployeeId, e.Department;

            SET @Offset = @Offset + @BatchSize;  -- advance the window by one batch
        END;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;   -- partial batch failure = full rollback, no half-data
        THROW;
    END CATCH;
END;

// ─── C#: Stream salary sheet rows — .NET 10 JIT loop inversion on hot path ───
public sealed class SalarySheetRepository
{
    private readonly string _connectionString;

    public SalarySheetRepository(IConfiguration config)
        => _connectionString = config.GetConnectionString("Default")
            ?? throw new InvalidOperationException(
                "Connection string 'Default' is not configured.");

    // .NET 10 JIT inverts this while-loop to do-while internally —
    // eliminates the first redundant condition check on the hot streaming path.
    public async IAsyncEnumerable<SalaryRow> StreamAsync(
        int payPeriodId,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync(ct);

        await using var cmd = new SqlCommand(
            "SELECT EmployeeId, Department, Gross, Deductions, Net " +
            "FROM   SalarySheet " +
            "WHERE  PayPeriodId = @PayPeriodId " +
            "ORDER  BY EmployeeId", conn);

        cmd.Parameters.Add("@PayPeriodId", SqlDbType.Int).Value = payPeriodId;

        // SequentialAccess: reads column-by-column, never buffers the full result set
        await using var reader = await cmd.ExecuteReaderAsync(
            CommandBehavior.SequentialAccess, ct);

        // JIT loop inversion fires here — do-while shape after first-iteration optimisation
        while (await reader.ReadAsync(ct))
        {
            yield return new SalaryRow(
                EmployeeId : reader.GetInt32(0),
                Department : reader.GetString(1),
                Gross      : reader.GetDecimal(2),
                Deductions : reader.GetDecimal(3),
                Net        : reader.GetDecimal(4)
            );
        }
    }
}

// ─── Caller: consume the stream without ever buffering the full set ───────────
public async Task ExportToCsvAsync(int payPeriodId, Stream output, CancellationToken ct)
{
    await foreach (var row in _repo.StreamAsync(payPeriodId, ct))
    {
        await WriteCsvLineAsync(output, row, ct); // one row processed at a time
    }
}`
    }
  ],
  revisionSummary: `
- **C# 14 field**: Eliminates manual backing fields in DDD entities — invariant guards stay, noise disappears.
- **EF Core 10 Named Filters**: Stack multiple global rules per entity; use .IgnoreQueryFilters("name") to relax exactly one without touching the others.
- **WHILE Loops**: Set-based batch processing defeats RBAR cursor performance by an order of magnitude — wrap in TRY/CATCH/ROLLBACK.
- **JIT Loop Inversion**: .NET 10 internally rewrites while-loops to do-while, removing the first-iteration condition check overhead on hot streaming paths.
  `,
  summary: ".NET ১০ এবং সি# ১৪ এর এই ফিচারগুলো ডিডিডি এনকোডিং, মাল্টি-টেন্যান্সি এবং পেরোল প্রসেসিংয়ের মতো প্রোডাকশন চ্যালেঞ্জকে অনেক বেশি পরিষ্কার এবং পারফরম্যান্ট কোডে সমাধান করে।"
};
