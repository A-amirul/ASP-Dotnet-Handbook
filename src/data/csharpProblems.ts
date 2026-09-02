export const csharpProblemsData = {
  id: 'csharpproblems',
  title: 'C# Problem Solving — Data Structures, Algorithms & .NET Tasks',
  description:
    'Pick the right C# collection, solve classic DSA problems in C#, and practice machine-test tasks that .NET developers get in real interviews.',
  chapterNumber: 30,
  sections: [
    {
      id: 'csharp-data-structures',
      topic: 'C# Data Structures — What to Use in Interviews',
      difficulty: 'junior',
      english:
        'In .NET interviews you rarely implement a hash table from scratch. You pick the right BCL type: Dictionary, HashSet, Stack, Queue, List, PriorityQueue. Knowing when to use each is half the battle.',
      bangla:
        '.NET interview-তে hash table scratch থেকে লেখা লাগে না — সঠিক BCL type বেছে নিন: Dictionary, HashSet, Stack, Queue, List, PriorityQueue। কখন কোনটা — এটাই অর্ধেক কাজ।',
      details: `
### C# type → Data structure → Use when

| C# type | Structure | Typical interview use |
| :--- | :--- | :--- |
| \`T[]\` / \`Span<T>\` | Array | Sorted data, two pointers, in-place |
| \`List<T>\` | Dynamic array | Build result, unknown size |
| \`Dictionary<K,V>\` | Hash map | O(1) lookup, count, index map |
| \`HashSet<T>\` | Hash set | Dedup, exists check, graph visited |
| \`Stack<T>\` | LIFO stack | Brackets, undo, DFS iterative |
| \`Queue<T>\` | FIFO queue | BFS, level order, scheduling |
| \`PriorityQueue<T,T>\` | Min/max heap (.NET 6+) | Top K, merge K lists, scheduling |
| \`LinkedList<T>\` | Doubly linked list | LRU cache, insert/remove O(1) |
| \`SortedDictionary<K,V>\` | Balanced tree map | Sorted keys, range queries |

### Quick decision (memorize)
- Need **index of value**? → \`Dictionary<value, index>\`
- Need **only exists?** → \`HashSet\`
- Need **sorted order**? → sort array or \`SortedDictionary\`
- Need **shortest path (unweighted)**? → \`Queue\` + BFS
- Need **K largest**? → \`PriorityQueue\` size K
      `,
      interviewQs: [
        {
          q: 'When would you use List vs Dictionary in a coding interview?',
          a: 'Use List when order matters and you iterate or build output sequentially. Use Dictionary when you need fast lookup by key — counting frequencies, mapping value to index (Two Sum), or caching computed results. If you call List.Contains in a loop, mention you could use HashSet for O(1) instead of O(n) per check.',
          bangla: 'Order + sequential build → List; key lookup/count → Dictionary; loop-এ Contains → HashSet consider।',
          difficulty: 'junior',
        },
      ],
      practice: 'For "find duplicate in array", write solution with HashSet and explain O(n) time.',
    },
    {
      id: 'dsa-by-structure',
      topic: 'Problem Solving by Data Structure (with C#)',
      difficulty: 'mid',
      english:
        'Group practice by structure: all Stack problems together, all Dictionary problems together. .NET interviews repeat the same structure → pattern mapping.',
      bangla:
        'Structure অনুযায়ী practice: Stack problem একসাথে, Dictionary problem একসাথে। .NET interview-তে structure → pattern mapping repeat হয়।',
      details: `
### Practice buckets

**Dictionary / HashSet**
- Two Sum, Group Anagrams, Subarray Sum K, Top K Frequent
- Contains Duplicate, Single Number (XOR alternative)

**Stack / Queue**
- Valid Parentheses, Evaluate RPN, Min Stack
- BFS shortest path, Level order traversal

**Two pointers / Array**
- Palindrome, Remove duplicates, Merge sorted, Container water

**Tree / Graph (classes + Queue/DFS)**
- Max depth, Validate BST, Number of islands, Graph reachability

**Heap (PriorityQueue)**
- Kth largest, Merge K lists, Meeting rooms II

**DP (array or Dictionary memo)**
- Climbing stairs, Coin change, House robber, Word break
      `,
      practice: 'Pick one problem from each bucket and code it in C# this week.',
    },
    {
      id: 'linq-machine-test',
      topic: 'LINQ & Collections — .NET Machine Test Favorites',
      difficulty: 'mid',
      english:
        'Many .NET companies give practical tasks: group sales data, parse strings, filter DTOs, paginate results. LINQ is allowed — use it cleanly and explain deferred vs immediate execution if asked.',
      bangla:
        'অনেক .NET company practical task দেয়: sales group, string parse, DTO filter, pagination। LINQ allowed — clean use করুন, deferred vs immediate explain করতে পারুন।',
      details: `
### Common LINQ interview tasks

| Task | LINQ approach |
| :--- | :--- |
| Top N by field | \`.OrderByDescending(x => x.Score).Take(n)\` |
| Group and sum | \`.GroupBy(x => x.Category).Select(g => new { g.Key, Sum = g.Sum(...) })\` |
| Distinct by property | \`.GroupBy(x => x.Id).Select(g => g.First())\` |
| Flatten nested | \`.SelectMany(x => x.Items)\` |
| Pagination | \`.Skip(page * size).Take(size)\` |
| Any / All validation | \`.All(x => x.Age >= 18)\` |

### When interviewer says "no LINQ"
Use \`Dictionary\`, \`for\` loops, manual aggregation — same logic, explicit control.
      `,
      interviewQs: [
        {
          q: 'Does LINQ ToList() run the query immediately?',
          a: 'Yes. Operators like Where and Select build a deferred pipeline; ToList, ToArray, Count, First force execution. In interviews, say: "OrderBy is deferred until I enumerate — if I call ToList(), execution happens once and materializes results."',
          bangla: 'Where/Select deferred; ToList/Count/First execute — interview-তে enumerate moment mention করুন।',
          difficulty: 'mid',
        },
      ],
      practice: 'Write GroupBy + Sum without LINQ using Dictionary manually.',
    },
    {
      id: 'dotnet-coding-patterns',
      topic: '.NET Developer Coding Patterns (Strings, Parsing, Validation)',
      difficulty: 'mid',
      english:
        'Beyond LeetCode: parse CSV, validate input, format output, handle null, use decimal for money, return structured results (records or small DTOs). This is what mid-level .NET machine tests look like.',
      bangla:
        'LeetCode-এর বাইরে: CSV parse, input validate, output format, null handle, money-তে decimal, record/DTO return — mid-level .NET machine test এরকম।',
      details: `
### .NET-specific task types

| Type | Skills tested |
| :--- | :--- |
| **String parsing** | Split, Trim, Regex, TryParse |
| **Validation** | null checks, Guard clauses, early return |
| **Money / dates** | \`decimal\`, \`DateTime.TryParse\`, culture |
| **Collections** | Group, filter, transform in-memory lists |
| **API-style** | Input DTO → validate → compute → output DTO |
| **Thread basics** | \`lock\`, \`Interlocked\`, \`ConcurrentDictionary\` (senior) |

### Code quality signals
- Meaningful method names (\`CalculateInvoiceTotal\`, not \`Calc\`)
- Small private helpers
- Unit-test friendly (pure functions where possible)
      `,
      practice: 'Implement ParseCsvLine that handles quoted commas.',
    },
    {
      id: 'study-path-dsa-csharp',
      topic: 'Study Path — DSA + C# for .NET Interview (4 Weeks)',
      difficulty: 'junior',
      english:
        'Week 1: Arrays, strings, Dictionary, HashSet (10 tasks). Week 2: Stack, Queue, two pointers (8 tasks). Week 3: Trees, graphs, BFS/DFS (6 tasks). Week 4: DP + .NET LINQ/machine tests (6 tasks).',
      bangla:
        'Week 1: Array/string/Dictionary (১০)। Week 2: Stack/Queue/two pointer (৮)। Week 3: Tree/graph BFS/DFS (৬)। Week 4: DP + LINQ/machine test (৬)।',
      details: `
### Recommended module order in this handbook
1. **Problem Solving** — framework + array/string tasks
2. **Algorithms** — Big-O, trees, graphs, DP
3. **This module** — C# collections + .NET practical tasks
4. **Real-world Tasks** — senior machine test scenarios

### Daily routine (45 min)
- 10 min: read one problem, write input/output example
- 25 min: code in C# without autocomplete if possible
- 10 min: explain complexity + one edge case aloud
      `,
      practice: 'Start Week 1 with FizzBuzz, Two Sum, Valid Anagram from Problem Solving module.',
    },
  ],
  tasks: [
    {
      title: '1. HashSet — Find All Duplicates',
      english: 'Given int[] nums (1..n), return all elements that appear twice or more. Use HashSet to detect.',
      bangla: 'int[] nums (1..n) — দুবার বা তার বেশি appear করা সব element return। HashSet দিয়ে detect।',
      code: `public IList<int> FindDuplicates(int[] nums) {
    var seen = new HashSet<int>();
    var dup = new HashSet<int>();
    foreach (int n in nums) {
        if (!seen.Add(n)) dup.Add(n);
    }
    return dup.ToList();
}`,
    },
    {
      title: '2. Stack — Evaluate Reverse Polish Notation',
      english: 'Evaluate arithmetic expression in RPN: ["2","1","+","3","*"] → ((2+1)*3) = 9.',
      bangla: 'RPN expression evaluate: ["2","1","+","3","*"] → 9। Stack ব্যবহার করুন।',
      code: `public int EvalRpn(string[] tokens) {
    var stack = new Stack<int>();
    foreach (var t in tokens) {
        if (t is "+" or "-" or "*" or "/") {
            int b = stack.Pop(), a = stack.Pop();
            stack.Push(t switch {
                "+" => a + b, "-" => a - b, "*" => a * b, _ => a / b
            });
        } else stack.Push(int.Parse(t));
    }
    return stack.Pop();
}`,
    },
    {
      title: '3. Dictionary — First Unique Character (Optimized)',
      english: 'Return index of first non-repeating character. Two-pass Dictionary count.',
      bangla: 'প্রথম non-repeating character-এর index — Dictionary count two-pass।',
      code: `public int FirstUnique(string s) {
    var count = new Dictionary<char, int>();
    foreach (char c in s) count[c] = count.GetValueOrDefault(c) + 1;
    for (int i = 0; i < s.Length; i++)
        if (count[s[i]] == 1) return i;
    return -1;
}`,
    },
    {
      title: '4. Queue — Shortest Path in Unweighted Graph',
      english: 'Given adjacency list and start/end nodes, return shortest path length or -1. BFS with Queue.',
      bangla: 'Adjacency list + start/end — shortest path length BFS Queue, না থাকলে -1।',
      code: `public int ShortestPath(int start, int end, IList<int>[] adj) {
    if (start == end) return 0;
    var dist = new int[adj.Length];
    Array.Fill(dist, -1);
    var q = new Queue<int>();
    q.Enqueue(start);
    dist[start] = 0;
    while (q.Count > 0) {
        int u = q.Dequeue();
        foreach (int v in adj[u]) {
            if (dist[v] != -1) continue;
            dist[v] = dist[u] + 1;
            if (v == end) return dist[v];
            q.Enqueue(v);
        }
    }
    return -1;
}`,
    },
    {
      title: '5. PriorityQueue — Merge K Sorted Lists (K=2)',
      english: 'Merge two sorted linked lists using PriorityQueue or iterative merge (both acceptable).',
      bangla: 'দুটি sorted linked list merge — PriorityQueue বা iterative merge।',
      code: `public ListNode? MergeTwoLists(ListNode? a, ListNode? b) {
    var dummy = new ListNode(0);
    var cur = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { cur.next = a; a = a.next; }
        else { cur.next = b; b = b.next; }
        cur = cur.next;
    }
    cur.next = a ?? b;
    return dummy.next;
}`,
    },
    {
      title: '6. LINQ — Group Orders by Customer (Sum Total)',
      english: 'Given List<Order> with CustomerId and Amount, return total amount per customer sorted by total descending.',
      bangla: 'List<Order> (CustomerId, Amount) — customer প্রতি total amount, descending sort।',
      code: `public record Order(int CustomerId, decimal Amount);

public IList<(int CustomerId, decimal Total)> TotalsByCustomer(IList<Order> orders) =>
    orders.GroupBy(o => o.CustomerId)
        .Select(g => (g.Key, g.Sum(o => o.Amount)))
        .OrderByDescending(x => x.Item2)
        .ToList();`,
    },
    {
      title: '7. LINQ — Top 5 Products by Revenue',
      english: 'From sales records (ProductId, Revenue), return top 5 product IDs by revenue.',
      bangla: 'Sales (ProductId, Revenue) — revenue অনুযায়ী top 5 ProductId।',
      code: `public record Sale(int ProductId, decimal Revenue);

public int[] Top5Products(IList<Sale> sales) =>
    sales.GroupBy(s => s.ProductId)
        .Select(g => new { g.Key, Total = g.Sum(x => x.Revenue) })
        .OrderByDescending(x => x.Total)
        .Take(5)
        .Select(x => x.Key)
        .ToArray();`,
    },
    {
      title: '8. String Parsing — Parse CSV Line (No Commas in Quotes)',
      english: 'Parse a single CSV line into fields. Handle simple quoted fields.',
      bangla: 'এক CSV line field-এ parse — quoted field handle করুন।',
      code: `public string[] ParseCsvLine(string line) {
    var fields = new List<string>();
    var cur = new System.Text.StringBuilder();
    bool inQuotes = false;
    for (int i = 0; i < line.Length; i++) {
        char c = line[i];
        if (c == '"') { inQuotes = !inQuotes; continue; }
        if (c == ',' && !inQuotes) { fields.Add(cur.ToString()); cur.Clear(); continue; }
        cur.Append(c);
    }
    fields.Add(cur.ToString());
    return fields.ToArray();
}`,
    },
    {
      title: '9. Validation — Is Valid Email (Simple)',
      english: 'Return true if email matches basic pattern: one @, domain with dot. Use Regex or manual check.',
      bangla: 'Basic email valid: এক @, domain-এ dot — Regex বা manual check।',
      code: `public bool IsValidEmail(string email) {
    if (string.IsNullOrWhiteSpace(email)) return false;
    int at = email.IndexOf('@');
    if (at <= 0 || at != email.LastIndexOf('@')) return false;
    string domain = email[(at + 1)..];
    return domain.Contains('.') && !domain.StartsWith('.') && !domain.EndsWith('.');
}`,
    },
    {
      title: '10. Recursion — Flatten Nested List<int>',
      english: 'Flatten List<object> where elements are int or nested List — return all ints in order.',
      bangla: 'Nested List<int> flatten — সব int order-এ return।',
      code: `public IList<int> Flatten(NestedInteger nested) {
    var result = new List<int>();
    void Dfs(NestedInteger ni) {
        if (ni.IsInteger()) result.Add(ni.GetInteger());
        else foreach (var child in ni.GetList()) Dfs(child);
    }
    Dfs(nested);
    return result;
}
// NestedInteger provided by interviewer or stub interface`,
    },
    {
      title: '11. Sort — Multiple Keys (Name then Age)',
      english: 'Sort List<Person> by Name ascending, then Age ascending. Use LINQ OrderBy.ThenBy or Comparison.',
      bangla: 'List<Person> Name ascending, তারপর Age ascending sort।',
      code: `public record Person(string Name, int Age);

public IList<Person> SortPeople(IList<Person> people) =>
    people.OrderBy(p => p.Name).ThenBy(p => p.Age).ToList();`,
    },
    {
      title: '12. Pagination — Skip and Take',
      english: 'Implement GetPage<T>(items, page, pageSize) returning items for 1-based page number.',
      bangla: 'GetPage<T>(items, page, pageSize) — 1-based page number-এর items return।',
      code: `public IList<T> GetPage<T>(IList<T> items, int page, int pageSize) {
    if (page < 1 || pageSize < 1) return Array.Empty<T>();
    return items.Skip((page - 1) * pageSize).Take(pageSize).ToList();
}`,
    },
    {
      title: '13. Graph DFS — Can Reach Destination?',
      english: 'Given directed graph adjacency list, return true if there is a path from source to destination.',
      bangla: 'Directed graph — source থেকে destination path আছে কিনা DFS।',
      code: `public bool CanReach(int src, int dest, IList<int>[] adj) {
    var visited = new bool[adj.Length];
    bool Dfs(int u) {
        if (u == dest) return true;
        visited[u] = true;
        foreach (int v in adj[u])
            if (!visited[v] && Dfs(v)) return true;
        return false;
    }
    return Dfs(src);
}`,
    },
    {
      title: '14. Tree DFS — Sum of All Node Values',
      english: 'Return sum of all values in binary tree. Simple DFS recursion.',
      bangla: 'Binary tree সব node value-এর sum — DFS recursion।',
      code: `public int SumTree(TreeNode? root) {
    if (root == null) return 0;
    return root.val + SumTree(root.left) + SumTree(root.right);
}`,
    },
    {
      title: '15. Decimal — Tiered Tax Calculation',
      english: 'Calculate tax: first 1000 at 10%, amount above 1000 at 20%. Use decimal.',
      bangla: 'Tax: প্রথম 1000 → 10%, বাকি → 20% — decimal ব্যবহার করুন।',
      code: `public decimal CalculateTax(decimal income) {
    if (income <= 0) return 0m;
    decimal tax = Math.Min(income, 1000m) * 0.10m;
    if (income > 1000m) tax += (income - 1000m) * 0.20m;
    return Math.Round(tax, 2);
}`,
    },
    {
      title: '16. HashMap — Two Sum With All Pairs (Follow-up)',
      english: 'Return all unique index pairs (i,j) where i<j and nums[i]+nums[j]=target. Dictionary of value to indices.',
      bangla: 'সব unique pair (i,j) যেখানে nums[i]+nums[j]=target — Dictionary value→indices।',
      code: `public IList<int[]> TwoSumAllPairs(int[] nums, int target) {
    var map = new Dictionary<int, List<int>>();
    var result = new List<int[]>();
    for (int i = 0; i < nums.Length; i++) {
        int need = target - nums[i];
        if (map.TryGetValue(need, out var idxs))
            foreach (int j in idxs) result.Add(new[] { j, i });
        if (!map.ContainsKey(nums[i])) map[nums[i]] = new List<int>();
        map[nums[i]].Add(i);
    }
    return result;
}`,
    },
    {
      title: '17. Stack — Min Stack Design',
      english: 'Design stack that supports push, pop, top, and getMin in O(1). Use auxiliary stack.',
      bangla: 'Stack push/pop/top/getMin সব O(1) — auxiliary stack।',
      code: `public class MinStack {
    private readonly Stack<int> _stack = new();
    private readonly Stack<int> _mins = new();
    public void Push(int x) {
        _stack.Push(x);
        _mins.Push(_mins.Count == 0 ? x : Math.Min(x, _mins.Peek()));
    }
    public void Pop() { _stack.Pop(); _mins.Pop(); }
    public int Top() => _stack.Peek();
    public int GetMin() => _mins.Peek();
}`,
    },
    {
      title: '18. Sliding Window — Longest Repeating Character Replacement',
      english: 'String s and k — you can replace at most k chars. Longest substring with same letter. Window + frequency.',
      bangla: 'String s, k replace — same letter-এর longest substring sliding window + frequency।',
      code: `public int CharacterReplacement(string s, int k) {
    int[] count = new int[26];
    int left = 0, maxFreq = 0, best = 0;
    for (int right = 0; right < s.Length; right++) {
        maxFreq = Math.Max(maxFreq, ++count[s[right] - 'A']);
        while (right - left + 1 - maxFreq > k) count[s[left++] - 'A']--;
        best = Math.Max(best, right - left + 1);
    }
    return best;
}`,
    },
    {
      title: '19. DP — House Robber II (Circular Street)',
      english: 'Houses in circle — cannot rob first and last together. Run house robber on [0..n-2] and [1..n-1], take max.',
      bangla: 'Circular street — first ও last একসাথে rob নয়। [0..n-2] ও [1..n-1] robber max।',
      code: `public int RobCircular(int[] nums) {
    if (nums.Length == 1) return nums[0];
    return Math.Max(RobRange(nums, 0, nums.Length - 2), RobRange(nums, 1, nums.Length - 1));
}
int RobRange(int[] nums, int lo, int hi) {
    int a = 0, b = 0;
    for (int i = lo; i <= hi; i++) (a, b) = (b, Math.Max(b, a + nums[i]));
    return b;
}`,
    },
    {
      title: '20. ConcurrentDictionary — Thread-Safe Word Count',
      english: 'Count word frequencies from IEnumerable<string> safely when called from parallel tasks. ConcurrentDictionary or lock + Dictionary.',
      bangla: 'Parallel task থেকে word frequency count — ConcurrentDictionary বা lock+Dictionary।',
      code: `public Dictionary<string, int> CountWords(IEnumerable<string> words) {
    var counts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
    lock (counts) {
        foreach (var w in words) {
            if (string.IsNullOrWhiteSpace(w)) continue;
            counts[w] = counts.GetValueOrDefault(w) + 1;
        }
    }
    return counts;
}`,
    },
    {
      title: '21. LINQ — Find Duplicate Emails (ERP)',
      english: 'From employee list, return emails appearing more than once — BD live coding favorite.',
      bangla: 'Duplicate email — GroupBy, BD interview live coding।',
      code: `var dup = employees
    .GroupBy(e => e.Email)
    .Where(g => g.Count() > 1)
    .Select(g => new { Email = g.Key, Count = g.Count() });`,
    },
    {
      title: '22. Second Highest Salary (Distinct + Skip)',
      english: 'Second highest salary with duplicate salary values handled.',
      bangla: 'Duplicate salary সহ second highest — Distinct + OrderByDescending + Skip(1)।',
      code: `var second = employees.Select(e => e.Salary).Distinct()
    .OrderByDescending(s => s).Skip(1).First();`,
    },
    {
      title: '23. Missing Numbers 1..n',
      english: 'Return missing numbers in sequence using Range and Except.',
      bangla: '১..n missing number — Enumerable.Range + Except।',
      code: `var missing = Enumerable.Range(1, n).Except(numbers);`,
    },
    {
      title: '24. Employee Exists — Any() not Count',
      english: 'Check existence with Any() — stops at first match.',
      bangla: 'Exists check — Any(), Count()>0 নয়।',
      code: `bool exists = employees.Any(e => e.Id == id);`,
    },
    {
      title: '25. Top 3 Salary + Dept Average',
      english: 'Top 3 by salary; group by department for average salary.',
      bangla: 'Top 3 salary; department-wise Average — OrderByDescending.Take + GroupBy.Average।',
      code: `var top3 = employees.OrderByDescending(e => e.Salary).Take(3);
var deptAvg = employees.GroupBy(e => e.Department)
    .Select(g => new { g.Key, Avg = g.Average(e => e.Salary) });`,
    },
    {
      title: '26. Dynamic LINQ Search (IQueryable)',
      english: 'Optional filters on name/department — query composes before ToListAsync.',
      bangla: 'Optional filter — IQueryable compose, শেষে ToListAsync।',
      code: `IQueryable<Employee> q = _context.Employees;
if (!string.IsNullOrWhiteSpace(name)) q = q.Where(x => x.Name.Contains(name));
if (!string.IsNullOrWhiteSpace(dept)) q = q.Where(x => x.Department.Name == dept);
return await q.AsNoTracking().ToListAsync();`,
    },
    {
      title: '27. Pagination + Search + Sort API',
      english: 'Search, sort switch, Skip/Take with AsNoTracking.',
      bangla: 'Search + sort + pagination — AsNoTracking।',
      code: `var q = _context.Employees.AsNoTracking();
if (!string.IsNullOrEmpty(search)) q = q.Where(x => x.Name.Contains(search));
q = sortBy switch {
  "salary" => q.OrderByDescending(x => x.Salary),
  "name" => q.OrderBy(x => x.Name),
  _ => q.OrderBy(x => x.Id)
};
return await q.Skip((page - 1) * size).Take(size).ToListAsync();`,
    },
    {
      title: '28. Reverse String (Two Pointers)',
      english: 'Reverse string in-place — O(n) time, O(1) extra space.',
      bangla: 'Two pointer string reverse — O(n) time।',
      code: `static string Reverse(string s) {
    var c = s.ToCharArray();
    for (int l = 0, r = c.Length - 1; l < r; l++, r--)
        (c[l], c[r]) = (c[r], c[l]);
    return new string(c);
}`,
    },
    {
      title: '29. SQL — Second Highest Salary',
      english: 'T-SQL second highest salary subquery pattern.',
      bangla: 'T-SQL second highest — MAX subquery।',
      code: `SELECT MAX(Salary) FROM Employee
WHERE Salary < (SELECT MAX(Salary) FROM Employee);`,
    },
    {
      title: '30. SQL — Duplicate Email (GROUP BY HAVING)',
      english: 'Find duplicate emails in SQL — interview classic.',
      bangla: 'SQL duplicate email — GROUP BY HAVING COUNT>1।',
      code: `SELECT Email, COUNT(*) AS Cnt FROM Employee
GROUP BY Email HAVING COUNT(*) > 1;`,
    },
    {
      title: '31. LINQ — Employees Joined Last 30 Days',
      english: 'Filter employees where DateJoined >= today minus 30 days.',
      bangla: 'গত ৩০ দিনে join করা employee — DateJoined filter।',
      code: `var recent = employees
    .Where(e => e.DateJoined >= DateTime.Today.AddDays(-30))
    .ToList();`,
    },
    {
      title: '32. LINQ — Highest Paid Per Department',
      english: 'Return highest salary employee from each department.',
      bangla: 'প্রতি department-এ highest salary employee — GroupBy + OrderByDescending + First।',
      code: `var result = employees
    .GroupBy(e => e.Department)
    .Select(g => g.OrderByDescending(e => e.Salary).First());`,
    },
    {
      title: '33. LINQ — Multiple Sort (Salary DESC, Name ASC)',
      english: 'Sort by salary descending then name ascending.',
      bangla: 'Salary descending, তারপর Name ascending — OrderByDescending.ThenBy।',
      code: `var sorted = employees
    .OrderByDescending(e => e.Salary)
    .ThenBy(e => e.Name);`,
    },
    {
      title: '34. LINQ — Intersect Common Elements',
      english: 'Find common elements between two lists.',
      bangla: 'দুটি list-এর common element — Intersect()।',
      code: `var common = listA.Intersect(listB);`,
    },
    {
      title: '35. Prime Number Check',
      english: 'Return true if number is prime — check up to sqrt(n).',
      bangla: 'Prime check — sqrt(n) পর্যন্ত loop।',
      code: `static bool IsPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= Math.Sqrt(n); i++)
        if (n % i == 0) return false;
    return true;
}`,
    },
    {
      title: '36. Specification Pattern — Active Employees',
      english: 'Encapsulate query logic in reusable specification applying to IQueryable.',
      bangla: 'Specification Pattern — query logic reusable specification-এ।',
      code: `public class ActiveEmployeeSpec {
    public IQueryable<Employee> Apply(IQueryable<Employee> q) =>
        q.Where(x => x.IsActive);
}
// Usage: spec.Apply(_context.Employees).ToListAsync();`,
    },
    {
      title: '37. Bulk Insert — 50k Employees',
      english: 'Import large employee list — use bulk extension or SqlBulkCopy, not foreach SaveChanges.',
      bangla: '৫০k employee import — BulkInsert/SqlBulkCopy, foreach SaveChanges নয়।',
      code: `// await context.BulkInsertAsync(employees); // EFCore.BulkExtensions
// Or SqlBulkCopy for maximum throughput`,
    },
    {
      title: '38. Rate Limiting — Login API (.NET 8)',
      english: 'Fixed window rate limiter on login endpoint — 5 requests per minute.',
      bangla: 'Login API rate limit — ৫ request/minute FixedWindowLimiter।',
      code: `builder.Services.AddRateLimiter(o => {
    o.AddFixedWindowLimiter("login", opt => {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
app.UseRateLimiter();`,
    },
    {
      title: '39. Distributed Cache Pattern',
      english: 'Cache-aside: check Redis, miss then SQL, set cache, invalidate on update.',
      bangla: 'Cache-aside: Redis check → SQL → set cache; update-এ invalidate।',
      code: `var cached = await _cache.GetAsync(key);
if (cached != null) return Deserialize(cached);
var data = await _repo.GetByIdAsync(id);
await _cache.SetAsync(key, Serialize(data));
return data;
// On update: await _cache.RemoveAsync(key);`,
    },
    {
      title: '40. SQL — Running Total Salary',
      english: 'Running total of salary ordered by EmployeeID using window function.',
      bangla: 'Running total salary — SUM() OVER (ORDER BY EmployeeID)।',
      code: `SELECT EmployeeID, Salary,
  SUM(Salary) OVER (ORDER BY EmployeeID) AS RunningTotal
FROM Employee;`,
    },
    {
      title: '41. LINQ — Highest Salary Employee (MaxBy)',
      english: 'Find employee with maximum salary — OrderByDescending First or MaxBy (.NET 6+).',
      bangla: 'Highest salary employee — MaxBy বা OrderByDescending().First()।',
      code: `var top = employees.MaxBy(e => e.Salary);
// Or: employees.OrderByDescending(e => e.Salary).First();`,
    },
    {
      title: '42. LINQ — Department Employee Count',
      english: 'Group employees by department and return count per department.',
      bangla: 'Department-wise count — GroupBy + Count()।',
      code: `var counts = employees
    .GroupBy(e => e.Department)
    .Select(g => new { Department = g.Key, Total = g.Count() });`,
    },
    {
      title: '43. Count Words in String',
      english: 'Split string by whitespace and count non-empty tokens.',
      bangla: 'Word count — Split + empty filter।',
      code: `static int CountWords(string text) =>
    text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;`,
    },
    {
      title: '44. Remove Duplicate Numbers',
      english: 'Return list with duplicates removed — Distinct or HashSet.',
      bangla: 'Duplicate number remove — Distinct()।',
      code: `var unique = numbers.Distinct().ToList();`,
    },
    {
      title: '45. Filter Even Numbers',
      english: 'Return only even numbers from a list.',
      bangla: 'Even numbers — Where(n => n % 2 == 0)।',
      code: `var evens = numbers.Where(n => n % 2 == 0);`,
    },
    {
      title: '46. Top 5 Most Recent Joiners',
      english: 'Order by DateJoined descending and take top 5.',
      bangla: 'Top 5 recent join — OrderByDescending(DateJoined).Take(5)।',
      code: `var recent = employees
    .OrderByDescending(e => e.DateJoined)
    .Take(5);`,
    },
    {
      title: '47. Employees Without Department',
      english: 'Find employees where Department is null or empty.',
      bangla: 'Department null/empty employee — Where filter।',
      code: `var noDept = employees
    .Where(e => string.IsNullOrEmpty(e.Department));`,
    },
    {
      title: '48. Oldest Employee',
      english: 'Find employee with earliest DateOfBirth.',
      bangla: 'Oldest employee — OrderBy(DateOfBirth).First()।',
      code: `var oldest = employees
    .OrderBy(e => e.DateOfBirth)
    .First();`,
    },
    {
      title: '49. Total Salary Sum',
      english: 'Sum all employee salaries — handle empty list.',
      bangla: 'Total salary — Sum(x => x.Salary)।',
      code: `var total = employees.Sum(e => e.Salary);`,
    },
    {
      title: '50. SQL — Nth Highest Salary (DENSE_RANK)',
      english: 'Find 3rd highest salary using window function.',
      bangla: 'Nth highest — DENSE_RANK() OVER (ORDER BY Salary DESC)।',
      code: `SELECT Salary FROM (
  SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) AS Rnk
  FROM Employee
) t WHERE Rnk = 3;`,
    },
    {
      title: '51. Generic Repository Interface',
      english: 'IRepository<T> with common CRUD — used when team needs test boundary beyond DbContext.',
      bangla: 'Generic Repository — IRepository<T> CRUD abstraction।',
      code: `public interface IRepository<T> where T : class {
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
}`,
    },
    {
      title: '52. Optimistic Concurrency (RowVersion)',
      english: 'Handle concurrent updates with Timestamp RowVersion and DbUpdateConcurrencyException.',
      bangla: 'RowVersion + DbUpdateConcurrencyException handle।',
      code: `public class Employee {
    public byte[] RowVersion { get; set; } // [Timestamp]
}
// catch (DbUpdateConcurrencyException) → reload or merge`,
    },
    {
      title: '53. Background Queue (Channel)',
      english: 'Enqueue work items processed by IHostedService — do not block HTTP request.',
      bangla: 'Background queue — Channel + HostedService worker।',
      code: `await _channel.Writer.WriteAsync(job);
// BackgroundService: await foreach (var job in _channel.Reader.ReadAllAsync())`,
    },
    {
      title: '54. MediatR Command Handler (CQRS)',
      english: 'Send command via IMediator — handler contains single use-case logic.',
      bangla: 'MediatR — IRequest → handler, controller thin।',
      code: `public record CreateEmployeeCommand(string Name) : IRequest<int>;
public class Handler : IRequestHandler<CreateEmployeeCommand, int> {
    public async Task<int> Handle(CreateEmployeeCommand req, CancellationToken ct) { ... }
}
// await _mediator.Send(new CreateEmployeeCommand("Amir"));`,
    },
  ],
  interviewQuestions: [
    {
      q: 'What data structure would you use to find if a path exists in a social network graph?',
      a: 'Use adjacency list (Dictionary<int, List<int>> or List<int>[]) plus BFS with Queue if you need shortest path in unweighted graph, or DFS with HashSet visited if you only need existence. For .NET, mention you would not load the whole graph into EF — this is in-memory algorithm practice mirroring real traversal.',
      bangla: 'Adjacency list + BFS (shortest) বা DFS (exists) — HashSet visited। EF-এ whole graph load নয় — in-memory traversal mirror।',
      difficulty: 'mid',
    },
    {
      q: 'Are LINQ queries allowed in .NET live coding interviews?',
      a: 'Usually yes for mid-level unless stated otherwise. Use LINQ for GroupBy, OrderBy, Where when it reads clearly. If performance matters, offer manual Dictionary/loop version. Always state whether execution is deferred or materialized.',
      bangla: 'Mid-level-এ সাধারণত yes — GroupBy/OrderBy clear থাকলে LINQ; performance হলে manual offer; deferred/materialized বলুন।',
      difficulty: 'junior',
    },
  ],
  quickRevision: {
    concepts: [
      'Dictionary = map/count; HashSet = dedup/exists',
      'Stack = LIFO brackets/RPN; Queue = BFS',
      'PriorityQueue = top K / scheduling (.NET 6+)',
      'LINQ: GroupBy, OrderBy, SelectMany, Skip/Take',
      'decimal for money; null checks first',
    ],
    questions: [
      'List vs Dictionary vs HashSet?',
      'BFS vs DFS when?',
      'LINQ deferred vs immediate?',
    ],
    mistakes: [
      'List.Contains inside loop (O(n²))',
      'double for currency',
      'Forgetting ConcurrentDictionary or lock for shared counts',
    ],
    scenarios: [
      'Machine test: CSV parse + validate + group',
      'Live: Two Sum with Dictionary',
      'Live: RPN with Stack',
    ],
  },
  summary:
    'Master C# collections (Dictionary, Stack, Queue, PriorityQueue), solve DSA by structure, and practice LINQ plus .NET parsing/validation tasks — the mix most .NET interviews actually test.',
};
