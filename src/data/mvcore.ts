export const mvcoreData = {
  id: 'mvcore',
  title: "ASP.NET MVC / ASP.NET Core Interview Mastery",
  description:
    "Complete interview-focused guide for ASP.NET MVC and ASP.NET Core architecture, security, and API readiness.",
  sections: [
    {
      topic: "MVC Lifecycle + Middleware Pipeline + Routing",
      english:
        "ASP.NET Core request processing starts from Kestrel, passes through middleware, then routing selects endpoint/controller action. In MVC, the flow includes model binding, action execution, result execution, and response write-back. Understand the exact order because interviewers often ask where authentication, exception handling, and logging happen.",
      bangla:
        "ASP.NET Core এ রিকোয়েস্ট প্রথমে সার্ভারে আসে, তারপর Middleware Pipeline দিয়ে যায়, এরপর Routing ঠিক করে কোন Controller/Action চলবে। MVC লাইফসাইকেলের মধ্যে Model Binding, Action Execution, Result Execution থাকে। ইন্টারভিউতে সাধারণত জিজ্ঞেস করে কোন স্টেপে Auth, Validation, Exception Handling হয়।",
      details: `
### Architecture Flow (High Level)
1. **Client Request** -> **Kestrel/IIS Reverse Proxy**
2. **Middleware Pipeline** (\`UseExceptionHandler\` -> \`UseRouting\` -> \`UseAuthentication\` -> \`UseAuthorization\` -> \`MapControllers/MapRazorPages\`)
3. **Routing Match** (Conventional or Attribute)
4. **Model Binding + Validation**
5. **Filters** (Authorization -> Resource -> Action -> Exception -> Result)
6. **Controller/Action বা Razor Page Handler Execute**
7. **Response Serialization / View Rendering**

### Conventional vs Attribute Routing
| Type | Example | Best Use Case |
| :--- | :--- | :--- |
| **Conventional** | \`{controller=Home}/{action=Index}/{id?}\` | Traditional MVC apps |
| **Attribute** | \`[Route("api/v1/orders/{id}")]\` | API-first, explicit endpoint design |

### Interview Scenario
- "Order API endpoint returning 404 in production but works locally."
  Check: route template mismatch, \`MapControllers()\` missing, environment-specific path base.
      `,
      commonMistakes: [
        "Putting UseAuthentication() after endpoint mapping, causing anonymous user context.",
        "Mixing route tokens incorrectly in attribute templates.",
        "Assuming middleware order does not matter.",
      ],
      bestPractices: [
        "Keep pipeline order explicit and minimal.",
        "Use attribute routing for APIs and conventional for classic MVC when helpful.",
        "Document endpoint contracts with clear versioned paths.",
      ],
      interviewQs: [
        {
          q: "Explain complete request flow from middleware to action result.",
          a: "Request enters Kestrel → exception handler middleware wraps everything → HTTPS enforcement → routing middleware maps the URL to an endpoint → CORS → authentication populates HttpContext.User → authorization evaluates policies → endpoint middleware executes → inside MVC: model binding maps request data to action parameters → model validation runs → authorization filters → resource filters → action filters (OnActionExecuting) → action method executes → action filters (OnActionExecuted) → result filters → result executes (JSON serialization or view rendering) → response flows back through middleware in reverse order.",
          bangla: "Kestrel → Exception Handler → Routing → Auth → Authorization → MVC Binding → Filters → Action → Result — এই order মুখস্থ থাকলে interview এ এগিয়ে থাকবেন।"
        },
        {
          q: "Why does middleware ordering matter in ASP.NET Core?",
          a: "Each middleware wraps all subsequent ones — request flows inward in registration order and the response flows outward in reverse. If UseAuthentication() is registered after UseAuthorization(), the identity claims are never populated when authorization runs and every request appears anonymous. If exception handling is not the outermost middleware, errors in downstream middleware escape uncaught. Ordering errors are silent security or reliability bugs — the app compiles without warnings but behaves incorrectly at runtime.",
          bangla: "Request registration order এ যায়, response উল্টো দিকে ফেরে — UseAuthentication() UseAuthorization() এর আগে না হলে সব request anonymous দেখায়।"
        },
        {
          q: "When do you choose conventional routing over attribute routing?",
          a: "Conventional routing suits traditional MVC applications with many controllers that all follow a predictable {controller}/{action}/{id?} pattern — configuration is in one place and controllers stay clean. Attribute routing is preferred for Web APIs where each endpoint needs a specific, semantic URI (/api/v1/orders/{orderId}/items) that does not map naturally to the controller/action naming. For mixed apps with both UI and API controllers, use both: attribute routing on API controllers, conventional on MVC controllers.",
          bangla: "API তে attribute routing explicit এবং semantic, MVC app এ conventional routing cleaner — mixed app এ দুটোই use করা যায়।"
        },
      ],
      practice:
        "Design pipeline order for a secure API with global exception handling, JWT auth, and CORS.",
      code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

var app = builder.Build();
app.UseExceptionHandler("/Home/Error");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapControllers();
app.Run();`,
    },
    {
      topic: "Filters + Model Binding + Validation",
      english:
        "Filters provide cross-cutting hooks around MVC execution. Model binding maps request data (route, query, form, body) to action parameters. Validation uses DataAnnotations and ModelState. In APIs, [ApiController] auto-validates and returns 400 with validation details.",
      bangla:
        "Filters দিয়ে Action এর আগে/পরে common logic বসানো যায় (যেমন logging, authorization)। Model Binding request থেকে data নিয়ে method parameter এ বসায়। Validation এর জন্য DataAnnotation এবং ModelState ব্যবহার হয়। [ApiController] থাকলে invalid model এ automatic 400 return করে।",
      details: `
### Filter Execution Order
1. **Authorization Filter**
2. **Resource Filter**
3. **Action Filter**
4. **Exception Filter** (on exceptions)
5. **Result Filter**

### Practical Interview Scenario
- "You need to log execution time for every API action without duplicating code."
  Use a custom **Action Filter** or middleware depending on needed context.

### Validation Strategy
- DTO-level validation with attributes like \`[Required]\`, \`[StringLength]\`
- Custom validation via \`IValidatableObject\` for cross-field rules
- Return consistent \`ValidationProblemDetails\` payload
      `,
      commonMistakes: [
        "Using entity models directly in APIs instead of DTOs.",
        "Ignoring ModelState.IsValid in non-ApiController endpoints.",
        "Putting business validation only in controller actions.",
      ],
      bestPractices: [
        "Use DTOs and FluentValidation or DataAnnotations for clean contracts.",
        "Centralize repeated concerns with filters.",
        "Keep domain validation in service/domain layer for consistency.",
      ],
      interviewQs: [
        {
          q: "Difference between model binding and model validation?",
          a: "Model binding runs first — it reads request data from route values, query strings, form fields, and the JSON body and maps them to action parameter types. If binding fails (incompatible type, malformed JSON), the parameter is null or default and binding errors are recorded in ModelState. Model validation then runs against the bound values to check declared constraints ([Required], [StringLength], [Range]). With [ApiController], a failed ModelState automatically short-circuits the action and returns HTTP 400 with ValidationProblemDetails before your action code runs.",
          bangla: "Binding আগে (request data → C# object), তারপর validation (annotation check) — [ApiController] থাকলে invalid ModelState এ auto 400, action code চলে না।"
        },
        {
          q: "When should you use a filter vs middleware?",
          a: "Use a filter when the logic is specific to MVC and needs access to action context, action parameters, or the result object — logging action execution time, requiring a custom request header specific to API operations, or wrapping controller exceptions with action-level context. Use middleware when the concern is infrastructure-level and applies to all requests including static files, health checks, and non-MVC routes — CORS, compression, authentication, global logging, and rate limiting all belong in middleware.",
          bangla: "Filter MVC context জানে (action parameter, result), Middleware শুধু HttpContext জানে — infrastructure level কাজ (CORS, Auth, Logging) middleware তে।"
        },
        {
          q: "How does [ApiController] improve validation behavior?",
          a: "Without [ApiController], you must explicitly check if (!ModelState.IsValid) return BadRequest(ModelState) in every action. With [ApiController], the framework automatically checks ModelState before the action executes and returns a 400 ValidationProblemDetails response if invalid — your action code only runs with valid input. It also enables binding source inference ([FromBody] for complex types, [FromRoute] for route params, [FromQuery] for query strings) so you do not need to explicitly annotate every parameter.",
          bangla: "ModelState auto check করে, boilerplate if (!ModelState.IsValid) লেখা লাগে না — binding source inference ও করে দেয়।"
        },
      ],
      practice:
        "Implement a custom ActionFilter that rejects requests if a required header is missing.",
      code: `public class RequireTenantHeaderFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.HttpContext.Request.Headers.ContainsKey("X-Tenant-Id"))
            context.Result = new BadRequestObjectResult("Missing X-Tenant-Id");
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}`,
    },
    {
      topic: "MVC vs Razor Pages vs Web API + State Management",
      english:
        "MVC fits complex UI with controllers/views. Razor Pages is page-focused and simpler for CRUD. Web API is best for client-server decoupled apps and mobile/SPA backends. For state, ViewBag/ViewData are short-lived per request, TempData survives one redirect, Session persists per user session.",
      bangla:
        "MVC বড় UI driven অ্যাপের জন্য ভালো। Razor Pages ছোট/মাঝারি page-centric ফিচারে দ্রুত কাজ দেয়। Web API মোবাইল/SPA/backend integration এর জন্য best। ViewBag/ViewData শুধু current request এ থাকে, TempData redirect পর্যন্ত থাকে, Session user session জুড়ে থাকে।",
      details: `
### Selection Guide
| Option | Choose When | Avoid When |
| :--- | :--- | :--- |
| **MVC** | Complex workflows, multiple reusable views | Very simple pages only |
| **Razor Pages** | Page-centric CRUD modules | Heavy API integrations |
| **Web API** | SPA/mobile/microservices backend | Server-rendered HTML needed |

### Practical Interview Scenario
- "You are building Admin Panel + Mobile App backend."
  - Admin UI -> **MVC or Razor Pages**
  - Mobile backend -> **Web API**
  - Shared business logic -> service layer

### State Management Quick Notes
- **ViewBag/ViewData**: request scope only
- **TempData**: next request (usually redirects)
- **Session**: server-side user state, use sparingly
      `,
      commonMistakes: [
        "Storing large objects in Session causing memory pressure.",
        "Using ViewBag for strongly typed critical data.",
        "Choosing MVC for API-only projects.",
      ],
      bestPractices: [
        "Use ViewModel for strongly typed views.",
        "Prefer stateless APIs; use session only when required.",
        "Keep UI concerns and API concerns separated.",
      ],
      interviewQs: [
        {
          q: "Razor Pages vs MVC: real project decision criteria?",
          a: "Choose Razor Pages when building page-centric features where each URL maps cleanly to a single page with its own PageModel handler — admin CRUD forms, simple dashboards, registration flows. Each page is self-contained with less ceremony than MVC. Choose MVC when you have complex controller logic serving multiple views, need reusable partial views across many pages, or are building a traditional layered web application with many shared view components. For new projects mixing both is common: Razor Pages for simple CRUD, MVC for complex UI flows.",
          bangla: "Razor Pages page-centric CRUD এ simple, MVC complex multi-view workflow এ ভালো — নতুন project এ দুটো mix করা common।"
        },
        {
          q: "TempData vs Session differences?",
          a: "TempData persists for exactly one subsequent request — it is designed for Post-Redirect-Get patterns where you redirect after a form POST and display a success or error message on the next page. It is automatically deleted after being read. Session persists for the entire user session (until browser close or server-side timeout) and is server-side storage. Use TempData for ephemeral one-time messages. Use Session sparingly for user-level state like shopping cart data, but avoid it in REST APIs as it introduces statefulness and breaks horizontal scaling.",
          bangla: "TempData একটা redirect পর্যন্ত, Session পুরো user session — REST API তে stateful Session avoid করুন, horizontal scaling ভেঙে দেয়।"
        },
        {
          q: "When will Web API be a better fit than MVC?",
          a: "When the client is a SPA framework (React, Angular, Vue), a mobile app (iOS/Android), or another backend service — anything that consumes JSON rather than server-rendered HTML. Web API is also the right choice for microservices, when the same data must be consumed by multiple different client types simultaneously (web and mobile from one API), or when you need stateless cacheable responses that scale horizontally without session affinity.",
          bangla: "SPA/mobile/microservices backend এ Web API — JSON consumer থাকলে server-rendered HTML এর MVC দরকার নেই।"
        },
      ],
      practice:
        "Refactor an MVC form flow to use TempData for PRG (Post-Redirect-Get) success messages.",
      code: `TempData["SuccessMessage"] = "Order created successfully";
return RedirectToAction("Details", new { id = order.Id });

// In target action/view:
// var msg = TempData["SuccessMessage"]?.ToString();`,
    },
    {
      topic: "Authentication, Authorization, Claims, Roles, Policies",
      english:
        "Authentication verifies identity; authorization checks permissions. Claims-based identity is central in ASP.NET Core. Roles are coarse-grained, policies are flexible and preferred for business rules. Use [Authorize] with policy names for readable security.",
      bangla:
        "Authentication বলে user কে, আর Authorization বলে user কী করতে পারবে। Claims হচ্ছে user info/permission token। Roles সাধারণ permission group, Policies আরো flexible এবং enterprise app এ বেশি ব্যবহার হয়।",
      details: `
### Security Model
- **Authentication**: Who are you?
- **Authorization**: What can you do?
- **Claims**: key-value identity facts (\`department=Finance\`, \`scope=orders.read\`)
- **Roles**: grouped permissions (\`Admin\`, \`Manager\`)
- **Policies**: rule-based access requirements

### Practical Interview Scenario
- "Only Finance managers can approve invoices above 50,000."
  Implement a custom policy with claim + threshold requirement handler.
      `,
      commonMistakes: [
        "Using roles for every fine-grained rule, causing role explosion.",
        "Relying only on UI hiding instead of backend authorization checks.",
        "Forgetting to protect newly added endpoints with [Authorize].",
      ],
      bestPractices: [
        "Use policy-based auth for business rules.",
        "Centralize security constants and policy names.",
        "Audit claims issuance source and token lifetime.",
      ],
      interviewQs: [
        {
          q: "Claims-based authorization কীভাবে roles থেকে আলাদা?",
          a: 'Roles are coarse-grained group memberships (Admin, Manager) — they tell you what group a user belongs to but carry no semantic context about specific permissions. Claims are key-value facts about a user (department=Finance, approved_limit=50000, country=BD) that can encode precise business-specific permissions. Policy-based authorization evaluates claims with custom handler logic, enabling rules like "Finance department only, and only for invoices above 50K" — a rule that cannot be expressed with a single role name without creating an explosion of granular roles.',
          bangla: "Role group membership, Claim user সম্পর্কে specific fact — 'Finance department এ 50K+ invoice approve' এই rule একটি Role এ express করা যায় না।"
        },
        {
          q: "How do custom policy handlers work?",
          a: 'Create a class implementing IAuthorizationRequirement (the requirement definition — typically empty, serving as a marker). Create another class implementing AuthorizationHandler<TRequirement> and override HandleRequirementAsync. Inside the handler, inspect context.User claims, call context.Succeed(requirement) if conditions pass, context.Fail() to explicitly deny, or do nothing to abstain (allowing other handlers to decide). Register the handler in DI, define the policy in AddAuthorization, and reference it with [Authorize(Policy = "PolicyName")]. Handlers are fully unit-testable in isolation.',
          bangla: "IAuthorizationRequirement + AuthorizationHandler — claims check করে context.Succeed() বা context.Fail() call করো। Handler DI তে register করুন।"
        },
        {
          q: "Difference between [AllowAnonymous] and missing [Authorize]?",
          a: "[AllowAnonymous] explicitly overrides any [Authorize] attribute at the controller level or any globally applied fallback authorization policy — the action will never be challenged regardless of global policy configuration. Missing [Authorize] means no explicit authorization check is applied to that specific action, but a globally configured fallback policy (AddAuthorization with a DefaultPolicy) could still block it. [AllowAnonymous] is the guaranteed override for public endpoints; simply missing [Authorize] is ambiguous and depends on the global policy configuration.",
          bangla: "[AllowAnonymous] সব global policy override করে গ্যারান্টিড public — missing [Authorize] global policy উপর depend করে, ambiguous।"
        },
      ],
      practice:
        "Create a policy requiring both role Admin and claim country=BD.",
      code: `builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("BangladeshAdmin", policy =>
        policy.RequireRole("Admin")
              .RequireClaim("country", "BD"));
});

[Authorize(Policy = "BangladeshAdmin")]
public IActionResult SecureDashboard() => View();`,
    },
    {
      topic: "JWT Auth, Cookie Auth, Identity Framework, CORS, Versioning",
      english:
        "JWT is ideal for stateless APIs and distributed systems. Cookie auth is common for browser-based MVC apps. ASP.NET Core Identity provides user management, hashing, lockout, and token workflows. CORS controls cross-origin access. API versioning prevents client breakage when contracts evolve.",
      bangla:
        "JWT সাধারণত API/SPA/mobile এর জন্য best কারণ এটি stateless। Cookie auth server-rendered MVC এর জন্য natural choice। Identity Framework দিয়ে user, role, password hash, email confirmation সহজে করা যায়। CORS cross-origin control করে এবং API Versioning backward compatibility বজায় রাখে।",
      details: `
### JWT vs Cookie
| Area | JWT | Cookie |
| :--- | :--- | :--- |
| Best For | SPA/Mobile/API | MVC server-rendered apps |
| Storage | Client storage | Browser cookie |
| Server Session | Usually stateless | Can be stateful |

### Global Exception Handling + Logging + Config
- Use centralized exception middleware for consistent error response.
- Configure structured logging (Serilog/NLog) with correlation IDs.
- Load config from \`appsettings.json\`, environment files, and secrets.
- Use \`appsettings.Development.json\` / \`appsettings.Production.json\`.

### Practical Interview Scenario
- "Production API started failing for v1 mobile clients after deploying v2 changes."
  Use API versioning package, keep v1 controller untouched, deprecate gradually.
      `,
      commonMistakes: [
        "Allowing wildcard CORS with credentials.",
        "Keeping JWT signing keys in source control.",
        "Breaking existing APIs without version negotiation.",
      ],
      bestPractices: [
        "Use HTTPS-only, secure cookies, and short-lived JWT + refresh flow.",
        "Adopt Serilog/NLog structured logs with environment enrichment.",
        "Separate configuration by environment and validate required settings at startup.",
      ],
      interviewQs: [
        {
          q: "JWT vs Cookie Auth: which one and why?",
          a: "JWT for stateless APIs consumed by SPAs, mobile apps, or other backend services — no server-side session storage, scales horizontally, supports cross-domain and cross-service calls. Cookie auth for server-rendered MVC applications — the browser handles cookie transmission automatically, and CSRF protection integrates naturally. For hybrid applications serving both a browser UI and an API (e.g., SPA + backend), configuring both schemes is common: cookie auth for page navigation, JWT for AJAX and API calls.",
          bangla: "JWT stateless API/SPA/mobile এর জন্য, Cookie server-rendered MVC এর জন্য natural — hybrid app এ দুটোই setup করা যায়।"
        },
        {
          q: "How does ASP.NET Core Identity integrate with JWT?",
          a: "Identity manages user creation, password hashing, claims storage, role assignment, lockout, and email confirmation workflows. After a successful login (Identity validates credentials via SignInManager), you read the user's claims from Identity, sign them into a JWT using a secret key, and return the token to the client. Identity does not natively issue JWTs — you add the JWT bearer authentication scheme alongside Identity. Identity handles the user store; JWT bearer middleware handles token validation on each subsequent protected request.",
          bangla: "Identity user manage করে, JWT bearer middleware token validate করে — Identity নিজে JWT issue করে না, দুটো আলাদা concern।"
        },
        {
          q: "How do you enable API versioning without breaking old clients?",
          a: 'Register AddApiVersioning with AssumeDefaultVersionWhenUnspecified = true and ReportApiVersions = true. Decorate controllers with [ApiVersion("1.0")] and [ApiVersion("2.0")]. Deploy v2 while keeping v1 controllers untouched and working. Mark v1 as deprecated with [ApiVersion("1.0", Deprecated = true)] — this adds a Sunset header to responses so clients can detect the deprecation. Communicate a retirement date with sufficient notice. Old clients continue working until the announced retirement date.',
          bangla: "AssumeDefaultVersionWhenUnspecified = true রাখুন, v1 controller untouched রাখুন, Deprecated = true দিয়ে Sunset header যোগ করুন।"
        },
      ],
      practice:
        "Set up two API versions (v1 and v2) and mark v1 as deprecated in Swagger.",
      code: `builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendApp", policy =>
        policy.WithOrigins("https://app.example.com")
              .AllowAnyHeader()
              .AllowAnyMethod());
});`,
    },
  ],
  revisionSummary: `
- **Pipeline First**: Middleware order + routing decide everything downstream.
- **MVC Internals**: Binding, validation, filters, and action execution flow must be clear.
- **Security**: Prefer policy-based auth; choose JWT or Cookie based on client type.
- **Production Readiness**: Global exception handling, logging, CORS, configuration, versioning.
- **Interview Edge**: Explain architecture with scenarios, not only definitions.
  `,
  summary:
    "ASP.NET Core interview এ সফল হতে হলে শুধু framework feature না, end-to-end request flow, security model, configuration strategy, এবং real-world failure handling ব্যাখ্যা করতে পারা জরুরি।",
};
