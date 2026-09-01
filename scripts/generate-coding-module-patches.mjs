import { getTaskClarity } from './task-problem-catalog.mjs';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'codingModulePatches.ts');

/** @type {Record<string, { pattern: string; en: object; bn: object; mistakes?: string[]; tips?: string[] }>} */
const PROBLEM_META = {
  fizzbuzz: {
    pattern: 'Modulo / conditional logic',
    en: {
      what: '**FizzBuzz** prints numbers 1 to n, but replaces multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".',
      why: 'Interviewers use this as a **warm-up** to see if you can write clean loops and handle multiple conditions in the right order — before harder problems.',
      how: '1) Loop `i` from 1 to n.\n2) Check **15 first** (3×5) → "FizzBuzz".\n3) Else check 3 → "Fizz", 5 → "Buzz".\n4) Else add `i.ToString()`.\n\n**Why 15 first?** If you check 3 before 15, you will wrongly print "Fizz" instead of "FizzBuzz" for 15, 30, …',
      analogy: 'Like a traffic light with a special rule: when **both** conditions apply (3 and 5), the special "FizzBuzz" sign wins over the single Fizz or Buzz signs.',
      realWorld: 'Same pattern as business rules: "if VIP **and** birthday → double discount" — **most specific rule first**, then general rules.',
    },
    bn: {
      what: '**FizzBuzz** ১ থেকে n পর্যন্ত সংখ্যা print করে, তবে ৩-এর গুণিতকে "Fizz", ৫-এর "Buzz", উভয়ের "FizzBuzz" লেখে।',
      why: 'Interview-তে এটা **warm-up** — loop, condition এবং **সঠিক order** বোঝায় কিনা দেখার জন্য।',
      how: '1) `i` = 1 থেকে n loop।\n2) **আগে 15** check (৩×৫) → "FizzBuzz"।\n3) না হলে ৩ → "Fizz", ৫ → "Buzz"।\n4) না হলে `i.ToString()`।\n\n**১৫ আগে কেন?** ৩ আগে check করলে ১৫-এ ভুল করে "Fizz" হবে।',
      analogy: 'Traffic light-এর মতো — **দুটো rule একসাথে** মিললে সবচেয়ে specific rule (FizzBuzz) আগে।',
      realWorld: 'Business rule: "VIP **এবং** birthday" → double discount — **specific rule আগে**।',
    },
    mistakes: ['Checking 3 before 15', 'Using print instead of returning List<string>'],
    tips: ['Say aloud: "I check 15 first to avoid the FizzBuzz bug."'],
  },
  'two-sum': {
    pattern: 'Hash map (Dictionary)',
    en: {
      what: '**Two Sum**: given an array and a target number, find **two indices** whose values add up to the target.',
      why: 'This is the #1 pattern for "find a pair" problems. It teaches **Dictionary** usage — core skill for .NET developers working with lookups and caching.',
      how: '1) Create empty `Dictionary<int,int>` mapping **value → index**.\n2) For each `nums[i]`, compute `need = target - nums[i]`.\n3) If `need` is already in the map, return `[map[need], i]`.\n4) Else store `nums[i] → i`.\n\n**Walkthrough:** nums=[2,7,11], target=9\n- i=0: need=7, map empty → store 2→0\n- i=1: need=2, map has 2 at index 0 → return [0,1]',
      analogy: 'Like finding a friend in a party who has the **exact money** you need to reach the bill total — you remember who you already met (hash map) instead of asking everyone again.',
      realWorld: 'Same idea as matching invoice lines to payments, or finding two API keys that hash to a required checksum.',
    },
    bn: {
      what: '**Two Sum**: array ও target দিয়ে **দুটি index** খুঁজুন যাদের যোগ target।',
      why: '"Pair খুঁজুন" pattern-এর #১ — **Dictionary** শেখায়, .NET-এ lookup/cache-এর base।',
      how: '1) খালি `Dictionary<int,int>` — **value → index**।\n2) প্রতি `nums[i]`-এ `need = target - nums[i]`।\n3) `need` map-এ থাকলে `[map[need], i]` return।\n4) না হলে `nums[i] → i` store।\n\n**উদাহরণ:** [2,7,11], target=9 → index [0,1]',
      analogy: 'Party-তে bill মেটাতে **ঠিক কত টাকা** দরকার — আগে যাদের দেখেছেন map-এ রাখুন, আবার সবাইকে জিজ্ঞেস নয়।',
      realWorld: 'Invoice line ↔ payment match — একই lookup idea।',
    },
    mistakes: ['Nested loop O(n²) without mentioning optimization', 'Returning values instead of indices'],
    tips: ['Say: O(n) time, O(n) space for the Dictionary'],
  },
  palindrome: {
    pattern: 'Two pointers',
    en: {
      what: '**Valid Palindrome**: check if a string reads the same forward and backward, ignoring spaces, punctuation, and letter case.',
      why: 'Teaches **two pointers** — one of the most common interview techniques for strings and sorted arrays.',
      how: '1) `left = 0`, `right = s.Length - 1`.\n2) Move `left` right while char is not letter/digit.\n3) Move `right` left while char is not letter/digit.\n4) Compare lowercased chars; if different → false.\n5) Move both inward until `left >= right`.',
      analogy: 'Two people reading from opposite ends of a book page — they skip spaces and symbols, only comparing actual letters.',
      realWorld: 'Input validation, username checks, and parsing cleaned identifiers in ASP.NET APIs.',
    },
    bn: {
      what: '**Valid Palindrome**: string সামনে-পেছনে একই কিনা — space, punctuation, case ignore।',
      why: '**Two pointer** technique শেখায় — string ও sorted array-তে খুব common।',
      how: '1) `left=0`, `right=শেষ`।\n2) letter/digit না হলে pointer সরান।\n3) lowercase compare — mismatch হলে false।\n4) `left >= right` পর্যন্ত।',
      analogy: 'দুজন book-এর দুই প্রান্ত থেকে পড়ছে — space skip করে শুধু letter compare।',
      realWorld: 'API input validation, username check।',
    },
  },
  anagram: {
    pattern: 'Frequency counting',
    en: {
      what: '**Valid Anagram** checks whether two strings use the **same letters** with the **same counts** — only order differs (listen ↔ silent).',
      why: 'Teaches **frequency counting** with a small fixed array `int[26]` — faster than sorting for lowercase a-z.',
      how: '1) If lengths differ → false.\n2) Create `count[26]`.\n3) For each index i: `count[s[i]-\'a\']++` and `count[t[i]-\'a\']--`.\n4) If all counts are 0 → anagram.\n\n**Why ++ and -- together?** One pass compares both strings at once.',
      analogy: 'Like two backpacks with letter tiles — anagram means both have exactly the same tiles, just shuffled.',
      realWorld: 'Detecting duplicate submissions, spell-check variants, comparing normalized user input.',
    },
    bn: {
      what: '**Valid Anagram** — দুটি string-এ **একই letter same count**-এ আছে কিনা, শুধু order আলাদা।',
      why: '**Frequency count** `int[26]` — lowercase a-z-এ sort-এর চেয়ে দ্রুত।',
      how: '1) Length আলাদা → false\n2) `count[26]`\n3) s-তে ++, t-তে --\n4) সব 0 → anagram\n\n**এক pass-এ ++/--** — দুটো string একসাথে compare।',
      analogy: 'দুটি bag-এ letter tile — same tiles, shuffle order।',
      realWorld: 'Duplicate submission detect, input normalize compare।',
    },
  },
  parentheses: {
    pattern: 'Stack',
    en: {
      what: '**Valid Parentheses** checks whether brackets `()`, `[]`, `{}` are **closed in the correct order**.',
      why: 'Classic **Stack** interview question — same logic as compilers parsing code and XML/JSON validators.',
      how: '1) Create empty `Stack<char>`.\n2) For each char:\n   - If opening bracket → push the **expected closing** bracket.\n   - If closing → stack must not be empty and pop must match.\n3) End with empty stack.\n\n**Trick:** push `)` when you see `(`, so pop compares directly.',
      analogy: 'Like nesting boxes — each new box opens inside the last; you must close the inner box before the outer one.',
      realWorld: 'Expression evaluators, Razor/HTML tag validators, lint rules for balanced braces in code.',
    },
    bn: {
      what: '**Valid Parentheses** — `()`, `[]`, `{}` **সঠিক order-এ close** হয়েছে কিনা।',
      why: 'Classic **Stack** question — compiler/XML parser-এ same logic।',
      how: '1) Empty stack\n2) Open bracket → expected close push\n3) Close → pop match check\n4) শেষে stack empty\n\n**Trick:** `(` দেখলে `)` push — pop সরাসরি compare।',
      analogy: 'Nested box — ভেতরের box আগে close, তারপর বাইরের।',
      realWorld: 'Expression parser, HTML tag balance check।',
    },
  },
  kadane: {
    pattern: 'Dynamic programming / greedy',
    en: {
      what: '**Maximum Subarray (Kadane\'s)** finds the contiguous slice of an array with the **largest sum**.',
      why: 'Famous DP/greedy hybrid — tests whether you can track a **running sum** and reset when it goes negative.',
      how: '1) `maxEndingHere = nums[0]`, `maxSoFar = nums[0]`.\n2) For i from 1:\n   - `maxEndingHere = Max(nums[i], maxEndingHere + nums[i])` — extend or restart.\n   - `maxSoFar = Max(maxSoFar, maxEndingHere)`.\n3) Return maxSoFar.\n\n**Intuition:** if running sum becomes negative, drop it — start fresh at nums[i].',
      analogy: 'Walking a path collecting coins — if your bag goes negative, drop the bag and start a new one at the next house.',
      realWorld: 'Best consecutive sales period, max CPU spike window, signal processing basics.',
    },
    bn: {
      what: '**Kadane** — array-এর contiguous অংশে **সবচেয়ে বড় sum**।',
      why: 'Running sum track + negative হলে reset — classic DP/greedy।',
      how: '1) `maxEndingHere`, `maxSoFar` init\n2) `maxEndingHere = Max(nums[i], maxEndingHere+nums[i])`\n3) negative হলে restart\n\n**Negative bag drop** = নতুন start nums[i]',
      analogy: 'Coin collect path — bag negative হলে bag ফেলে নতুন start।',
      realWorld: 'Best sales week, max spike window।',
    },
  },
  'climbing-stairs': {
    pattern: 'Dynamic programming',
    en: {
      what: '**Climbing Stairs**: count how many distinct ways to reach step n if each move is 1 or 2 steps.',
      why: 'Simplest DP introduction — same recurrence as Fibonacci. Appears in almost every DP intro interview.',
      how: '1) Ways to step 1 = 1, step 2 = 2.\n2) `ways[i] = ways[i-1] + ways[i-2]` — last step either 1 or 2.\n3) Optimize space: only keep last two values `a`, `b`.\n\nExample n=4: 1→1→1→1, 1→1→2, 1→2→1, 2→1→1, 2→2 = 5 ways.',
      analogy: 'Like climbing stairs at home — at each step you choose one or two steps up; total paths add up from previous steps.',
      realWorld: 'Routing with 1 or 2 hop options, versioning sequences, combinatorics in scheduling.',
    },
    bn: {
      what: '**Climbing Stairs** — n step-এ ১ বা ২ step দিয়ে কত **distinct way**।',
      why: 'সবচেয়ে সহজ DP — Fibonacci recurrence।',
      how: '1) step1=1, step2=2\n2) `ways[i]=ways[i-1]+ways[i-2]`\n3) Space O(1): শুধু last two\n\nn=4 → 5 ways',
      analogy: 'বাড়ির stairs — প্রতি step-এ ১ বা ২ step choice।',
      realWorld: '1/2 hop routing, schedule combination।',
    },
  },
  'reverse-list': {
    pattern: 'Linked list pointers',
    en: {
      what: '**Reverse Linked List** flips each node\'s `next` pointer so the list reads backward.',
      why: 'Tests pointer manipulation — fundamental before merge list, cycle detection, and many tree problems.',
      how: '1) `prev = null`, `curr = head`.\n2) While curr not null:\n   - Save `next = curr.next`\n   - `curr.next = prev` (flip link)\n   - Move `prev = curr`, `curr = next`\n3) Return `prev` (new head).\n\n**Draw it:** always draw 3 nodes on paper before coding.',
      analogy: 'Like reversing a chain of people holding hands — each person now points to the one behind them.',
      realWorld: 'Undo singly-linked event logs, reverse iteration without array allocation (conceptually).',
    },
    bn: {
      what: '**Reverse Linked List** — প্রতি node-এর `next` উল্টে list backward।',
      why: 'Pointer manipulation test — merge/cycle-এর আগে must-know।',
      how: '1) prev=null, curr=head\n2) next save → curr.next=prev → advance\n3) return prev\n\n**Paper-এ ৩ node draw** আগে code।',
      analogy: 'Hand-in-hand chain reverse — পেছনের দিকে point।',
      realWorld: 'Event log reverse traverse concept।',
    },
  },
  'group-anagrams': {
    pattern: 'Hash map + key design',
    en: {
      what: '**Group Anagrams** clusters words that are anagrams of each other: eat, tea, ate → one group.',
      why: 'Tests **Dictionary key design** — a common mid-level .NET interview and real LINQ grouping task.',
      how: '1) Create `Dictionary<string, List<string>>`.\n2) For each word, build a **canonical key**:\n   - Sort letters: `new string(word.OrderBy(c => c))`, OR\n   - Count signature: `a1b1c0...`\n3) Add word to `map[key]`.\n4) Return all lists.\n\nSorted key is easiest to explain in interviews.',
      analogy: 'Like sorting each word\'s letters into alphabetical order as a "fingerprint" — same fingerprint means anagram family.',
      realWorld: 'Grouping search keywords, deduplicating tags, batching similar tokens in NLP pipelines.',
    },
    bn: {
      what: '**Group Anagrams** — anagram word এক group-এ (eat, tea, ate)।',
      why: '**Dictionary key design** — mid .NET interview + real LINQ group।',
      how: '1) Dictionary<string, List>\n2) Key = letter sort\n3) map[key].Add(word)\n4) Values return\n\nInterview-তে sorted key explain করা সহজ।',
      analogy: 'Letter sort = fingerprint — same fingerprint = same anagram family।',
      realWorld: 'Keyword group, tag dedup।',
    },
  },
  'shopping-cart': {
    pattern: 'Business logic (decimal)',
    en: {
      what: '**Shopping Cart Total** applies business rules in order: discount → shipping fee → tax on the final amount.',
      why: 'Very common .NET machine test — checks `decimal` usage, rule order, and rounding — not algorithm tricks.',
      how: '1) Start with `subtotal` (decimal).\n2) If subtotal > 500 → subtract 10% discount.\n3) Add flat shipping (e.g. $5).\n4) Multiply by tax (e.g. 1.05 for 5%).\n5) `Math.Round(result, 2)`.\n\n**Never use double for money** — 0.1 + 0.2 ≠ 0.3 in floating point!',
      analogy: 'Like a restaurant bill: discount coupon first, then service charge, then VAT on what remains.',
      realWorld: 'Every e-commerce checkout service in ASP.NET — identical pattern to production tickets.',
    },
    bn: {
      what: '**Shopping Cart** — discount → shipping → tax order-এ total।',
      why: 'Common machine test — `decimal`, rule order, round — algorithm নয়।',
      how: '1) subtotal (decimal)\n2) >500 → 10% discount\n3) + shipping\n4) × tax\n5) Round 2 decimal\n\n**Money-তে double নয়** — 0.1+0.2 ≠ 0.3!',
      analogy: 'Restaurant bill — coupon, service charge, VAT order।',
      realWorld: 'E-commerce checkout — production ticket pattern।',
    },
  },
  'coin-change': {
    pattern: 'Dynamic programming',
    en: {
      what: '**Coin Change** finds the **minimum number of coins** needed to make an exact amount (or -1 if impossible).',
      why: 'Classic 1D DP — teaches `dp[amount]` meaning and iterating coins in inner loop.',
      how: '1) `dp[0] = 0`, fill rest with infinity/large value.\n2) For each amount a from 1 to target:\n   - For each coin c: if `c <= a`, `dp[a] = Min(dp[a], dp[a-c] + 1)`.\n3) Return dp[target] if reachable else -1.\n\n**Meaning:** dp[a] = min coins to make amount a.',
      analogy: 'Like making change with fewest coins in a wallet — try each coin size and reuse best smaller amount.',
      realWorld: 'Resource pack optimization, minimum API calls to reach quota, change-making in POS systems.',
    },
    bn: {
      what: '**Coin Change** — exact amount-এ **minimum coin count** (-1 impossible)।',
      why: 'Classic 1D DP — `dp[amount]` meaning।',
      how: '1) dp[0]=0, rest large\n2) amount 1..target loop\n3) `dp[a]=Min(dp[a], dp[a-c]+1)`\n\n**dp[a]** = amount a-তে min coin',
      analogy: 'Wallet-এ fewest coin change — ছোট amount-এর best reuse।',
      realWorld: 'POS change, quota min API call।',
    },
  },
  'binary-search': {
    pattern: 'Binary search',
    en: {
      what: '**Binary Search** finds a target value in a **sorted** array by repeatedly cutting the search space in half.',
      why: 'O(log n) search is fundamental. Interviewers use it to test whether you understand **sorted data** and avoid scanning every element.',
      how: '1) `lo = 0`, `hi = length - 1`.\n2) While `lo <= hi`:\n   - `mid = lo + (hi - lo) / 2`\n   - If `nums[mid] == target` → return mid\n   - If target smaller → `hi = mid - 1`\n   - Else → `lo = mid + 1`\n3) Return -1 if not found.\n\n**Key idea:** each step removes half the array.',
      analogy: 'Like finding a word in a dictionary — open middle, go left or right, never read every page.',
      realWorld: 'EF Core indexed queries, sorted log timestamps, pagination with sorted IDs.',
    },
    bn: {
      what: '**Binary Search** **sorted** array-তে target খুঁজে — প্রতিবার search area **অর্ধেক** করে।',
      why: 'O(log n) basic — sorted data বোঝা এবং সব element scan না করা।',
      how: '1) `lo`, `hi` দিয়ে middle বের করুন।\n2) target ছোট → বামে, বড় → ডানে।\n3) `lo <= hi` পর্যন্ত।\n\n**মূল কথা:** প্রতি step-এ অর্ধেক বাদ।',
      analogy: 'Dictionary-তে word খোঁজা — middle খুলে left/right, সব page নয়।',
      realWorld: 'Indexed DB query, sorted log search।',
    },
  },
  'sliding-window-unique': {
    pattern: 'Sliding window',
    en: {
      what: '**Longest Substring Without Repeating Characters** — find the max length of a substring where no character repeats.',
      why: 'The #1 sliding window intro question in .NET interviews — tests Dictionary + two indices (left/right).',
      how: '1) `left = 0`, map `char → last index`.\n2) Expand `right`; if char seen inside window, move `left` past last index.\n3) Update map; track `max(right - left + 1)`.\n\nWindow = s[left..right] always has unique chars.',
      analogy: 'A camera frame sliding along a string — if a duplicate appears, jump the left edge past the first copy.',
      realWorld: 'Unique session token windows, deduped log parsing, stream chunk validation.',
    },
    bn: {
      what: '**Longest Substring Without Repeating** — substring-এ কোনো char repeat না, max length।',
      why: 'Sliding window intro #১ — Dictionary + left/right index।',
      how: '1) left=0, char→last index map\n2) right expand; duplicate হলে left jump\n3) max window size track\n\nWindow s[left..right] সবসময় unique।',
      analogy: 'String-এ sliding camera — duplicate এলে left edge jump।',
      realWorld: 'Unique session window, log parse।',
    },
  },
  'subarray-sum-k': {
    pattern: 'Prefix sum + hash map',
    en: {
      what: '**Subarray Sum Equals K** counts how many contiguous subarrays sum to exactly k.',
      why: 'Teaches prefix sum + Dictionary — appears in billing reconciliation and metrics interviews.',
      how: '1) Running `sum`, map `prefixSum → count` (start with {0:1}).\n2) For each num: `sum += num`.\n3) Add `map[sum - k]` to answer (subarrays ending here).\n4) Increment `map[sum]`.\n\nIf prefix at j was sum-k, subarray (j+1..i) sums to k.',
      analogy: 'Running total on a receipt — if current total minus k appeared before, a middle chunk equals k.',
      realWorld: 'Revenue windows matching target, time-series anomaly slices.',
    },
    bn: {
      what: '**Subarray Sum = K** — contiguous subarray কতগুলো sum exactly k।',
      why: 'Prefix sum + Dictionary — billing/metrics interview-এ আসে।',
      how: '1) running sum, map prefix→count\n2) sum += num\n3) count += map[sum-k]\n4) map[sum]++\n\nprefix sum-k আগে থাকলে middle chunk = k।',
      analogy: 'Receipt running total — total-k আগে ছিল মানে middle chunk k।',
      realWorld: 'Revenue window, time-series slice।',
    },
  },
  'majority-element': {
    pattern: 'Boyer-Moore voting',
    en: {
      what: '**Majority Element** — find the value that appears more than ⌊n/2⌋ times (guaranteed to exist).',
      why: 'O(n) O(1) voting algorithm — favorite "optimize from hash map" follow-up question.',
      how: '1) `candidate`, `count = 0`.\n2) For each num: if count==0, candidate=num, count=1; else count += (num==candidate ? 1 : -1).\n3) Return candidate.\n\nIntuition: majority can survive pairing with others.',
      analogy: 'Election: cancel one vote for candidate with one vote against — majority survives cancellation.',
      realWorld: 'Leader election tie-break, dominant SKU detection in streams.',
    },
    bn: {
      what: '**Majority Element** — ⌊n/2⌋-এর বেশি appear (exists guaranteed)।',
      why: 'O(n) O(1) Boyer-Moore — hash map optimize follow-up favorite।',
      how: '1) candidate, count=0\n2) count 0 হলে candidate=n\n3) match হলে +1, না হলে -1\n\nMajority cancel survive করে।',
      analogy: 'Vote cancel — majority শেষে থাকে।',
      realWorld: 'Leader election, dominant SKU detect।',
    },
  },
  'word-break': {
    pattern: 'Dynamic programming',
    en: {
      what: '**Word Break** — can string s be split into space-separated dictionary words?',
      why: 'Classic 1D DP string problem — mid/senior .NET interviews and NLP tokenization discussions.',
      how: '1) `dp[0] = true` (empty string ok).\n2) For i 1..n: dp[i]=true if any j<i has dp[j] true AND s[j..i) in dictionary.\n3) Return dp[n].\n\nState: dp[i] = can prefix length i be segmented?',
      analogy: 'Breaking a long Bengali sentence into valid words — try every cut point, remember which prefixes worked.',
      realWorld: 'Tokenization, URL slug validation, autocomplete segmentation.',
    },
    bn: {
      what: '**Word Break** — s dictionary word দিয়ে segment করা যায় কিনা।',
      why: 'Classic 1D DP string — mid/senior interview + tokenization।',
      how: '1) dp[0]=true\n2) dp[i] true যদি কোনো j-এ dp[j] true ও s[j..i) dict-এ\n3) dp[n] return\n\nState: prefix length i segmentable?',
      analogy: 'Long sentence valid word-এ ভাঙা — cut point try, prefix memo।',
      realWorld: 'Tokenize, slug validate।',
    },
  },
  'lru-cache': {
    pattern: 'System design + data structures',
    en: {
      what: '**LRU Cache** — fixed capacity cache: Get/Put both O(1); evict **least recently used** when full.',
      why: 'Top design + DS question for senior .NET — same idea as `IMemoryCache` with size limits and Redis LRU.',
      how: '1) `Dictionary<key, LinkedListNode>` for O(1) lookup.\n2) `LinkedList` orders MRU at front.\n3) Get: move node to front.\n4) Put: update or insert at front; if over capacity, remove tail from list + map.\n\nInterview tip: explain why doubly-linked list + map achieves O(1).',
      analogy: 'Desk stack: recently used papers on top; when desk full, throw bottom paper away.',
      realWorld: 'IMemoryCache compaction, Redis eviction, HTTP client connection pools.',
    },
    bn: {
      what: '**LRU Cache** — capacity limit; Get/Put O(1); full হলে **least recently used** evict।',
      why: 'Senior .NET design + DS — `IMemoryCache`, Redis LRU same idea।',
      how: '1) Dictionary + LinkedList\n2) MRU front\n3) Get → front\n4) Put full → tail remove\n\nDoubly-linked + map = O(1) explain করুন।',
      analogy: 'Desk paper stack — recent top, full হলে bottom ফেলে।',
      realWorld: 'IMemoryCache, Redis eviction।',
    },
  },
  'generate-parentheses': {
    pattern: 'Backtracking',
    en: {
      what: '**Generate Parentheses** — produce all valid combinations of n pairs of `(` and `)`.',
      why: 'Standard backtracking intro — tests recursion, pruning, and state management in C# interviews.',
      how: '1) DFS with `(open, close, current)`.\n2) Add `(` if open < n.\n3) Add `)` if close < open (never more closes than opens).\n4) When length == 2n, save string.\n\nPrune invalid branches early — classic backtracking rule.',
      analogy: 'Building balanced brackets like stacking plates — never take more closes than opens mid-build.',
      realWorld: 'Test case generation, expression templates, syntax combinatorics.',
    },
    bn: {
      what: '**Generate Parentheses** — n pair valid `()` সব combination।',
      why: 'Backtracking intro — recursion, prune, state management।',
      how: '1) DFS (open, close, cur)\n2) open<n → `(`\n3) close<open → `)`\n4) length 2n → save\n\nInvalid branch early prune।',
      analogy: 'Balanced bracket stack — close open-এর বেশি mid-build নয়।',
      realWorld: 'Test case generate, syntax template।',
    },
  },
};

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
}

