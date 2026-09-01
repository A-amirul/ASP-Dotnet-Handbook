/** Bilingual patch content definitions — imported by generate-bilingual-patches.mjs */

export const DIAGRAMS = {
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

/** Compact row: slug, diagram?, what, why, how, analogy, realWorld, tableEn, tableBn, mistakes[2], practices[2] */
function row(
  slug,
  diagram,
  what,
  why,
  how,
  analogy,
  realWorld,
  tableEn,
  tableBn,
  mistakes,
  practices,
) {
  return { slug, diagram, what, why, how, analogy, realWorld, tableEn, tableBn, mistakes, practices };
}

const T = (en, bn) => ({ en, bn });

export const PATCH_ROWS = [
  // ── BASICS ──
  row(
    'loop-control-foreach-vs-for',
    null,
    T(
      '**foreach** iterates collections read-only via `IEnumerator`. **for** gives index control for modification, skipping, or backward deletion.',
      '**foreach** `IEnumerator` দিয়ে collection read-only iterate করে। **for** index control দেয় — modify, skip, backward delete।',
    ),
    T(
      'Wrong loop choice causes `InvalidOperationException` (modify during foreach) or O(n²) when searching inside loops.',
      'ভুল loop-এ `InvalidOperationException` (foreach-এ modify) বা loop-এ search করলে O(n²) trap।',
    ),
    T(
      'Default to foreach for reading. Use backward for when removing: `for (int i = list.Count - 1; i >= 0; i--)`. Use for when you need index steps.',
      'পড়ার জন্য foreach। item remove: backward for। index step লাগলে for।',
    ),
    T(
      'foreach is a conveyor belt — you watch items pass, cannot rearrange mid-run. for is walking a shelf with a step counter.',
      'foreach = conveyor belt — চলাকালীন rearrange যায় না। for = step counter সহ shelf walk।',
    ),
    T(
      'Removing expired sessions from a List: backward for works; foreach + Remove throws at runtime in production.',
      'Expired session List থেকে remove: backward for কাজ করে; foreach + Remove production-এ exception।',
    ),
    `| Scenario | Loop | Why |
| :--- | :--- | :--- |
| Print all items | foreach | Clean syntax |
| Remove items | for backward | No index shift bug |
| Every 3rd update | for | Flexible step |`,
    `| Scenario | Loop | কেন |
| :--- | :--- | :--- |
| সব print | foreach | Clean |
| Remove | for backward | Index bug নয় |
| প্রতি ৩য় update | for | Flexible step |`,
    [
      T('Modifying a collection inside foreach (`InvalidOperationException`).', 'foreach-এ collection modify — `InvalidOperationException`।'),
      T('Using `List.Contains` inside a loop (O(n²)).', 'Loop-এ `List.Contains` — O(n²) trap।'),
    ],
    [
      T('Use foreach by default for readability.', 'Default foreach readability-র জন্য।'),
      T('When deleting, loop backward with for.', 'Delete করলে backward for loop।'),
    ],
  ),
  row(
    'list-vs-dictionary-performance-mapping',
    null,
    T(
      '**List<T>** is an ordered dynamic array — search is O(n). **Dictionary<K,V>** uses hashing for O(1) average lookup by key.',
      '**List<T>** ordered dynamic array — search O(n)। **Dictionary<K,V>** hash দিয়ে key lookup O(1) average।',
    ),
    T(
      'Using `List.Find` or `Contains` in hot paths with thousands of items destroys performance. Dictionary is built for repeated ID lookups.',
      'হাজার item-এ `List.Find`/`Contains` hot path নষ্ট করে। বারবার ID lookup-এ Dictionary।',
    ),
    T(
      'Use List when order matters or you iterate all items once. Use Dictionary for repeated key lookup. Use HashSet for uniqueness checks.',
      'Order গুরুত্বপূর্ণ বা সব iterate — List। বারবার key lookup — Dictionary। unique check — HashSet।',
    ),
    T(
      'List is a numbered bookshelf — finding book #847 means scanning from the start. Dictionary is a catalog — jump directly to the shelf.',
      'List = numbered bookshelf — #847 খুঁজতে scan। Dictionary = catalog — সরাসরি shelf।',
    ),
    T(
      'User permission checks on every API call: `Dictionary<userId, Role>` beats scanning a List of 50k users per request.',
      'প্রতি API call permission: 50k user List scan নয়, `Dictionary<userId, Role>`।',
    ),
    `| | List | Dictionary |
| :--- | :--- | :--- |
| Lookup | O(n) | O(1) avg |
| Order | Yes | No |
| Duplicates | Values OK | Unique keys |`,
    `| | List | Dictionary |
| :--- | :--- | :--- |
| Lookup | O(n) | O(1) avg |
| Order | Yes | No |
| Duplicate | Value OK | Unique key |`,
    [
      T('`List.Contains` in a loop (O(n²)).', 'Loop-এ `List.Contains` — O(n²)।'),
      T('`Dictionary[key]` without `TryGetValue` (KeyNotFoundException).', '`TryGetValue` ছাড়া `Dictionary[key]` — exception।'),
    ],
    [
      T('Use `TryGetValue` for safe Dictionary reads.', 'Dictionary-এ `TryGetValue` safe read।'),
      T('Use HashSet when you only need uniqueness.', 'শুধু unique লাগলে HashSet।'),
    ],
  ),
  row(
    'tuples-delegates-func-concept',
    null,
    T(
      '**ValueTuple** groups multiple return values without a class. **Delegate** is a type-safe method pointer. **Func** and **Action** are built-in delegate shortcuts.',
      '**ValueTuple** class ছাড়া multiple value return। **Delegate** type-safe method pointer। **Func/Action** built-in delegate shortcut।',
    ),
    T(
      'Creating a DTO class for every two-value return is ceremony. Delegates enable callbacks, LINQ, and event-driven code.',
      'দুই value return-এ class ceremony। Delegate callback, LINQ, event-এ লাগে।',
    ),
    T(
      'Return `(int id, string name)` from methods. Store methods in `Func<int, bool>`. Use `Action` for void callbacks.',
      'Method থেকে `(int id, string name)` return। `Func<int, bool>`-এ method store। void callback-এ Action।',
    ),
    T(
      'Tuple is a labeled envelope — no filing cabinet (class) needed. Delegate is a phone number you pass so someone else calls the method later.',
      'Tuple = labeled envelope — class লাগে না। Delegate = phone number — পরে call করার জন্য pass।',
    ),
    T(
      'LINQ `.Where(x => x > 5)` uses Func under the hood. OrderService returns `(bool ok, string error)` for business validation.',
      'LINQ `.Where(x => x > 5)` ভিতরে Func। OrderService validation-এ `(bool ok, string error)` return।',
    ),
    `| Type | Signature | Use |
| :--- | :--- | :--- |
| Action | void | Fire-and-forget |
| Func<T> | returns T | LINQ, factories |
| ValueTuple | (a, b) | Multi-return |`,
    `| Type | Signature | Use |
| :--- | :--- | :--- |
| Action | void | Fire-and-forget |
| Func<T> | T return | LINQ, factory |
| ValueTuple | (a, b) | Multi-return |`,
    [
      T('Using `Tuple` class instead of ValueTuple (extra heap allocation).', 'ValueTuple-এর বদলে Tuple class — extra allocation।'),
      T('Multicast delegate without knowing invocation order.', 'Multicast delegate order না জেনে — unpredictable।'),
    ],
    [
      T('Prefer ValueTuple for lightweight multi-return.', 'Multi-return-এ ValueTuple।'),
      T('Use Func/Action instead of custom delegate types when possible.', 'Custom delegate-এর বদলে Func/Action।'),
    ],
  ),

  // ── MVCORE ──
  row(
    'mvc-lifecycle-middleware-pipeline-routing',
    DIAGRAMS.ASPNET_PIPELINE_DIAGRAM,
    T(
      'An ASP.NET Core request flows through **middleware** (logging, auth, CORS), then **routing** maps URL to endpoint, then **MVC** invokes controller action.',
      'ASP.NET Core request **middleware** (logging, auth, CORS) দিয়ে যায়, **routing** URL endpoint-এ map করে, **MVC** controller action invoke করে।',
    ),
    T(
      'Middleware order matters: exception handler early, auth before endpoints, static files before routing. Wrong order = auth bypass or broken CORS.',
      'Middleware order গুরুত্বপূর্ণ: exception handler আগে, auth endpoint-এর আগে। ভুল order = auth bypass বা broken CORS।',
    ),
    T(
      'Configure in `Program.cs`: `UseExceptionHandler` → `UseHttpsRedirection` → `UseAuthentication` → `UseAuthorization` → `MapControllers`.',
      '`Program.cs`-এ: `UseExceptionHandler` → `UseHttpsRedirection` → `UseAuthentication` → `UseAuthorization` → `MapControllers`।',
    ),
    T(
      'Airport: security → passport → gate → plane. Each station can stop you or pass you forward. Middleware is the same for HTTP.',
      'বিমানবন্দর: security → passport → gate → plane। প্রতিটি station থামাতে বা এগিয়ে পাঠাতে পারে।',
    ),
    T(
      'A `/api/orders/42` GET hits routing, resolves `OrdersController.Get(42)`, model binding fills `id=42`, action returns JSON.',
      '`/api/orders/42` GET routing-এ `OrdersController.Get(42)` resolve, model binding `id=42`, JSON return।',
    ),
    `| Stage | Responsibility | Example |
| :--- | :--- | :--- |
| Middleware | Cross-cutting | Logging, CORS |
| Routing | URL → endpoint | [Route attribute] |
| MVC | Action execution | Controller method |`,
    `| Stage | দায়িত্ব | উদাহরণ |
| :--- | :--- | :--- |
| Middleware | Cross-cutting | Logging, CORS |
| Routing | URL → endpoint | [Route attribute] |
| MVC | Action execution | Controller method |`,
    [
      T('Putting `UseAuthorization` before `UseAuthentication`.', '`UseAuthorization` `UseAuthentication`-এর আগে রাখা।'),
      T('Duplicating auth logic in every controller instead of middleware/filters.', 'প্রতি controller-এ auth duplicate — middleware/filter ব্যবহার করুন।'),
    ],
    [
      T('Document middleware order in a team wiki or comment block.', 'Middleware order team wiki-তে document করুন।'),
      T('Use endpoint routing (`MapControllers`) not legacy MVC route table for APIs.', 'API-তে endpoint routing (`MapControllers`) ব্যবহার করুন।'),
    ],
  ),
  row(
    'filters-model-binding-validation',
    DIAGRAMS.ASPNET_PIPELINE_DIAGRAM,
    T(
      '**Filters** run before/after actions (auth, validation, exception). **Model binding** maps HTTP data to parameters. **Validation** checks `[Required]`, `[Range]`, FluentValidation rules.',
      '**Filters** action-এর আগে/পরে চলে (auth, validation)। **Model binding** HTTP data parameter-এ map। **Validation** `[Required]`, FluentValidation check।',
    ),
    T(
      'Without filters, every action duplicates auth and error handling. Without validation, bad input reaches your database and causes 500s or data corruption.',
      'Filter ছাড়া প্রতি action-এ auth duplicate। Validation ছাড়া bad input database-এ যায় — 500 বা corrupt data।',
    ),
    T(
      'Add `[ApiController]` for automatic 400 on invalid model. Use `IAsyncActionFilter` for logging. Register FluentValidation in DI.',
      '`[ApiController]` invalid model-এ auto 400। `IAsyncActionFilter` logging-এ। FluentValidation DI-তে register।',
    ),
    T(
      'Model binding is a translator at customs — converts JSON/form to C# objects. Validation is the inspector who rejects invalid passports.',
      'Model binding = customs translator — JSON/form C# object-এ। Validation = inspector — invalid reject।',
    ),
    T(
      'POST `/orders` with negative quantity: model binder fills `CreateOrderDto`, `[Range(1,100)]` fails, API returns 400 ProblemDetails without hitting SQL.',
      'POST `/orders` negative quantity: binder `CreateOrderDto` fill, `[Range(1,100)]` fail, 400 ProblemDetails — SQL-এ যায় না।',
    ),
    `| Filter order | Type | Runs |
| :--- | :--- | :--- |
| 1 | Authorization | Before action |
| 2 | Action | Around action |
| 3 | Exception | On error |`,
    `| Filter order | Type | কখন |
| :--- | :--- | :--- |
| 1 | Authorization | Action-এর আগে |
| 2 | Action | Action-এর around |
| 3 | Exception | Error-এ |`,
    [
      T('Trusting client input without server-side validation.', 'Server-side validation ছাড়া client input trust।'),
      T('Using `ModelState.IsValid` manually when `[ApiController]` already handles it.', '`[ApiController]` থাকলেও manually `ModelState.IsValid` — redundant।'),
    ],
    [
      T('Return ProblemDetails (RFC 7807) for validation errors.', 'Validation error-এ ProblemDetails return।'),
      T('Validate at the boundary (DTO), not deep inside domain entities.', 'Domain-এর ভিতরে নয়, boundary (DTO)-তে validate।'),
    ],
  ),
  row(
    'mvc-vs-razor-pages-vs-web-api-state-management',
    DIAGRAMS.WEBAPI_FLOW_DIAGRAM,
    T(
      '**MVC** = controllers + views for server-rendered HTML. **Razor Pages** = page-focused (one .cshtml + PageModel). **Web API** = JSON endpoints, no views. **State**: TempData, Session, or stateless JWT.',
      '**MVC** = controller + view HTML। **Razor Pages** = page-focused। **Web API** = JSON, no view। **State**: TempData, Session, stateless JWT।',
    ),
    T(
      'Choosing MVC for a SPA backend wastes view engine overhead. Using Session for scale-out APIs breaks without sticky sessions or distributed cache.',
      'SPA backend-এ MVC view engine waste। Scale-out API-তে Session sticky session ছাড়া ভেঙে যায়।',
    ),
    T(
      'SPA/mobile → Web API only. Admin CRUD with minimal JS → Razor Pages. Legacy MVC apps → migrate page-by-page to Razor Pages or Blazor.',
      'SPA/mobile → Web API। Admin CRUD minimal JS → Razor Pages। Legacy MVC → page-by-page migrate।',
    ),
    T(
      'MVC is a full restaurant with kitchen (controller) and dining room (view). Web API is takeout only — food in a box (JSON). Razor Pages is a food truck — one window, one menu page.',
      'MVC = restaurant kitchen + dining room। Web API = takeout JSON। Razor Pages = food truck — এক window, এক page।',
    ),
    T(
      'React frontend + .NET backend: Web API with JWT, no Session. Internal admin tool: Razor Pages with cookie auth and TempData for wizard steps.',
      'React + .NET: Web API + JWT, Session নয়। Internal admin: Razor Pages + cookie + TempData wizard।',
    ),
    `| Style | Best for | State |
| :--- | :--- | :--- |
| Web API | SPA, mobile | JWT (stateless) |
| Razor Pages | Server HTML CRUD | Cookie + TempData |
| MVC | Legacy apps | Session (avoid at scale) |`,
    `| Style | Best for | State |
| :--- | :--- | :--- |
| Web API | SPA, mobile | JWT (stateless) |
| Razor Pages | Server HTML CRUD | Cookie + TempData |
| MVC | Legacy | Session (scale-এ avoid) |`,
    [
      T('Using Session for high-traffic APIs behind a load balancer without Redis.', 'Load balancer-এ Session Redis ছাড়া — broken state।'),
      T('Mixing MVC views and Web API in one controller class.', 'এক controller-এ MVC view + Web API mix।'),
    ],
    [
      T('Prefer stateless APIs; store state in client or database.', 'Stateless API prefer; state client/database-এ।'),
      T('Use `[ApiController]` + ProblemDetails for APIs.', '`[ApiController]` + ProblemDetails API-তে।'),
    ],
  ),
  row(
    'authentication-authorization-claims-roles-policies',
    DIAGRAMS.JWT_FLOW_DIAGRAM,
    T(
      '**Authentication** proves who you are (login). **Authorization** decides what you can do. **Claims** are key-value facts (`sub`, `role`). **Roles** group permissions. **Policies** combine claims/rules (`RequireAdmin`).',
      '**Authentication** = কে আপনি (login)। **Authorization** = কী করতে পারবেন। **Claims** = key-value (`sub`, `role`)। **Roles** = permission group। **Policies** = claim/rule combine।',
    ),
    T(
      'Checking `User.IsInRole("Admin")` everywhere couples code to role names. Policies centralize rules and support custom requirements (e.g. must own the resource).',
      'সব জায়গায় `User.IsInRole("Admin")` role name-এ couple। Policy rule centralize করে custom requirement support।',
    ),
    T(
      'Register policies: `options.AddPolicy("CanEditOrder", p => p.RequireClaim("permission", "orders:edit"))`. Use `[Authorize(Policy = "CanEditOrder")]` on actions.',
      'Policy register: `AddPolicy("CanEditOrder", ...)`। Action-এ `[Authorize(Policy = "CanEditOrder")]`।',
    ),
    T(
      'Authentication is showing ID at the door. Authorization is the VIP list — even with valid ID, you may not enter the backstage.',
      'Authentication = door-এ ID দেখানো। Authorization = VIP list — valid ID-তেও backstage নয়।',
    ),
    T(
      'Azure AD issues JWT with claims `roles: ["Manager"]`. Policy `RequireManager` checks claim; controller never hardcodes role string.',
      'Azure AD JWT `roles: ["Manager"]` claim। Policy `RequireManager` check — controller-এ role string hardcode নয়।',
    ),
    `| Concept | Question | Example |
| :--- | :--- | :--- |
| AuthN | Who? | Login, JWT |
| AuthZ | Allowed? | Authorize attribute |
| Claim | Fact about user | sub, email claims |
| Policy | Rule set | RequireAdmin |`,
    `| Concept | প্রশ্ন | উদাহরণ |
| :--- | :--- | :--- |
| AuthN | কে? | Login, JWT |
| AuthZ | Allowed? | Authorize attribute |
| Claim | User fact | sub, email claims |
| Policy | Rule set | RequireAdmin |`,
    [
      T('Confusing authentication failure (401) with authorization failure (403).', '401 (AuthN fail) vs 403 (AuthZ fail) confuse করা।'),
      T('Storing permissions only in JWT without server-side refresh when roles change.', 'Role change হলে JWT-তে permission refresh না করা।'),
    ],
    [
      T('Use policies, not scattered role checks.', 'Scattered role check নয়, policy।'),
      T('Return 401 for missing/invalid token, 403 for valid but insufficient.', 'Invalid token → 401, valid কিন্তু insufficient → 403।'),
    ],
  ),
  row(
    'jwt-auth-cookie-auth-identity-framework-cors-versioning',
    DIAGRAMS.JWT_FLOW_DIAGRAM,
    T(
      '**JWT** = stateless bearer token for APIs. **Cookie auth** = server session in HttpOnly cookie for browser apps. **Identity** = ASP.NET user/role store. **CORS** controls cross-origin browser calls. **API versioning** (`/v1/`, header) avoids breaking clients.',
      '**JWT** = stateless bearer API token। **Cookie** = HttpOnly cookie browser session। **Identity** = user/role store। **CORS** = cross-origin control। **Versioning** = breaking change avoid।',
    ),
    T(
      'JWT in localStorage is XSS-vulnerable. Cookie without SameSite/Secure is CSRF-vulnerable. Missing CORS blocks SPA. Unversioned API breaks mobile apps on deploy.',
      'localStorage JWT XSS risk। Cookie SameSite/Secure ছাড়া CSRF। CORS missing SPA block। Unversioned API deploy-এ mobile break।',
    ),
    T(
      'API: JWT in Authorization header + short expiry + refresh token. Browser MVC: cookie + Identity. Configure CORS for SPA origin only. Version via URL or `Api-Version` header.',
      'API: JWT header + short expiry + refresh। Browser MVC: cookie + Identity। CORS SPA origin only। Version URL/header।',
    ),
    T(
      'JWT is a stamped wristband at a festival — show it at each gate, no central desk. Cookie is a cloakroom ticket — server looks up your coat.',
      'JWT = festival wristband — প্রতি gate-এ show, central desk নয়। Cookie = cloakroom ticket — server lookup।',
    ),
    T(
      'Mobile app uses JWT stored in secure keychain. Blazor WASM calls API with bearer token; CORS allows `https://app.company.com` only.',
      'Mobile JWT secure keychain-এ। Blazor WASM bearer token; CORS শুধু `https://app.company.com`।',
    ),
    `| Auth | Best for | Risk |
| :--- | :--- | :--- |
| JWT | SPA, mobile API | XSS if localStorage |
| Cookie | Server-rendered | CSRF without SameSite |
| Identity | User DB + roles | Must configure correctly |`,
    `| Auth | Best for | Risk |
| :--- | :--- | :--- |
| JWT | SPA, mobile API | localStorage XSS |
| Cookie | Server-rendered | CSRF |
| Identity | User DB | Config গুরুত্বপূর্ণ |`,
    [
      T('Storing JWT in localStorage instead of memory or secure storage.', 'JWT localStorage-এ — XSS risk।'),
      T('CORS `AllowAnyOrigin` with credentials enabled.', 'CORS `AllowAnyOrigin` + credentials — security hole।'),
    ],
    [
      T('Use HttpOnly Secure SameSite cookies for browser auth.', 'Browser auth: HttpOnly Secure SameSite cookie।'),
      T('Version APIs before breaking changes; deprecate old versions with timeline.', 'Breaking change-এর আগে version; পুরনো version timeline-এ deprecate।'),
    ],
  ),
];
