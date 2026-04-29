export const basicsData = {
  title: 'Fundamentals: Arrays & Loops',
  description: 'Mastering the core building blocks of C# for efficient data manipulation and iteration.',
  sections: [
    {
      topic: "Arrays: Types & Methods",
      english: "Arrays in C# come in three flavors: Single-dimensional, Multi-dimensional, and Jagged. The System.Array class provides numerous static methods for sorting, searching, and manipulating these structures.",
      bangla: "C# এ মূলত ৩ ধরনের অ্যারে থাকে: সিঙ্গেল, মাল্টি-ডাইমেনশনাল এবং জ্যাগড (অ্যারের ভেতর অ্যারে)। এছাড়া System.Array ক্লাস আমাদের অনেক রেডিমেড মেথড দেয় যা দিয়ে অ্যারে সর্টিং বা সার্চিং খুব সহজে করা যায়।",
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
        "Explain the memory layout difference between Rectangular and Jagged arrays.",
        "Difference between IndexOf() and Find()?",
        "How do you sort an array of custom Objects?"
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
      bangla: "সবসময় মনে রাখবেন: শুধু ডাটা পড়ার জন্য 'foreach' ভালো কারণ এতে ভুল হওয়ার চান্স কম। কিন্তু ডাটা পরিবর্তন বা ইনডেক্স নিয়ে কাজ করতে হলে 'for' লুপ ব্যবহার করতে হবে।",
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
        "When deleting items, always loop BACKWARDS: \`for (int i = list.Count - 1; i >= 0; i--)\`.",
        "Avoid nested loops (O(n^2)) for large datasets."
      ],
      interviewQs: [
        "Why can't we modify a collection in a foreach loop?",
        "What is the Under-the-hood mechanism of a foreach loop?",
        "How do you break out of nested loops efficiently?"
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
        "How is a List different from an Array internally?",
        "What happens when two keys generate the same Hash? (Collision)",
        "When is a List faster than a Dictionary?"
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

// Iterating through a Dictionary (Bangla: ডিকশনারি লুপ করার নিয়ম)
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
      bangla: "ট্যাপল (Tuple) দিয়ে কোনো ক্লাস ছাড়াই একাধিক ভ্যালু রিটার্ন করা যায়। ডেলিগেট (Delegate) হলো মেথডের পয়েন্টার। আর Func/Action হলো আধুনিক C# এর শর্টকাট ডেলিগেট যা কোডকে অনেক ক্লিন করে।",
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
        "Use Lambda expressions (\`() => ...\`) with Func/Action for highly readable code."
      ],
      interviewQs: [
        "Difference between Action and Func?",
        "When should you use a Tuple instead of a Ref/Out parameter?",
        "What is a Multicast Delegate?"
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