function detectKey(title) {
  const t = title.toLowerCase();
  if (t.includes('fizzbuzz')) return 'fizzbuzz';
  if (t.includes('two sum')) return 'two-sum';
  if (t.includes('palindrome')) return 'palindrome';
  if (t.includes('valid anagram')) return 'anagram';
  if (t.includes('parentheses')) return 'parentheses';
  if (t.includes('subarray') || t.includes('kadane')) return 'kadane';
  if (t.includes('climbing stairs')) return 'climbing-stairs';
  if (t.includes('reverse linked')) return 'reverse-list';
  if (t.includes('group anagram')) return 'group-anagrams';
  if (t.includes('shopping cart')) return 'shopping-cart';
  if (t.includes('coin change')) return 'coin-change';
  if (t.includes('binary search') && !t.includes('rotated')) return 'binary-search';
  if (t.includes('longest substring')) return 'sliding-window-unique';
  if (t.includes('subarray sum')) return 'subarray-sum-k';
  if (t.includes('majority element')) return 'majority-element';
  if (t.includes('word break')) return 'word-break';
  if (t.includes('lru cache')) return 'lru-cache';
  if (t.includes('generate parentheses')) return 'generate-parentheses';
  return null;
}

function genericPatch(title, pattern) {
  const name = title.replace(/^\d+\.\s*/, '').split('(')[0].trim();
  return {
    explanation: {
      what: {
        en: `**${name}** — a common .NET interview coding task using the **${pattern}** pattern.`,
        bn: `**${name}** — .NET interview-এ common task, **${pattern}** pattern।`,
      },
      why: {
        en: `Interviewers ask this to see if you can (1) restate the problem, (2) pick the right C# collection/algorithm, (3) handle edge cases, and (4) explain time/space complexity.`,
        bn: `Interview-তে দেখে: problem বোঝা, সঠিক C# tool, edge case, complexity explain।`,
      },
      how: {
        en: `**Step-by-step for beginners:**\n1) **Understand** — write one example input/output.\n2) **Brute force** — describe naive approach and its complexity.\n3) **Optimize** — name the pattern (${pattern}).\n4) **Code** — small methods, meaningful names.\n5) **Test** — empty input, single element, duplicates.\n6) **Complexity** — state Big-O aloud.`,
        bn: `**Beginner steps:**\n1) Example input/output লিখুন।\n2) Brute force + complexity।\n3) Pattern (${pattern}) বলুন।\n4) Clean C# code।\n5) Edge case test।\n6) Big-O বলুন।`,
      },
      analogy: {
        en: `Think of ${name} like following a **recipe card** — each step has a reason; skipping a step gives wrong output.`,
        bn: `${name} = **recipe card** — step skip করলে result ভুল।`,
      },
      realWorld: {
        en: `In .NET jobs, ${name}-style logic appears in service-layer rules, LINQ transformations, and machine tests — not just puzzles.`,
        bn: `.NET job-এ ${name}-type logic service layer, LINQ, machine test-এ আসে।`,
      },
    },
    commonMistakes: [
      { en: 'Starting to code without an example walkthrough.', bn: 'Example walkthrough ছাড়া code শুরু।' },
      { en: 'Not mentioning time/space complexity.', bn: 'Time/space complexity না বলা।' },
    ],
    bestPractices: [
      { en: 'Use meaningful names: `left`, `right`, `seen`, not `i`, `j`, `d`.', bn: 'Meaningful name: `left`, `seen` — `i`, `d` নয়।' },
      { en: 'Handle null/empty input first.', bn: 'Null/empty input আগে handle।' },
    ],
  };
}

