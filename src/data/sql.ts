export const sqlData = {
  id: 'sql',
  title: 'SQL Server Performance & Internals',
  description:
    'How SQL Server stores, finds, and isolates rows: keys, indexes, plans, joins, transactions, and a playbook for when an API query goes from 1s to 10s with an 88% missing-index warning.',
  sections: [
    {
      topic: 'Normalization vs denormalization, keys, and constraints',
      difficulty: 'senior',
      english:
        'Normalization removes update anomalies by storing each fact once: 3NF is the default for OLTP because writes stay consistent without hunting duplicated columns. Denormalization copies data (or pre-aggregates) to make a read path cheap — a reporting table, a JSON snapshot, a cached total. The trade-off is write amplification and stale reads: every denormalized column is a second source of truth you must keep in the same transaction or via a reliable async process. Keys are not just uniqueness: a primary key (usually clustered) defines the physical order of the table; foreign keys protect integrity and give the optimizer cardinality hints, but they cost extra lookups on write. Failure: a “flexible” schema with no FKs, then orphaned rows and query plans that assume 1:N when the data is M:N garbage. When NOT to normalize further: a high-volume event log that is insert-only and always queried by a covering time index; 6NF purity there only adds joins.',
      bangla:
        'OLTP-এ নরমালাইজেশন ডিফল্ট — এক ফ্যাক্ট এক জায়গায়। ডিনরমালাইজেশন রিড সস্তা করে কিন্তু রাইটে দুই সোর্স অব ট্রুথ। PK/FK শুধু ইউনিকনেস নয়, প্ল্যান ও ইন্টিগ্রিটি।',
      details: `
### OLTP vs read models

| Approach | Wins | Loses | Use when |
| :--- | :--- | :--- | :--- |
| 3NF OLTP | Consistent writes, small rows | More joins on read | Orders, payments, inventory |
| Controlled denorm | Fast reads, fewer joins | Dual writes, drift | Dashboard totals, search documents |
| JSON column | Flexible payload | Weak constraints, SARGability | Rarely filtered extras, not core keys |

### Keys and constraints
- **PRIMARY KEY**: uniqueness + (usually) clustered index. Keep it stable and narrow (int/bigint/UUID as uniqueidentifier).
- **UNIQUE**: alternate keys (email, SKU) — this is what \`Single()\` in LINQ should match.
- **FOREIGN KEY**: blocks orphans; \`ON DELETE CASCADE\` is a foot-gun on large children.
- **CHECK / DEFAULT**: cheap invariants next to the data.
- **Natural vs surrogate**: natural keys change (email); surrogates (IDENTITY/sequence) stay put. Clustered on a random GUID fragments pages.

### When NOT to denormalize
- The duplicated field is updated often from multiple writers.
- You do not have a single transaction or outbox to refresh the copy.
      `,
      code: `public sealed class OrderWriteService(AppDbContext db)
{
    public async Task PlaceAsync(PlaceOrder cmd, CancellationToken ct)
    {
        var order = new Order { CustomerId = cmd.CustomerId, Status = "Open" };
        db.Orders.Add(order);
        db.OrderLines.AddRange(cmd.Lines.Select(l => new OrderLine
        {
            Order = order,
            Sku = l.Sku,
            Qty = l.Qty,
            UnitPrice = l.UnitPrice
        }));
        await db.SaveChangesAsync(ct);
    }
}`,
      sql: `-- Narrow, stable clustered key + alternate unique key
CREATE TABLE dbo.Customer
(
    CustomerId INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED,
    Email      NVARCHAR(256) NOT NULL
        CONSTRAINT UQ_Customer_Email UNIQUE,
    Name       NVARCHAR(200) NOT NULL,
    CONSTRAINT CK_Customer_Email CHECK (Email LIKE N'%@%')
);

CREATE TABLE dbo.Orders
(
    OrderId     BIGINT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Orders PRIMARY KEY CLUSTERED,
    CustomerId  INT NOT NULL
        CONSTRAINT FK_Orders_Customer REFERENCES dbo.Customer(CustomerId),
    Status      VARCHAR(20) NOT NULL,
    CreatedAt   DATETIME2(3) NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSUTCDATETIME()
);`,
      commonMistakes: [
        'Clustering on a random GUID, causing constant page splits and fragmentation.',
        'No unique constraint on a business key, then debugging “duplicate customers” in the app.',
        'Denormalizing Order.CustomerName without a transaction that updates both on rename.',
      ],
      bestPractices: [
        'OLTP: normalize to 3NF, then denormalize one measured read path at a time.',
        'Put uniqueness in the database; the app race will lose.',
        'Keep clustered keys narrow and ever-increasing for insert-heavy tables.',
      ],
      interviewQs: [
        {
          q: 'When do you denormalize in an OLTP database?',
          a: 'When a read path is proven hot and the join cost or the extra hop dominates, and you can name the write path that keeps copies consistent. Examples: storing a paid-order total on the order header updated in the same transaction as lines; a search table populated from an outbox. I do not denormalize because a junior finds joins hard. I also do not put computed display strings in the row if a query can compute them. If the copy can be stale by minutes, a cache or a reporting replica is often better than polluting the OLTP table. Measure with a plan, then duplicate the smallest column set that removes the join.',
          bangla: 'হট রিড প্রমাণিত এবং কপি আপডেটের ট্রানজ্যাকশন/আউটবক্স থাকলে ডিনরমালাইজ করুন। জয়েন কঠিন বলে নয় — ছোট কলাম সেট, মাপা পথ।',
          followUp: 'How do you keep a denormalized total correct under concurrent line inserts?',
          difficulty: 'senior',
        },
        {
          q: 'Why is a random GUID a bad clustered primary key?',
          a: 'The clustered index is the table’s sort order. Sequential inserts append to the last page (good latch behavior). A random GUID inserts into a random page, splitting pages, fragmenting, and turning inserts into random I/O. NewSequentialId and UUID v7 reduce this but still widen every nonclustered index because they include the clustering key. A BIGINT IDENTITY or a sequence is the usual OLTP clustered key; put the GUID in a unique nonclustered index if the outside world needs it. This is a storage-engine answer, not a “GUIDs are bad” slogan.',
          bangla: 'ক্লাস্টার্ড ইনডেক্স টেবিলের অর্ডার। র‍্যান্ডম GUID মাঝখানে ইনসার্ট → পেজ স্প্লিট। IDENTITY/sequence ক্লাস্টার করুন, GUID ইউনিক ননক্লাস্টার্ডে রাখুন।',
          followUp: 'What does “the clustering key is in every nonclustered index” imply for key width?',
          difficulty: 'expert',
        },
        {
          q: 'Do foreign keys hurt performance enough to drop them in production?',
          a: 'They add CPU on writes to check existence, and they can block if the parent row is locked. They also prevent the data disasters that cost more than that CPU. The optimizer can use FKs for simplifications. Dropping FKs “for speed” without a measured wait-stats case is a senior red flag. If a bulk load is the issue, disable/rebuild around the load window, or use a staging table. If parent lookups are slow, index the FK column — an unindexed FK is a common scan on DELETE of the parent.',
          bangla: 'FK রাইটে চেক খরচ করে, কিন্তু অরফান ও বাজে প্ল্যান আটকায়। স্পিডের জন্য ড্রপ নয় — FK কলামে ইনডেক্স দিন, বাল্ক লোড আলাদা।',
          followUp: 'What happens on DELETE of a parent if the FK is unindexed?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Design Customer/Orders/OrderLines in 3NF with FKs and a unique email. Then add one denormalized Order.LineCount updated in the same SaveChanges transaction.',
    },
    {
      topic: 'Indexes: clustered, nonclustered, composite, covering, included columns, SARGability',
      difficulty: 'expert',
      english:
        'A clustered index is the table: rows live in that key order (a heap has no such order). A nonclustered index is a separate B-tree of keys that points to the heap RID or the clustering key. Composite indexes are ordered left to right: (TenantId, CreatedAt) helps WHERE TenantId = @t AND CreatedAt > @d, not WHERE CreatedAt > @d alone. A covering index can satisfy a query from the index alone; INCLUDE adds non-key columns to the leaf so you avoid a lookup without widening the sort key. SARGability means the predicate can seek: WHERE CreatedAt >= @d is seekable; WHERE YEAR(CreatedAt) = 2026 or WHERE Amount + 1 = @a is not. Trade-off: every index speeds some reads and slows every write, plus storage and log. Failure: indexing every column “because missing index said so”, or a nonclustered index that still lookups 90% of the table. When NOT to index: a column never in WHERE/JOIN/ORDER BY, or a table so small a scan is cheaper.',
      bangla:
        'ক্লাস্টার্ড = টেবিলের অর্ডার। ননক্লাস্টার্ড আলাদা B-tree। কম্পোজিট বাম থেকে ম্যাচ করে। INCLUDE কভারিং করে লুকআপ এড়ায়। ফাংশনে কলাম মোড়ালে seek মরে — SARGability।',
      details: `
### Index types

| Kind | What it is | Seek when |
| :--- | :--- | :--- |
| Clustered | The table sorted by key | Equality/range on leading key |
| Nonclustered | Extra B-tree + row locator | Leading key(s) SARGable |
| Composite | Multi-column key | Left-prefix of the key |
| Covering | Leaf has every column the query needs | No key lookup |
| Filtered | \`WHERE Status = 'Open'\` | Same predicate (or subset) |

### INCLUDE vs key columns
- Key columns: used for seek/sort uniqueness.
- INCLUDE: payload at the leaf for covering; not in the internal tree (narrower).
- Do not INCLUDE huge NVARCHAR(MAX) “just in case”.

### SARGable vs not

| Predicate | Seek? |
| :--- | :--- |
| \`CreatedAt >= @p\` | Yes |
| \`CAST(CreatedAt AS date) = @d\` | Usually no |
| \`Name LIKE N'abc%'\` | Yes (prefix) |
| \`Name LIKE N'%abc%'\` | No |
| \`Amount + 0 = @a\` | No |
| \`CONVERT(varchar, Id) = @s\` | No (also type mismatch) |
      `,
      code: `public sealed class OrderSearch(AppDbContext db)
{
    public Task<List<OrderListRow>> RecentAsync(int tenantId, DateTimeOffset from, CancellationToken ct) =>
        db.Orders.AsNoTracking()
            .Where(o => o.TenantId == tenantId && o.CreatedAt >= from)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderListRow(o.Id, o.Number, o.CreatedAt))
            .Take(50)
            .ToListAsync(ct);
}`,
      sql: `-- Composite + covering: seek TenantId, range CreatedAt, no lookup
CREATE NONCLUSTERED INDEX IX_Orders_Tenant_CreatedAt
ON dbo.Orders (TenantId, CreatedAt DESC)
INCLUDE (Number, Status);

-- Anti-pattern: wrapping the column kills the seek
-- BAD:  WHERE YEAR(CreatedAt) = 2026
-- GOOD: WHERE CreatedAt >= '2026-01-01' AND CreatedAt < '2027-01-01';`,
      commonMistakes: [
        'Creating a nonclustered index on (CreatedAt, TenantId) when every query filters TenantId first.',
        'SELECT * so a carefully covering index still does lookups.',
        'Functions on columns in WHERE (YEAR, CAST, TRIM) that force scans.',
      ],
      bestPractices: [
        'Equality columns first, then range, then INCLUDE the selected extras.',
        'Match the query’s ORDER BY to the index to avoid a sort.',
        'One well-designed composite beats five single-column indexes on the same table.',
      ],
      interviewQs: [
        {
          q: 'Clustered vs nonclustered — what is physically different?',
          a: 'The clustered index leaf is the data row. There is at most one clustered index. A nonclustered leaf is (index keys + clustering key or RID). To get columns not in the nonclustered index, SQL Server does a key lookup (or RID lookup) per row, which becomes random I/O and is why lookups on many rows are worse than a scan. Heaps (no clustered index) use RIDs; forwarding pointers after updates make heaps painful for OLTP. Choosing the clustered key is a table-design decision, not an afterthought. Nonclustered indexes are how you add extra access paths.',
          bangla: 'ক্লাস্টার্ড লিফ = সারি নিজে। ননক্লাস্টার্ড আলাদা ট্রি, বাকি কলামে lookup। অনেক lookup স্ক্যানের চেয়ে খারাপ — তাই covering।',
          followUp: 'Why does every nonclustered index contain the clustering key?',
          difficulty: 'expert',
        },
        {
          q: 'What is a covering index and when is INCLUDE better than adding a key column?',
          a: 'Covering means the query can be answered from the index leaf without touching the base table. INCLUDE puts a column in the leaf only, so it does not affect seek order or uniqueness and keeps non-leaf pages smaller. Add a column to the key if you filter or sort on it; INCLUDE if you only SELECT it. Covering a 40-column SELECT * is the wrong goal — project fewer columns. Too many INCLUDEs make the index almost a second copy of the table (write cost). The sweet spot is the 3–8 columns a hot API actually returns.',
          bangla: 'কভারিং = ইনডেক্স থেকেই কুয়েরি শেষ, টেবিল lookup নেই। ফিল্টার/সর্ট হলে কি, শুধু SELECT হলে INCLUDE। SELECT * কভার করার চেষ্টা করবেন না।',
          followUp: 'How do you prove a query is covered in an actual plan?',
          difficulty: 'senior',
        },
        {
          q: 'Explain SARGability with a production example.',
          a: 'A seekable argument is one that can be compared to the index key as stored. WHERE OrderDate >= @from uses the index. WHERE CONVERT(date, OrderDate) = @d wraps the column, so the engine cannot seek (unless a computed persisted column + index exists). Leading-wildcard LIKE, mismatched types (varchar vs nvarchar, implicit convert on the column), and wrapping in ISNULL are the usual killers. The API still “has an index” in SSMS, which is why seniors read the plan, not the index list. Fix the predicate first; adding another index on the same column will not help a non-SARGable WHERE.',
          bangla: 'কলামকে ফাংশনে মুড়ে WHERE দিলে ইনডেক্স seek হয় না। CONVERT/YEAR/LIKE %x% ক্লাসিক। আগে প্রেডিকেট ঠিক করুন, আরেকটা ইনডেক্স নয়।',
          followUp: 'How do implicit conversions show up in the plan?',
          difficulty: 'senior',
        },
        {
          q: 'Why can five indexes make an INSERT-heavy table slower than a scan-heavy one?',
          a: 'Each INSERT/UPDATE/DELETE maintains every nonclustered index: more log, more page splits, more latch contention. If the workload is 90% writes (ingest), indexes that are never used in WHERE are pure tax. Unused indexes still cost you. sys.dm_db_index_usage_stats (with caveats after failover) plus write latency tell you which indexes to drop. The missing-index DMV does not subtract this write cost. Design indexes from the top N queries, not from every column.',
          bangla: 'প্রতি ইনডেক্স প্রতি রাইটে মেইনটেইন হয়। ইনজেস্ট-হেভি টেবিলে অব্যবহৃত ইনডেক্স শুধু ট্যাক্স। টপ কুয়েরি থেকে ইনডেক্স ডিজাইন করুন।',
          followUp: 'How do you find unused indexes safely in production?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Take a tenant+date query. Create (TenantId, CreatedAt DESC) INCLUDE (Number). Compare logical reads before/after and with YEAR(CreatedAt) in the WHERE.',
    },
    {
      topic: 'Execution plans, query optimization, and missing-index warnings',
      difficulty: 'expert',
      english:
        'The optimizer is a cost-based search: it estimates cardinality, assigns costs to operators, and picks a cheap enough plan — not the mathematically perfect one. Actual plans show what ran (rows, time, spills); estimated plans show what it thought. Warnings (missing index, spill to tempdb, implicit conversion) are clues, not orders. An 88% missing-index impact looks urgent and is often wrong: it ignores existing similar indexes, write cost, and whether the query should even return that many rows. Trade-off: a hint (FORCESEEK, RECOMPILE, indexes) can freeze a good plan or freeze a bad one after data grows. Failure: blindly creating the missing-index suggestion, doubling write cost, and still scanning because the predicate is not SARGable. When NOT to trust estimates: after a big data change without stats update, or with table variables that look like one row. Seniors read operators: Clustered Index Scan vs Seek, Key Lookup, Hash vs Nested Loops, Sort warnings.',
      bangla:
        'অপটিমাইজার কস্ট-ভিত্তিক — পারফেক্ট প্ল্যান নয়। Missing index ওয়ার্নিং আদেশ নয়: রাইট খরচ ও বিদ্যমান ইনডেক্স হিসেব করে না। Actual plan-এ rows/spill পড়ুন, হিন্ট আগে নয়।',
      details: `
### Plan reading (the operators that matter)

| Operator | Means | Worry when |
| :--- | :--- | :--- |
| Clustered Index Seek | Narrow access | Residual predicate still reads many rows |
| Clustered Index Scan | Read most/all of table | Unexpected on a huge table |
| Index Seek + Key Lookup | Nonclustered + base table | Lookups × rows is huge |
| Nested Loops | Per outer row, inner seek | Inner is a scan (N+1 in SQL) |
| Hash Match | Build hash table | Spill to tempdb |
| Sort | Explicit sort | Spill; missing index for ORDER BY |

### Missing index warning
- Generated from the plan’s guessed predicates/outputs.
- Does not know your other indexes, uniqueness, or fill factor.
- Create it only after: (1) query is necessary, (2) predicate is SARGable, (3) you merge with existing indexes, (4) you accept write cost.

### Stats
- Histogram on the first index column drives estimates.
- Stale stats → bad join type. \`UPDATE STATISTICS\` after large loads.
      `,
      code: `public sealed class PlanAwareQuery(AppDbContext db)
{
    public Task<int> OpenCountAsync(int tenantId, CancellationToken ct) =>
        db.Orders.AsNoTracking()
            .Where(o => o.TenantId == tenantId && o.Status == "Open")
            .CountAsync(ct);
}`,
      sql: `-- Inspect the plan, do not guess
SET STATISTICS IO, TIME ON;
SELECT Number, CreatedAt
FROM dbo.Orders
WHERE TenantId = 42 AND CreatedAt >= '2026-01-01'
ORDER BY CreatedAt DESC;

-- Missing index is a suggestion. Merge, do not stamp every warning.
-- Example merge: existing (TenantId) INCLUDE (Status)
-- + suggested (TenantId, CreatedAt) INCLUDE (Number)
-- → one index (TenantId, CreatedAt DESC) INCLUDE (Number, Status);

-- Stats after a bulk load
UPDATE STATISTICS dbo.Orders WITH FULLSCAN;`,
      commonMistakes: [
        'Creating every missing-index recommendation from Query Store in one afternoon.',
        'Using NOLOCK as a performance strategy (dirty reads, missing/duplicate rows).',
        'Forcing a join hint from a blog without checking row estimates vs actuals.',
      ],
      bestPractices: [
        'Compare estimated vs actual rows; a 100x miss is the real bug.',
        'Fix selectivity and SARGability before adding indexes.',
        'Use Query Store to see plan regressions after a release.',
      ],
      interviewQs: [
        {
          q: 'An actual plan shows a missing index with 88% impact. Do you create it?',
          a: 'Not blindly. I read the query: is it called 10 times a day or 10k? Is the WHERE SARGable? Does an existing index already lead with the same column if we only INCLUDE extra output? The 88% is a model of this plan’s cost, not of write amplification on the table. I check dm_db_index_usage_stats and overlapping definitions. I might create a merged covering index in staging, A/B the reads, and watch insert latency. If the query is an accidental SELECT * from EF, I fix the projection and the warning often disappears. Interviewers score the skepticism, not the CREATE INDEX reflex.',
          bangla: '৮৮% দেখেই ইনডেক্স নয় — কুয়েরি হট কিনা, SARGable কিনা, মার্জ করা যায় কিনা। প্রজেকশন ঠিক করলে ওয়ার্নিং মরে। রাইট খরচ মাপুন।',
          followUp: 'How do you merge two overlapping missing-index suggestions?',
          difficulty: 'expert',
        },
        {
          q: 'Seek vs scan — when is a scan the right plan?',
          a: 'When the query needs most of the rows, or the table is tiny, a scan plus sequential I/O beats thousands of random lookups. A seek that then lookups 40% of the table is a hidden scan with worse I/O pattern. The optimizer chooses based on estimates: if it thinks 10 rows and actual is 10 million, you get a seek+lookup disaster. So “scan is always bad” is junior. Seniors ask what fraction of the table is touched and whether the scan is residual after a seek. Covering can turn a lookup-heavy seek into a range scan of a narrow index, which is often the win.',
          bangla: 'পুরো টেবিল লাগলে বা টেবিল ছোট হলে স্ক্যান ঠিক। ৪০% lookup-সহ seek আসলে খারাপ I/O। এস্টিমেট ভুল হলে প্ল্যান ভুল।',
          followUp: 'What is a residual predicate on a seek?',
          difficulty: 'expert',
        },
        {
          q: 'How do you debug a plan that was fast last week and is slow today?',
          a: 'Plan regression: stats changed, data skewed, a new parameter sniffed a rare value, or an index was dropped. Query Store shows the old vs new plan. Parameter sniffing: a plan compiled for a tiny tenant reused for the huge one. Fixes: optimize for unknown, RECOMPILE on a cheap-but-wild query, or a filtered index per pattern — not a random hint first. Also check blocking: duration can be wait, not CPU. Last week vs today might be a lock, not a plan. Always split: compile/CPU vs wait_type.',
          bangla: 'Query Store-এ পুরনো/নতুন প্ল্যান। প্যারামিটার স্নিফিং, স্টেটস, ব্লকিং আলাদা করুন। আগে wait_type, তারপর হিন্ট।',
          followUp: 'When is OPTION (RECOMPILE) acceptable in production?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Capture an actual plan for a tenant search. Note estimated vs actual rows. If a missing-index warning appears, write why you would or would not create it.',
    },
    {
      topic: 'Joins, CTE vs temp table vs table variable, views, procs, functions',
      difficulty: 'senior',
      english:
        'Join type is a plan choice: nested loops for small outer + indexed inner, hash for large unordered sets, merge for two sorted inputs. Writing INNER JOIN in SQL does not force nested loops. CTEs are usually inlined (not materialized) — a CTE referenced twice may be computed twice. Temp tables (#t) have statistics and can be indexed; they are the hammer for big intermediate results. Table variables (@t) historically had one-row guesses (better now with some hints, still weaker stats) and shine for tiny sets. Views are saved queries, not caches — an indexed (materialized) view is the exception and has strict rules. Stored procedures cache plans and encapsulate permissions; they are not automatically faster than parameterized ad hoc. Scalar UDFs in a WHERE or SELECT can run once per row (RBAR) unless inlined. Trade-off: a proc hides SQL from EF and can be the right escape hatch; a thick proc layer can also hide N+1. Failure: a multi-statement TVF that the optimizer treats as a black box with bad estimates.',
      bangla:
        'JOIN টাইপ অপটিমাইজার বেছে নেয়। CTE সাধারণত ইনলাইন — দুবার ইউজ দুবার চলতে পারে। বড় ইন্টারমিডিয়েট = #temp (স্ট্যাটস), ছোট = টেবিল ভ্যারিয়েবল। Scalar UDF প্রতি সারিতে চলতে পারে।',
      details: `
### Intermediate results

| Tool | Stats | Indexed | Typical use |
| :--- | :--- | :--- | :--- |
| CTE | Inlined | No | Readability, recursion |
| Temp table \`#t\` | Yes (recompiled) | Yes | Large; reuse; explicit indexes |
| Table variable \`@t\` | Weak / memory optimized options | Limited | Tiny lists, TVP-like |
| Derived table | Inlined | No | Same as CTE |

### Routines
- **View**: no performance magic; the outer query’s WHERE may or may not push down.
- **Proc**: plan reuse, easy GRANT EXEC; still needs good indexes.
- **Inline TVF**: like a parameterized view — optimizer-friendly.
- **Multi-statement TVF / scalar UDF**: often optimizer-hostile.

### Join anti-patterns
- Functions on join columns.
- \`OR\` across two tables that prevents a seek.
- Accidental cross join (missing ON).
      `,
      code: `public sealed class ReportingQueries(AppDbContext db)
{
    public Task<List<CustomerSpend>> TopSpendersAsync(int tenantId, CancellationToken ct) =>
        db.Database.SqlQuery<CustomerSpend>($"""
            SELECT TOP (20) c.CustomerId, c.Name, SUM(o.Total) AS Spend
            FROM dbo.Customer c
            JOIN dbo.Orders o ON o.CustomerId = c.CustomerId
            WHERE o.TenantId = {tenantId}
            GROUP BY c.CustomerId, c.Name
            ORDER BY Spend DESC
            """).ToListAsync(ct);
}`,
      sql: `-- CTE: readable, but referenced twice may run twice
WITH OpenOrders AS
(
    SELECT OrderId, CustomerId, Total
    FROM dbo.Orders
    WHERE Status = 'Open'
)
SELECT c.Name, COUNT(*) AS OpenCount
FROM OpenOrders o
JOIN dbo.Customer c ON c.CustomerId = o.CustomerId
GROUP BY c.Name;

-- Large intermediate: materialize once
SELECT OrderId, CustomerId, Total
INTO #Open
FROM dbo.Orders
WHERE Status = 'Open';
CREATE CLUSTERED INDEX IX_Open ON #Open (CustomerId);

-- Inline TVF beats scalar UDF in a WHERE
CREATE FUNCTION dbo.OrdersForTenant(@TenantId INT)
RETURNS TABLE
AS
RETURN
(
    SELECT OrderId, CustomerId, Total, CreatedAt
    FROM dbo.Orders
    WHERE TenantId = @TenantId
);`,
      commonMistakes: [
        'Assuming a CTE is executed once and stored (it usually is not).',
        'Using a scalar UDF to format dates in a 2-million-row SELECT.',
        'Table variable for 500k rows because “tempdb is slow” folklore.',
      ],
      bestPractices: [
        'If you need to reuse a big set, #temp + index, not a CTE mentioned three times.',
        'Prefer inline TVFs over scalar UDFs in set-based queries.',
        'Views for reuse and security; indexed views only with a measured workload and constraint discipline.',
      ],
      interviewQs: [
        {
          q: 'CTE vs temp table vs table variable — how do you choose?',
          a: 'CTE for clarity and when the set is consumed once; the optimizer inlines it, so it is not a performance feature. Temp table when the set is large, reused, or needs indexes/stats — the extra write to tempdb pays for a better plan. Table variable for small lists (a few hundred ids) passed around a batch; do not use it as a 2-million-row scratch pad. Memory-optimized table variables exist but are a specialist tool. If a CTE is referenced twice and the plan shows two identical subtrees, I materialize to #temp. This is a cardinality/stats answer more than a syntax answer.',
          bangla: 'একবার ইউজ = CTE। বড়/রিইউজ/ইনডেক্স = #temp। ছোট লিস্ট = টেবিল ভ্যারিয়েবল। CTE দুবার রেফার করলে দুবার চলতে পারে।',
          followUp: 'Why did table variables historically estimate 1 row?',
          difficulty: 'senior',
        },
        {
          q: 'Are stored procedures faster than EF LINQ?',
          a: 'Not automatically. Both can send parameterized SQL and reuse plans. A proc wins when you need a plan shape EF cannot express, temp tables, or permission sandboxing (GRANT EXEC without table SELECT). A proc loses when every screen needs a new proc and you cannot compose queries. EF with a tight DTO projection often matches a simple proc. The slow part is usually the plan and indexes, not “ORM vs proc”. I drop to SQL when I have a measured plan problem or a set-based write (MERGE/UPDATE FROM) that EF would round-trip.',
          bangla: 'প্রক অটোমেটিক দ্রুত নয় — প্ল্যান ও ইনডেক্সই মূল। EF যা পারে না (temp, জটিল আপডেট, পারমিশন) তখন প্রক।',
          followUp: 'When is FromSql/Dapper the senior choice over a proc?',
          difficulty: 'senior',
        },
        {
          q: 'Why can a scalar UDF destroy a query that looks indexed?',
          a: 'Historically the UDF ran once per row (RBAR), hiding the real predicate from the optimizer and blocking parallelism. Even with scalar UDF inlining in modern SQL Server, not every function inlines (side effects, time functions, certain constructs). A UDF in a join or WHERE can turn a seek into a compute scalar plus scan. Rewrite as inline TVF or inline the expression. If you see a Compute Scalar calling a function on millions of rows, that is your incident. This is why “we wrapped business rules in functions” needs a performance review.',
          bangla: 'Scalar UDF প্রতি সারিতে চলতে পারে, অপটিমাইজারকে WHERE দেখায় না। Inline TVF বা এক্সপ্রেশন লিখুন। মিলিয়ন রোতে Compute Scalar = ইনসিডেন্ট।',
          followUp: 'What is the difference between an inline TVF and a multi-statement TVF for estimates?',
          difficulty: 'expert',
        },
      ],
      practice:
        'Rewrite a scalar UDF used in WHERE as an inline TVF. Compare CPU and the plan’s estimated rows.',
    },
    {
      topic: 'Transactions, ACID, isolation levels, anomalies, deadlocks, blocking',
      difficulty: 'expert',
      english:
        'ACID is the contract: Atomicity (all or nothing), Consistency (constraints hold), Isolation (concurrency rules), Durability (after commit, it survives a crash). Isolation is where interviews go deep: READ UNCOMMITTED/NOLOCK allows dirty reads; READ COMMITTED (default) prevents dirty reads but not non-repeatable reads; REPEATABLE READ holds S-locks on read rows; SERIALIZABLE ranges-locks to block phantoms; SNAPSHOT uses row versions in tempdb to avoid most blocking readers. Lost updates happen when two transactions read, modify, write without a token or lock. Blocking is waiting on a lock; a deadlock is a cycle — SQL picks a victim (error 1205). Trade-off: stricter isolation reduces anomalies and increases blocking; SNAPSHOT reduces reader/writer blocking but adds tempdb version store and possible update conflicts. Failure: wrapping a whole HTTP request in SERIALIZABLE, or using NOLOCK on a balance query. When NOT to lengthen a transaction: any network call or user think-time inside BEGIN TRAN.',
      bangla:
        'ডিফল্ট READ COMMITTED ডার্টি আটকায়, ফ্যান্টম নয়। SNAPSHOT রিডার-রাইটার ব্লক কমায়, tempdb খরচ বাড়ায়। NOLOCK ব্যালেন্সে নিষিদ্ধ। ডেডলক = চক্র, ১২০৫ ভিকটিম।',
      details: `
### Anomalies vs isolation

| Anomaly | What you see | Prevented by |
| :--- | :--- | :--- |
| Dirty read | Read uncommitted data that rolls back | READ COMMITTED+ |
| Non-repeatable read | Same row, two values in one tran | REPEATABLE READ+ / SNAPSHOT |
| Phantom | New rows appear in a range | SERIALIZABLE / SNAPSHOT |
| Lost update | Last writer wins without conflict | rowversion, or higher isolation + pattern |

### Blocking vs deadlock
- Blocking: one lock holder, others wait — duration shows as LCK_M_* waits.
- Deadlock: A waits for B, B waits for A — one is killed.
- Fix deadlocks by lock order, narrower transactions, covering indexes (less lookup locks), retry on 1205.

### SNAPSHOT
- Readers do not take S-locks; they read versions.
- Writers can still block writers.
- \`READ_COMMITTED_SNAPSHOT\` (RCSI) is the common database option for OLTP APIs.
      `,
      code: `public sealed class TransferService(AppDbContext db)
{
    public async Task TransferAsync(int fromId, int toId, decimal amount, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        var accounts = await db.Accounts
            .Where(a => a.Id == fromId || a.Id == toId)
            .OrderBy(a => a.Id)
            .ToListAsync(ct);

        var from = accounts.Single(a => a.Id == fromId);
        var to = accounts.Single(a => a.Id == toId);
        if (from.Balance < amount) throw new InvalidOperationException("Insufficient funds");
        from.Balance -= amount;
        to.Balance += amount;
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
    }
}`,
      sql: `-- Optimistic concurrency (lost-update protection) without SERIALIZABLE
UPDATE dbo.Orders
SET Status = 'Paid', RowVer = RowVer + 1
WHERE OrderId = @id AND RowVer = @rowVer;
IF @@ROWCOUNT = 0
    THROW 50001, 'Conflict', 1;

-- Deadlock retry is an app concern; SQL only kills a victim
-- SET DEADLOCK_PRIORITY LOW;  -- optional for a reporting session

-- RCSI: readers stop blocking writers (database-level decision)
-- ALTER DATABASE AppDb SET READ_COMMITTED_SNAPSHOT ON;`,
      commonMistakes: [
        'NOLOCK on financial reads because “it is faster”.',
        'A transaction that calls an HTTP API before COMMIT.',
        'Catching 1205 and retrying the same lock order forever without backoff.',
      ],
      bestPractices: [
        'Keep transactions short and local to the database.',
        'Use rowversion/ETag for user-edit lost updates; use SERIALIZABLE/locks for money movement.',
        'Index FKs and access rows in a consistent order to cut deadlocks.',
      ],
      interviewQs: [
        {
          q: 'Dirty vs phantom vs lost update — give a .NET API example of each.',
          a: 'Dirty: a report with NOLOCK sees a payment that later rolls back; the dashboard shows money that never existed. Phantom: SERIALIZABLE-needed range — you count open orders, another request inserts one, you count again in the same transaction and get a new row; inventory reservation that re-queries a range is the usual bug. Lost update: two tabs GET a customer, both PUT, last PUT wins and silently drops the other edit — fix with rowversion. These are isolation/concurrency design choices, not EF bugs. I pick the cheapest isolation that makes the invariant true, then add constraints.',
          bangla: 'Dirty = NOLOCK-এ রোলব্যাক হওয়া পেমেন্ট। Phantom = রেঞ্জে নতুন সারি। Lost update = দুই ট্যাব PUT, last-write-wins — rowversion দিন।',
          followUp: 'Which isolation does EF use by default on SaveChanges?',
          difficulty: 'senior',
        },
        {
          q: 'Blocking vs deadlock — how do you tell in production?',
          a: 'Blocking shows long LCK waits, a head blocker in sys.dm_exec_requests, and throughput collapse without 1205. Deadlocks appear as 1205 in the app, deadlock graphs in XEvents/system_health, and a retry storm. A dump of the app will not show the SQL cycle; you need the deadlock XML. Fixes differ: blocking often means a missing index or a long transaction; deadlock means lock order or too many indexes causing extra lookup locks. Killing sessions treats the symptom. I always identify the blocker query text first.',
          bangla: 'ব্লকিং = অপেক্ষা, হেড ব্লকার। ডেডলক = ১২০৫ ও গ্রাফ। অ্যাপ ডাম্পে SQL চক্র দেখা যায় না — XEvent লাগে।',
          followUp: 'What is a typical deadlock from two indexes on the same update?',
          difficulty: 'expert',
        },
        {
          q: 'Should every ASP.NET app enable READ_COMMITTED_SNAPSHOT?',
          a: 'It is a strong default for read-heavy APIs because readers stop taking S-locks and writers are less blocked. Cost: tempdb version store, and writers can still conflict. It does not fix lost updates or give you repeatable application logic across two statements unless you use a snapshot transaction. Some reporting that needed NOLOCK can drop NOLOCK after RCSI. I would not enable it in production Friday night without a tempdb plan and a rollback. It is a database option, not a connection string flag you flip per query (except SNAPSHOT isolation as a session setting when allowed).',
          bangla: 'রিড-হেভি API-তে RCSI ভালো ডিফল্ট — রিডার S-লক নেয় না। tempdb খরচ আছে, lost update সমাধান নয়। প্রোডে মাপ ছাড়া ফ্লাইপ নয়।',
          followUp: 'RCSI vs SNAPSHOT isolation transaction — difference?',
          difficulty: 'expert',
        },
        {
          q: 'Why must a transaction not include an HTTP call?',
          a: 'Locks and the version store are held for the duration of the transaction. A 2-second HTTP call turns into 2 seconds of blocking or version-store growth under load. If the HTTP fails you still hold locks during retry. Distributed transactions (MSDTC) across SQL and HTTP are worse. The pattern is: commit the DB state, then publish an outbox message, then the HTTP happens in a worker with retries. For money in two databases you need a saga, not a longer isolation level. This is the same “don’t hold a lock across await” idea at the database.',
          bangla: 'ট্রানজ্যাকশনের সময় লক থাকে — HTTP ২ সেকেন্ড মানে ২ সেকেন্ড ব্লকিং। আউটবক্স: আগে কমিট, পরে ওয়ার্কারে HTTP।',
          followUp: 'How does the outbox pattern preserve atomicity without a distributed transaction?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Simulate two concurrent transfers on the same accounts. Show a deadlock or a lost update, then fix with ordered locking or a rowversion.',
    },
    {
      topic: 'Investigation playbook: API query 1s → 10s and an 88% missing-index warning',
      difficulty: 'expert',
      english:
        'A senior does not start with CREATE INDEX. First confirm the 10s is this SQL (APM span, EF command log, Query Store) and not thread-pool starvation or a chatty N+1 that is ten 1s calls. Split wait vs CPU: if LCK or PAGEIOLATCH, it is blocking or I/O, not “needs the missing index”. If CPU and a scan, then read the actual plan: parameter sniffing, stats, SARGability, lookups. The 88% warning is one input. Root cause is often a new filter that is not SARGable, a tenant that grew 20x, a plan change after stats, or an Include that exploded rows. Trade-off: a covering index may drop the query to 50ms and raise insert latency 15% — say that out loud. Failure: shipping five overlapping indexes from the warning list Friday night and causing a write outage. When NOT to add an index: the query is a one-off report, or fixing SELECT columns removes the lookup. The playbook is evidence, then the smallest schema or query change, then watch Query Store.',
      bangla:
        'আগে প্রমাণ করুন ১০ সেকেন্ড এই SQL, N+1 বা স্টার্ভেশন নয়। ওয়েট vs CPU ভাগ করুন। ৮৮% missing index একটা ইনপুট মাত্র — SARGability, স্নিফিং, ব্লকিং আগে। ছোট পরিবর্তন, তারপর Query Store।',
      details: `
### Playbook (order matters)

1. **Prove the query** — one command vs N+1; duration in SQL vs in app.
2. **Wait stats** — LCK (blocking), PAGEIOLATCH (I/O), CXPACKET/CXCONSUMER (parallel), CPU.
3. **Actual plan** — scan/seek, estimated vs actual, lookups, spills, warnings.
4. **SARGability & parameters** — implicit convert, sniffed parameter, tenant skew.
5. **Existing indexes** — merge, do not stack clones.
6. **Change** — query shape first (projection, filter), then one index, then stats.
7. **Verify** — Query Store, p95 API, insert latency, deadlock rate.

### 1s → 10s typical roots

| Clue | Likely root |
| :--- | :--- |
| 10 SQL calls × 1s | N+1, not one slow query |
| One SQL, LCK waits | Head blocker, long tran |
| One SQL, scan, 88% missing index | Maybe index; check SARGable |
| One SQL, seek + 1M lookups | Covering / less SELECT |
| Fast in SSMS, slow in app | Parameter sniffing / ARITHABORT |
| Only one tenant | Skew; filtered index or recompile |

### How to find root cause (the interview answer)
Do not start at the warning. Start at the span. Count round-trips. Read waits. Read the plan. Then the warning either confirms a missing access path or is a distraction.
      `,
      code: `public sealed class SlowEndpoint(AppDbContext db, ILogger<SlowEndpoint> log)
{
    public async Task<IReadOnlyList<OrderListRow>> SearchAsync(int tenantId, DateTimeOffset from, CancellationToken ct)
    {
        var sw = Stopwatch.StartNew();
        var rows = await db.Orders.AsNoTracking()
            .Where(o => o.TenantId == tenantId && o.CreatedAt >= from)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderListRow(o.Id, o.Number, o.CreatedAt))
            .Take(50)
            .ToListAsync(ct);
        log.LogInformation("OrderSearch tenant {Tenant} rows {Rows} ms {Ms}", tenantId, rows.Count, sw.ElapsedMilliseconds);
        return rows;
    }
}`,
      sql: `-- 1) Is it one query? Query Store / this
SELECT qst.query_sql_text, rs.avg_duration / 1000.0 AS avg_ms, rs.count_executions
FROM sys.query_store_runtime_stats rs
JOIN sys.query_store_plan p ON p.plan_id = rs.plan_id
JOIN sys.query_store_query q ON q.query_id = p.query_id
JOIN sys.query_store_query_text qst ON qst.query_text_id = q.query_text_id
ORDER BY rs.avg_duration DESC;

-- 2) Blocking right now
SELECT r.session_id, r.blocking_session_id, r.wait_type, r.wait_time, t.text
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE r.blocking_session_id <> 0;

-- 3) Missing-index DMV is a backlog, not a to-do list
SELECT migs.avg_user_impact, mid.statement, mid.equality_columns, mid.inequality_columns, mid.included_columns
FROM sys.dm_db_missing_index_group_stats migs
JOIN sys.dm_db_missing_index_groups mig ON mig.index_group_handle = migs.group_handle
JOIN sys.dm_db_missing_index_details mid ON mid.index_handle = mig.index_handle
ORDER BY migs.avg_user_impact DESC;`,
      commonMistakes: [
        'Creating the 88% index in production without an actual plan or a write-cost check.',
        'Tuning a 10s endpoint that is actually 10 sequential queries of 1s.',
        'Ignoring blocking because the missing-index warning was louder in SSMS.',
      ],
      bestPractices: [
        'One evidence trail: trace → wait → plan → change → Query Store verify.',
        'Prefer query/projection fixes over new indexes when they remove the need.',
        'Treat missing-index impact as a hint to look, not a permission to create.',
      ],
      interviewQs: [
        {
          q: 'An API went from 1s to 10s. The plan says missing index 88%. Walk through root cause.',
          a: 'I first prove whether we have one 10s command or ten 1s commands (N+1). If one command, I check waits: blocking can make a seek look “slow” with a green missing-index warning that is irrelevant. If it is CPU/scan, I open the actual plan and compare estimated vs actual rows. I check whether last week’s plan differed in Query Store (sniffing, stats). I check the predicate for non-SARGable changes from a “small” code review. Only then I consider an index, merging with what exists. The 88% did not cause the regression by itself — something changed: data, plan, query, or contention. I ship the smallest fix and watch p95 plus write latency.',
          bangla: 'আগে এক কুয়েরি না N+1। তারপর ওয়েট (ব্লকিং)। তারপর actual plan ও Query Store। ৮৮% শেষে — মার্জ করে এক ইনডেক্স, রাইট ল্যাটেন্সি দেখে।',
          followUp: 'What if SSMS runs it in 200ms with the same SQL?',
          difficulty: 'expert',
        },
        {
          q: 'How do you find the root cause when everyone is staring at the missing-index list?',
          a: 'I take the list away for a minute and ask: what wait type, what query text, what tenant, what deploy. Missing-index DMVs accumulate since startup and include queries that ran once. I correlate Query Store by time of the incident. I look at blocking chains during the 10s window. I look at whether a new EF Include changed cardinality. Root cause is a change in workload or plan, not the existence of a DMV row. The missing index might be the fix after you prove a scan of a 50-million-row table on a hot path. It might be noise. Seniors rank evidence; they do not rank warning percentages.',
          bangla: 'DMV স্টার্টআপ থেকে জমে, একবার-চলা কুয়েরিও থাকে। ইনসিডেন্ট উইন্ডোতে Query Store ও ব্লকিং মিলাই। পার্সেন্টেজ নয়, এভিডেন্স র‍্যাঙ্ক করুন।',
          followUp: 'Which DMV resets on failover and can mislead you?',
          difficulty: 'expert',
        },
        {
          q: 'When would you refuse to create an index even if the warning is 88%?',
          a: 'When the query is not SARGable (the index will not be used), when an existing index can cover with a small INCLUDE merge, when the table is write-heavy and the query is a rare report (schedule it, or use a replica), when SELECT * would make the covering index a second copy of the table, or when the real issue is blocking. I also refuse a Friday-night index on a 200 GB table without an online/resumable plan and a rollback. An index is a production schema change with write tax forever. The warning does not accept that tax for you.',
          bangla: 'নন-SARGable, রিয়ার রিপোর্ট, SELECT *, বা আসল সমস্যা ব্লকিং হলে ইনডেক্স নয়। ২০০ GB টেবিলে অনলাইন প্ল্যান ছাড়া শুক্রবার রাত্রে নয়।',
          followUp: 'How do you add a large index with low blocking in production?',
          difficulty: 'senior',
        },
        {
          q: 'How do you separate “query is slow” from “API is slow” in .NET?',
          a: 'Application Insights/OpenTelemetry spans: ASP.NET vs EF vs HTTP. If EF duration is 200ms and the API is 10s, look at thread pool, extra sequential awaits, or serialization. If EF is 10s, go to SQL. MiniProfiler or logging RelationalEventId.CommandExecuted with timestamps counts round-trips. A 10s ToListAsync of 2 million rows can be SQL 2s plus 8s materialization/GC — the plan warning will not mention GC. Measure allocations if SQL is innocent. Seniors instrument before they index.',
          bangla: 'স্প্যান দেখুন: ১০ সেকেন্ড EF-এ না অ্যাপে। অ্যাপে হলে স্টার্ভেশন/N+1/সিরিয়ালাইজ। SQL নির্দোষ হলে ম্যাটেরিয়ালাইজেশন/GC মাপুন।',
          followUp: 'What does a 2-million-row ToList do to the GC and the SQL plan?',
          difficulty: 'senior',
        },
      ],
      practice:
        'Take a 10s endpoint. Log SQL count and duration. If one query, save the actual plan and write a one-page decision: wait type, SARGable?, merge index or rewrite, how you will verify.',
    },
  ],
  quickRevision: {
    concepts: [
      '3NF for OLTP; denormalize one measured read path',
      'Clustered index is the table; keep the key narrow and sequential',
      'Nonclustered leaf + lookup vs covering INCLUDE',
      'Composite indexes match left prefix',
      'SARGable predicates seek; functions on columns scan',
      'Optimizer is cost-based; estimated vs actual rows',
      'Missing-index % is a hint, not a command',
      'CTE inlines; #temp has stats; scalar UDFs can be RBAR',
      'Isolation: dirty / non-repeatable / phantom / lost update',
      'Blocking ≠ deadlock; 1205 is a cycle victim',
    ],
    questions: [
      'When do you denormalize OLTP?',
      'Why is a random GUID a bad clustered key?',
      'Clustered vs nonclustered physically?',
      'What is SARGability?',
      'Do you create an 88% missing index?',
      'CTE vs temp table vs table variable?',
      'Dirty vs phantom vs lost update?',
      'Blocking vs deadlock in production?',
      'API 1s → 10s — first three checks?',
      'When do you refuse to add an index?',
    ],
    mistakes: [
      'Blindly creating every missing-index warning',
      'NOLOCK as a performance strategy',
      'YEAR(column) / CAST(column) in WHERE',
      'Long transactions that include HTTP',
      'Tuning N+1 as if it were one slow query',
    ],
    scenarios: [
      'API 1s to 10s after a release, 88% missing index',
      'Fast in SSMS, slow from EF (sniffing)',
      'Deadlock 1205 on concurrent transfers',
      'Insert latency jumps after five new indexes',
      'Report with NOLOCK shows money that rolled back',
    ],
  },
  revisionSummary: `
- Indexes are access paths with a write tax. Design from hot queries: left-prefix keys, INCLUDE to cover, SARGable predicates. The clustered key is table design.
- Plans and waits tell the truth; missing-index percentages do not. CTE/UDF/isolation choices change estimates and locking as much as “add an index”.
- 1s → 10s: prove the SQL, count round-trips, split wait vs CPU, then change the smallest thing and verify in Query Store.
  `,
  summary:
    'Senior SQL is reading the engine: how rows are stored, how they are found, how they are locked, and how you prove a regression before you CREATE INDEX.',
};
