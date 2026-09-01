import fs from 'fs';

const diagramMap = {
  ASPNET_PIPELINE_DIAGRAM: 'ASPNET_PIPELINE_DIAGRAM',
  WEBAPI_FLOW_DIAGRAM: 'WEBAPI_FLOW_DIAGRAM',
  JWT_FLOW_DIAGRAM: 'JWT_FLOW_DIAGRAM',
  DI_FLOW_DIAGRAM: 'DI_FLOW_DIAGRAM',
  DI_LIFETIMES_DIAGRAM: 'DI_LIFETIMES_DIAGRAM',
  EF_DBCONTEXT_DIAGRAM: 'EF_DBCONTEXT_DIAGRAM',
  CACHE_ASIDE_DIAGRAM: 'CACHE_ASIDE_DIAGRAM',
  CQRS_DIAGRAM: 'CQRS_DIAGRAM',
  CLEAN_ARCH_DIAGRAM: 'CLEAN_ARCH_DIAGRAM',
  ASYNC_FLOW_DIAGRAM: 'ASYNC_FLOW_DIAGRAM',
  REPOSITORY_PATTERN_DIAGRAM: 'REPOSITORY_PATTERN_DIAGRAM',
  LINQ_DEFERRED_DIAGRAM: 'LINQ_DEFERRED_DIAGRAM',
  GC_GENERATIONS_DIAGRAM: 'GC_GENERATIONS_DIAGRAM',
  SOLID_DIAGRAM: 'SOLID_DIAGRAM',
  MIDDLEWARE_CHAIN_ASCII: 'MIDDLEWARE_CHAIN_ASCII',
};