function metaPatch(key, title) {
  const m = PROBLEM_META[key];
  if (!m) return null;
  const patch = {
    explanation: {
      what: { en: m.en.what, bn: m.bn.what },
      why: { en: m.en.why, bn: m.bn.why },
      how: { en: m.en.how, bn: m.bn.how },
      analogy: { en: m.en.analogy, bn: m.bn.analogy },
      realWorld: { en: m.en.realWorld, bn: m.bn.realWorld },
    },
    commonMistakes: (m.mistakes || []).map((e, i) => ({
      en: e,
      bn: (m.tips && m.tips[i]) || e,
    })),
    bestPractices: (m.tips || []).map((t) => ({ en: t, bn: t })),
  };
  return patch;
}

const PATTERN_BY_KEYWORD = [
  ['hash map', 'dictionary', 'two sum', 'anagram', 'duplicate', 'group'],
  ['two pointer', 'palindrome', 'container', 'sorted'],
  ['stack', 'parentheses', 'queue using'],
  ['sliding window', 'window'],
  ['binary search', 'search'],
  ['linked list', 'reverse list', 'cycle'],
  ['tree', 'bst', 'inorder', 'level'],
  ['graph', 'bfs', 'dfs', 'islands'],
  ['dynamic', 'dp', 'fibonacci', 'stairs', 'coin', 'robber', 'lcs', 'kadane', 'subarray'],
  ['greedy', 'stock', 'interval'],
  ['heap', 'kth', 'priority'],
  ['trie', 'prefix'],
  ['xor', 'missing'],
  ['business', 'shopping', 'cart', 'decimal'],
  ['linq', 'group', 'pagination', 'skip', 'parse', 'csv', 'validation', 'email'],
];

