export const basicsData = {
  id: 'basics',
  title: 'Fundamentals: Arrays & Loops',
  description: 'Mastering the core building blocks of C# for efficient data manipulation and iteration.',
  sections: [
    {
      topic: "Arrays: Types & Methods",
      english: "Arrays in C# come in three flavors: Single-dimensional, Multi-dimensional, and Jagged. The System.Array class provides numerous static methods for sorting, searching, and manipulating these structures.",
      bangla: "C# এ মূলত ৩ ধরনের অ্যারে থাকে: সিঙ্গেল, মাল্টি-ডাইমেনশনাল এবং জ্যাগড (অ্যারের ভেতর অ্যারে)। এছাড়া System.Array ক্লাস আমাদের অনেক রেডিমেড মেথড দেয় যা দিয়ে অ্যারে সর্টিং বা সার্চিং খুব সহজে করা যায়।",
      details: `
### 1. The Three Array Types
- **Single-Dimensional**: Standard flat list (\`int[]\`).
- **Multi-Dimensional (Rectangular)**: A fixed grid where every row has the same number of columns (\`int[,]\`).
- **Jagged Arrays**: An array of arrays where each sub-array can be a different length (\`int[][]\`).

### 2. Common Array Properties
- **Length**: Total number of elements across all dimensions.
- **Rank**: Number of dimensions (e.g., 1 for single, 2 for 2D).

### 3. Essential System.Array Methods
| Method | Description | Example |
| :--- | :--- | :--- |
| **Sort()** | Sorts elements in ascending order. | \`Array.Sort(myArray)\` |
| **Reverse()** | Reverses the order of elements. | \`Array.Reverse(myArray)\` |
| **Clear()** | Sets a range of elements to zero/null. | \`Array.Clear(myArray, 0, 2)\` |
| **Copy()** | Copies one array into another. | \`Array.Copy(source, target, count)\` |
| **IndexOf()** | Returns index of the first occurrence. | \`Array.IndexOf(arr, value)\` |
| **Find()** | Returns first item matching a predicate. | \`Array.Find(arr, x => x > 10)\` |
      `,
      commonMistakes: [
        "Confusing Multi-dimensional [ , ] with Jagged [ ][ ] syntax.",
        "Attempting to Use Array.Sort() on complex objects without implementing IComparable.",
        "Using Array.Resize() frequently (It creates a brand new array, which is slow)."
      ],
      bestPractices: [
        "Use Jagged arrays for performance (they are often faster as they avoid certain runtime checks).",
        "Use 'Array.Fill()' to quickly populate an array with a default value.",
        "Use 'Array.Empty<T>()' instead of creating a 'new T[0]' to save memory allocations."
      ],
      interviewQs: [
        {
          q: "Explain the memory layout difference between Rectangular and Jagged arrays.",
          a: "Rectangular int[,] is a single contiguous block in memory — the runtime allocates rows x cols x sizeof(T) bytes in one allocation. Jagged int[][] is an array of references: the outer array holds pointers, and each inner array is a separate heap object. Jagged arrays often have better CPU cache performance on row-by-row access and avoid the extra dimension-index calculation that rectangular arrays require.",
          bangla: "Rectangular অ্যারে একটি contiguous ব্লকে থাকে, Jagged আলাদা heap অবজেক্ট — তাই row-by-row access এ Jagged দ্রুত।"
        },
        {
          q: "Difference between IndexOf() and Find()?",
          a: "Array.IndexOf() searches for a specific value by equality and returns its zero-based position — you must already know the exact value. Array.Find() accepts a predicate (Func<T, bool>) and returns the first element satisfying the condition. Use IndexOf for exact-value lookups, Find when the search criteria is a condition on the element's properties.",
          bangla: "IndexOf নির্দিষ্ট value খোঁজে, Find শর্ত (predicate) দিয়ে খোঁজে — সরাসরি value জানলে IndexOf, শর্ত থাকলে Find।"
        },
        {
          q: "How do you sort an array of custom Objects?",
          a: "Two options: implement IComparable<T> on the object to define its default sort order, then call Array.Sort(arr) directly. Or pass a comparison delegate to the overload: Array.Sort(arr, (a, b) => a.Name.CompareTo(b.Name)). For multi-key sorts, chain comparisons inside the lambda. LINQ's OrderBy is also a clean alternative when you need a sorted projection without modifying the original array.",
          bangla: "IComparable implement করুন অথবা Sort-এ lambda দিন — LINQ OrderBy ব্যবহার করলে original array অপরিবর্তিত থাকে।"
        }
      ],
      practice: "Declare a Jagged array where the 1st row has 2 items and the 2nd row has 5 items. Then use Array.Sort() on the second row.",
      code: `// --- 1. Multi-dimensional (Rectangular) ---
int[,] grid = new int[3, 2]; // 3 rows, 2 columns FIXED

// --- 2. Jagged (Array of Arrays) ---
int[][] jagged = new int[2][];
jagged[0] = new int[3]; // First row size 3
jagged[1] = new int[10]; // Second row size 10

// --- 3. Power Methods ---
int[] nums = { 5, 2, 8, 1 };
Array.Sort(nums);    // Result: { 1, 2, 5, 8 }
Array.Reverse(nums); // Result: { 8, 5, 2, 1 }

// Binary Search (Array MUST be sorted first)
int index = Array.BinarySearch(nums, 5);`
    },
    {
      topic: "Loop Control: 'foreach' vs 'for'",
      english: "'foreach' is for safety and readability—it prevents collection modification. 'for' gives you control over the index, allowing for skip-steps or item modification.",
      bangla: "সবসময় মনে রাখবেন: শুধু ডাটা পড়ার জন্য 'foreach' ভালো কারণ এতে ভুল হওয়ার চান্স কম। কিন্তু ডাটা পরিবর্তন বা ইনডেক্স নিয়ে কাজ করতে হলে 'for' লুপ ব্যবহার করতে হবে।",
      details: `
### Choosing the Right Loop
- **foreach (Read-Only)**: It uses an \`IEnumerator\`. If you try to remove an item while looping, C# will throw an exception to protect the data integrity.
- **for (Manual Control)**: Since you manage the \`i\` index, you can go backward, skip every 2nd item, or safely remove items (if you iterate backward).

| Scenario | Recommended Loop | Why? |
| :--- | :--- | :--- |
| Printing a list | **foreach** | Clean & simple |
| Removing items | **for (Backward)** | Prevents index shifting bugs |
| Updating every 3rd item | **for** | Flexible step index (\`i += 3\`) |
      `,
      commonMistakes: [
        "Modifying a collection inside a 'foreach' loop (InvalidOperationException).",
        "Off-by-one errors in 'for' loops (using <= instead of <).",
        "Using 'foreach' when you need the current index (use 'for' instead of manual counter)."
      ],
      bestPractices: [
        "Use 'foreach' by default for cleaner code.",
        "When deleting items, always loop BACKWARDS: `for (int i = list.Count - 1; i >= 0; i--)`.",
        "Avoid nested loops (O(n^2)) for large datasets."
      ],
      interviewQs: [
        {
          q: "Why can't we modify a collection in a foreach loop?",
          a: "foreach uses the IEnumerator pattern. The enumerator reads a _version counter stamped on the collection at the start of iteration. Any structural change (Add or Remove) increments that counter. When MoveNext() detects the version mismatch, it throws InvalidOperationException to prevent unpredictable iteration behavior — you might skip or double-process elements if modification were allowed mid-loop.",
          bangla: "_version counter mismatch হলে InvalidOperationException ছোড়া হয় — data integrity রক্ষার জন্য loop চলাকালীন collection পরিবর্তন নিষেধ।"
        },
        {
          q: "What is the Under-the-hood mechanism of a foreach loop?",
          a: "The compiler desugars foreach into: get IEnumerator from GetEnumerator(), then a while loop calling MoveNext() and reading Current, wrapped in a try/finally that calls Dispose() on the enumerator. Any type exposing GetEnumerator() with a Current property and MoveNext() method is foreach-compatible — it does not need to implement IEnumerable<T>. This duck-typing approach is why Span<T> works in foreach despite not implementing the interface.",
          bangla: "foreach আসলে IEnumerator এর MoveNext() ও Current দিয়ে চলে — যে কোনো type এ GetEnumerator() থাকলেই foreach কাজ করে, IEnumerable<T> implement না করলেও।"
        },
        {
          q: "How do you break out of nested loops efficiently?",
          a: "The cleanest C# approach is to extract the nested loops into a separate method and use return — the method returns as soon as the condition is met, and the return is readable and testable. Alternatively, use a bool flag variable checked in each loop condition. Using goto with a label is technically valid but strongly discouraged. Never use exceptions for flow control in nested loops — that is a significant performance and readability mistake.",
          bangla: "সবচেয়ে clean উপায় — আলাদা method এ নিয়ে return করা। Exception দিয়ে flow control করা performance এবং readability উভয়ের জন্যই ভুল।"
        }
      ],
      practice: "Write a loop that removes all even numbers from a List<int> correctly.",
      code: `List<int> data = new List<int> { 1, 2, 3, 4, 5 };

// SAFE: Removing items backward
for (int i = data.Count - 1; i >= 0; i--) {
    if (data[i] % 2 == 0) data.RemoveAt(i);
}

// ERROR: This will crash at runtime!
/*
foreach (var item in data) {
    if (item == 3) data.Remove(item);
}
*/`
    },
    {
      topic: "List vs Dictionary: Performance Mapping",
      english: "Use List<T> for ordered sequences. Use Dictionary<K,V> for fast lookups. A Dictionary lookup is O(1), making it exponentially faster for searching.",
      bangla: "লিস্ট (List) হলো একটি ডাইনামিক লাইব্রেরি। কিন্তু যদি আপনার কাছে লাখ লাখ ডাটা থাকে এবং দ্রুত কিছু খুঁজতে চান, তবে ডিকশনারি (Dictionary) ব্যবহার করুন। ডিকশনারি ইনডেক্সিং এর জন্য ম্যাজিকের মতো কাজ করে।",
      details: `
### The Power of Key-Value Pairs
- **List<T> Search**: If you have 1 million items, a list search (\`.Find\`) might have to look at all 1 million items (O(n)).
- **Dictionary Search**: Using a unique key, it calculates a 'Hash' and jumps directly to the memory address (O(1)).

| Feature | List<T> | Dictionary<K,V> | HashSet<T> |
| :--- | :--- | :--- | :--- |
| **Lookup** | Slow \`O(n)\` | Fast \`O(1)\` | Fast \`O(1)\` |
| **Duplicates** | Allowed | Unique Keys | Unique Values |
| **Ordering** | Maintained | Unordered | Unordered |
      `,
      commonMistakes: [
        "Using List.Contains() in a loop (O(n^2) performance trap).",
        "Not checking Key exists in Dictionary (use TryGetValue).",
        "Using the wrong Key type (Keys should be immutable, like string or int)."
      ],
      bestPractices: [
        "Use **HashSet<T>** if you only care about uniqueness and speed, not ordering.",
        "Use **Dictionary** any time you need to 'Find' an object by an ID repeatedly.",
        "Use **List** if the order of items is the most important thing."
      ],
      interviewQs: [
        {
          q: "How is a List different from an Array internally?",
          a: "An Array has a fixed size determined at creation. A List<T> wraps an internal array that doubles in capacity (starting at 4, then 8, 16, 32...) when it fills up — the doubling triggers an Array.Copy to a larger backing array. The amortized cost of append is O(1). For known fixed sizes, an Array is more memory-efficient. For dynamic growth, List is the right tool — just consider calling the constructor overload with an estimated initial capacity to avoid reallocations.",
          bangla: "Array সাইজ fixed, List ভেতরে array দ্বিগুণ করে বাড়ায় — capacity আগে দিলে reallocation কমে এবং performance ভালো হয়।"
        },
        {
          q: "What happens when two keys generate the same Hash? (Collision)",
          a: "A hash collision is resolved by chaining. In .NET's Dictionary, each bucket maintains a linked list of Entry structs. On a collision, the new entry is appended to that chain. Lookup walks the chain comparing full keys by equality. When the load factor exceeds a threshold (around 0.72), the dictionary rehashes — all entries are redistributed into a new larger bucket array. In .NET 9+, Dictionary uses an improved Robin Hood hashing algorithm to minimize worst-case chain lengths.",
          bangla: "Collision হলে bucket এ linked list chain তৈরি হয় — load factor 0.72 ছাড়ালে dictionary rehash করে, .NET 9+ এ Robin Hood hashing আরো উন্নত।"
        },
        {
          q: "When is a List faster than a Dictionary?",
          a: "For very small collections (fewer than 10-15 elements), the overhead of hashing and bucket lookup can exceed a simple sequential scan of a contiguous array. A List is also faster when you need to iterate all elements in insertion order — Dictionary iteration has indirection through bucket arrays and is cache-unfriendly. For sorted searches on small data, a sorted List with BinarySearch is also competitive. Use Dictionary when repeat keyed lookups outweigh the hash computation overhead.",
          bangla: "ছোট collection (১০-১৫ element এর কম) এ List দ্রুত — সব element iterate করতে List ভালো, কিন্তু বারবার key দিয়ে খুঁজতে Dictionary।"
        }
      ],
      practice: "Create a Dictionary that maps Employee IDs to their Names and retrieve a name without causing an exception. Also, demonstrate how to iterate through a Dictionary using a loop.",
      code: `// --- List<T> Advanced Examples ---
var fruits = new List<string> { "Apple", "Banana" };
fruits.Insert(0, "Mango"); // Insert at specific index
fruits.RemoveAll(f => f.StartsWith("A")); // Remove with condition
bool exists = fruits.Exists(f => f == "Banana");

// --- Dictionary<K, V> Advanced Examples ---
var stock = new Dictionary<string, int> {
    { "Laptop", 5 },
    { "Mouse", 20 }
};

// Iterating through a Dictionary (Bangla: ডিকশনারি লুপ করার নিয়ম)
foreach (KeyValuePair<string, int> item in stock) {
    Console.WriteLine($"Item: {item.Key}, Quantity: {item.Value}");
}

// Update or Add (Bangla: থাকলে আপডেট করবে, না থাকলে অ্যাড করবে)
stock["Keyboard"] = 15;

// Safely getting value
if (stock.TryGetValue("Laptop", out int qty)) {
    Console.WriteLine($"Laptops in stock: {qty}");
}`
    },
    {
      topic: "Tuples, Delegates & Func Concept",
      english: "Tuples allow grouping multiple values without a class. Delegates are pointers to methods, while Func and Action are pre-defined delegates that make functional programming easier.",
      bangla: "ট্যাপল (Tuple) দিয়ে কোনো ক্লাস ছাড়াই একাধিক ভ্যালু রিটার্ন করা যায়। ডেলিগেট (Delegate) হলো মেথডের পয়েন্টার। আর Func/Action হলো আধুনিক C# এর শর্টকাট ডেলিগেট যা কোডকে অনেক ক্লিন করে।",
      details: `
### 1. ValueTuples
Used for returning multiple values from a method without creating a \`struct\` or \`class\`.
- **Syntax**: \`(int id, string name) user = (1, "Karim");\`

### 2. Delegates (The Basics)
A delegate is a type that represents references to methods with a particular parameter list and return type.

### 3. Func vs Action vs Predicate
- **Action**: A delegate for a method that returns **void**.
- **Func**: A delegate for a method that **returns a value**.
- **Predicate**: A delegate that returns a **bool** (used for filtering).
      `,
      commonMistakes: [
        "Using Tuples for large data models (use a 'class' or 'record' for complex API models).",
        "Not null-checking delegates before calling them (use 'myDelegate?.Invoke()').",
        "Confusing parameter order in Func<T1, T2, TResult> (The LAST type is always the return type)."
      ],
      bestPractices: [
        "Use Tuples for internal private methods to avoid 'Class Explosion'.",
        "Use 'Action' and 'Func' instead of defining custom delegates whenever possible.",
        "Use Lambda expressions (() => ...) with Func/Action for highly readable code."
      ],
      interviewQs: [
        {
          q: "Difference between Action and Func?",
          a: "Action<T> delegates represent methods that accept parameters but return void. Func<T, TResult> delegates represent methods that accept parameters and return a value — the last generic type argument is always the return type. For example: Action<string> points to void DoWork(string s), while Func<string, int> points to int GetLength(string s). Both are built-in generic delegate types that eliminate the need to declare custom delegate types.",
          bangla: "Action ভয়েড রিটার্ন করে, Func ভ্যালু রিটার্ন করে — Func এর শেষ generic type সবসময় return type।"
        },
        {
          q: "When should you use a Tuple instead of a Ref/Out parameter?",
          a: "Use a Tuple when a method naturally produces multiple related return values — (bool Success, string Error) is cleaner than void Check(out bool success, out string error) because the caller does not need to pre-declare variables. Tuples are ideal for private/internal methods. For public API surfaces, a dedicated result record or DTO is more self-documenting. Avoid out parameters in async methods entirely — they are not supported.",
          bangla: "Tuple পরিষ্কার — variable আগে declare করতে হয় না এবং async method এও কাজ করে। Public API তে DTO বেশি readable।"
        },
        {
          q: "What is a Multicast Delegate?",
          a: "A multicast delegate holds an invocation list — multiple method references chained together using += to add and -= to remove handlers. When invoked, it calls every method in registration order. If the delegate has a return type, only the last method's return value is retained (all others are discarded). Events in C# are built on multicast delegates but enforce that only the declaring class can invoke the full invocation list, preventing external callers from raising the event.",
          bangla: "+= দিয়ে একাধিক method চেইন করা যায় — সব method order অনুযায়ী call হয়, return type থাকলে শেষ method এর value রাখা হয়।"
        }
      ],
      practice: "Write a Func that takes two numbers and returns their sum, and an Action that prints a welcome message.",
      code: `// --- 1. ValueTuples (Multiple Returns) ---
public (int id, string name) GetUser() {
    return (101, "Karim");
}
var user = GetUser();
Console.WriteLine(user.name); // Access by name

// --- 2. Func (Returns Value) ---
// Func<Input1, Input2, ReturnType>
Func<int, int, int> add = (a, b) => a + b;
int result = add(5, 10); // 15

// --- 3. Action (Returns Void) ---
Action<string> log = message => Console.WriteLine(message);
log("Hello Programmers!");

// --- 4. Predicate (Boolean check) ---
Predicate<int> isEven = x => x % 2 == 0;
bool check = isEven(4); // true`
    }
  ],
  revisionSummary: `
- **Arrays & Lists**: Fixed vs Dynamic sizing. Loop backward when deleting.
- **Dictionary/HashSet**: Use for O(1) high-performance lookups.
- **Tuples**: Lightweight grouping for returning multiple values.
- **Func/Action**: Modern way to pass methods as parameters (Delegates).
  `,
  summary: "অ্যারে এবং লুপ হলো প্রোগ্রামের ফাউন্ডেশন। ডাটা স্টোর করা এবং প্রসেস করার জন্য লিস্ট, ডিকশনারি এবং ডেলিগেটসের ওপর পরিষ্কার ধারণা রাখা জরুরি।"
};
