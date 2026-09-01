export const algorithmsData = {
  id: 'algorithms',
  title: 'Algorithms & Data Structures for .NET Interviews',
  description:
    'Big-O, core data structures, sorting, searching, trees, graphs, and dynamic programming — with C# solutions for the algorithm tasks most .NET interviews assign.',
  chapterNumber: 29,
  sections: [
    {
      id: 'big-o-complexity',
      topic: 'Big O & Complexity — What Interviewers Expect',
      difficulty: 'junior',
      english:
        'You do not need PhD-level math. You need to compare solutions: "nested loop is O(n²), hash map is O(n)". .NET interviews often ask you to optimize a brute-force solution or explain why EF/LINQ is slow.',
      bangla:
        'PhD-level math দরকার নয় — solution compare করতে হবে: "nested loop O(n²), hash map O(n)"। .NET interview-তে brute-force optimize বা EF/LINQ slow কেন explain করতে বলে।',
      details: `
### Common complexities (know these cold)

| Complexity | Name | Example in C# |
| :--- | :--- | :--- |
| O(1) | Constant | \`dict[key]\`, \`stack.Push\` |
| O(log n) | Logarithmic | Binary search on sorted array |
| O(n) | Linear | Single \`foreach\`, one hash pass |
| O(n log n) | Linearithmic | \`Array.Sort\`, LINQ \`OrderBy\` |
| O(n²) | Quadratic | Nested loops, bubble sort |
| O(2ⁿ) | Exponential | Naive Fibonacci recursion |

### Space complexity
- **O(1) extra space** — only a few variables (two pointers, swap in-place)
- **O(n) space** — Dictionary, recursion stack depth n, new array copy

### How to say it in an interview
"Single pass with a Dictionary → **O(n) time**, **O(n) space** for the map. We could reduce space to O(1) if the input guarantees small alphabet — use \`int[26]\` instead."
      `,
      commonMistakes: [
        'Saying "O(n log n)" without knowing why (usually sorting).',
        'Ignoring recursion stack space in DFS.',
        'Claiming LINQ is always O(n) — GroupBy + OrderBy can be higher.',
      ],
      bestPractices: [
        'Always give time AND space.',
        'Mention trade-off: faster lookup vs more memory.',
        'Relate to .NET: List.Contains is O(n); HashSet.Contains is O(1).',
      ],
      interviewQs: [
        {
          q: 'What is the time complexity of Dictionary lookup in C#?',
          a: 'Average case O(1), worst case O(n) if many hash collisions. In practice .NET Dictionary uses chaining and resizes when load factor grows — interviewers accept "amortized O(1)". Contrast with List.Contains which is O(n).',
          bangla: 'Dictionary average O(1); List.Contains O(n) — contrast করুন।',
          difficulty: 'junior',
        },
      ],
      practice: 'For Binary Search, write time O(log n) and space O(1) on paper.',
    },
    {
      id: 'sorting-searching',
      topic: 'Sorting & Searching Algorithms',
      difficulty: 'mid',
      english:
        'You rarely implement QuickSort from scratch in .NET interviews, but you must implement Binary Search, know when data must be sorted, and explain built-in Sort (IntroSort).',
      bangla:
        'QuickSort scratch থেকে কম লাগে, কিন্তু Binary Search implement করতে হবে, sorted data কখন লাগে জানতে হবে, built-in Sort (IntroSort) explain করতে হবে।',
      details: `
### Algorithms to implement in C#

| Algorithm | When used | Complexity |
| :--- | :--- | :--- |
| **Binary Search** | Sorted array, find target | O(log n) |
| **Merge Sort** | Stable sort concept, merge step | O(n log n) |
| **Quick Sort** | Partition concept (interview discussion) | O(n log n) avg |
| **Built-in** | \`Array.Sort\`, \`OrderBy\` | O(n log n) |

### Binary search template (avoid overflow)
\`\`\`csharp
int lo = 0, hi = nums.Length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2; // not (lo+hi)/2
    ...
}
\`\`\`

### Searching variants interviewers ask
- Find **first/last** position of target (binary search with bias)
- Search in **rotated sorted** array
- **Square root** / minimize maximum (binary search on answer)
      `,
      interviewQs: [
        {
          q: 'Why use lo + (hi - lo) / 2 instead of (lo + hi) / 2?',
          a: 'When lo and hi are large, lo + hi can overflow int.MaxValue in languages with fixed-width ints. lo + (hi - lo) / 2 computes the same midpoint safely. In C# this is less critical than Java/C++ but still shows you understand edge cases — good senior signal.',
          bangla: 'lo+hi overflow avoid — midpoint safe formula।',
          difficulty: 'mid',
        },
      ],
      practice: 'Implement binary search returning index or -1.',
      code: `public int BinarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.Length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    },
    {
      id: 'linked-list-stack-queue',
      topic: 'Linked Lists, Stack & Queue',
      difficulty: 'mid',
      english:
        'Reverse a linked list, detect cycle, implement queue using stacks — these test pointer manipulation and understanding of BCL collections vs custom nodes.',
      bangla:
        'Linked list reverse, cycle detect, stack দিয়ে queue — pointer manipulation এবং BCL vs custom node বোঝায়।',
      details: `
### Must-know linked list tasks
- **Reverse** (iterative three pointers)
- **Cycle detection** (Floyd slow/fast)
- **Merge two sorted lists**
- **Middle node** (slow/fast)

### Stack & Queue patterns
- **Valid parentheses** — stack of expected closers
- **Queue using two stacks** — amortized O(1) enqueue/dequeue
- **Monotonic stack** — next greater element (advanced mid)

### C# note
Interviewers may use \`ListNode\` class. In production prefer \`LinkedList<T>\` from BCL or arrays unless you need O(1) splice.
      `,
      interviewQs: [
        {
          q: 'How does Floyd cycle detection work?',
          a: 'Slow moves 1 step, fast moves 2 steps. If there is a cycle, fast eventually laps slow and they meet inside the cycle. If fast reaches null, no cycle. After meeting, reset one pointer to head and move both 1 step — meeting point is cycle start (optional follow-up proof). O(n) time, O(1) space.',
          bangla: 'Slow 1, fast 2 step — meet হলে cycle; null হলে no cycle। O(n) time O(1) space।',
          difficulty: 'mid',
        },
      ],
      practice: 'Reverse linked list iteratively — draw pointers before coding.',
      code: `public ListNode? ReverseList(ListNode? head) {
    ListNode? prev = null, curr = head;
    while (curr != null) {
        var next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    },
    {
      id: 'trees-graphs',
      topic: 'Trees & Graphs — BFS, DFS, Traversals',
      difficulty: 'mid',
      english:
        'Binary tree traversals (in/pre/post-order), BFS level order, and graph BFS/DFS appear in mid/senior .NET interviews — especially when discussing hierarchies, org charts, or dependency graphs.',
      bangla:
        'Binary tree traversal, BFS level order, graph BFS/DFS mid/senior .NET interview-তে আসে — hierarchy, org chart, dependency graph-এর context-এ।',
      details: `
### Tree traversals

| Order | Visit | Use case |
| :--- | :--- | :--- |
| Inorder (LNR) | Left, Node, Right | BST → sorted order |
| Preorder (NLR) | Node, Left, Right | Copy tree, prefix expression |
| Postorder (LRN) | Left, Right, Node | Delete tree, postfix |
| Level order | BFS with Queue | Print by level |

### Graph representation in interviews
- **Adjacency list**: \`List<int>[]\` or \`Dictionary<int, List<int>>\`
- **BFS** — shortest path unweighted, level-by-level
- **DFS** — detect cycle, connected components, path exists

### .NET real-world link
- File system folders → tree DFS
- Service dependency graph → topological sort (Kahn BFS)
      `,
      interviewQs: [
        {
          q: 'BFS vs DFS — when to use which?',
          a: 'BFS when you need shortest path in an unweighted graph or level-order processing — uses Queue, O(V+E). DFS when you need to explore all paths, detect cycles with recursion stack, or backtrack — uses less memory for deep narrow graphs but can stack overflow on very deep trees. In ASP.NET, BFS models breadth-first API fan-out; DFS models deep dependency resolution.',
          bangla: 'Shortest path/level → BFS; backtrack/cycle/path explore → DFS।',
          difficulty: 'mid',
        },
      ],
      practice: 'Implement level-order traversal with Queue<TreeNode>.',
      code: `public IList<IList<int>> LevelOrder(TreeNode? root) {
    var result = new List<IList<int>>();
    if (root == null) return result;
    var q = new Queue<TreeNode>();
    q.Enqueue(root);
    while (q.Count > 0) {
        int size = q.Count;
        var level = new List<int>(size);
        for (int i = 0; i < size; i++) {
            var node = q.Dequeue();
            level.Add(node.val);
            if (node.left != null) q.Enqueue(node.left);
            if (node.right != null) q.Enqueue(node.right);
        }
        result.Add(level);
    }
    return result;
}`,
    },
    {
      id: 'dynamic-programming',
      topic: 'Dynamic Programming — Patterns & When to Use',
      difficulty: 'senior',
      english:
        'DP scares beginners but .NET interviews usually ask classic patterns: Fibonacci, climbing stairs, coin change, LCS, house robber. Learn to spot "count ways" and "longest sub…" phrases.',
      bangla:
        'DP ভয় লাগে, কিন্তু .NET interview-তে classic pattern: Fibonacci, climbing stairs, coin change, LCS। "Count ways" ও "longest sub…" phrase চিনুন।',
      details: `
### DP recognition signals
- **Overlapping subproblems** — Fib(n) calls Fib(n-1) many times
- **Optimal substructure** — best answer built from smaller answers
- Keywords: "maximum", "minimum", "count ways", "longest", "can you reach"

### Top-down vs bottom-up

| Style | C# approach | Pros |
| :--- | :--- | :--- |
| Top-down | Recursion + \`Dictionary\` memo | Easier to write |
| Bottom-up | \`int[] dp\` loops | No stack overflow, often faster |

### Classic DP tasks for .NET interviews
1. Climbing stairs / Fibonacci
2. House robber (max non-adjacent sum)
3. Coin change (min coins)
4. Longest common subsequence
5. Maximum subarray (Kadane — greedy/DP hybrid)
      `,
      interviewQs: [
        {
          q: 'What is the difference between memoization and tabulation?',
          a: 'Memoization (top-down) stores results of recursive calls in a cache when first computed — lazy. Tabulation (bottom-up) fills a table from smallest subproblem up — iterative, no recursion stack. Both are DP. In C# interviews, start with memo Dictionary for speed of writing; mention you could convert to bottom-up int[] for O(1) stack space.',
          bangla: 'Memoization = top-down lazy cache; tabulation = bottom-up table fill।',
          difficulty: 'senior',
        },
      ],
      practice: 'Solve climbing stairs with bottom-up O(1) space.',
      code: `public int ClimbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) (a, b) = (b, a + b);
    return b;
}`,
    },
    {
      id: 'advanced-patterns',
      topic: 'Sliding Window, Heap & Trie (Mid/Senior)',
      difficulty: 'senior',
      english:
        'Sliding window solves substring/subarray problems in O(n). Heap (PriorityQueue in .NET 6+) finds top K. Trie supports prefix search — autocomplete scenarios.',
      bangla:
        'Sliding window substring/subarray O(n); Heap (.NET 6+ PriorityQueue) top K; Trie prefix search — autocomplete।',
      details: `
### Sliding window checklist
1. Expand window until constraint violated
2. Shrink from left until valid again
3. Update answer at each valid state

### PriorityQueue<T> (.NET 6+)
\`var pq = new PriorityQueue<int,int>();\` — use for **Kth largest**, merge K sorted lists, Dijkstra.

### When interviewers ask Trie
- Autocomplete, word search, prefix counting
- Trade-off: O(word length) lookup vs memory for children
      `,
      interviewQs: [
        {
          q: 'How do you find the Kth largest element efficiently?',
          a: 'Option 1: Min-heap of size K — O(n log k) time, O(k) space; stream-friendly. Option 2: QuickSelect — O(n) average. Option 3: Sort — O(n log n), simplest but mention better options. In .NET 6+, use PriorityQueue and explain why heap beats full sort when K is small.',
          bangla: 'Min-heap size K → O(n log k); full sort O(n log n) — K ছোট হলে heap better।',
          difficulty: 'senior',
        },
      ],
      practice: 'Implement max sliding window of size k (deque or heap approach).',
    },
  ],
  tasks: [
    {
      title: '1. Binary Search',
      english: 'Find target index in sorted array, or -1.',
      bangla: 'Sorted array-তে target index, না থাকলে -1।',
      code: `public int Search(int[] nums, int target) {
    int lo = 0, hi = nums.Length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    },
    {
      title: '2. Reverse Linked List',
      english: 'Reverse singly linked list iteratively. O(n) time, O(1) space.',
      bangla: 'Singly linked list iterative reverse।',
      code: `public ListNode? ReverseList(ListNode? head) {
    ListNode? prev = null, curr = head;
    while (curr != null) {
        var next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    },
    {
      title: '3. Linked List Cycle (Floyd)',
      english: 'Return true if linked list has a cycle.',
      bangla: 'Linked list-এ cycle আছে কিনা Floyd algorithm।',
      code: `public bool HasCycle(ListNode? head) {
    var slow = head;
    var fast = head;
    while (fast?.next != null) {
        slow = slow!.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    },
    {
      title: '4. Maximum Subarray (Kadane)',
      english: 'Find contiguous subarray with largest sum.',
      bangla: 'সবচেয়ে বড় sum-এর contiguous subarray (Kadane)।',
      code: `public int MaxSubArray(int[] nums) {
    int best = nums[0], cur = nums[0];
    for (int i = 1; i < nums.Length; i++) {
        cur = Math.Max(nums[i], cur + nums[i]);
        best = Math.Max(best, cur);
    }
    return best;
}`,
    },
    {
      title: '5. Climbing Stairs (DP)',
      english: 'Count distinct ways to climb n stairs (1 or 2 steps at a time).',
      bangla: 'n সিঁড়ি — ১ বা ২ step, কত distinct way।',
      code: `public int ClimbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) (a, b) = (b, a + b);
    return b;
}`,
    },
    {
      title: '6. Fibonacci with Memoization',
      english: 'Nth Fibonacci with top-down memo — avoid exponential recursion.',
      bangla: 'Memoization দিয়ে Fibonacci — exponential recursion avoid।',
      code: `public long Fib(int n, Dictionary<int, long>? memo = null) {
    memo ??= new Dictionary<int, long>();
    if (n <= 1) return n;
    if (memo.TryGetValue(n, out var v)) return v;
    return memo[n] = Fib(n - 1, memo) + Fib(n - 2, memo);
}`,
    },
    {
      title: '7. Merge Intervals',
      english: 'Merge overlapping intervals [[1,3],[2,6],[8,10]].',
      bangla: 'Overlapping interval merge করুন।',
      code: `public int[][] Merge(int[][] intervals) {
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    var merged = new List<int[]>();
    foreach (var iv in intervals) {
        if (merged.Count == 0 || merged[^1][1] < iv[0])
            merged.Add(iv);
        else
            merged[^1][1] = Math.Max(merged[^1][1], iv[1]);
    }
    return merged.ToArray();
}`,
    },
    {
      title: '8. Coin Change (Min Coins)',
      english: 'Fewest coins to make amount, or -1 if impossible.',
      bangla: 'amount তৈরি minimum coin count, impossible হলে -1।',
      code: `public int CoinChange(int[] coins, int amount) {
    var dp = new int[amount + 1];
    Array.Fill(dp, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        foreach (int c in coins)
            if (c <= a) dp[a] = Math.Min(dp[a], dp[a - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    },
    {
      title: '9. Longest Common Subsequence',
      english: 'Length of LCS for two strings (classic 2D DP).',
      bangla: 'দুটি string-এর LCS length (2D DP)।',
      code: `public int LongestCommonSubsequence(string a, string b) {
    int m = a.Length, n = b.Length;
    var dp = new int[m + 1, n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i, j] = a[i - 1] == b[j - 1]
                ? dp[i - 1, j - 1] + 1
                : Math.Max(dp[i - 1, j], dp[i, j - 1]);
    return dp[m, n];
}`,
    },
    {
      title: '10. Binary Tree Inorder Traversal',
      english: 'Return inorder values (left, root, right) — recursive or iterative.',
      bangla: 'Inorder traversal (left, root, right)।',
      code: `public IList<int> InorderTraversal(TreeNode? root) {
    var result = new List<int>();
    void Dfs(TreeNode? node) {
        if (node == null) return;
        Dfs(node.left);
        result.Add(node.val);
        Dfs(node.right);
    }
    Dfs(root);
    return result;
}`,
    },
    {
      title: '11. Validate Binary Search Tree',
      english: 'Determine if tree is valid BST (all left < node < all right).',
      bangla: 'Tree valid BST কিনা check করুন।',
      code: `public bool IsValidBST(TreeNode? root) {
    return Valid(root, long.MinValue, long.MaxValue);
}
bool Valid(TreeNode? node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return Valid(node.left, min, node.val) && Valid(node.right, node.val, max);
}`,
    },
    {
      title: '12. Graph BFS',
      english: 'BFS traversal from start node using adjacency list.',
      bangla: 'Adjacency list থেকে BFS traversal।',
      code: `public IList<int> Bfs(int start, IList<int>[] adj) {
    var visited = new bool[adj.Count];
    var order = new List<int>();
    var q = new Queue<int>();
    q.Enqueue(start);
    visited[start] = true;
    while (q.Count > 0) {
        int u = q.Dequeue();
        order.Add(u);
        foreach (int v in adj[u])
            if (!visited[v]) { visited[v] = true; q.Enqueue(v); }
    }
    return order;
}`,
    },
    {
      title: '13. Number of Islands (DFS)',
      english: 'Count connected components of 1 in a 2D grid (classic DFS/BFS).',
      bangla: '2D grid-এ 1-এর connected component (island) count।',
      code: `public int NumIslands(char[][] grid) {
    int rows = grid.Length, cols = grid[0].Length, count = 0;
    void Dfs(int r, int c) {
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') return;
        grid[r][c] = '0';
        Dfs(r + 1, c); Dfs(r - 1, c); Dfs(r, c + 1); Dfs(r, c - 1);
    }
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == '1') { count++; Dfs(r, c); }
    return count;
}`,
    },
    {
      title: '14. Kth Largest Element (Min-Heap)',
      english: 'Find Kth largest using PriorityQueue — O(n log k).',
      bangla: 'PriorityQueue দিয়ে Kth largest — O(n log k)।',
      code: `public int FindKthLargest(int[] nums, int k) {
    var pq = new PriorityQueue<int, int>();
    foreach (int n in nums) {
        pq.Enqueue(n, n);
        if (pq.Count > k) pq.Dequeue();
    }
    return pq.Peek();
}`,
    },
    {
      title: '15. Implement Queue using Stacks',
      english: 'FIFO queue using two stacks — classic data structure design.',
      bangla: 'দুটি Stack দিয়ে FIFO Queue — classic design question।',
      code: `public class MyQueue {
    private readonly Stack<int> _in = new(), _out = new();
    public void Push(int x) => _in.Push(x);
    public int Pop() {
        Move();
        return _out.Pop();
    }
    public int Peek() { Move(); return _out.Peek(); }
    void Move() {
        if (_out.Count == 0)
            while (_in.Count > 0) _out.Push(_in.Pop());
    }
}`,
    },
    {
      title: '16. Sliding Window Maximum',
      english: 'Max in each window of size k — deque technique O(n).',
      bangla: 'Size k window-এর প্রতিটিতে max — deque O(n)।',
      code: `public int[] MaxSlidingWindow(int[] nums, int k) {
    var dq = new LinkedList<int>();
    var res = new int[nums.Length - k + 1];
    int ri = 0;
    for (int i = 0; i < nums.Length; i++) {
        while (dq.Count > 0 && dq.First!.Value <= i - k) dq.RemoveFirst();
        while (dq.Count > 0 && nums[dq.Last!.Value] <= nums[i]) dq.RemoveLast();
        dq.AddLast(i);
        if (i >= k - 1) res[ri++] = nums[dq.First!.Value];
    }
    return res;
}`,
    },
    {
      title: '17. Trie (Prefix Tree) — Insert & Search',
      english: 'Autocomplete-style prefix tree for word insert and exact search.',
      bangla: 'Insert ও exact search-এর Trie (prefix tree)।',
      code: `public class Trie {
    private class Node {
        public Dictionary<char, Node> Next = new();
        public bool End;
    }
    private readonly Node _root = new();
    public void Insert(string word) {
        var cur = _root;
        foreach (char c in word) {
            if (!cur.Next.ContainsKey(c)) cur.Next[c] = new Node();
            cur = cur.Next[c];
        }
        cur.End = true;
    }
    public bool Search(string word) {
        var cur = _root;
        foreach (char c in word) {
            if (!cur.Next.TryGetValue(c, out cur!)) return false;
        }
        return cur.End;
    }
}`,
    },
    {
      title: '18. House Robber (DP)',
      english: 'Max money robbing non-adjacent houses along a street.',
      bangla: 'Adjacent নয় — max money (House Robber DP)।',
      code: `public int Rob(int[] nums) {
    int rob1 = 0, rob2 = 0;
    foreach (int n in nums) (rob1, rob2) = (rob2, Math.Max(rob2, rob1 + n));
    return rob2;
}`,
    },
    {
      title: '19. Product of Array Except Self',
      english: 'Return array where output[i] = product of all elements except nums[i]. O(n), no division.',
      bangla: 'output[i] = বাকি সব element-এর product — O(n), division ছাড়া।',
      code: `public int[] ProductExceptSelf(int[] nums) {
    int n = nums.Length;
    var res = new int[n];
    res[0] = 1;
    for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
    }
    return res;
}`,
    },
    {
      title: '20. Container With Most Water (Two Pointers)',
      english: 'Max area between two lines in height array.',
      bangla: 'Height array-তে two pointer দিয়ে max water area।',
      code: `public int MaxArea(int[] h) {
    int l = 0, r = h.Length - 1, best = 0;
    while (l < r) {
        best = Math.Max(best, Math.Min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++; else r--;
    }
    return best;
}`,
    },
    {
      title: '21. Merge Two Sorted Lists',
      english: 'Merge two sorted linked lists into one sorted list. Classic pointer problem — asked in most mid-level .NET interviews.',
      bangla: 'দুটি sorted linked list merge — classic pointer, mid-level .NET interview-এ almost always।',
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
      title: '22. Add Two Numbers (Linked List)',
      english: 'Two non-empty linked lists representing digits in reverse order — add and return sum as linked list.',
      bangla: 'Reverse digit linked list দুটি যোগ — sum linked list return (carry handle)।',
      code: `public ListNode? AddTwoNumbers(ListNode? l1, ListNode? l2) {
    var dummy = new ListNode(0);
    var cur = dummy;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
        int sum = carry;
        if (l1 != null) { sum += l1.val; l1 = l1.next; }
        if (l2 != null) { sum += l2.val; l2 = l2.next; }
        cur.next = new ListNode(sum % 10);
        carry = sum / 10;
        cur = cur.next;
    }
    return dummy.next;
}`,
    },
    {
      title: '23. Maximum Depth of Binary Tree',
      english: 'Return max depth (height) of binary tree. Simple DFS — very common tree warm-up.',
      bangla: 'Binary tree max depth — simple DFS, tree warm-up খুব common।',
      code: `public int MaxDepth(TreeNode? root) {
    if (root == null) return 0;
    return 1 + Math.Max(MaxDepth(root.left), MaxDepth(root.right));
}`,
    },
    {
      title: '24. Symmetric Tree (Mirror)',
      english: 'Check if binary tree is mirror of itself. Common follow-up after max depth.',
      bangla: 'Tree নিজের mirror কিনা — max depth-এর পর common follow-up।',
      code: `public bool IsSymmetric(TreeNode? root) {
    bool Mirror(TreeNode? a, TreeNode? b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && Mirror(a.left, b.right) && Mirror(a.right, b.left);
    }
    return Mirror(root, root);
}`,
    },
    {
      title: '25. Lowest Common Ancestor (BST)',
      english: 'Find lowest common ancestor of two nodes in a BST. Use BST property — O(h) time.',
      bangla: 'BST-তে দুটি node-এর LCA — BST property O(h)।',
      code: `public TreeNode? LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}`,
    },
    {
      title: '26. Graph DFS (Recursive)',
      english: 'Depth-first search on adjacency list. Pair with BFS task — interviewers often ask both.',
      bangla: 'Adjacency list DFS recursive — BFS-এর সাথে pair, interview-তে দুটোই জিজ্ঞেস।',
      code: `public IList<int> Dfs(int start, IList<int>[] adj) {
    var visited = new bool[adj.Count];
    var order = new List<int>();
    void Visit(int u) {
        visited[u] = true;
        order.Add(u);
        foreach (int v in adj[u])
            if (!visited[v]) Visit(v);
    }
    Visit(start);
    return order;
}`,
    },
    {
      title: '27. Search in Rotated Sorted Array',
      english: 'Sorted array rotated at unknown pivot — find target in O(log n). Binary search variant.',
      bangla: 'Rotated sorted array-তে target O(log n) — binary search variant, mid-level favorite।',
      code: `public int SearchRotated(int[] nums, int target) {
    int lo = 0, hi = nums.Length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    },
    {
      title: '28. Generate Parentheses (Backtracking)',
      english: 'Generate all combinations of n pairs of well-formed parentheses. Classic backtracking intro.',
      bangla: 'n pair well-formed parentheses সব combination — classic backtracking intro।',
      code: `public IList<string> GenerateParenthesis(int n) {
    var result = new List<string>();
    void Dfs(int open, int close, string cur) {
        if (cur.Length == 2 * n) { result.Add(cur); return; }
        if (open < n) Dfs(open + 1, close, cur + "(");
        if (close < open) Dfs(open, close + 1, cur + ")");
    }
    Dfs(0, 0, "");
    return result;
}`,
    },
    {
      title: '29. Subsets (Backtracking / Bitmask)',
      english: 'Return all possible subsets (power set) of distinct integers. Backtracking or iterative.',
      bangla: 'Distinct integer-এর সব subset (power set) — backtracking বা iterative।',
      code: `public IList<IList<int>> Subsets(int[] nums) {
    var result = new List<IList<int>>();
    void Dfs(int i, List<int> cur) {
        result.Add(new List<int>(cur));
        for (int j = i; j < nums.Length; j++) {
            cur.Add(nums[j]);
            Dfs(j + 1, cur);
            cur.RemoveAt(cur.Count - 1);
        }
    }
    Dfs(0, new List<int>());
    return result;
}`,
    },
    {
      title: '30. Word Break (DP)',
      english: 'Can string s be segmented into dictionary words? Classic 1D DP — common mid/senior .NET interview.',
      bangla: 'String s dictionary word-এ segment করা যায় কিনা — 1D DP, mid/senior .NET common।',
      code: `public bool WordBreak(string s, IList<string> wordDict) {
    var set = new HashSet<string>(wordDict);
    var dp = new bool[s.Length + 1];
    dp[0] = true;
    for (int i = 1; i <= s.Length; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && set.Contains(s.Substring(j, i - j))) {
                dp[i] = true;
                break;
            }
    return dp[s.Length];
}`,
    },
    {
      title: '31. Longest Increasing Subsequence',
      english: 'Length of longest strictly increasing subsequence. O(n log n) with patience sorting / binary search.',
      bangla: 'Longest strictly increasing subsequence length — O(n log n) patience sorting।',
      code: `public int LengthOfLIS(int[] nums) {
    var tails = new List<int>();
    foreach (int n in nums) {
        int lo = 0, hi = tails.Count;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (tails[mid] < n) lo = mid + 1; else hi = mid;
        }
        if (lo == tails.Count) tails.Add(n);
        else tails[lo] = n;
    }
    return tails.Count;
}`,
    },
    {
      title: '32. Find All Anagrams in a String',
      english: 'Find all start indices of p anagrams in s. Sliding window + frequency — very common string interview.',
      bangla: 's-এ p-এর anagram সব start index — sliding window + frequency, string interview favorite।',
      code: `public IList<int> FindAnagrams(string s, string p) {
    var res = new List<int>();
    if (s.Length < p.Length) return res;
    int[] need = new int[26], have = new int[26];
    foreach (char c in p) need[c - 'a']++;
    for (int i = 0; i < s.Length; i++) {
        have[s[i] - 'a']++;
        if (i >= p.Length) have[s[i - p.Length] - 'a']--;
        if (SpanEquals(need, have)) res.Add(i - p.Length + 1);
    }
    return res;
}
static bool SpanEquals(int[] a, int[] b) {
    for (int i = 0; i < 26; i++) if (a[i] != b[i]) return false;
    return true;
}`,
    },
    {
      title: '33. LRU Cache Design',
      english: 'Design LRU cache with Get and Put in O(1). Dictionary + doubly-linked list concept — senior .NET favorite.',
      bangla: 'LRU cache Get/Put O(1) — Dictionary + linked list concept, senior .NET favorite design।',
      code: `public class LRUCache {
    private readonly int _cap;
    private readonly Dictionary<int, LinkedListNode<(int key, int val)>> _map = new();
    private readonly LinkedList<(int key, int val)> _list = new();
    public LRUCache(int capacity) => _cap = capacity;
    public int Get(int key) {
        if (!_map.TryGetValue(key, out var node)) return -1;
        _list.Remove(node);
        _list.AddFirst(node);
        return node.Value.val;
    }
    public void Put(int key, int value) {
        if (_map.TryGetValue(key, out var existing)) {
            _list.Remove(existing);
            _list.AddFirst(existing);
            existing.Value = (key, value);
            return;
        }
        var node = _list.AddFirst((key, value));
        _map[key] = node;
        if (_map.Count > _cap) {
            var last = _list.Last!;
            _map.Remove(last.Value.key);
            _list.RemoveLast();
        }
    }
}`,
    },
    {
      title: '34. Path Sum on Binary Tree',
      english: 'Return true if tree has root-to-leaf path with given sum. Classic tree DFS.',
      bangla: 'Root-to-leaf path sum target আছে কিনা — classic tree DFS।',
      code: `public bool HasPathSum(TreeNode? root, int target) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return target == root.val;
    return HasPathSum(root.left, target - root.val)
        || HasPathSum(root.right, target - root.val);
}`,
    },
    {
      title: '35. Meeting Rooms II (Min Rooms)',
      english: 'Minimum conference rooms needed for overlapping intervals. Sort + min-heap — scheduling interview classic.',
      bangla: 'Overlapping meeting-এ minimum room count — sort + min-heap, scheduling classic।',
      code: `public int MinMeetingRooms(int[][] intervals) {
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    var heap = new PriorityQueue<int, int>();
    foreach (var iv in intervals) {
        if (heap.Count > 0 && heap.Peek() <= iv[0]) heap.Dequeue();
        heap.Enqueue(iv[1], iv[1]);
    }
    return heap.Count;
}`,
    },
  ],
  interviewQuestions: [
    {
      q: 'Do .NET backend interviews always require LeetCode hard problems?',
      a: 'No. Most .NET roles (especially mid-level) focus on easy/medium array-string-hash, linked list, tree BFS/DFS, and simple DP. Senior roles add system design and may ask one medium algorithm. FAANG-style hard graphs are rarer unless the role is explicitly algorithm-heavy. Practice the 20 tasks in this module plus Problem Solving module first.',
      bangla: 'বেশিরভাগ .NET role easy/medium — hard graph FAANG-style কম; Problem Solving module আগে master করুন।',
      difficulty: 'mid',
    },
    {
      q: 'Should you use recursion or iteration in C# interviews?',
      a: 'Prefer iteration when depth can be large (linked list, tree height) to avoid StackOverflowException — default stack is limited. Recursion is fine for balanced trees and small n. Mention tail recursion is not optimized in C#. For production .NET, iterative or explicit stack is safer; for interviews, choose clarity and state complexity.',
      bangla: 'বড় depth → iteration; C# tail recursion optimize হয় না — mention করুন।',
      difficulty: 'senior',
    },
  ],
  quickRevision: {
    concepts: [
      'O(1) hash, O(log n) binary search, O(n log n) sort',
      'Reverse list / Floyd cycle / merge sorted lists',
      'Tree: inorder BST, level BFS with Queue',
      'DP: Fib/stairs, coin change, LCS, Kadane',
      'Sliding window, PriorityQueue for top K, Trie for prefix',
      'Backtracking: parentheses, subsets; LRU cache design',
      'Rotated array search, LIS, word break DP, meeting rooms heap',
    ],
    questions: [
      'Binary search — why lo + (hi-lo)/2?',
      'BFS vs DFS?',
      'Memoization vs tabulation?',
    ],
    mistakes: [
      'Binary search with (lo+hi)/2 overflow story missing',
      'DFS on deep tree without mentioning stack overflow',
      'DP without defining state transition',
    ],
    scenarios: [
      'Live code: reverse linked list + complexity',
      'Whiteboard: level-order traversal',
      'Follow-up: optimize Two Sum to O(1) space if sorted',
    ],
  },
  summary:
    'Know Big-O, implement binary search and list/tree/graph classics in C#, recognize DP and backtracking patterns, and drill all 35 algorithm tasks until complexity explanation is automatic.',
};
