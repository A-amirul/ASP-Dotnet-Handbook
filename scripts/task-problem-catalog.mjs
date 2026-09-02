/**
 * Clear problem / example / solution / complexity for each coding task slug.
 * Used by generate-coding-module-patches.mjs
 */

/** @type {Record<string, { problem: object; example: object; approach: object; solution: object; complexity: object }>} */
export const TASK_CLARITY = {
  '1-fizzbuzz-classic-warm-up': {
    problem: {
      en: 'Print numbers from **1 to n**. Replace multiples of 3 with `"Fizz"`, multiples of 5 with `"Buzz"`, and multiples of both with `"FizzBuzz"`.',
      bn: '**১ থেকে n** পর্যন্ত print করুন। ৩-এর গুণিতক → `"Fizz"`, ৫-এর → `"Buzz"`, উভয় → `"FizzBuzz"`।',
    },
    example: {
      en: '**Input:** `n = 5`\n**Output:** `["1", "2", "Fizz", "4", "FizzBuzz"]`\n\n**Input:** `n = 15` → last item must be `"FizzBuzz"`, not `"Fizz"`.',
      bn: '**Input:** `n = 5`\n**Output:** `["1", "2", "Fizz", "4", "FizzBuzz"]`\n\n**Input:** `n = 15` → শেষে `"FizzBuzz"` হতে হবে, `"Fizz"` নয়।',
    },
    approach: { en: '**Pattern:** Loop + modulo (`%`). Check **15 first**, then 3, then 5.', bn: '**Pattern:** Loop + modulo। **আগে 15**, তারপর ৩, তারপর ৫।' },
    solution: {
      en: '1. Create `List<string>` result.\n2. Loop `i` from 1 to n.\n3. If `i % 15 == 0` → add `"FizzBuzz"`.\n4. Else if `i % 3 == 0` → `"Fizz"`.\n5. Else if `i % 5 == 0` → `"Buzz"`.\n6. Else add `i.ToString()`.\n7. Return list.',
      bn: '1. `List<string>` result।\n2. `i` = 1..n loop।\n3. `i % 15 == 0` → `"FizzBuzz"`।\n4. `i % 3 == 0` → `"Fizz"`।\n5. `i % 5 == 0` → `"Buzz"`।\n6. না হলে number string।\n7. Return list।',
    },
    complexity: { en: '**Time:** O(n) — one pass.\n**Space:** O(n) — output list.', bn: '**Time:** O(n)\n**Space:** O(n) — output list' },
  },
  '2-two-sum-hash-map-1-classic': {
    problem: {
      en: 'Given integer array `nums` and integer `target`, return **indices** of two numbers that add up to `target`. Exactly one answer exists.',
      bn: '`nums` array ও `target` দিয়ে এমন **দুটি index** return করুন যাদের value-এর যোগ `target`।',
    },
    example: {
      en: '**Input:** `nums = [2, 7, 11, 15]`, `target = 9`\n**Output:** `[0, 1]` because `nums[0] + nums[1] = 2 + 7 = 9`',
      bn: '**Input:** `nums = [2, 7, 11, 15]`, `target = 9`\n**Output:** `[0, 1]` কারণ `2 + 7 = 9`',
    },
    approach: { en: '**Pattern:** Hash map (`Dictionary`). Store `value → index`. For each number, check if `target - num` exists.', bn: '**Pattern:** `Dictionary` — `value → index` store; `target - num` আছে কিনা check।' },
    solution: {
      en: '1. Empty `Dictionary<int,int> map`.\n2. For each index `i` and value `nums[i]`:\n   - `need = target - nums[i]`\n   - If `map` contains `need` → return `[map[need], i]`\n   - Else `map[nums[i]] = i`\n3. No pair → throw or return empty.',
      bn: '1. খালি Dictionary।\n2. প্রতি `i`: `need = target - nums[i]`\n   - map-এ `need` থাকলে `[map[need], i]` return\n   - না হলে `map[nums[i]] = i`\n3. না পেলে error।',
    },
    complexity: { en: '**Time:** O(n)\n**Space:** O(n) for Dictionary', bn: '**Time:** O(n)\n**Space:** O(n)' },
  },
  '1-binary-search': {
    problem: {
      en: 'Given a **sorted** array `nums` and `target`, return the **index** of target, or **-1** if not found.',
      bn: '**Sorted** array `nums` ও `target` — target-এর **index** return, না থাকলে **-1**।',
    },
    example: {
      en: '**Input:** `nums = [-1, 0, 3, 5, 9, 12]`, `target = 9`\n**Output:** `4`\n\n**Input:** `target = 2` → **Output:** `-1`',
      bn: '**Input:** `nums = [-1,0,3,5,9,12]`, `target = 9` → **Output:** `4`\n\n**Input:** `target = 2` → **Output:** `-1`',
    },
    approach: { en: '**Pattern:** Binary search. Cut search range in half each step. Requires sorted input.', bn: '**Pattern:** Binary search — প্রতি step-এ range অর্ধেক। Sorted array লাগে।' },
    solution: {
      en: '1. `lo = 0`, `hi = nums.Length - 1`.\n2. While `lo <= hi`:\n   - `mid = lo + (hi - lo) / 2`\n   - If `nums[mid] == target` → return mid\n   - If `nums[mid] < target` → `lo = mid + 1`\n   - Else → `hi = mid - 1`\n3. Return -1.',
      bn: '1. `lo=0`, `hi=length-1`\n2. `lo <= hi`: mid বের → match হলে return; ছোট হলে ডানে; বড় হলে বামে\n3. শেষে -1',
    },
    complexity: { en: '**Time:** O(log n)\n**Space:** O(1)', bn: '**Time:** O(log n)\n**Space:** O(1)' },
  },
  '4-maximum-subarray-kadane': {
    problem: {
      en: 'Find the **contiguous subarray** with the **largest sum** and return that sum.',
      bn: '**Contiguous subarray**-এর **সবচেয়ে বড় sum** return করুন।',
    },
    example: {
      en: '**Input:** `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`\n**Output:** `6` (subarray `[4, -1, 2, 1]`)',
      bn: '**Input:** `[-2,1,-3,4,-1,2,1,-5,4]`\n**Output:** `6` (subarray `[4,-1,2,1]`)',
    },
    approach: { en: '**Pattern:** Kadane\'s algorithm. Track running sum; restart when sum goes negative.', bn: '**Pattern:** Kadane — running sum; negative হলে restart।' },
    solution: {
      en: '1. `best = nums[0]`, `cur = nums[0]`.\n2. For i from 1 to end:\n   - `cur = Max(nums[i], cur + nums[i])` — extend or start fresh\n   - `best = Max(best, cur)`\n3. Return `best`.',
      bn: '1. `best`, `cur` init nums[0]\n2. Loop: `cur = Max(nums[i], cur+nums[i])`; `best = Max(best,cur)`\n3. Return best',
    },
    complexity: { en: '**Time:** O(n)\n**Space:** O(1)', bn: '**Time:** O(n)\n**Space:** O(1)' },
  },
  '16-longest-substring-without-repeating-characters': {
    problem: {
      en: 'Given string `s`, find the **length** of the longest substring **without repeating** characters.',
      bn: 'String `s`-এ **repeat ছাড়া** longest substring-এর **length** খুঁজুন।',
    },
    example: {
      en: '**Input:** `"abcabcbb"` → **Output:** `3` (`"abc"`)\n**Input:** `"bbbbb"` → **Output:** `1`',
      bn: '**Input:** `"abcabcbb"` → **Output:** `3`\n**Input:** `"bbbbb"` → **Output:** `1`',
    },
    approach: { en: '**Pattern:** Sliding window + `Dictionary<char, lastIndex>`. Move `left` when duplicate inside window.', bn: '**Pattern:** Sliding window + char→index map। Duplicate হলে `left` সরান।' },
    solution: {
      en: '1. `left = 0`, `best = 0`, map char → last index.\n2. For `right` 0..n-1:\n   - If char seen and index >= left → `left = lastIndex + 1`\n   - Store char index at right\n   - `best = Max(best, right - left + 1)`\n3. Return best.',
      bn: '1. left=0, best=0, map\n2. right loop: duplicate হলে left jump; map update; best update\n3. Return best',
    },
    complexity: { en: '**Time:** O(n)\n**Space:** O(min(n, alphabet))', bn: '**Time:** O(n)\n**Space:** O(alphabet)' },
  },
  '33-lru-cache-design': {
    problem: {
      en: 'Design **LRU Cache** with fixed capacity. `Get(key)` and `Put(key, value)` must be **O(1)**. Evict least recently used when full.',
      bn: 'Fixed capacity **LRU Cache** — `Get`/`Put` **O(1)**; full হলে least recently used evict।',
    },
    example: {
      en: '**Input:** capacity=2, Put(1,1), Put(2,2), Get(1)→1, Put(3,3) evicts key 2, Get(2)→-1',
      bn: 'capacity=2, Put(1,1), Put(2,2), Get(1)→1, Put(3,3) key 2 evict, Get(2)→-1',
    },
    approach: { en: '**Pattern:** `Dictionary` + `LinkedList` for O(1) lookup and reorder.', bn: '**Pattern:** Dictionary + LinkedList — O(1) lookup ও reorder।' },
    solution: {
      en: '1. Map key → linked list node.\n2. Get: if missing return -1; move node to front (MRU).\n3. Put: update existing or insert at front.\n4. If over capacity, remove tail node from map + list.',
      bn: '1. key → node map\n2. Get: miss → -1; hit → front\n3. Put: update/insert front\n4. Over capacity → tail remove',
    },
    complexity: { en: '**Get/Put:** O(1) average\n**Space:** O(capacity)', bn: '**Get/Put:** O(1)\n**Space:** O(capacity)' },
  },
  '3-valid-palindrome': {
    problem: { en: 'Return `true` if string is a palindrome, ignoring non-alphanumeric characters and case.', bn: 'Non-alphanumeric ও case ignore করে palindrome হলে `true`।' },
    example: { en: '**Input:** `"A man, a plan, a canal: Panama"` → **Output:** `true`', bn: '**Input:** `"A man, a plan, a canal: Panama"` → **Output:** `true`' },
    approach: { en: '**Pattern:** Two pointers from both ends, skip invalid chars.', bn: '**Pattern:** Two pointer — দুই প্রান্ত, invalid char skip।' },
    solution: { en: '1. `left=0`, `right=Length-1`.\n2. Skip non letter/digit on both sides.\n3. Compare lowercase; mismatch → false.\n4. Move inward until `left >= right`.', bn: '1. left/right\n2. invalid skip\n3. lowercase compare\n4. inward move' },
    complexity: { en: '**Time:** O(n)\n**Space:** O(1)', bn: '**Time:** O(n)\n**Space:** O(1)' },
  },
  '7-valid-parentheses-stack': {
    problem: { en: 'Given string of brackets `()`, `[]`, `{}`, return whether it is **valid and properly closed**.', bn: '`()`, `[]`, `{}` valid ও properly closed কিনা return করুন।' },
    example: { en: '**Input:** `"()[]{}"` → `true`\n**Input:** `"(]"` → `false`', bn: '**Input:** `"()[]{}"` → `true`\n**Input:** `"(]"` → `false`' },
    approach: { en: '**Pattern:** Stack — push expected closing bracket for each open.', bn: '**Pattern:** Stack — open-এ expected close push।' },
    solution: { en: '1. Empty stack.\n2. Open bracket → push matching close.\n3. Close → pop must match.\n4. End: stack empty.', bn: '1. Stack\n2. Open → push close\n3. Close → pop match\n4. শেষে empty' },
    complexity: { en: '**Time:** O(n)\n**Space:** O(n)', bn: '**Time:** O(n)\n**Space:** O(n)' },
  },
  '2-reverse-linked-list': {
    problem: { en: 'Reverse a **singly linked list** and return the new head.', bn: '**Singly linked list** reverse করে new head return।' },
    example: { en: '**Input:** `1→2→3→null` → **Output:** `3→2→1→null`', bn: '**Input:** `1→2→3` → **Output:** `3→2→1`' },
    approach: { en: '**Pattern:** Three pointers `prev`, `curr`, `next` — flip links one by one.', bn: '**Pattern:** prev/curr/next — link flip।' },
    solution: { en: '1. `prev=null`, `curr=head`.\n2. While curr: save next, curr.next=prev, advance prev and curr.\n3. Return prev.', bn: '1. prev=null\n2. loop: next save, flip, advance\n3. return prev' },
    complexity: { en: '**Time:** O(n)\n**Space:** O(1)', bn: '**Time:** O(n)\n**Space:** O(1)' },
  },
  '5-climbing-stairs-dp': {
    problem: { en: 'Count **distinct ways** to climb n stairs taking 1 or 2 steps at a time.', bn: 'n সিঁড়ি — ১ বা ২ step, **কত distinct way**।' },
    example: { en: '**Input:** `n=3` → **Output:** `3` (1+1+1, 1+2, 2+1)', bn: '**Input:** `n=3` → **Output:** `3`' },
    approach: { en: '**Pattern:** DP / Fibonacci — `ways[i] = ways[i-1] + ways[i-2]`.', bn: '**Pattern:** DP — `ways[i]=ways[i-1]+ways[i-2]`।' },
    solution: { en: '1. Base: n<=2 return n.\n2. Keep two vars `a,b` for last two ways.\n3. Loop i=3..n: `(a,b)=(b,a+b)`.\n4. Return b.', bn: '1. base n<=2\n2. a,b vars\n3. loop update\n4. return b' },
    complexity: { en: '**Time:** O(n)\n**Space:** O(1)', bn: '**Time:** O(n)\n**Space:** O(1)' },
  },
  '8-coin-change-min-coins': {
    problem: { en: 'Given coin denominations and `amount`, return **minimum coins** needed, or `-1` if impossible.', bn: 'Coin denominations ও `amount` — **minimum coin count**, impossible হলে `-1`।' },
    example: { en: '**Input:** coins=[1,2,5], amount=11 → **Output:** `3` (5+5+1)', bn: 'coins=[1,2,5], amount=11 → **Output:** `3`' },
    approach: { en: '**Pattern:** 1D DP — `dp[a]` = min coins for amount `a`.', bn: '**Pattern:** 1D DP — `dp[a]` = min coins।' },
    solution: { en: '1. dp[0]=0, rest = infinity.\n2. For a=1..amount, each coin c: if c<=a, dp[a]=Min(dp[a], dp[a-c]+1).\n3. Return dp[amount] or -1.', bn: '1. dp[0]=0\n2. loop amount+coins\n3. dp[amount] or -1' },
    complexity: { en: '**Time:** O(amount × coins)\n**Space:** O(amount)', bn: '**Time:** O(amount×coins)\n**Space:** O(amount)' },
  },
  '13-number-of-islands-dfs': {
    problem: { en: 'Given 2D grid of `"1"` (land) and `"0"` (water), count **number of islands**.', bn: '2D grid `"1"` land, `"0"` water — **island count**।' },
    example: { en: '**Input:** 4×5 grid with three separate `"1"` groups → **Output:** `3`', bn: 'তিনটা আলাদা `"1"` group → **Output:** `3`' },
    approach: { en: '**Pattern:** DFS/BFS — sink each island when visited (`grid[r][c]=\'0\'`).', bn: '**Pattern:** DFS — visit করে `"0"` mark (sink)।' },
    solution: { en: '1. Loop every cell.\n2. If `grid[r][c]==\'1\'`: count++, DFS flood fill 4 directions.\n3. Return count.', bn: '1. cell loop\n2. `1` পেলে count++ ও DFS\n3. return count' },
    complexity: { en: '**Time:** O(rows×cols)\n**Space:** O(rows×cols) recursion', bn: '**Time:** O(rows×cols)\n**Space:** O(rows×cols)' },
  },
  '21-merge-two-sorted-lists': {
    problem: { en: 'Merge two **sorted** linked lists into one sorted list. Return merged head.', bn: 'দুটি **sorted** linked list merge — sorted head return।' },
    example: { en: '**Input:** `1→2→4`, `1→3→4` → **Output:** `1→1→2→3→4→4`', bn: '**Input:** `1→2→4` + `1→3→4` → merged sorted' },
    approach: { en: '**Pattern:** Dummy head + compare two pointers.', bn: '**Pattern:** Dummy head + compare pointers।' },
    solution: { en: '1. Dummy node, cur pointer.\n2. While both lists: attach smaller node, advance.\n3. Attach remainder.\n4. Return dummy.next.', bn: '1. dummy node\n2. compare attach\n3. remainder\n4. dummy.next' },
    complexity: { en: '**Time:** O(n+m)\n**Space:** O(1)', bn: '**Time:** O(n+m)\n**Space:** O(1)' },
  },
  '27-search-in-rotated-sorted-array': {
    problem: { en: 'Search `target` in **rotated sorted** array (no duplicates). Return index or -1.', bn: '**Rotated sorted** array-তে `target` index, না থাকলে -1।' },
    example: { en: '**Input:** `[4,5,6,7,0,1,2]`, target=0 → **Output:** `4`', bn: '**Input:** `[4,5,6,7,0,1,2]`, target=0 → **Output:** `4`' },
    approach: { en: '**Pattern:** Modified binary search — one half is always sorted.', bn: '**Pattern:** Binary search — এক half সবসময় sorted।' },
    solution: { en: '1. lo/hi binary search.\n2. If nums[lo]<=nums[mid]: left half sorted — check if target in range.\n3. Else right half sorted — adjust lo/hi.\n4. Return -1 if not found.', bn: '1. lo/hi\n2. left sorted check\n3. else right\n4. -1' },
    complexity: { en: '**Time:** O(log n)\n**Space:** O(1)', bn: '**Time:** O(log n)\n**Space:** O(1)' },
  },
  '30-word-break-dp': {
    problem: { en: 'Can string `s` be segmented into **dictionary words** (reuse allowed)? Return true/false.', bn: 'String `s` dictionary word-এ ভাগ করা যায় কিনা — true/false।' },
    example: { en: '**Input:** s=`"leetcode"`, dict=[`"leet"`,`"code"`] → **Output:** `true`', bn: 's=`"leetcode"`, dict leet+code → **Output:** `true`' },
    approach: { en: '**Pattern:** 1D DP — `dp[i]` = can prefix length i be segmented?', bn: '**Pattern:** 1D DP — prefix length i segmentable?' },
    solution: { en: '1. dp[0]=true.\n2. For i=1..n: try every j<i; if dp[j] and s[j..i) in dict → dp[i]=true.\n3. Return dp[n].', bn: '1. dp[0]=true\n2. j loop + dict check\n3. dp[n]' },
    complexity: { en: '**Time:** O(n² × word check)\n**Space:** O(n)', bn: '**Time:** O(n²)\n**Space:** O(n)' },
  },
  '2-stack-evaluate-reverse-polish-notation': {
    problem: { en: 'Evaluate **Reverse Polish Notation** expression: operators come after operands. Return the final integer result.', bn: '**RPN** expression evaluate — operator operand-এর পরে; final integer return।' },
    example: { en: '**Input:** `["2","1","+","3","*"]` → **Output:** `9` because `(2+1)*3 = 9`', bn: '**Input:** `["2","1","+","3","*"]` → **Output:** `9`' },
    approach: { en: '**Pattern:** Stack — push numbers; on operator pop two, compute, push result.', bn: '**Pattern:** Stack — number push; operator-এ pop দুটো, compute, push।' },
    solution: { en: '1. Empty Stack<int>.\n2. Token is operator → pop b, pop a, push result.\n3. Token is number → push parsed int.\n4. Return stack.Pop().', bn: '1. Stack\n2. Operator → pop, compute, push\n3. Number → push\n4. Pop return' },
    complexity: { en: '**Time:** O(n)\n**Space:** O(n) stack', bn: '**Time:** O(n)\n**Space:** O(n)' },
  },
  '6-linq-group-orders-by-customer-sum-total': {
    problem: { en: 'Given orders with `CustomerId` and `Amount`, return **total amount per customer**, sorted by total **descending**.', bn: '`CustomerId`, `Amount` — customer প্রতি **total amount**, descending sort।' },
    example: { en: '**Input:** `(1,100), (2,50), (1,25)` → **Output:** `(1,125), (2,50)`', bn: '**Input:** customer 1→125, customer 2→50' },
    approach: { en: '**Pattern:** LINQ GroupBy + Sum + OrderByDescending. Alternative: Dictionary manual loop.', bn: '**Pattern:** LINQ GroupBy + Sum + OrderByDescending।' },
    solution: { en: '1. `orders.GroupBy(o => o.CustomerId)`\n2. `.Select(g => (g.Key, g.Sum(o => o.Amount)))`\n3. `.OrderByDescending(x => x.Item2)`\n4. `.ToList()`', bn: '1. GroupBy CustomerId\n2. Sum Amount\n3. OrderByDescending\n4. ToList' },
    complexity: { en: '**Time:** O(n log n) for sort\n**Space:** O(n)', bn: '**Time:** O(n log n)\n**Space:** O(n)' },
  },
  '8-string-parsing-parse-csv-line-no-commas-in-quotes': {
    problem: { en: 'Parse one **CSV line** into fields. Commas inside **double quotes** are not separators.', bn: 'এক **CSV line** field-এ parse — **quotes**-এর ভিতর comma separator নয়।' },
    example: { en: '**Input:** `"John,Doe",30,NY` → **Output:** `["John,Doe", "30", "NY"]`', bn: '**Input:** `"John,Doe",30` → quoted field একটাই field' },
    approach: { en: '**Pattern:** Single pass with StringBuilder + `inQuotes` flag.', bn: '**Pattern:** StringBuilder + `inQuotes` flag single pass।' },
    solution: { en: '1. Loop each char.\n2. `"` toggles inQuotes.\n3. `,` outside quotes → flush field.\n4. Append char otherwise.\n5. Flush last field.', bn: '1. char loop\n2. quote toggle\n3. comma → flush\n4. append\n5. last flush' },
    complexity: { en: '**Time:** O(line length)\n**Space:** O(fields)', bn: '**Time:** O(n)\n**Space:** O(fields)' },
  },
  '17-stack-min-stack-design': {
    problem: { en: 'Design a stack with `Push`, `Pop`, `Top`, and **`GetMin` all O(1)**.', bn: 'Stack `Push`, `Pop`, `Top`, **`GetMin` সব O(1)** design।' },
    example: { en: 'Push 3, Push 1, GetMin→1, Pop, GetMin→3', bn: 'Push 3, Push 1, GetMin→1, Pop, GetMin→3' },
    approach: { en: '**Pattern:** Auxiliary stack tracking minimum at each depth.', bn: '**Pattern:** Auxiliary stack — প্রতি depth-এ min track।' },
    solution: { en: '1. Main stack + min stack.\n2. Push: push value; push Min(value, minPeek).\n3. Pop both stacks.\n4. GetMin = min stack Peek.', bn: '1. main + min stack\n2. push both\n3. pop both\n4. GetMin = min.Peek' },
    complexity: { en: '**All ops:** O(1)\n**Space:** O(n)', bn: '**All ops:** O(1)\n**Space:** O(n)' },
  },
};

