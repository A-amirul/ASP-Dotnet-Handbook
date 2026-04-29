export const codingTasks = {
  id: 'tasks',
  title: 'Real-world Practical Challenges',
  description: 'Practice complex logic and machine test scenarios that distinguish senior engineers.',
  tasks: [
    {
      title: "1. The Shopping Cart (Complex Calculation)",
      english: "Implement a shopping cart logic that applies a 10% discount for orders over $500, then adds a flat $5 shipping fee, then applies a 5% tax to the final total.",
      bangla: "একটি শপিং কার্ট লজিক তৈরি করুন যা ৫০০ ডলারের বেশি অর্ডারের জন্য ১০% ডিসকাউন্ট দেয়, এরপর শিপিং ফি ৫ ডলার যুক্ত করে এবং সবশেষে ৫% ট্যাক্স অ্যাপ্লাই করে।",
      code: `public decimal CalculateTotal(decimal subtotal) {
    decimal discount = subtotal > 500 ? subtotal * 0.10m : 0;
    decimal priceAfterDiscount = subtotal - discount;
    decimal total = (priceAfterDiscount + 5) * 1.05m;
    return Math.Round(total, 2);
}`
    },
    {
      title: "2. The Cache-Aside Pattern",
      english: "Implement a service that checks Redis for a key; if missing, fetches from database, saves to Redis with 1 hour TTL, and returns the result.",
      bangla: "রেডিস ক্যাশ ব্যবহারের জন্য ক্যাশ-অ্যাসাইড প্যাটার্ণ ইমপ্লিমেন্ট করুন। ক্যাশে ডাটা না থাকলে ডিবি থেকে এনে ক্যাশে ১ ঘণ্টার জন্য সেভ করবে।",
      code: `public async Task<string> GetData(string key) {
    var cached = await _redis.GetStringAsync(key);
    if (cached != null) return cached;

    var data = await _db.QueryAsync(key);
    await _redis.SetStringAsync(key, data, new DistributedCacheEntryOptions {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
    });
    return data;
}`
    },
    {
      title: "3. Background Report Generation",
      english: "Instead of making the user wait 30 seconds for a CSV report, start a background task and return a 202 Accepted status with a tracking ID.",
      bangla: "ইউজারকে ওয়েট না করিয়ে ব্যাকগ্রাউন্ডে রিপোর্ট জেনারেট করানোর জন্য ২০২ অ্যাকসেপ্টেড স্ট্যাটাস কোড এবং ট্র্যাকিং আইডি রিটার্ণ করার লজিক।",
      code: `[HttpPost("export")]
public async Task<IActionResult> Export() {
    string jobId = Guid.NewGuid().ToString();
    // Use Hangfire or BackgroundService
    _jobQueue.Enqueue(() => GenerateReport(jobId)); 
    return Accepted(new { Id = jobId }); // 202 Status
}`
    },
    {
      title: "4. Thread Safety with Interlocked",
      english: "Ensure a shared counter is updated safely across multiple threads without hits on performance.",
      bangla: "একাধিক থ্রেডের মধ্যে শেয়ার্ড কাউন্টার সেফভাবে আপডেট করার জন্য ইন্টারলকড মেকানিজম ব্যবহার করা।",
      code: `static int secureCount = 0;
Parallel.For(0, 1000, i => Interlocked.Increment(ref secureCount));`
    },
    {
      title: "5. Global Exception Handler Middleware",
      english: "Build a middleware that catches all exceptions and returns a structured JSON 'ProblemDetails' response.",
      bangla: "সিস্টেমের যেকোনো এরর হ্যান্ডেল করে একটি সুন্দর এবং স্ট্যান্ডার্ড JSON এরর মেসেজ রিটার্ণ করার মিডলওয়্যার।",
      code: `public async Task Invoke(HttpContext ctx) {
    try { await _next(ctx); }
    catch (Exception ex) {
        ctx.Response.StatusCode = 500;
        await ctx.Response.WriteAsJsonAsync(new { 
            Error = "Server Error", 
            TraceId = ctx.TraceIdentifier 
        });
    }
}`
    },
    {
      title: "6. Generic Repository Implementation",
      english: "Implement a generic repository to abstract data access logic and improve testability.",
      bangla: "ডাটাবেজ এক্সেস লজিক আলাদা করার জন্য একটি জেনারিক রিপোজিটরির প্যাটার্ণ ইমপ্লিমেন্ট করা।",
      code: `public interface IRepository<T> where T : class {
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetByIdAsync(int id);
    void Add(T entity);
}`
    },
    {
      title: "7. Palindrome Check & String Optimization",
      english: "Check if a string is a palindrome ignoring case and non-alphanumeric characters.",
      bangla: "একটি স্ট্রিং উল্টো করলেও একই থাকে কি না (প্যালিনড্রোম) তা চেক করার লজিক। এটি বেসিক লজিক্যাল টেস্টে খুব বেশি আসে।",
      code: `public bool IsPalindrome(string s) {
    string clean = new string(s.Where(char.IsLetterOrDigit).ToArray()).ToLower();
    return clean.SequenceEqual(clean.Reverse());
}`
    },
    {
      title: "8. Dependency Injection with Factory",
      english: "Resolve different services based on a key (e.g. PayPal vs Stripe) using the Factory Pattern with DI.",
      bangla: "রানিং অ্যাপে কন্ডিশনের ওপর ভিত্তি করে একেক সময় একেক সার্ভিস (যেমন: পেমেন্ট গেটওয়ে) সিলেক্ট করার জন্য ফ্যাক্টরি প্যাটার্ণ ব্যবহার।",
      code: `public IPayment GetPayment(string type) => type switch {
    "Stripe" => _serviceProvider.GetRequiredService<StripeProvider>(),
    "PayPal" => _serviceProvider.GetRequiredService<PayPalProvider>(),
    _ => throw new NotSupportedException()
};`
    },
    {
      title: "9. LINQ Optimization (N+1 Solution)",
      english: "Show how to avoid N+1 query problem using Eager Loading in Entity Framework.",
      bangla: "ডাটাবেজ পারফরম্যান্স বাড়ানোর জন্য লুপের ভেতরে কুয়েরি না চালিয়ে .Include() মেথড ব্যবহার করে ডাটা ফেচ করা।",
      code: `// Inefficient way (N+1)
foreach(var u in db.Users) { var p = db.Posts.Where(x => x.UserId == u.Id); }

// Efficient way (Join)
var usersWithPosts = db.Users.Include(u => u.Posts).ToList();`
    },
    {
      title: "10. Singleton Pattern (Thread-Safe)",
      english: "Implement a thread-safe Singleton pattern using Double-Checked Locking.",
      bangla: "পুরো অ্যাপ্লিকেশনে একটিমাত্র অবজেক্ট নিশ্চিত করার জন্য থ্রেড-সেফ সিঙ্গেলটন প্যাটার্ণ ইমপ্লিমেন্টেশন। এটি সিনিয়র রোলে প্রায়ই আসে।",
      code: `private static readonly object _lock = new();
private static MyInstance _instance;
public static MyInstance Instance {
    get {
        if (_instance == null) {
            lock(_lock) { if (_instance == null) _instance = new MyInstance(); }
        }
        return _instance;
    }
}`
    },
    {
      title: "11. Two Sum Problem",
      english: "Given an array of integers, return indices of the two numbers such that they add up to a specific target. Use a Dictionary for O(n) complexity.",
      bangla: "একটি অ্যারে থেকে এমন দুটি সংখ্যার ইনডেক্স খুঁজে বের করুন যাদের যোগফল একটি নির্দিষ্ট টার্গেটের সমান। ডিকশনারি ব্যবহার করে এটি দ্রুত (O(n)) করা যায়।",
      code: `public int[] TwoSum(int[] nums, int target) {
    var map = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++) {
        int complement = target - nums[i];
        if (map.ContainsKey(complement)) return new[] { map[complement], i };
        map[nums[i]] = i;
    }
    return null;
}`
    },
    {
      title: "12. Reverse a Linked List",
      english: "Reverse a singly linked list iteratively by changing the next pointers of each node.",
      bangla: "একটি সিঙ্গলি লিঙ্কড লিস্টকে উল্টো (Reverse) করার লজিক। এটি মেমোরি এবং পয়েন্টার হ্যান্ডেলিং বোঝার জন্য সেরা অংক।",
      code: `public ListNode ReverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
    },
    {
      title: "13. Binary Search Implementation",
      english: "Find the position of a target value within a sorted array using the divide and conquer approach.",
      bangla: "একটি সর্টেড অ্যারে থেকে দ্রুত ডাটা খোঁজার পদ্ধতি। এটি প্রতিবার সার্চ এরিয়া অর্ধেক করে ফেলে (O(log n))।",
      code: `public int BinarySearch(int[] nums, int target) {
    int left = 0, right = nums.Length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
    },
    {
      title: "14. Valid Parentheses (Stack)",
      english: "Determine if the input string containing brackets is valid. Use a Stack to keep track of opening brackets.",
      bangla: "ব্র্যাকেটগুলো সঠিক ক্রমে আছে কি না তা চেক করার জন্য স্ট্যাক (Stack) ডাটা স্ট্রাকচার ব্যবহার করা। কম্পাইলার বা পার্সার তৈরিতে এটি লাগে।",
      code: `public bool IsValid(string s) {
    var stack = new Stack<char>();
    foreach (char c in s) {
        if (c == '(') stack.Push(')');
        else if (c == '{') stack.Push('}');
        else if (c == '[') stack.Push(']');
        else if (stack.Count == 0 || stack.Pop() != c) return false;
    }
    return stack.Count == 0;
}`
    },
    {
      title: "15. Find Missing Number (XOR)",
      english: "Find the missing number in an array containing n distinct numbers in the range [0, n] using XOR to keep O(1) space.",
      bangla: "০ থেকে n পর্যন্ত সংখ্যার মধ্যে কোনটি মিসিং তা খুঁজে বের করা। XOR অপারেশন ব্যবহার করলে এটি খুব কম মেমোরিতেই সমাধান করা যায়।",
      code: `public int MissingNumber(int[] nums) {
    int res = nums.Length;
    for (int i = 0; i < nums.Length; i++) {
        res ^= i ^ nums[i];
    }
    return res;
}`
    },
    {
      title: "16. Fibonacci with Memoization",
      english: "Calculate the nth Fibonacci number efficiently using Dynamic Programming (Memoization) to avoid redundant calculations.",
      bangla: "ফিবোনাচি সিরিজ বের করার সময় একই হিসাব বারবার না করে ডাইনামিক প্রোগ্রামিং ব্যবহার করার পদ্ধতি।",
      code: `private Dictionary<int, long> memo = new();
public long Fib(int n) {
    if (n <= 1) return n;
    if (memo.ContainsKey(n)) return memo[n];
    return memo[n] = Fib(n - 1) + Fib(n - 2);
}`
    },
    {
      title: "17. Merge Intervals",
      english: "Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals.",
      bangla: "ওভারল্যাপিং ইন্টারভালগুলো (যেমন সময়ের স্লট) একসাথে মার্জ করার লজিক। এটি ক্যালেন্ডার বা সিডিউলিং অ্যাপে কাজে লাগে।",
      code: `public int[][] Merge(int[][] intervals) {
    var sorted = intervals.OrderBy(x => x[0]).ToArray();
    var merged = new List<int[]>();
    foreach (var interval in sorted) {
        if (merged.Count == 0 || merged.Last()[1] < interval[0]) merged.Add(interval);
        else merged.Last()[1] = Math.Max(merged.Last()[1], interval[1]);
    }
    return merged.ToArray();
}`
    },
    {
      title: "18. Maximum Subarray (Kadane's)",
      english: "Find the contiguous subarray within a one-dimensional array of numbers which has the largest sum.",
      bangla: "একটি অ্যারের ভেতরের এমন একটি অংশ খুঁজে বের করা যার যোগফল সবচেয়ে বেশি। এটি বিখ্যাত 'Kadane's Algorithm'।",
      code: `public int MaxSubArray(int[] nums) {
    int maxSoFar = nums[0], maxEndingHere = nums[0];
    for (int i = 1; i < nums.Length; i++) {
        maxEndingHere = Math.Max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.Max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`
    },
    {
      title: "19. Cycle Detection (Floyd's)",
      english: "Detect if a linked list has a cycle using two pointers (slow and fast).",
      bangla: "লিঙ্কড লিস্টের কোনো লুপ বা সাইকেল আছে কি না তা বের করার জন্য স্লো (Slow) এবং ফাস্ট (Fast) পয়েন্টার মেথড।",
      code: `public bool HasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`
    },
    {
      title: "20. Climbing Stairs (DP)",
      english: "Calculate how many distinct ways you can climb to the top of n stairs, where each time you can either climb 1 or 2 steps.",
      bangla: "একবার ১ বা ২ ধাপ উঠে n তলা পর্যন্ত কতভাবে পৌঁছানো সম্ভব? এটি মূলত ডাইনামিক প্রোগ্রামিং এর বেসিক সমস্যা।",
      code: `public int ClimbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`
    },
    {
      title: "21. Valid Anagram",
      english: "Check if two strings are anagrams by comparing their character counts using a frequency array.",
      bangla: "দুটি শব্দ এনগ্রাম কি না (একই বর্ণ আলাদা ক্রমে আছে কি না) তা চেক করার লজিক।",
      code: `public bool IsAnagram(string s, string t) {
    if (s.Length != t.Length) return false;
    int[] counts = new int[26];
    for (int i = 0; i < s.Length; i++) {
        counts[s[i] - 'a']++;
        counts[t[i] - 'a']--;
    }
    return counts.All(x => x == 0);
}`
    },
    {
      title: "22. Binary Tree Inorder Traversal",
      english: "Traverse a binary tree in an 'Inorder' fashion (Left, Root, Right) using recursion.",
      bangla: "বাইনারি ট্রি থেকে ডাটা সঠিক ক্রমে (Left-Root-Right) পড়ার জন্য রিকারশন লজিক।",
      code: `public void Inorder(TreeNode root) {
    if (root == null) return;
    Inorder(root.left);
    Console.WriteLine(root.val);
    Inorder(root.right);
}`
    },
    {
      title: "23. Implementing a Queue using Stacks",
      english: "Implement a First-In-First-Out (FIFO) queue using two stacks.",
      bangla: "দুটি স্ট্যাক (Stack) ব্যবহার করে একটি কিউ (Queue) ডাটা স্ট্রাকচার তৈরি করার পদ্ধতি। এটি ইন্টারভিউতে খুব বেশি আসে।",
      code: `public class MyQueue {
    Stack<int> s1 = new(), s2 = new();
    public void Push(int x) => s1.Push(x);
    public int Pop() {
        if (s2.Count == 0) while (s1.Count > 0) s2.Push(s1.Pop());
        return s2.Pop();
    }
}`
    },
    {
      title: "24. Remove Duplicates from Sorted Array",
      english: "Remove duplicates in-place such that each unique element appears only once and returns the new length.",
      bangla: "একটি সর্টেড অ্যারে থেকে ডুপ্লিকেটগুলো ডিলিট করে নতুন সাইজ রিটার্ণ করার এফিশিয়েন্ট মেথড।",
      code: `public int RemoveDuplicates(int[] nums) {
    if (nums.Length == 0) return 0;
    int i = 0;
    for (int j = 1; j < nums.Length; j++) {
        if (nums[j] != nums[i]) nums[++i] = nums[j];
    }
    return i + 1;
}`
    },
    {
      title: "25. Best Time to Buy and Sell Stock",
      english: "Find the maximum profit you can achieve by buying and selling a stock on different days.",
      bangla: "অ্যারে থেকে শেয়ার কেনা ও বেচার মাধ্যমে সর্বোচ্চ প্রফিট বের করার লজিক (Single Pass algorithm)।",
      code: `public int MaxProfit(int[] prices) {
    int minPrice = int.MaxValue, maxProfit = 0;
    foreach (var price in prices) {
        minPrice = Math.Min(minPrice, price);
        maxProfit = Math.Max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`
    },
    {
      title: "26. FizzBuzz Implementation",
      english: "Standard logic test: print Fizz for multiples of 3, Buzz for 5, and FizzBuzz for both.",
      bangla: "কন্ডিশনাল লজিকের জন্য বেসিক ফিজ-বাজ লজিক যা সব জুনিয়র-সিনিয়র ইন্টারভিউতে ওয়ার্ম-আপ হিসেবে আসে।",
      code: `public List<string> FizzBuzz(int n) {
    var res = new List<string>();
    for(int i=1; i<=n; i++) {
        string s = i % 15 == 0 ? "FizzBuzz" : 
                   i % 3 == 0 ? "Fizz" : 
                   i % 5 == 0 ? "Buzz" : i.ToString();
        res.Add(s);
    }
    return res;
}`
    },
    {
      title: "27. Reverse Words in a String",
      english: "Reverse the order of words in a string, ensuring no extra spaces between words.",
      bangla: "একটি সেন্টেন্সের শব্দগুলোকে উল্টো ক্রমে সাজানোর লজিক (যেমন: 'Hello World' -> 'World Hello')।",
      code: `public string ReverseWords(string s) {
    var words = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    Array.Reverse(words);
    return string.Join(" ", words);
}`
    },
    {
      title: "28. Factorial (Recursion vs Iterative)",
      english: "Calculate the factorial of a number using both recursion and iteration methods.",
      bangla: "কোনো সংখ্যার ফ্যাক্টরিয়াল বের করার জন্য রিকারশন বনাম ইটারেটিভ পদ্ধতি তুলনা। রিকারশন অনেক মেমোরি খরচ করে।",
      code: `// Recursive
public int FacRec(int n) => n <= 1 ? 1 : n * FacRec(n - 1);

// Iterative (Memory efficient)
public int FacIter(int n) {
    int res = 1;
    for (int i = 2; i <= n; i++) res *= i;
    return res;
}`
    },
    {
      title: "29. Check for Balanced Tree",
      english: "Determine if a binary tree is height-balanced relative to its subtrees.",
      bangla: "একটি বাইনারি ট্রি ব্যালেন্সড কি না (লেফট এবং রাইট সাবট্রির হাইট ডিফারেন্স ১ এর বেশি কি না) তা চেক করা।",
      code: `public bool IsBalanced(TreeNode root) {
    return GetHeight(root) != -1;
}
private int GetHeight(TreeNode node) {
    if (node == null) return 0;
    int left = GetHeight(node.left);
    int right = GetHeight(node.right);
    if (left == -1 || right == -1 || Math.Abs(left - right) > 1) return -1;
    return Math.Max(left, right) + 1;
}`
    },
    {
      title: "30. Deep Copy vs Shallow Copy",
      english: "Demonstrate the difference between copying references vs copying full object graphs.",
      bangla: "অবজেক্ট মেমোরিতে কীভাবে কপি হয় তা বোঝার জন্য শ্যালো বনাম ডিপ কপি ইমপ্লিমেন্টেশন। এটি মেমোরি বাগ এড়াতে লাগে।",
      code: `public class Person {
    public string Name;
    public Address Home;
    
    public Person ShallowCopy() => (Person)this.MemberwiseClone();
    public Person DeepCopy() => new Person { 
        Name = this.Name, 
        Home = new Address { City = this.Home.City } 
    };
}`
    },
    {
      title: "31. Longest Common Subsequence (DP)",
      english: "Find the length of the longest subsequence present in two strings.",
      bangla: "দুটি স্ট্রিং এর মধ্যে কমন সাবসিকোয়েন্স (যেমন 'ABC' এবং 'AC' এর মধ্যে 'AC') এর সর্বোচ্চ দৈর্ঘ্য বের করা।",
      code: `public int Lcs(string text1, string text2) {
    int m = text1.Length, n = text2.Length;
    int[,] dp = new int[m + 1, n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) dp[i, j] = 1 + dp[i - 1, j - 1];
            else dp[i, j] = Math.Max(dp[i - 1, j], dp[i, j - 1]);
        }
    }
    return dp[m, n];
}`
    },
    {
      title: "32. Sliding Window Maximum",
      english: "Find the maximum element in each sliding window of size k in an array.",
      bangla: "একটি নির্দিষ্ট সাইজ 'k' এর উইন্ডো অ্যারের ওপর দিয়ে স্লাইড করার সময় প্রতিবার উইন্ডোর ভেতরকার সবচেয়ে বড় সংখ্যাটি বের করা।",
      code: `public int[] MaxSlidingWindow(int[] nums, int k) {
    var result = new List<int>();
    var deque = new LinkedList<int>();
    for (int i = 0; i < nums.Length; i++) {
        while (deque.Count > 0 && nums[deque.Last.Value] <= nums[i]) deque.RemoveLast();
        deque.AddLast(i);
        if (deque.First.Value == i - k) deque.RemoveFirst();
        if (i >= k - 1) result.Add(nums[deque.First.Value]);
    }
    return result.ToArray();
}`
    },
    {
      title: "33. Graph BFS Implementation",
      english: "Traverse a graph using Breadth-First Search (BFS) starting from a given node.",
      bangla: "গ্রাফ ট্রাভার্সাল করার পদ্ধতি। কিউ (Queue) ব্যবহার করে কাছাকাছি নোডগুলো আগে ভিজিট করা হয়।",
      code: `public void BFS(int startNode, List<int>[] adj) {
    bool[] visited = new bool[adj.Length];
    var queue = new Queue<int>();
    visited[startNode] = true;
    queue.Enqueue(startNode);
    while (queue.Count > 0) {
        int u = queue.Dequeue();
        Console.WriteLine(u);
        foreach (int v in adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                queue.Enqueue(v);
            }
        }
    }
}`
    },
    {
      title: "34. Implement a Trie (Prefix Tree)",
      english: "Create a data structure that supports inserting and searching words based on prefixes.",
      bangla: "অটো-কমপ্লিট বা ডিকশনারি সার্চের জন্য ট্রাই (Trie) ডাটা স্ট্রাকচার ইমপ্লিমেন্টেশন। এটি স্ট্রিং প্রসেসিং এ খুব ফাস্ট।",
      code: `public class TrieNode {
    public Dictionary<char, TrieNode> Children = new();
    public bool IsEndOfWord;
}
public class Trie {
    private TrieNode root = new();
    public void Insert(string word) {
        var curr = root;
        foreach (char c in word) {
            if (!curr.Children.ContainsKey(c)) curr.Children[c] = new TrieNode();
            curr = curr.Children[c];
        }
        curr.IsEndOfWord = true;
    }
}`
    },
    {
      title: "35. Container With Most Water",
      english: "Find two lines that together with the x-axis forms a container, such that the container contains the most water.",
      bangla: "একটি অ্যারে থেকে দুটি উচ্চতা এমনভাবে বেছে নেয়া যাতে তাদের মধ্যবর্তী পানির ক্ষেত্রফল সবচেয়ে বেশি হয় (Two-pointer technique)।",
      code: `public int MaxArea(int[] height) {
    int left = 0, right = height.Length - 1, maxArea = 0;
    while (left < right) {
        int w = right - left;
        int h = Math.Min(height[left], height[right]);
        maxArea = Math.Max(maxArea, w * h);
        if (height[left] < height[right]) left++; else right--;
    }
    return maxArea;
}`
    },
    {
      title: "36. Find All Anagrams in a String",
      english: "Find all start indices of p's anagrams in s using a sliding window approach.",
      bangla: "একটি স্ট্রিং এর মধ্যে আরেকটি শব্দের সব এনগ্রাম (একই বর্ণ ব্যবহার করা শব্দ) কোথায় কোথায় আছে তা খুঁজে বের করা।",
      code: `public IList<int> FindAnagrams(string s, string p) {
    var res = new List<int>();
    if (s.Length < p.Length) return res;
    int[] pCount = new int[26], sCount = new int[26];
    foreach (char c in p) pCount[c - 'a']++;
    for (int i = 0; i < s.Length; i++) {
        sCount[s[i] - 'a']++;
        if (i >= p.Length) sCount[s[i - p.Length] - 'a']--;
        if (pCount.SequenceEqual(sCount)) res.Add(i - p.Length + 1);
    }
    return res;
}`
    },
    {
      title: "37. Lowest Common Ancestor (Tree)",
      english: "Find the lowest common ancestor node of two given nodes in a binary tree.",
      bangla: "বাইনারি ট্রিতে দুটি নোডের সবচেয়ে নিকটবর্তী কমন পূর্বপুরুষ (Ancestor) খুঁজে বের করা।",
      code: `public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    var left = LowestCommonAncestor(root.left, p, q);
    var right = LowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left ?? right;
}`
    },
    {
      title: "38. Subsets Generation (Backtracking)",
      english: "Given an integer array, return all possible subsets (the power set).",
      bangla: "একটি সেটের সব সম্ভাব্য সাবসেট বের করার পদ্ধতি। এটি ব্যাকট্র্যাকিং অ্যালগরিদম বোঝার জন্য দারুণ।",
      code: `public List<List<int>> Subsets(int[] nums) {
    var res = new List<List<int>>();
    Generate(0, nums, new List<int>(), res);
    return res;
}
private void Generate(int start, int[] nums, List<int> current, List<List<int>> res) {
    res.Add(new List<int>(current));
    for (int i = start; i < nums.Length; i++) {
        current.Add(nums[i]);
        Generate(i + 1, nums, current, res);
        current.RemoveAt(current.Count - 1);
    }
}`
    },
    {
      title: "39. Top K Frequent Elements",
      english: "Find the k most frequent elements in an array using a priority queue or dictionary.",
      bangla: "সবচেয়ে বেশি বার আসা 'k' সংখ্যক সংখ্যা খুঁজে বের করা। এর জন্য ডিকশনারি এবং সর্টিং মেকানিজম লাগে।",
      code: `public int[] TopKFrequent(int[] nums, int k) {
    return nums.GroupBy(n => n)
               .OrderByDescending(g => g.Count())
               .Take(k)
               .Select(g => g.Key)
               .ToArray();
}`
    },
    {
      title: "40. Coin Change Problem (DP)",
      english: "Find the fewest number of coins needed to make up a given amount.",
      bangla: "বিভিন্ন মানের কয়েন ব্যবহার করে একটি নির্দিষ্ট টাকা বানাতে সর্বনিম্ন কয়টি কয়েন লাগবে তা বের করা।",
      code: `public int CoinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Array.Fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        foreach (int coin in coins) {
            if (i >= coin) dp[i] = Math.Min(dp[i], 1 + dp[i - coin]);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
    }
  ],
  revisionSummary: `
### Practical Checklist for Interviews:
1. **Accuracy**: Use decimals for money, not double/float.
2. **Performance**: Avoid N+1 and use Caching where needed.
3. **User Experience**: Use Async/Background tasks for long operations.
4. **Security**: Validate inputs and handle global exceptions clean.
`,
  summary: "প্র্যাকটিক্যাল মেশিন টেস্টে সফল হতে হলে আপনাকে শুধু কোড লিখলে হবে না, ক্লিন কোড এবং পারফরম্যান্স অপ্টিমাইজেশন নিশ্চিত করতে হবে।"
};