// [slug, titleEn, whatEn, whatBn, whyEn, whyBn, howEn, howBn, analogyEn, analogyBn, realWorldEn, realWorldBn, diagram?, tableEn?, tableBn?, mistake1en, mistake1bn, mistake2en, mistake2bn, bp1en, bp1bn, bp2en, bp2bn]
const patchData = [
  // basics 2-4
  ['loop-control-foreach-vs-for', 'Loop Control: foreach vs for',
    '**foreach** iterates collections read-only via IEnumerator. **for** gives index control for modification, skipping, or backward deletion.',
    '**foreach** collection read-only iterate করে IEnumerator দিয়ে। **for** index control দেয় — modify, skip, backward delete।',
    'Wrong loop choice causes InvalidOperationException (modify during foreach) or O(n²) performance when searching inside loops.',
    'ভুল loop InvalidOperationException (foreach-এ modify) বা loop-এ search করলে O(n²) performance trap।',
    'Default to foreach for reading. Use backward for loop when removing items: `for (int i = list.Count - 1; i >= 0; i--)`. Use for when you need index steps (`i += 3`).',
    'পড়ার জন্য foreach default। item remove: backward for loop। index step লাগলে for (`i += 3`)।',
    'foreach is like a conveyor belt — you watch items pass, you cannot rearrange the belt mid-run. for is like walking a shelf with a step counter — you choose which slot to pull.',
    'foreach = conveyor belt — চলাকালীন rearrange করা যায় না। for = shelf-এ step counter — কোন slot pull করবেন বেছে নেন।',
    'Removing expired sessions from a List during cleanup: backward for loop works; foreach + Remove throws at runtime in production.',
    'Expired session List থেকে remove: backward for কাজ করে; foreach + Remove production-এ runtime exception।',
    null,
    '| Scenario | Loop | Why |\n| :--- | :--- | :--- |\n| Print all items | foreach | Clean |\n| Remove items | for backward | No index shift bug |\n| Every 3rd update | for | Flexible step |',
    '| Scenario | Loop | কেন |\n| :--- | :--- | :--- |\n| সব print | foreach | Clean |\n| Remove | for backward | Index bug নয় |\n| প্রতি ৩য় update | for | Flexible step |',
    'Modifying a collection inside foreach (InvalidOperationException).', 'foreach-এ collection modify — InvalidOperationException।',
    'Using List.Contains inside a loop (O(n²)).', 'Loop-এ List.Contains — O(n²) trap।',
    'Use foreach by default for readability.', 'Default foreach readability-র জন্য।',
    'When deleting, loop backward with for.', 'Delete করলে backward for loop।',
  ],
  ['list-vs-dictionary-performance-mapping', 'List vs Dictionary Performance',
    '**List<T>** is an ordered dynamic array — search is O(n). **Dictionary<K,V>** uses hashing for O(1) average lookup by key.',
    '**List<T>** ordered dynamic array — search O(n)। **Dictionary<K,V>** hash দিয়ে key lookup O(1) average।',
    'Using List.Find or Contains in hot paths with thousands of items destroys performance. Dictionary is built for repeated ID lookups.',
    'হাজার হাজার item-এ List.Find/Contains hot path নষ্ট করে। বারবার ID lookup-এ Dictionary।',
    'Use List when order matters or you iterate all items once. Use Dictionary when you lookup by key repeatedly. Use HashSet for uniqueness checks only.',
    'Order গুরুত্বপূর্ণ বা সব item iterate — List। বারবার key lookup — Dictionary। শুধু unique check — HashSet।',
    'List is a numbered bookshelf — finding book #847 means scanning from the start. Dictionary is a catalog number system — you jump directly to the shelf.',
    'List = numbered bookshelf — #847 খুঁজতে শুরু থেকে scan। Dictionary = catalog — সরাসরি shelf-এ jump।',
    'User permission checks on every API call: Dictionary<userId, Role> beats scanning a List of 50k users per request.',
    'প্রতি API call-এ permission check: 50k user List scan নয়, Dictionary<userId, Role>।',
    null,
    '| | List | Dictionary |\n| :--- | :--- | :--- |\n| Lookup | O(n) | O(1) avg |\n| Order | Yes | No |\n| Duplicates | Values OK | Unique keys |',
    '| | List | Dictionary |\n| :--- | :--- | :--- |\n| Lookup | O(n) | O(1) avg |\n| Order | Yes | No |\n| Duplicate | Value OK | Unique key |',
    'List.Contains in a loop (O(n²)).', 'Loop-এ List.Contains — O(n²)।',
    'Dictionary[key] without TryGetValue (KeyNotFoundException).', 'TryGetValue ছাড়া Dictionary[key] — exception।',
    'Use TryGetValue for safe Dictionary reads.', 'Dictionary-এ TryGetValue safe read।',
    'Use HashSet when you only need uniqueness.', 'শুধু unique লাগলে HashSet।',
  ],
  ['tuples-delegates-func-concept', 'Tuples, Delegates & Func',
    '**ValueTuple** groups multiple return values without a class. **Delegate** is a type-safe method pointer. **Func** and **Action** are built-in delegate shortcuts.',
    '**ValueTuple** class ছাড়া multiple value return। **Delegate** type-safe method pointer। **Func/Action** built-in delegate shortcut।',
    'Creating a DTO class for every two-value return is ceremony. Delegates enable callbacks, LINQ, and event-driven code.',
    'দুই value return-এ class বানানো ceremony। Delegate callback, LINQ, event-এ লাগে।',
    'Return `(int id, string name)` from methods. Store methods in `Func<int, bool>` variables. Use `Action` for void callbacks.',
    'Method থেকে `(int id, string name)` return। `Func<int, bool>`-এ method store। void callback-এ Action।',
    'Tuple is a labeled envelope with multiple papers inside — no need for a full filing cabinet (class). Delegate is a phone number you can pass so someone else calls the method later.',
    'Tuple = labeled envelope — filing cabinet (class) লাগে না। Delegate = phone number — পরে call করার জন্য pass করা।',
    'LINQ `.Where(x => x > 5)` uses Func under the hood. OrderService returns `(bool ok, string error)` instead of throwing for business validation.',
    'LINQ `.Where(x => x > 5)` ভিতরে Func। OrderService business validation-এ `(bool ok, string error)` return — throw নয়।',
    null,
    '| Type | Signature | Use |\n| :--- | :--- | :--- |\n| Action | void | Fire-and-forget |\n| Func<T> | returns T | LINQ, factories |\n| ValueTuple | (a, b) | Multi-return |',
    '| Type | Signature | Use |\n| :--- | :--- | :--- |\n| Action | void | Fire-and-forget |\n| Func<T> | T return | LINQ, factory |\n| ValueTuple | (a, b) | Multi-return |',
    'Using Tuple class instead of ValueTuple (extra heap allocation).', 'ValueTuple-এর বদলে Tuple class — extra allocation।',
    'Multicast delegate without knowing invocation order.', 'Multicast delegate order না জেনে — unpredictable।',
    'Prefer ValueTuple for lightweight multi-return.', 'Multi-return-এ ValueTuple।',
    'Use Func/Action instead of custom delegate types when possible.', 'Custom delegate-এর বদলে Func/Action।',
  ],
];

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function genPatch(row) {
  const [slug, title, whatEn, whatBn, whyEn, whyBn, howEn, howBn, analogyEn, analogyBn, realWorldEn, realWorldBn, diagram, tableEn, tableBn, m1e, m1b, m2e, m2b, b1e, b1b, b2e, b2b] = row;
  let out = `  '${slug}': {\n    id: '${slug}',\n    explanation: {\n`;
  out += `      what: { en: '${esc(whatEn)}', bn: '${esc(whatBn)}' },\n`;
  out += `      why: { en: '${esc(whyEn)}', bn: '${esc(whyBn)}' },\n`;
  out += `      how: { en: '${esc(howEn)}', bn: '${esc(howBn)}' },\n`;
  out += `      analogy: { en: '${esc(analogyEn)}', bn: '${esc(analogyBn)}' },\n`;
  out += `      realWorld: { en: '${esc(realWorldEn)}', bn: '${esc(realWorldBn)}' },\n`;
  out += `    },\n`;
  if (diagram) out += `    diagram: ${diagram},\n`;
  if (tableEn) {
    out += `    comparisonTable: {\n      en: \`${esc(tableEn)}\`,\n      bn: \`${esc(tableBn)}\`,\n    },\n`;
  }
  out += `    commonMistakes: [\n      { en: '${esc(m1e)}', bn: '${esc(m1b)}' },\n      { en: '${esc(m2e)}', bn: '${esc(m2b)}' },\n    ],\n`;
  out += `    bestPractices: [\n      { en: '${esc(b1e)}', bn: '${esc(b1b)}' },\n      { en: '${esc(b2e)}', bn: '${esc(b2b)}' },\n    ],\n  },\n`;
  return out;
}

console.log(genPatch(patchData[0]));