export function getTaskClarity(slug, title, english, bangla, pattern) {
  if (TASK_CLARITY[slug]) return TASK_CLARITY[slug];

  const name = title.replace(/^\d+\.\s*/, '').split('(')[0].trim();
  return {
    problem: {
      en: english
        ? `**Problem:** ${english}`
        : `**Problem:** Solve **${name}** using ${pattern}. State clearly what you return.`,
      bn: bangla
        ? `**প্রশ্ন:** ${bangla}`
        : `**প্রশ্ন:** **${name}** solve করুন — ${pattern} ব্যবহার করে কী return করবেন স্পষ্ট করুন।`,
    },
    example: {
      en: '**How to explain in interview:**\n1. Write one small **input** on the board.\n2. Draw the **expected output**.\n3. Mention one **edge case** (empty, single item, duplicate).\n\nPattern: **' + pattern + '**',
      bn: '**Interview-তে:**\n1. ছোট **input** লিখুন\n2. **Output** draw করুন\n3. এক **edge case** বলুন\n\nPattern: **' + pattern + '**',
    },
    approach: {
      en: '**Approach:** Use **' + pattern + '**.\n- Name the C# type (Dictionary, Stack, Queue, etc.)\n- Say brute force first, then optimized idea\n- Write 3–5 bullet steps before coding',
      bn: '**Approach:** **' + pattern + '**।\n- C# type বলুন (Dictionary, Stack…)\n- আগে brute force, তারপর optimize\n- Code-এর আগে ৩–৫ bullet step',
    },
    solution: {
      en: '**Solution outline for ' + name + ':**\n1. Handle null/empty input.\n2. Initialize data structures.\n3. Main loop or recursion (core logic).\n4. Return the answer.\n5. Walk through your example on the board.\n\n↓ Full **C# code** is below — match each block to these steps.',
      bn: '**' + name + ' solution outline:**\n1. null/empty handle\n2. Structure init\n3. Main loop/recursion\n4. Return\n5. Example trace\n\n↓ **C# code** নিচে — step-এর সাথে match করুন।',
    },
    complexity: {
      en: guessComplexityEn(title, pattern),
      bn: guessComplexityBn(title, pattern),
    },
  };
}

