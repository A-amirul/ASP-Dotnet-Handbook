export const problemSolvingData = {
  id: 'problemsolving',
  title: 'Problem Solving for .NET Interviews',
  description:
    'Step-by-step approach, common patterns, and hands-on coding tasks that .NET developers face in live interviews and machine tests.',
  chapterNumber: 28,
  sections: [
    {
      id: 'interview-framework',
      topic: 'How to Solve Any Coding Task (Interview Framework)',
      difficulty: 'junior',
      english:
        'Most .NET interviews give you 20–45 minutes for one problem. Interviewers care less about perfect syntax and more about clear thinking, edge cases, and clean C# code. Use a repeatable framework every time.',
      bangla:
        'বেশিরভাগ .NET interview-তে ২০–৪৫ মিনিটে একটা coding problem দেওয়া হয়। Perfect syntax-এর চেয়ে clear thinking, edge case handle করা এবং clean C# code বেশি গুরুত্ব পায়। প্রতিবার একই framework follow করুন।',
      details: `
### The UMPIRE-style framework (adapted for C#)

| Step | What you do | Example phrase |
| :--- | :--- | :--- |
| **U — Understand** | Restate the problem, ask clarifying questions | "Can the input be null? Duplicates allowed?" |
| **M — Match** | Name the pattern (hash map, two pointers, stack…) | "This looks like Two Sum → Dictionary" |
| **P — Plan** | Write steps in plain English before coding | "Loop once, store complement in map" |
| **I — Implement** | Write clean C# with meaningful names | \`Dictionary<int,int> seen\` not \`d\` |
| **R — Review** | Walk through a small example on paper | Trace \`[2,7,11], target=9\` |
| **E — Evaluate** | State time/space complexity | "O(n) time, O(n) space" |

### Clarifying questions .NET interviewers love
- Can input be **null** or empty?
- Are numbers **sorted**? Can there be **duplicates**?
- Should we return **index** or **value**?
- Is input size small enough for **O(n²)** or must we optimize?
- Do we modify **in-place** or return a new collection?

### What interviewers score in C# live coding
- Do you use the **right collection** (\`Dictionary\`, \`HashSet\`, \`List\`, \`Span\`)?
- Do you handle **null** and empty inputs?
- Do you use \`decimal\` for money, not \`double\`?
- Can you explain **why** your solution is correct?
      `,
      commonMistakes: [
        'Jumping to code without restating the problem.',
        'Using double for currency calculations.',
        'Forgetting null/empty checks on string or array input.',
        'Not stating time and space complexity at the end.',
      ],
      bestPractices: [
        'Talk out loud — silence looks like you are stuck.',
        'Start with brute force, then optimize if asked.',
        'Use LINQ for readability in interviews unless asked for O(1) space.',
        'Write a small private helper method instead of one giant method.',
      ],
      interviewQs: [
        {
          q: 'You are stuck on a problem for 5 minutes. What should you do?',
          a: 'Stop coding. Restate the problem aloud, list what you have tried, and propose a simpler brute-force approach. Interviewers prefer honest progress over silent struggle. Example: "Let me try a nested loop first — O(n²) — then optimize with a hash map."',
          bangla: '৫ মিনিট stuck হলে coding বন্ধ করুন, problem restate করুন, brute-force propose করুন — silent struggle interview-তে negative signal।',
          difficulty: 'junior',
        },
        {
          q: 'When should you use LINQ vs a manual for loop in an interview?',
          a: 'Use LINQ when clarity matters and performance is O(n) anyway — GroupBy, OrderBy, Where read well. Use manual loops when you need in-place mutation, early exit, index control, or O(1) extra space. Always mention: "I could write this with LINQ, but a loop gives better control here."',
          bangla: 'LINQ = readability; manual loop = in-place, early exit, O(1) space — trade-off বলুন।',
          difficulty: 'mid',
        },
      ],
      practice:
        'Pick "Valid Palindrome" — write Understand/Match/Plan in comments before coding.',
    },
    {
      id: 'pattern-cheat-sheet',
      topic: 'Pattern Cheat Sheet — When to Use What',
      difficulty: 'mid',
      english:
        'Senior .NET interviews rarely ask obscure algorithms. They repeat patterns: hash maps for lookup, two pointers for sorted arrays, sliding window for substrings, stack for brackets, BFS/DFS for graphs. Recognizing the pattern saves 10 minutes.',
      bangla:
        'Senior .NET interview-তে obscure algorithm কম আসে। বারবার pattern আসে: lookup-এ hash map, sorted array-তে two pointer, substring-এ sliding window, bracket-এ stack, graph-এ BFS/DFS। Pattern চিনলে ১০ মিনিট বাঁচে।',
      details: `
### Pattern → Problem signal → C# tool

| Pattern | You hear / see… | C# types to reach for |
| :--- | :--- | :--- |
| **Hash map / set** | "Find pair", "duplicate", "frequency", "anagram" | \`Dictionary<K,V>\`, \`HashSet<T>\` |
| **Two pointers** | Sorted array, palindrome, container area | \`left\`, \`right\` indices |
| **Sliding window** | Substring, subarray with constraint, "at most K" | Window + frequency array/map |
| **Stack** | Matching brackets, next greater, undo | \`Stack<T>\` |
| **Queue / BFS** | Shortest path (unweighted), level order | \`Queue<T>\` |
| **Recursion / DFS** | Tree, combinations, permutations | Base case + recursive call |
| **Binary search** | Sorted data, "find position", minimize/maximize answer | \`while (lo <= hi)\` |
| **Dynamic programming** | "Count ways", "longest", overlapping subproblems | \`int[] dp\` or \`Dictionary\` memo |
| **Greedy** | Interval scheduling, activity selection | Sort + one pass |
| **Prefix sum** | Range sum queries, subarray sum equals K | \`prefix[i]\` or running sum + map |

### .NET-specific interview favorites
- **String manipulation** — reverse words, palindrome, anagram (very common in junior/mid)
- **Collection logic** — group by, distinct, top N (LINQ or Dictionary)
- **Business rules** — discount, tax, shipping (decimal + order of operations)
- **API-style parsing** — validate input, return structured result
      `,
      interviewQs: [
        {
          q: 'How do you decide between Dictionary and HashSet?',
          a: 'Use HashSet when you only need to know if a value exists or to deduplicate — O(1) Contains. Use Dictionary when you need to map a key to extra data: value→index (Two Sum), char→count (anagram), prefix sum→count. Rule: if the question asks "how many" or "where", use Dictionary; if "exists or not", HashSet is enough.',
          bangla: 'শুধু exists/dedup → HashSet; count/index/map → Dictionary।',
          difficulty: 'mid',
        },
      ],
      practice: 'For each pattern row, name one LeetCode-easy problem that fits.',
    },
    {
      id: 'string-array-problems',
      topic: 'Strings & Arrays — Most Asked Task Types',
      difficulty: 'junior',
      english:
        'String and array tasks appear in almost every .NET developer screening: reverse words, palindrome, two sum, remove duplicates, find max. Master these before system design rounds.',
      bangla:
        'প্রায় সব .NET developer screening-এ string ও array task আসে: reverse words, palindrome, two sum, remove duplicates, find max। System design-এর আগে এগুলো master করুন।',
      details: `
### Top string/array tasks in .NET interviews

| Task | Pattern | Time | Notes |
| :--- | :--- | :--- | :--- |
| Two Sum | Hash map | O(n) | Store \`target - nums[i]\` |
| Valid Palindrome | Two pointers | O(n) | Skip non-alphanumeric |
| Reverse Words | Split + reverse or two-pass | O(n) | \`StringSplitOptions.RemoveEmptyEntries\` |
| Valid Anagram | Frequency array (26) or sort | O(n) | Same length required |
| Remove Duplicates (sorted) | Two pointers in-place | O(n) | \`i\` slow, \`j\` fast |
| FizzBuzz | Modulo rules | O(n) | Warm-up / logic check |
| First Non-Repeating Char | Dictionary or \`int[26]\` | O(n) | Two passes or one with LinkedHashMap concept |
| Max Subarray (Kadane) | DP / greedy | O(n) | Track running sum |

### C# tips for string problems
- Prefer \`ReadOnlySpan<char>\` in production; in interviews \`char[]\` or two pointers on string is fine.
- \`string\` is immutable — building with \`+=\` in a loop is O(n²); use \`StringBuilder\`.
- \`string.Split(' ', StringSplitOptions.RemoveEmptyEntries)\` handles multiple spaces cleanly.
      `,
      interviewQs: [
        {
          q: 'Why is string concatenation in a loop slow in C#?',
          a: 'string is immutable. Each += allocates a new string and copies all prior characters — O(n²) total for n append operations. Use StringBuilder for repeated building, or string.Join / string.Create when appropriate. In interviews, mention this when you choose StringBuilder over +=.',
          bangla: 'string immutable — loop-এ += O(n²); StringBuilder ব্যবহার করুন।',
          difficulty: 'junior',
        },
      ],
      practice: 'Implement Valid Palindrome with two pointers — no extra string allocation if possible.',
      code: `public bool IsPalindrome(string s) {
    int left = 0, right = s.Length - 1;
    while (left < right) {
        while (left < right && !char.IsLetterOrDigit(s[left])) left++;
        while (left < right && !char.IsLetterOrDigit(s[right])) right--;
        if (char.ToLowerInvariant(s[left]) != char.ToLowerInvariant(s[right]))
            return false;
        left++; right--;
    }
    return true;
}`,
    },
    {
      id: 'collection-linq-problems',
      topic: 'Collections, LINQ & Business Logic Tasks',
      difficulty: 'mid',
      english:
        'Many .NET interviews test practical skills: group data, find top N, apply pricing rules, or transform DTOs. These mirror real API and service-layer work more than pure LeetCode.',
      bangla:
        'অনেক .NET interview practical skill test করে: data group, top N, pricing rule, DTO transform — pure LeetCode-এর চেয়ে real API/service-layer কাজের মতো।',
      details: `
### Common collection / LINQ interview tasks

| Task | Approach |
| :--- | :--- |
| Group anagrams | Sort each word as key → \`Dictionary<string, List<string>>\` |
| Top K frequent elements | Dictionary count + OrderByDescending.Take(k) or bucket sort |
| Merge two sorted lists | Two pointers or LINQ merge pattern |
| Distinct by property | \`GroupBy(x => x.Id).Select(g => g.First())\` |
| Shopping cart total | \`decimal\`, apply discount → fee → tax in order |
| Flatten nested list | Recursion or \`SelectMany\` |

### Business logic rules (very common)
1. Always use **decimal** for money.
2. Apply rules in documented order (discount before tax, etc.).
3. Round with \`Math.Round(value, 2)\` at the end.
4. Return a small result object, not multiple out parameters.
      `,
      interviewQs: [
        {
          q: 'How would you find the top 3 most frequent words in a list?',
          a: 'Count with Dictionary<string,int>, then order by count descending and take 3: words.GroupBy(w => w).Select(g => new { Word = g.Key, Count = g.Count() }).OrderByDescending(x => x.Count).Take(3). For large data, mention that OrderBy is O(n log n) and a min-heap of size 3 would be O(n log k) — good senior follow-up.',
          bangla: 'Dictionary count → OrderByDescending.Take(3); বড় data-তে min-heap O(n log k) mention করুন।',
          difficulty: 'mid',
        },
      ],
      practice: 'Implement group anagrams: ["eat","tea","tan","ate","nat","bat"] → groups.',
      code: `public IList<IList<string>> GroupAnagrams(string[] strs) {
    var map = new Dictionary<string, List<string>>();
    foreach (var word in strs) {
        var key = new string(word.OrderBy(c => c).ToArray());
        if (!map.ContainsKey(key)) map[key] = new List<string>();
        map[key].Add(word);
    }
    return map.Values.ToList<IList<string>>();
}`,
    },
  ],
  tasks: [
    {
      title: '1. FizzBuzz (Classic Warm-up)',
      english:
        'Print numbers 1..n. Multiples of 3 → "Fizz", 5 → "Buzz", both → "FizzBuzz". Tests basic conditional logic — often the first live task.',
      bangla:
        '১ থেকে n পর্যন্ত: ৩-এর গুণিতক "Fizz", ৫-এর "Buzz", উভয় "FizzBuzz"। Basic conditional logic test — প্রায়ই প্রথম live task।',
      code: `public IList<string> FizzBuzz(int n) {
    var result = new List<string>(n);
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) result.Add("FizzBuzz");
        else if (i % 3 == 0) result.Add("Fizz");
        else if (i % 5 == 0) result.Add("Buzz");
        else result.Add(i.ToString());
    }
    return result;
}`,
    },
    {
      title: '2. Two Sum (Hash Map — #1 Classic)',
      english:
        'Given int[] nums and target, return indices of two numbers that add to target. Exactly one solution exists. Must be O(n) with Dictionary.',
      bangla:
        'nums ও target দিয়ে দুটি সংখ্যার index খুঁজুন যাদের যোগ target। Dictionary দিয়ে O(n)।',
      code: `public int[] TwoSum(int[] nums, int target) {
    var map = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++) {
        int need = target - nums[i];
        if (map.TryGetValue(need, out int j)) return new[] { j, i };
        map[nums[i]] = i;
    }
    throw new InvalidOperationException("No solution");
}`,
    },
    {
      title: '3. Valid Palindrome',
      english: 'Return true if string reads same forward/backward, ignoring non-alphanumeric and case.',
      bangla: 'Non-alphanumeric ও case ignore করে palindrome কিনা true/false।',
      code: `public bool IsPalindrome(string s) {
    int l = 0, r = s.Length - 1;
    while (l < r) {
        while (l < r && !char.IsLetterOrDigit(s[l])) l++;
        while (l < r && !char.IsLetterOrDigit(s[r])) r--;
        if (char.ToLowerInvariant(s[l++]) != char.ToLowerInvariant(s[r--]))
            return false;
    }
    return true;
}`,
    },
    {
      title: '4. Reverse Words in a String',
      english: 'Reverse word order: "the sky is blue" → "blue is sky the". Handle extra spaces.',
      bangla: '"the sky is blue" → "blue is sky the" — extra space handle করুন।',
      code: `public string ReverseWords(string s) {
    var words = s.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    Array.Reverse(words);
    return string.Join(' ', words);
}`,
    },
    {
      title: '5. Valid Anagram',
      english: 'Return true if t is an anagram of s (same letters, different order).',
      bangla: 't, s-এর anagram কিনা (একই letter, আলাদা order)।',
      code: `public bool IsAnagram(string s, string t) {
    if (s.Length != t.Length) return false;
    Span<int> count = stackalloc int[26];
    for (int i = 0; i < s.Length; i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    foreach (int c in count) if (c != 0) return false;
    return true;
}`,
    },
    {
      title: '6. First Non-Repeating Character',
      english: 'Return index of first character that appears only once. Return -1 if none.',
      bangla: 'প্রথম unique character-এর index; না থাকলে -1।',
      code: `public int FirstUniqChar(string s) {
    var count = new int[26];
    foreach (char c in s) count[c - 'a']++;
    for (int i = 0; i < s.Length; i++)
        if (count[s[i] - 'a'] == 1) return i;
    return -1;
}`,
    },
    {
      title: '7. Valid Parentheses (Stack)',
      english: 'Given string of brackets ()[]{} , determine if valid and properly nested.',
      bangla: '()[]{} bracket valid ও properly nested কিনা Stack দিয়ে।',
      code: `public bool IsValid(string s) {
    var stack = new Stack<char>();
    foreach (char c in s) {
        if (c is '(' or '[' or '{') stack.Push(c);
        else {
            if (stack.Count == 0) return false;
            char open = stack.Pop();
            if (c == ')' && open != '(') return false;
            if (c == ']' && open != '[') return false;
            if (c == '}' && open != '{') return false;
        }
    }
    return stack.Count == 0;
}`,
    },
    {
      title: '8. Remove Duplicates from Sorted Array (In-place)',
      english: 'Remove duplicates in-place, return new length. O(1) extra space.',
      bangla: 'Sorted array থেকে duplicate in-place remove, নতুন length return।',
      code: `public int RemoveDuplicates(int[] nums) {
    if (nums.Length == 0) return 0;
    int write = 0;
    for (int read = 1; read < nums.Length; read++)
        if (nums[read] != nums[write]) nums[++write] = nums[read];
    return write + 1;
}`,
    },
    {
      title: '9. Merge Two Sorted Arrays',
      english: 'Merge nums1 (with extra space at end) and nums2 into sorted nums1.',
      bangla: 'দুটি sorted array merge করে nums1-এ sorted রাখুন (শেষে extra space আছে)।',
      code: `public void Merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,
    },
    {
      title: '10. Group Anagrams',
      english: 'Group strings that are anagrams of each other.',
      bangla: 'Anagram stringগুলো একসাথে group করুন।',
      code: `public IList<IList<string>> GroupAnagrams(string[] strs) {
    var map = new Dictionary<string, List<string>>();
    foreach (var w in strs) {
        var key = new string(w.OrderBy(c => c).ToArray());
        if (!map.TryGetValue(key, out var list)) map[key] = list = new List<string>();
        list.Add(w);
    }
    return map.Values.ToList<IList<string>>();
}`,
    },
    {
      title: '11. Best Time to Buy and Sell Stock',
      english: 'One transaction max — find maximum profit from price array.',
      bangla: 'একবার buy/sell — price array থেকে max profit।',
      code: `public int MaxProfit(int[] prices) {
    int min = int.MaxValue, profit = 0;
    foreach (int p in prices) {
        min = Math.Min(min, p);
        profit = Math.Max(profit, p - min);
    }
    return profit;
}`,
    },
    {
      title: '12. Contains Duplicate',
      english: 'Return true if any value appears at least twice. O(n) with HashSet.',
      bangla: 'কোনো value দুবার আছে কিনা HashSet O(n)।',
      code: `public bool ContainsDuplicate(int[] nums) {
    var seen = new HashSet<int>();
    foreach (int n in nums) {
        if (!seen.Add(n)) return true;
    }
    return false;
}`,
    },
    {
      title: '13. Shopping Cart Total (Business Logic)',
      english: '10% discount if subtotal > 500, then +$5 shipping, then 5% tax. Use decimal.',
      bangla: 'Subtotal > 500 হলে ১০% discount, +$5 shipping, ৫% tax — decimal ব্যবহার করুন।',
      code: `public decimal CalculateTotal(decimal subtotal) {
    decimal discount = subtotal > 500m ? subtotal * 0.10m : 0m;
    decimal afterDiscount = subtotal - discount;
    decimal withShipping = afterDiscount + 5m;
    return Math.Round(withShipping * 1.05m, 2);
}`,
    },
    {
      title: '14. Find Missing Number (XOR Trick)',
      english: 'Array has n distinct numbers from 0..n, one missing. O(n) time, O(1) space.',
      bangla: '০..n থেকে একটা missing — XOR O(n) time, O(1) space।',
      code: `public int MissingNumber(int[] nums) {
    int xor = nums.Length;
    for (int i = 0; i < nums.Length; i++) xor ^= i ^ nums[i];
    return xor;
}`,
    },
    {
      title: '15. Rotate Array by K Steps',
      english: 'Rotate array to the right by k steps. Use reverse three times trick.',
      bangla: 'Array k step right rotate — reverse তিনবার trick।',
      code: `public void Rotate(int[] nums, int k) {
    k %= nums.Length;
    Reverse(nums, 0, nums.Length - 1);
    Reverse(nums, 0, k - 1);
    Reverse(nums, k, nums.Length - 1);
}
void Reverse(int[] a, int l, int r) {
    while (l < r) (a[l], a[r]) = (a[r], a[l++], r--);
}`,
    },
    {
      title: '16. Longest Substring Without Repeating Characters',
      english:
        'Find length of longest substring with all unique characters. Classic sliding window — very common in .NET screening.',
      bangla:
        'সব unique character-এর longest substring-এর length — classic sliding window, .NET screening-এ খুব common।',
      code: `public int LengthOfLongestSubstring(string s) {
    var last = new Dictionary<char, int>();
    int best = 0, left = 0;
    for (int right = 0; right < s.Length; right++) {
        if (last.TryGetValue(s[right], out int prev) && prev >= left)
            left = prev + 1;
        last[s[right]] = right;
        best = Math.Max(best, right - left + 1);
    }
    return best;
}`,
    },
    {
      title: '17. Move Zeroes to End',
      english: 'Move all zeros to end of array in-place, keep relative order of non-zero elements.',
      bangla: 'সব zero শেষে in-place সরান, non-zero-এর order same রাখুন।',
      code: `public void MoveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.Length; read++)
        if (nums[read] != 0) nums[write++] = nums[read];
    while (write < nums.Length) nums[write++] = 0;
}`,
    },
    {
      title: '18. Subarray Sum Equals K',
      english: 'Count number of contiguous subarrays whose sum equals k. Prefix sum + Dictionary.',
      bangla: 'Sum = k এমন contiguous subarray কতটি — prefix sum + Dictionary।',
      code: `public int SubarraySum(int[] nums, int k) {
    var prefixCount = new Dictionary<int, int> { [0] = 1 };
    int sum = 0, count = 0;
    foreach (int n in nums) {
        sum += n;
        if (prefixCount.TryGetValue(sum - k, out int c)) count += c;
        prefixCount[sum] = prefixCount.GetValueOrDefault(sum) + 1;
    }
    return count;
}`,
    },
    {
      title: '19. Reverse String (In-place)',
      english: 'Reverse char array in-place using two pointers. Common warm-up before harder string tasks.',
      bangla: 'char array two pointer দিয়ে in-place reverse — string task warm-up।',
      code: `public void ReverseString(char[] s) {
    int l = 0, r = s.Length - 1;
    while (l < r) (s[l], s[r]) = (s[r], s[l++], r--);
}`,
    },
    {
      title: '20. Find Duplicate Number (Cycle Detection)',
      english: 'Array of n+1 integers in range 1..n — find the duplicate. Floyd cycle on array as linked list.',
      bangla: 'n+1 integer, range 1..n — duplicate খুঁজুন। Array-কে linked list ধরে Floyd cycle।',
      code: `public int FindDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}`,
    },
    {
      title: '21. Top K Frequent Elements',
      english: 'Return k most frequent integers from array. Dictionary count + OrderBy or bucket sort.',
      bangla: 'Array থেকে kটি most frequent integer — Dictionary count + OrderBy/bucket।',
      code: `public int[] TopKFrequent(int[] nums, int k) {
    var count = new Dictionary<int, int>();
    foreach (int n in nums) count[n] = count.GetValueOrDefault(n) + 1;
    return count.OrderByDescending(p => p.Value).Take(k).Select(p => p.Key).ToArray();
}`,
    },
    {
      title: '22. Longest Common Prefix',
      english: 'Find longest common prefix among array of strings. Often asked before trie questions.',
      bangla: 'String array-এর longest common prefix — trie-এর আগে often জিজ্ঞেস হয়।',
      code: `public string LongestCommonPrefix(string[] strs) {
    if (strs.Length == 0) return "";
    for (int i = 0; i < strs[0].Length; i++) {
        char c = strs[0][i];
        for (int j = 1; j < strs.Length; j++)
            if (i >= strs[j].Length || strs[j][i] != c)
                return strs[0][..i];
    }
    return strs[0];
}`,
    },
    {
      title: '23. Implement strStr() — Find Needle in Haystack',
      english: 'Return index of first occurrence of needle in haystack, or -1. Classic string search.',
      bangla: 'haystack-এ needle-এর first index, না থাকলে -1 — classic string search।',
      code: `public int StrStr(string haystack, string needle) {
    if (needle.Length == 0) return 0;
    for (int i = 0; i <= haystack.Length - needle.Length; i++)
        if (haystack.AsSpan(i, needle.Length).SequenceEqual(needle))
            return i;
    return -1;
}`,
    },
    {
      title: '24. Single Number (XOR)',
      english: 'Every element appears twice except one — find it in O(n) time O(1) space using XOR.',
      bangla: 'সব element দুবার, একটা একবার — XOR O(n) O(1)।',
      code: `public int SingleNumber(int[] nums) {
    int xor = 0;
    foreach (int n in nums) xor ^= n;
    return xor;
}`,
    },
    {
      title: '25. Majority Element (> n/2)',
      english: 'Find element appearing more than ⌊n/2⌋ times. Boyer-Moore voting algorithm O(n) O(1).',
      bangla: '⌊n/2⌋-এর বেশি appear করা element — Boyer-Moore voting O(n) O(1)।',
      code: `public int MajorityElement(int[] nums) {
    int candidate = 0, count = 0;
    foreach (int n in nums) {
        if (count == 0) { candidate = n; count = 1; }
        else count += n == candidate ? 1 : -1;
    }
    return candidate;
}`,
    },
  ],
  interviewQuestions: [
    {
      q: 'What is the most common mistake in .NET live coding interviews?',
      a: 'Starting to code without clarifying inputs and without naming the pattern. Always restate the problem, confirm null/empty behavior, say "I will use a Dictionary because we need O(1) lookup", then implement. Second common mistake: using double for money.',
      bangla: 'Pattern না বলে code শুরু করা এবং money-তে double — দুটোই common mistake।',
      difficulty: 'junior',
    },
    {
      q: 'How do you practice problem solving as a .NET developer?',
      a: 'Split practice: (1) 30 easy/medium array-string-hash problems in C# on paper or IDE, (2) 10 business-logic tasks with decimal and clean methods, (3) explain complexity aloud for each. Use the same UMPIRE framework until it is automatic. Pair with this handbook\'s Algorithm module for deeper DSA.',
      bangla: 'Array/string/hash + business logic + complexity explain aloud — Algorithm module-এর সাথে pair করুন।',
      difficulty: 'mid',
    },
  ],
  quickRevision: {
    concepts: [
      'UMPIRE: Understand → Match pattern → Plan → Implement → Review → Evaluate complexity',
      'Dictionary for lookup/count; HashSet for exists/dedup',
      'Two pointers on sorted data; sliding window on substrings',
      'Stack for brackets; decimal for money; StringBuilder for string build',
      'Sliding window: longest unique substring, anagram window',
      'Prefix sum + Dictionary: subarray sum equals k',
      'Boyer-Moore voting: majority element',
    ],
    questions: [
      'Two Sum — why O(n) with hash map?',
      'Palindrome — two pointers vs reverse string?',
      'When LINQ vs manual loop?',
    ],
    mistakes: [
      'Coding before clarifying null/empty input',
      'O(n²) string concat with +=',
      'Forgetting to state time/space at the end',
    ],
    scenarios: [
      '30-min live: FizzBuzz or Two Sum warm-up',
      '45-min: Group anagrams + follow-up optimize key',
      'Take-home: shopping cart + unit tests',
    ],
  },
  summary:
    'Master the interview framework and pattern cheat sheet, then drill all 25 tasks until you can code them in C# without looking and explain complexity clearly.',
};