function guessPattern(title) {
  const t = title.toLowerCase();
  for (const keys of PATTERN_BY_KEYWORD) {
    if (keys.some((k) => t.includes(k))) {
      if (keys[0] === 'hash map') return 'Hash map (Dictionary/HashSet)';
      if (keys[0] === 'two pointer') return 'Two pointers';
      if (keys[0] === 'stack') return 'Stack / Queue';
      if (keys[0] === 'sliding window') return 'Sliding window';
      if (keys[0] === 'binary search') return 'Binary search';
      if (keys[0] === 'linked list') return 'Linked list pointers';
      if (keys[0] === 'tree') return 'Tree traversal';
      if (keys[0] === 'graph') return 'Graph BFS/DFS';
      if (keys[0] === 'dynamic') return 'Dynamic programming';
      if (keys[0] === 'greedy') return 'Greedy / single pass';
      if (keys[0] === 'heap') return 'Heap (PriorityQueue)';
      if (keys[0] === 'trie') return 'Trie (prefix tree)';
      if (keys[0] === 'xor') return 'Bit manipulation (XOR)';
      if (keys[0] === 'business') return 'Business logic (decimal)';
    }
  }
  if (['linq', 'group', 'pagination', 'skip'].some((k) => t.includes(k))) return 'LINQ & collections';
  if (['parse', 'csv', 'validation', 'email'].some((k) => t.includes(k))) return 'String parsing & validation';
  return 'Problem solving';
}