function guessComplexityEn(title, pattern) {
  const t = title.toLowerCase();
  if (t.includes('binary') || t.includes('search rotated')) return '**Time:** O(log n)\n**Space:** O(1)';
  if (t.includes('sort') || t.includes('top k') && t.includes('order')) return '**Time:** O(n log n)\n**Space:** O(n)';
  if (pattern.includes('DP') || t.includes('lcs') || t.includes('coin')) return '**Time:** O(n) or O(n²) depending on state\n**Space:** O(n) or O(n²) for DP table';
  if (t.includes('nested') || t.includes('subsets')) return '**Time:** O(2^n) or O(n·2^n)\n**Space:** O(n) recursion';
  if (t.includes('heap') || t.includes('kth')) return '**Time:** O(n log k)\n**Space:** O(k)';
  return '**Time:** O(n) typical for one pass\n**Space:** O(1) to O(n) — state in answer aloud';
}

function guessComplexityBn(title, pattern) {
  const t = title.toLowerCase();
  if (t.includes('binary')) return '**Time:** O(log n)\n**Space:** O(1)';
  if (pattern.includes('DP')) return '**Time:** O(n)–O(n²)\n**Space:** O(n) DP table';
  return '**Time:** O(n) (typical)\n**Space:** O(1)–O(n) — interview-তে বলুন';
}