/** Section-specific rich patches */
const SECTION_PATCHES = {
  'interview-framework': {
    explanation: {
      what: {
        en: 'A **repeatable 6-step framework** (Understand → Match → Plan → Implement → Review → Evaluate) for every live coding question in a .NET interview.',
        bn: '**.NET interview coding**-এর জন্য **৬ ধাপের framework** (Understand → Match → Plan → Implement → Review → Evaluate) — প্রতিবার একই।',
      },
      why: {
        en: 'Beginners panic and start typing random code. A framework **slows you down in a good way** — interviewers want to see your thinking, not a silent race to compile.',
        bn: 'Beginner panic করে random code টাইপ করে। Framework **ভালোভাবে slow** করে — interviewer আপনার **thinking** দেখতে চায়, silent typing নয়।',
      },
      how: {
        en: '**U — Understand:** Repeat the question in your own words. Ask: null input? sorted? duplicates?\n\n**M — Match:** Say the pattern: "This is Two Sum → Dictionary."\n\n**P — Plan:** 3–5 bullet steps before code.\n\n**I — Implement:** Clean C#, good names.\n\n**R — Review:** Trace `[2,7,11], target=9` on paper.\n\n**E — Evaluate:** "O(n) time, O(n) space."',
        bn: '**U — Understand:** নিজের ভাষায় প্রশ্ন repeat; null? sorted? duplicate?\n\n**M — Match:** Pattern বলুন: "Two Sum → Dictionary"\n\n**P — Plan:** Code-এর আগে ৩–৫ bullet\n\n**I — Implement:** Clean C#\n\n**R — Review:** Paper-এ example trace\n\n**E — Evaluate:** "O(n) time, O(n) space"',
      },
      analogy: {
        en: 'Like cooking with a **recipe card** — read ingredients first (Understand), pick the right pan (Match), write steps (Plan), then cook (Implement).',
        bn: '**Recipe card**-এর মতো — আগে ingredients (Understand), pan বেছে নিন (Match), step লিখুন (Plan), তারপর cook।',
      },
      realWorld: {
        en: 'Senior .NET developers use the same structure in code reviews and incident debugging — clarify, hypothesize, plan, fix, verify, document impact.',
        bn: 'Senior .NET dev code review/incident-এ same structure — clarify, plan, fix, verify।',
      },
    },
  },
  'pattern-cheat-sheet': {
    explanation: {
      what: {
        en: 'A **pattern cheat sheet** maps problem **keywords** to the right C# tool: Dictionary, two pointers, stack, BFS, DP, etc.',
        bn: '**Pattern cheat sheet** — problem-এর **keyword** দেখে সঠিক C# tool (Dictionary, two pointer, stack, BFS, DP…)।',
      },
      why: {
        en: 'Most interview problems are **variants of 10 patterns**. Recognizing the pattern in 30 seconds saves 15 minutes of wrong approaches.',
        bn: 'বেশিরভাগ problem **১০টা pattern-এর variant** — ৩০ সেকেন্ডে pattern চিনলে ১৫ মিনিট ভুল approach বাঁচে।',
      },
      how: {
        en: 'When you read the question, scan for signals:\n- "pair / duplicate / frequency" → **Dictionary or HashSet**\n- "sorted / palindrome" → **two pointers**\n- "substring / window" → **sliding window**\n- "brackets / undo" → **Stack**\n- "shortest path / levels" → **BFS + Queue**\n- "count ways / longest" → **DP**',
        bn: 'প্রশ্ন পড়ে signal scan:\n- "pair/duplicate" → **Dictionary/HashSet**\n- "sorted/palindrome" → **two pointer**\n- "substring" → **sliding window**\n- "bracket" → **Stack**\n- "shortest path" → **BFS**\n- "count ways" → **DP**',
      },
      analogy: {
        en: 'Like a **doctor\'s triage chart** — fever + cough suggests one treatment, broken bone suggests another. Symptoms → pattern → tool.',
        bn: '**Doctor triage**-এর মতো — symptom দেখে treatment; problem signal → pattern → tool।',
      },
      realWorld: {
        en: 'In ASP.NET services: dedup with HashSet, rate-limit windows, bracket validation in expression parsers — same patterns as interview tasks.',
        bn: 'ASP.NET-এ HashSet dedup, sliding window rate limit — interview pattern-ই production-এ।',
      },
    },
  },
  'string-array-problems': {
    explanation: {
      what: {
        en: '**String and array tasks** — the most common live coding questions for .NET developers (Two Sum, palindrome, anagram, FizzBuzz, etc.).',
        bn: '**String ও array task** — .NET developer interview-এ সবচেয়ে common live coding (Two Sum, palindrome, anagram…)।',
      },
      why: {
        en: 'These test basic C# fluency before API/EF questions. If you fail FizzBuzz or Two Sum, the interview often stops early.',
        bn: 'API/EF-এর আগে basic C# fluency test। FizzBuzz/Two Sum fail করলে interview often early stop।',
      },
      how: {
        en: 'Master this order as a beginner:\n1) FizzBuzz (loops)\n2) Two Sum (Dictionary)\n3) Valid Palindrome (two pointers)\n4) Valid Anagram (frequency)\n5) Remove duplicates (two pointers in-place)\n\nFor each: code it, explain complexity, explain one edge case.',
        bn: 'Beginner order:\n1) FizzBuzz\n2) Two Sum\n3) Palindrome\n4) Anagram\n5) Remove duplicates\n\nপ্রতিটিতে code + complexity + edge case।',
      },
      analogy: {
        en: 'Like learning guitar **chords** before songs — these tasks are the chords of coding interviews.',
        bn: 'Guitar **chords**-এর মতো — interview coding-এর base building blocks।',
      },
      realWorld: {
        en: 'String parsing in controllers, CSV imports, log line processing — same array/string skills.',
        bn: 'Controller string parse, CSV import — same skill।',
      },
    },
  },
  'collection-linq-problems': {
    explanation: {
      what: {
        en: '**Collection and LINQ tasks** test practical .NET skills: grouping, top-N, merging, and **money calculations** with `decimal`.',
        bn: '**Collection ও LINQ task** — group, top-N, merge, **`decimal`** দিয়ে money calculation।',
      },
      why: {
        en: 'Many companies prefer "can you write service-layer logic?" over pure LeetCode hard. Shopping cart and group-by problems mirror real tickets.',
        bn: 'অনেক company LeetCode hard-এর চেয়ে service-layer logic চায় — shopping cart/group-by real ticket-এর মতো।',
      },
      how: {
        en: '**Group anagrams:** sort letters as key → Dictionary.\n**Top K:** count then OrderByDescending.Take(k).\n**Shopping cart:** discount → shipping → tax, always `decimal`.\n\nSay in interview: "I use LINQ for readability here; if performance critical I would use a single-pass loop."',
        bn: '**Group anagrams:** letter sort = key → Dictionary\n**Top K:** count → OrderByDescending.Take(k)\n**Cart:** discount → shipping → tax, `decimal`\n\nInterview-তে LINQ vs loop trade-off বলুন।',
      },
      analogy: {
        en: 'Like organizing a **warehouse** — group same items (anagrams), pick top sellers (top K), calculate invoice total (cart).',
        bn: '**Warehouse** organize — same item group, top seller, invoice total।',
      },
      realWorld: {
        en: 'E-commerce checkout, reporting dashboards, and EF GroupBy projections — direct job skills.',
        bn: 'E-commerce checkout, report dashboard — direct job skill।',
      },
    },
  },
  'big-o-complexity': {
    explanation: {
      what: {
        en: '**Big O notation** describes how runtime or memory **grows** when input size increases — e.g. O(n) doubles work when data doubles.',
        bn: '**Big O** — input বড় হলে time/memory **কত দ্রুত বাড়ে** (যেমন O(n) = data double → work double)।',
      },
      why: {
        en: 'Interviewers ask "can you optimize?" — you need Big O to compare nested loop O(n²) vs Dictionary O(n). Also explains why `List.Contains` in a loop is slow.',
        bn: 'Optimize করতে Big O লাগে — nested loop O(n²) vs Dictionary O(n)। `List.Contains` loop-এ slow কেন explain।',
      },
      how: {
        en: '**Beginner rules:**\n- One loop → O(n)\n- Loop inside loop → O(n²)\n- Halving each step (binary search) → O(log n)\n- Sort → O(n log n)\n\nAlways say **both** time and space. Example: "Dictionary lookup O(1) average, but O(n) extra space for the map."',
        bn: '**Rules:** এক loop O(n), nested O(n²), half each step O(log n), sort O(n log n)। **Time + space** দুটো বলুন।',
      },
      analogy: {
        en: 'O(n) = checking **every house** on a street. O(log n) = **phone book** lookup. O(1) = knowing exactly which drawer a file is in.',
        bn: 'O(n) = street-এ **প্রতি house**। O(log n) = **phone book**। O(1) = exact drawer জানা।',
      },
      realWorld: {
        en: 'Choosing HashSet vs List for Contains, indexing SQL columns, caching — all Big O decisions in production .NET.',
        bn: 'HashSet vs List, SQL index, cache — production Big O decision।',
      },
    },
  },
  'sorting-searching': {
    explanation: {
      what: {
        en: '**Sorting** arranges data in order; **searching** finds an item — binary search requires sorted data and runs in O(log n).',
        bn: '**Sorting** = order; **searching** = খোঁজা — binary search sorted data-তে O(log n)।',
      },
      why: {
        en: 'You will use `Array.Sort` and LINQ `OrderBy` daily. Interviewers want you to **implement binary search** once to prove you understand halves, not magic.',
        bn: '`Array.Sort`, `OrderBy` daily use — binary search **implement** করে half-এর logic prove করুন।',
      },
      how: {
        en: 'Binary search loop invariant: answer is always between `lo` and `hi`.\n- If `nums[mid] < target` → search right half (`lo = mid + 1`)\n- Else → search left half (`hi = mid - 1`)\n\nUse `mid = lo + (hi - lo) / 2` to avoid overflow discussion.',
        bn: 'Answer সবসময় `lo`–`hi` মধ্যে। ছোট → ডানে, বড় → বামে। `mid = lo + (hi-lo)/2`।',
      },
      analogy: {
        en: 'Sorting = arranging books A–Z on a shelf. Binary search = opening the middle of a phone book.',
        bn: 'Sort = bookshelf A–Z। Binary search = phone book middle খোলা।',
      },
      realWorld: {
        en: 'Paged API with sorted IDs, database indexes (B-tree ≈ binary search idea), log timestamp lookup.',
        bn: 'Sorted API pagination, DB index, log lookup।',
      },
    },
  },
  'linked-list-stack-queue': {
    explanation: {
      what: {
        en: '**Linked list** nodes point to next; **stack** = LIFO (last in first out); **queue** = FIFO (first in first out).',
        bn: '**Linked list** = node chain; **stack** LIFO; **queue** FIFO।',
      },
      why: {
        en: 'Reverse list and cycle detection test **pointer thinking**. Stack solves brackets. Queue + BFS comes next in graphs.',
        bn: 'List reverse/cycle = **pointer thinking**। Stack = bracket। Queue = BFS-এর base।',
      },
      how: {
        en: '**Reverse list:** 3 pointers `prev`, `curr`, `next` — flip links one by one.\n**Cycle:** slow (+1 step), fast (+2 steps) — if they meet, cycle exists.\n**Queue from 2 stacks:** push to `in`, pop from `out`, move when `out` empty.',
        bn: '**Reverse:** prev/curr/next flip\n**Cycle:** slow/fast meet = cycle\n**Queue:** 2 stack in/out',
      },
      analogy: {
        en: 'Stack = stack of plates (take top). Queue = cinema line (first come first served). Linked list = treasure hunt with "next clue" addresses.',
        bn: 'Stack = plate stack। Queue = cinema line। Linked list = "next clue" chain।',
      },
      realWorld: {
        en: 'Undo stack in editors, message queues in RabbitMQ, linked structures in low-level memory (less common in daily C#).',
        bn: 'Editor undo stack, RabbitMQ queue।',
      },
    },
  },
  'trees-graphs': {
    explanation: {
      what: {
        en: 'A **tree** has one root and no cycles; a **graph** has nodes and edges (may cycle). **BFS** uses Queue (levels); **DFS** goes deep first.',
        bn: '**Tree** = one root, no cycle; **graph** = node+edge (cycle হতে পারে)। **BFS** Queue; **DFS** deep first।',
      },
      why: {
        en: 'Org charts, file folders, UI components, and dependency graphs are trees/graphs. Mid-level .NET interviews often ask level-order or "is there a path?"',
        bn: 'Org chart, folder, UI tree, dependency graph — mid interview level-order / path question।',
      },
      how: {
        en: '**BFS:** Queue, mark visited, dequeue, enqueue neighbors.\n**DFS:** recurse (or stack) — go deep, backtrack.\n**Level order:** BFS but process queue size at each level.\n\nPick BFS for **shortest path** (unweighted); DFS for **explore all / cycle**.',
        bn: '**BFS:** Queue + visited\n**DFS:** recurse/stack\n**Level:** BFS + level size\n\nShortest → BFS; explore/cycle → DFS',
      },
      analogy: {
        en: 'BFS = ripples in water (nearest first). DFS = exploring one maze path until dead end, then backtrack.',
        bn: 'BFS = পানির ripple। DFS = maze-এ এক path deep, backtrack।',
      },
      realWorld: {
        en: 'Folder traversal, permission inheritance, microservice dependency resolution.',
        bn: 'Folder traverse, permission tree, service dependency।',
      },
    },
  },
  'dynamic-programming': {
    explanation: {
      what: {
        en: '**Dynamic Programming (DP)** saves answers to subproblems so you never recompute the same thing — used for "count ways", "longest", "minimum cost".',
        bn: '**DP** — subproblem-এর answer save, same কাজ repeat নয় — "count ways", "longest", "min cost"।',
      },
      why: {
        en: 'Naive Fibonacci is O(2ⁿ). DP reduces to O(n). Interviewers use DP to test if you can define **state** and **transition**.',
        bn: 'Naive Fibonacci O(2ⁿ) → DP O(n)। **State** ও **transition** define করতে পারেন কিনা test।',
      },
      how: {
        en: '**Steps for beginners:**\n1) Define `dp[i]` meaning in one sentence.\n2) Write recurrence (how dp[i] relates to smaller indices).\n3) Base case (dp[0], dp[1]).\n4) Fill bottom-up OR memoize top-down.\n\nExample stairs: `dp[i] = dp[i-1] + dp[i-2]` (ways to reach step i).',
        bn: '1) `dp[i]` meaning এক বাক্য\n2) Recurrence\n3) Base case\n4) Bottom-up বা memo\n\nStairs: `dp[i]=dp[i-1]+dp[i-2]`',
      },
      analogy: {
        en: 'Like climbing stairs and **writing on each step** how many ways you could reach it — don\'t recount from ground every time.',
        bn: 'Stairs-এ **প্রতি step-এ** way count লিখে রাখা — ground থেকে আবার count নয়।',
      },
      realWorld: {
        en: 'Resource allocation, pricing tiers, caching computed reports — anywhere overlapping sub-calculations appear.',
        bn: 'Resource allocation, pricing tier — overlapping calculation।',
      },
    },
  },
  'advanced-patterns': {
    explanation: {
      what: {
        en: '**Sliding window** maintains a range `[left,right]`; **heap** keeps top K; **Trie** stores strings by prefix for fast prefix search.',
        bn: '**Sliding window** range `[left,right]`; **heap** top K; **Trie** prefix search।',
      },
      why: {
        en: 'Mid/senior .NET interviews ask substring problems (window), "Kth largest" (heap), and autocomplete-style questions (Trie).',
        bn: 'Mid/senior: substring (window), Kth largest (heap), autocomplete (Trie)।',
      },
      how: {
        en: '**Window:** expand `right` until invalid, shrink `left` until valid, update answer.\n**Top K:** min-heap size K — if heap bigger than K, pop smallest.\n**Trie:** each node has `Dictionary<char, Node>` children.',
        bn: '**Window:** right expand, left shrink\n**Top K:** min-heap size K\n**Trie:** char → child map',
      },
      analogy: {
        en: 'Sliding window = a **movable camera frame** on a long string. Heap = keeping only the **K tallest** people in a crowd.',
        bn: 'Window = string-এ **চলমান frame**। Heap = **K tallest** রাখা।',
      },
      realWorld: {
        en: 'Rate limiting windows, streaming top-N metrics, search autocomplete in admin UIs.',
        bn: 'Rate limit window, top-N metric, search autocomplete।',
      },
    },
  },
  'csharp-data-structures': {
    explanation: {
      what: {
        en: '**C# BCL collections** mapped to classic data structures — Dictionary, HashSet, Stack, Queue, PriorityQueue, List — and when to pick each in a live interview.',
        bn: '**C# BCL collection** → classic data structure map — Dictionary, HashSet, Stack, Queue, PriorityQueue — interview-তে কখন কোনটা।',
      },
      why: {
        en: '.NET interviews expect you to use built-in types, not implement a hash table from scratch. Choosing the wrong type (List.Contains in a loop) is a common fail signal.',
        bn: '.NET interview-তে BCL type expected — ভুল type (loop-এ List.Contains) common fail signal।',
      },
      how: {
        en: 'Memorize: **pair/count → Dictionary**; **exists/dedup → HashSet**; **brackets/RPN → Stack**; **shortest path → Queue BFS**; **top K → PriorityQueue**; **build output → List**.',
        bn: '**pair/count → Dictionary**; **exists → HashSet**; **bracket → Stack**; **shortest path → Queue**; **top K → PriorityQueue**; **output → List**।',
      },
      analogy: {
        en: 'Like a **toolbox** — screwdriver vs hammer; each collection is a tool for a specific job.',
        bn: '**Toolbox**-এর মতো — screwdriver vs hammer; প্রতি collection এক job।',
      },
      realWorld: {
        en: 'ASP.NET services use the same types: HashSet for dedup, Dictionary for caches, Queue for background work.',
        bn: 'ASP.NET-এ HashSet dedup, Dictionary cache, Queue background work — same types।',
      },
    },
  },
  'dsa-by-structure': {
    explanation: {
      what: {
        en: '**Practice buckets** grouped by data structure — all Dictionary problems, all Stack problems — so you recognize the pattern instantly.',
        bn: '**Structure অনুযায়ী bucket** — সব Dictionary problem একসাথে — pattern instantly চিনুন।',
      },
      why: {
        en: 'When you see "valid parentheses", you should think Stack in under 5 seconds. Structure-first study builds that reflex.',
        bn: '"Valid parentheses" দেখলে ৫ সেকেন্ডে Stack — structure-first study reflex বানায়।',
      },
      how: {
        en: 'Each week pick one bucket: Week 1 Dictionary/HashSet, Week 2 Stack/Queue, Week 3 trees/graphs, Week 4 DP + LINQ. Code 2–3 problems per bucket in C#.',
        bn: 'প্রতি week এক bucket: Week 1 Dictionary, Week 2 Stack/Queue, Week 3 tree/graph, Week 4 DP+LINQ — bucket-এ ২–৩ problem C#।',
      },
      analogy: {
        en: 'Like sorting your **flashcards by color** — red = hash map, blue = stack — faster recall under pressure.',
        bn: '**Flashcard color sort** — red = hash map, blue = stack — pressure-এ দ্রুত recall।',
      },
      realWorld: {
        en: 'Production code also clusters by structure: parsers use stacks, caches use dictionaries, schedulers use queues.',
        bn: 'Production: parser → stack, cache → dictionary, scheduler → queue।',
      },
    },
  },
  'linq-machine-test': {
    explanation: {
      what: {
        en: '**LINQ and collection tasks** common in .NET machine tests: GroupBy, OrderBy, Top N, SelectMany, Skip/Take pagination.',
        bn: '**.NET machine test**-এ common LINQ: GroupBy, OrderBy, Top N, SelectMany, Skip/Take pagination।',
      },
      why: {
        en: 'Mid-level .NET roles often test "can you transform in-memory data like a service method?" — not just LeetCode hard.',
        bn: 'Mid-level .NET role "service method-এর মতো data transform?" test করে — শুধু LeetCode hard নয়।',
      },
      how: {
        en: 'Readability: LINQ chain with meaningful names. Performance: mention single-pass Dictionary alternative. Always know deferred vs immediate (ToList forces execution).',
        bn: 'Readability: LINQ chain; performance: single-pass Dictionary mention; deferred vs immediate (ToList execute) জানুন।',
      },
      analogy: {
        en: 'LINQ is like **Excel pivot tables** on in-memory objects — group, filter, sort without manual loops.',
        bn: 'LINQ = in-memory object-এ **Excel pivot** — group, filter, sort।',
      },
      realWorld: {
        en: 'Reporting APIs, admin dashboards, and unit tests on service-layer aggregation logic.',
        bn: 'Report API, admin dashboard, service aggregation unit test।',
      },
    },
  },
  'dotnet-coding-patterns': {
    explanation: {
      what: {
        en: '**.NET-specific coding patterns**: CSV parsing, email validation, decimal money, pagination, null guards — typical mid-level machine test tasks.',
        bn: '**.NET-specific pattern**: CSV parse, email validate, decimal money, pagination, null guard — mid-level machine test।',
      },
      why: {
        en: 'These tasks prove you can write production-quality C# — not just algorithm trivia. Interviewers watch naming, edge cases, and decimal vs double.',
        bn: 'Production-quality C# proof — naming, edge case, decimal vs double watch করা হয়।',
      },
      how: {
        en: 'Template: validate input → parse/transform → compute with decimal where money → return record/DTO. Use StringBuilder for large strings, TryParse instead of Parse.',
        bn: 'Template: validate → parse → decimal compute → record return; StringBuilder, TryParse।',
      },
      analogy: {
        en: 'Like a **checkout form** — validate email, parse line items, calculate tax with correct rounding.',
        bn: '**Checkout form** — email validate, line parse, tax decimal rounding।',
      },
      realWorld: {
        en: 'Import pipelines, invoice services, API input validation in ASP.NET controllers.',
        bn: 'Import pipeline, invoice service, ASP.NET validation।',
      },
    },
  },
  'study-path-dsa-csharp': {
    explanation: {
      what: {
        en: 'A **4-week study path** combining Problem Solving, Algorithms, and this C# DSA module for .NET interview readiness.',
        bn: '**৪ সপ্তাহ study path** — Problem Solving + Algorithms + C# DSA module .NET interview ready।',
      },
      why: {
        en: 'Random LeetCode grinding wastes time. Following handbook order builds foundations before trees/graphs/DP.',
        bn: 'Random LeetCode time waste — handbook order foundation আগে tree/graph/DP।',
      },
      how: {
        en: 'Week 1: arrays + Dictionary (Problem Solving). Week 2: Stack/Queue + two pointers. Week 3: trees/graphs (Algorithms). Week 4: LINQ + .NET tasks (this module). 45 min/day: read → code → explain complexity.',
        bn: 'Week 1: array+Dictionary; Week 2: Stack+two pointer; Week 3: tree/graph; Week 4: LINQ+.NET task; ৪৫ min/day।',
      },
      analogy: {
        en: 'Like a **gym program** — leg day, push day — structure beats random exercises.',
        bn: '**Gym program** — leg day, push day — structure random exercise-এর চেয়ে ভালো।',
      },
      realWorld: {
        en: 'Matches how teams onboard: basics → web → data → then system design and coding screens.',
        bn: 'Team onboard flow match: basics → web → data → system design + coding।',
      },
    },
  },
};

function escapeTemplate(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function emitPatchEntry(slugKey, patch) {
  const lines = [`  '${slugKey}': {`];
  for (const field of ['problem', 'example', 'approach', 'solution', 'complexity']) {
    if (patch[field]?.en || patch[field]?.bn) {
      lines.push(`    ${field}: {`);
      lines.push(`      en: \`${escapeTemplate(patch[field].en || '')}\`,`);
      lines.push(`      bn: \`${escapeTemplate(patch[field].bn || '')}\`,`);
      lines.push('    },');
    }
  }
  if (patch.explanation) {
    lines.push('    explanation: {');
    for (const [field, val] of Object.entries(patch.explanation)) {
      lines.push(`      ${field}: {`);
      lines.push(`        en: \`${escapeTemplate(val.en)}\`,`);
      lines.push(`        bn: \`${escapeTemplate(val.bn)}\`,`);
      lines.push('      },');
    }
    lines.push('    },');
  }
  if (patch.commonMistakes?.length) {
    lines.push('    commonMistakes: [');
    for (const m of patch.commonMistakes) {
      lines.push(`      { en: \`${escapeTemplate(m.en)}\`, bn: \`${escapeTemplate(m.bn)}\` },`);
    }
    lines.push('    ],');
  }
  if (patch.bestPractices?.length) {
    lines.push('    bestPractices: [');
    for (const b of patch.bestPractices) {
      lines.push(`      { en: \`${escapeTemplate(b.en)}\`, bn: \`${escapeTemplate(b.bn)}\` },`);
    }
    lines.push('    ],');
  }
  lines.push('  },');
  return lines.join('\n');
}

function buildTaskPatch(title, english, bangla) {
  const s = slug(title);
  const key = detectKey(title);
  const pattern = guessPattern(title);
  const base = key ? metaPatch(key, title) : null;
  const generic = genericPatch(title, pattern);
  const clarity = getTaskClarity(s, title, english, bangla, pattern);
  const merged = { ...(base || generic), ...clarity };
  if (base?.explanation) merged.explanation = base.explanation;
  else if (generic.explanation) merged.explanation = generic.explanation;
  if (base?.commonMistakes) merged.commonMistakes = base.commonMistakes;
  if (base?.bestPractices) merged.bestPractices = base.bestPractices;
  if (!base && generic.commonMistakes) merged.commonMistakes = generic.commonMistakes;
  if (!base && generic.bestPractices) merged.bestPractices = generic.bestPractices;
  if (clarity.solution && base?.explanation?.how) {
    merged.solution = {
      en: `${clarity.solution.en}\n\n**Detailed steps:**\n${base.explanation.how.en}`,
      bn: `${clarity.solution.bn}\n\n**বিস্তারিত:**\n${base.explanation.how.bn}`,
    };
  }
  return merged;
}

// Collect tasks from source files
function extractTasksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const tasks = [];
  const blockRe = /\{\s*title:\s*'(\d+\.[^']+)'[\s\S]*?english:\s*'((?:\\'|[^'])*)'[\s\S]*?bangla:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    tasks.push({
      title: m[1],
      english: m[2].replace(/\\'/g, "'"),
      bangla: m[3].replace(/\\'/g, "'"),
    });
  }
  return tasks;
}

const root = path.join(__dirname, '..', 'src', 'data');
const allTasks = [
  ...extractTasksFromFile(path.join(root, 'problemSolving.ts')),
  ...extractTasksFromFile(path.join(root, 'algorithms.ts')),
  ...extractTasksFromFile(path.join(root, 'csharpProblems.ts')),
];

const entries = [];

for (const [id, patch] of Object.entries(SECTION_PATCHES)) {
  entries.push(emitPatchEntry(id, patch));
}

for (const task of allTasks) {
  entries.push(emitPatchEntry(slug(task.title), buildTaskPatch(task.title, task.english, task.bangla)));
}

const file = `import type { HandbookSection } from './types';

/** Beginner-friendly bilingual patches for Problem Solving, Algorithms & C# DSA modules. Regen: node scripts/generate-coding-module-patches.mjs */
export const codingModulePatches: Record<string, Partial<HandbookSection>> = {
${entries.join('\n')}
};
`;

fs.writeFileSync(OUT, file, 'utf8');
console.log(`Wrote ${Object.keys(SECTION_PATCHES).length} section + ${allTasks.length} task patches → ${OUT}`);
