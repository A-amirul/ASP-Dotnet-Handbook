export const apiDocsContent = {
  id: 'apidocs',
  title: 'API Design & Documentation',
  description:
    'Design clean, versioned REST APIs with consistent errors, OpenAPI contracts, and documentation that scales with your team.',
  category: 'ASP.NET Platform',
  chapterNumber: 9,
  sections: [
    {
      id: 'rest-api-design',
      topic: 'REST API Design',
      english:
        'REST treats URLs as resource nouns and HTTP methods as verbs. A well-designed API is predictable: clients guess endpoints correctly, status codes tell the story, and responses stay consistent. Compare REST to RPC-style APIs where every action is a POST to /doSomething — REST scales better for public APIs because HTTP caching, tooling, and developer intuition all work in your favor.',
      bangla:
        'REST-এ URL হলো resource-এর নাম (যেমন `/users`) এবং কাজটি HTTP method দিয়ে বোঝানো হয় (GET = পড়া, POST = তৈরি)। ভালো API predictable — client সহজেই বুঝতে পারে কোন endpoint কী করবে। RPC-style API-তে প্রতিটি action আলাদা POST endpoint (`/createUser`, `/deleteOrder`) — REST public API-তে বেশি maintainable কারণ caching ও standard HTTP semantics কাজ করে।',
      details: `
### Resource naming rules
- Use **plural nouns**: \`/api/v1/orders\`, not \`/api/v1/getOrders\`
- Nest sub-resources: \`/users/{id}/orders\`
- Use query params for filtering, sorting, pagination — not new endpoints

### HTTP method semantics
| Method | Action | Idempotent? | Safe? |
| :--- | :--- | :--- | :--- |
| **GET** | Read | Yes | Yes |
| **POST** | Create | No | No |
| **PUT** | Full replace | Yes | No |
| **PATCH** | Partial update | No* | No |
| **DELETE** | Remove | Yes | No |

### REST vs RPC (when interviewers compare styles)

| Aspect | REST | RPC-style |
| :--- | :--- | :--- |
| URL | Noun: \`/orders/42\` | Verb: \`/orders/cancel\` |
| Action | HTTP method | Often POST body action |
| Caching | GET cacheable by default | Harder to cache |
| Discoverability | Standard conventions | Custom per API |
      `,
      code: `// Resource-based endpoints — predictable and cache-friendly
// GET    /api/v1/users              → list users
// POST   /api/v1/users              → create user
// GET    /api/v1/users/{id}         → get one user
// PUT    /api/v1/users/{id}         → replace user
// PATCH  /api/v1/users/{id}         → partial update
// DELETE /api/v1/users/{id}         → delete user

// Sub-resources
// GET    /api/v1/users/{id}/orders
// POST   /api/v1/users/{id}/orders

// Filtering & pagination via query string
// GET /api/v1/users?status=active&role=admin&skip=20&take=10

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
      [FromQuery] UserFilter filter,
      CancellationToken ct)
  {
    var users = await _userService.GetAllAsync(filter, ct);
    return Ok(users); // 200 OK
  }

  [HttpPost]
  public async Task<ActionResult<UserDto>> CreateUser(
      CreateUserDto dto,
      CancellationToken ct)
  {
    var user = await _userService.CreateAsync(dto, ct);
    return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user); // 201
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<UserDto>> GetUserById(int id, CancellationToken ct)
  {
    var user = await _userService.GetByIdAsync(id, ct);
    return user is null ? NotFound() : Ok(user);
  }
}`,
      codeExplanation: {
        en: '- `CreatedAtAction` returns **201 Created** with a `Location` header pointing to the new resource.\n- Query params (`UserFilter`) keep the URL stable while supporting search.\n- Route constraint `{id:int}` rejects invalid IDs before hitting the service layer.',
        bn: '- `CreatedAtAction` **201 Created** দেয় এবং `Location` header-এ নতুন resource-এর URL দেয়।\n- Query param (`UserFilter`) দিয়ে filter করা যায় URL বদলানো ছাড়াই।\n- `{id:int}` constraint ভুল ID আগেই reject করে।',
      },
      commonMistakes: [
        {
          en: 'Using verbs in URLs: `/api/createUser` or `/api/users/delete/5` instead of `POST /users` and `DELETE /users/5`.',
          bn: 'URL-এ verb ব্যবহার: `/api/createUser` — REST-এ noun + HTTP method ব্যবহার করুন।',
        },
        {
          en: 'Returning 200 OK for every response, including errors — clients cannot distinguish success from failure.',
          bn: 'সব response-এ 200 OK — error-ও 200 দিলে client success আর failure আলাদা করতে পারে না।',
        },
        {
          en: 'Exposing internal database IDs without authorization checks on nested resources.',
          bn: 'Nested resource (`/users/1/orders/99`) access করার আগে ownership verify না করা — security hole।',
        },
      ],
      bestPractices: [
        {
          en: 'Use plural nouns and consistent casing (kebab-case URLs, camelCase JSON).',
          bn: 'Plural noun ও consistent casing (URL kebab-case, JSON camelCase) রাখুন।',
        },
        {
          en: 'Return hypermedia links (HATEOAS) or clear pagination metadata for list endpoints.',
          bn: 'List endpoint-এ pagination metadata বা HATEOAS link দিন — client পরের page খুঁজে পায়।',
        },
        {
          en: 'Design for idempotency: PUT and DELETE should produce the same result if called twice.',
          bn: 'Idempotency মাথায় রাখুন: PUT/DELETE দুবার call করলেও same result হওয়া উচিত।',
        },
      ],
      interviewQs: [
        {
          q: 'What are the principles of RESTful API design?',
          a: 'REST has six constraints: stateless (each request carries full context), client-server separation, uniform interface (resources via URI + standard HTTP verbs), layered system, cacheable responses, and optional code-on-demand. In practice: noun-based URLs, semantic HTTP methods, consistent error shapes, versioning for breaking changes, and status codes that mean something — not always 200.',
          bangla:
            'Stateless, Uniform Interface, Cacheable — interview-এ এই তিনটি সবচেয়ে গুরুত্বপূর্ণ। URL noun, action HTTP method-এ।',
        },
        {
          q: 'REST vs RPC — when would you choose each?',
          a: 'REST fits CRUD-heavy public APIs where HTTP caching, standard tooling, and predictable URLs matter. RPC (gRPC, GraphQL mutations, or POST /doAction) fits internal microservice calls where you need strong typing, streaming, or complex orchestration in one round-trip. Many teams expose REST externally and gRPC internally. The mistake is mixing styles in one public surface without documenting the contract.',
          bangla:
            'Public API-তে REST (caching, standard), internal service-to-service-এ gRPC/RPC (performance, typing) — দুটো mix করলে contract স্পষ্ট রাখুন।',
        },
        {
          q: 'How do you design pagination for a list endpoint?',
          a: 'Accept `page`/`pageSize` or `cursor` query params. Return metadata: totalCount, hasNextPage, nextCursor. Use cursor-based pagination for large tables (infinite scroll) because OFFSET becomes slow at high page numbers. Cap max page size (e.g. 100) to prevent memory abuse. Push filtering to the database with IQueryable, not in-memory after fetching everything.',
          bangla:
            'Cursor pagination বড় table-এ ভালো — OFFSET page 10000-এ slow। max pageSize limit দিন।',
        },
      ],
      practice:
        'Design REST endpoints for a library system: books, authors, and borrow records. Include list, create, and nested routes.',
      difficulty: 'mid',
    },
    {
      id: 'openapi-swagger',
      topic: 'OpenAPI / Swagger',
      english:
        'OpenAPI is a machine-readable contract describing every endpoint, request body, response schema, and auth scheme. Swagger UI renders that contract as interactive documentation. In ASP.NET Core, Swashbuckle generates the spec from your controllers; XML comments and `[ProducesResponseType]` enrich it. A living spec enables SDK generation, contract testing, and parallel frontend development against mocks.',
      bangla:
        'OpenAPI হলো API-এর machine-readable contract — প্রতিটি endpoint, request/response schema, auth scheme এখানে লেখা থাকে। Swagger UI সেই contract থেকে interactive documentation বানায়। ASP.NET Core-এ Swashbuckle controller থেকে spec generate করে; XML comment ও `[ProducesResponseType]` দিয়ে enrich করা যায়। Spec থেকে auto SDK, mock server, contract test — সব possible।',
      details: `
### What OpenAPI gives you
| Capability | Benefit |
| :--- | :--- |
| **Swagger UI** | Try endpoints in the browser |
| **Client SDKs** | NSwag / AutoRest generate typed clients |
| **Contract tests** | CI fails on breaking schema changes |
| **API gateways** | Import spec for routing & validation |

### ASP.NET Core setup checklist
1. \`services.AddSwaggerGen()\` with \`OpenApiInfo\`
2. Enable XML documentation file in \`.csproj\`
3. \`IncludeXmlComments\` in SwaggerGen
4. \`AddSecurityDefinition\` for JWT Bearer
5. Restrict Swagger UI in Production (auth or disable)
      `,
      code: `// Program.cs — Swagger / OpenAPI registration
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Order API",
        Version = "v1",
        Description = "Manage customers, orders, and shipments"
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        options.IncludeXmlComments(xmlPath);

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste JWT: Bearer {token}"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Documented controller action
/// <summary>Get a user by ID</summary>
/// <param name="id">Numeric user identifier</param>
/// <response code="200">User found</response>
/// <response code="404">User does not exist</response>
[HttpGet("{id:int}")]
[Authorize]
[ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
public async Task<ActionResult<UserDto>> GetUserById(int id, CancellationToken ct)
{
    var user = await _userService.GetByIdAsync(id, ct);
    return user is null ? NotFound() : Ok(user);
}`,
      codeExplanation: {
        en: '- `IncludeXmlComments` pulls `///` summaries into the OpenAPI description.\n- `ProducesResponseType` documents response schemas for each status code.\n- `AddSecurityDefinition` + `AddSecurityRequirement` show the Authorize button in Swagger UI.',
        bn: '- `IncludeXmlComments` controller-এর `///` comment OpenAPI description-এ যায়।\n- `ProducesResponseType` প্রতিটি status code-এর response schema দেখায়।\n- JWT security definition Swagger UI-তে Authorize button দেয়।',
      },
      commonMistakes: [
        {
          en: 'Leaving Swagger UI publicly accessible in Production without authentication.',
          bn: 'Production-এ Swagger UI খোলা রাখা — API structure ও test endpoint attacker-দের হাতে চলে যায়।',
        },
        {
          en: 'Skipping XML comments and ProducesResponseType — generated spec shows `object` everywhere.',
          bn: 'XML comment ও ProducesResponseType ছাড়া spec-এ সব `object` দেখায় — client developer confused হয়।',
        },
        {
          en: 'Not versioning the OpenAPI document when API versions diverge.',
          bn: 'API version বদলালে OpenAPI document version update না করা — client ভুল contract follow করে।',
        },
      ],
      bestPractices: [
        {
          en: 'Treat the OpenAPI spec as a contract — review it in PRs like code.',
          bn: 'OpenAPI spec-কে contract হিসেবে treat করুন — PR-এ code-এর মতো review করুন।',
        },
        {
          en: 'Use `[ApiExplorerSettings(IgnoreApi = true)]` for internal diagnostic endpoints.',
          bn: 'Internal diagnostic endpoint `[ApiExplorerSettings(IgnoreApi = true)]` দিয়ে Swagger থেকে লুকান।',
        },
        {
          en: 'Provide example request/response bodies with Swashbuckle filters or attributes.',
          bn: 'Example request/response body দিন — frontend team mock ছাড়াই integrate শুরু করতে পারে।',
        },
      ],
      interviewQs: [
        {
          q: 'What is the purpose of Swagger/OpenAPI?',
          a: 'OpenAPI is a standard JSON/YAML format describing your API contract. Swagger UI renders it as interactive docs. Benefits: auto-generated client SDKs, mock servers for parallel development, API gateway configuration, and contract testing in CI to catch breaking changes before deployment. The spec should live in version control alongside the code.',
          bangla:
            'Machine-readable contract — SDK auto-generate, mock server, contract test। Spec version control-এ রাখলে breaking change CI-তে ধরা পড়ে।',
        },
        {
          q: 'How do you document JWT authentication in Swagger?',
          a: 'Call AddSecurityDefinition with type Http, scheme bearer, and header Authorization. Add AddSecurityRequirement so Swagger UI shows an Authorize button. Controllers use [Authorize]. In Swagger UI, paste "Bearer {token}" after obtaining a JWT from your login endpoint. Without this, consumers guess the header format incorrectly.',
          bangla:
            'AddSecurityDefinition (Bearer JWT) + AddSecurityRequirement — Swagger UI-তে Authorize button আসে।',
        },
        {
          q: 'How do you hide an endpoint from Swagger without removing routing?',
          a: 'Apply [ApiExplorerSettings(IgnoreApi = true)] on the action or controller. The route still works; it is excluded from the generated OpenAPI document. Use for health checks, internal diagnostics, or experimental endpoints not ready for external consumers.',
          bangla:
            '[ApiExplorerSettings(IgnoreApi = true)] — routing ঠিক থাকে, শুধু docs থেকে বাদ যায়।',
        },
      ],
      practice:
        'Add Swashbuckle to a Web API project, enable XML comments, and document one GET and one POST with response codes 200, 201, 400, and 404.',
      difficulty: 'mid',
    },
    {
      id: 'api-versioning',
      topic: 'Versioning',
      english:
        'API versioning lets you ship breaking changes without breaking existing clients. Strategies: URL path (`/api/v2/users`), header (`API-Version: 2.0`), or query string (`?api-version=2.0`). URL versioning is the most explicit and cache-friendly for public APIs. Non-breaking changes (new optional fields, new endpoints) do not require a new version; removing or renaming fields does.',
      bangla:
        'API versioning দিয়ে breaking change করলেও পুরনো client কাজ করতে থাকে। তিনটি উপায়: URL (`/api/v2/users`), header (`API-Version: 2.0`), query (`?api-version=2.0`)। Public API-তে URL versioning সবচেয়ে স্পষ্ট ও cache-friendly। নতুন optional field যোগ = non-breaking; field remove/rename = breaking = নতুন version।',
      details: `
### Versioning strategies compared

| Strategy | Example | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **URL path** | \`/api/v2/users\` | Explicit, easy to test | URL changes per version |
| **Header** | \`API-Version: 2.0\` | Clean URLs | Invisible, harder to cache |
| **Query string** | \`?api-version=2.0\` | Simple to add | Pollutes URLs, easy to forget |

### Breaking vs non-breaking changes

| Change | Breaking? |
| :--- | :--- |
| Add optional response field | No |
| Add new endpoint | No |
| Remove response field | **Yes** |
| Change field type (string → int) | **Yes** |
| Change URL or HTTP method | **Yes** |

### Deprecation workflow
1. Ship v2 alongside v1
2. Mark v1 \`[Obsolete]\` and document sunset date
3. Return \`Sunset\` / \`Deprecation\` response headers
4. Monitor v1 traffic; retire when near zero
      `,
      code: `// URL path versioning — two controllers, clear separation
[ApiController]
[Route("api/v1/[controller]")]
public class UsersV1Controller : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> Get(int id, CancellationToken ct)
        => Ok(await _users.GetByIdAsync(id, ct));
}

[ApiController]
[Route("api/v2/[controller]")]
public class UsersV2Controller : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDetailDto>> Get(int id, CancellationToken ct)
        => Ok(await _users.GetDetailAsync(id, ct)); // v2 adds extra fields
}

// Header / attribute versioning with Asp.Versioning.Mvc
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet("{id:int}")]
    [MapToApiVersion("1.0")]
    public IActionResult GetV1(int id) => Ok(new { id, name = "Widget" });

    [HttpGet("{id:int}")]
    [MapToApiVersion("2.0")]
    public IActionResult GetV2(int id)
        => Ok(new { id, name = "Widget", sku = "WDG-001", stock = 42 });
}
// Client: GET /api/products/1  +  Header: API-Version: 2.0`,
      codeExplanation: {
        en: '- Separate controllers per URL version keep breaking changes isolated.\n- `MapToApiVersion` lets one route serve multiple versions via header or query.\n- v2 can return a richer DTO without changing v1 clients.',
        bn: '- URL version-এ আলাদা controller রাখলে breaking change isolate হয়।\n- `MapToApiVersion` দিয়ে এক route-এ header/query version handle করা যায়।\n- v2 richer DTO দিতে পারে v1 client-কে না ভাঙিয়ে।',
      },
      commonMistakes: [
        {
          en: 'Breaking v1 in place instead of introducing v2 — silent client failures in production.',
          bn: 'v1-এ breaking change করা — production-এ পুরনো app হুট করে ভেঙে যায়; নতুন version বানান।',
        },
        {
          en: 'Supporting too many versions indefinitely — maintenance cost explodes.',
          bn: 'অনেক version অনির্দিষ্টকাল support করা — maintenance cost বাড়ে; sunset date দিন।',
        },
        {
          en: 'Versioning every tiny change — only version breaking contract changes.',
          bn: 'ছোটখাটো change-েও version bump — শুধু breaking contract change-এ version বাড়ান।',
        },
      ],
      bestPractices: [
        {
          en: 'Prefer URL path versioning for public REST APIs; document the strategy in your API guide.',
          bn: 'Public REST API-তে URL path versioning prefer করুন; API guide-এ strategy লিখে রাখুন।',
        },
        {
          en: 'Use Sunset and Deprecation headers with a communicated retirement timeline.',
          bn: 'Sunset/Deprecation header + retirement timeline জানান — client team prepare করতে পারে।',
        },
        {
          en: 'Use Asp.Versioning.Mvc for header/query versioning without duplicating entire controllers.',
          bn: 'Header/query versioning-এ Asp.Versioning.Mvc ব্যবহার করুন — পুরো controller duplicate করতে হয় না।',
        },
      ],
      interviewQs: [
        {
          q: 'How do you handle API versioning?',
          a: 'Three strategies: URL path (/api/v1/users) — explicit and cacheable, preferred for public APIs. Header (API-Version: 2.0) — clean URLs but harder to test. Query (?version=2) — simple but pollutes URLs. Never break existing contracts: additive changes are non-breaking; field removal or type changes need a new version. Deprecate old versions with Sunset headers rather than abrupt removal.',
          bangla:
            'URL path সবচেয়ে explicit (/api/v1) — breaking change মানে নতুন version, Sunset header দিয়ে deprecate করুন।',
        },
        {
          q: 'URL vs header versioning — which do you recommend for a public API?',
          a: 'URL path versioning for public APIs: visible in browser, easy curl/Postman testing, works with HTTP caches and CDN rules. Header versioning suits internal APIs where URL stability is mandated but clients control headers programmatically. Many companies use URL externally and gRPC internally.',
          bangla:
            'Public API-তে URL versioning — test ও cache সহজ। Internal API-তে header versioning URL clean রাখে।',
        },
        {
          q: 'What is a non-breaking API change?',
          a: 'Adding a new optional field to a response, adding a new endpoint, or adding an optional query parameter. Clients that ignore unknown fields continue working. Breaking changes: removing fields, renaming fields, changing types, changing status codes for the same condition, or changing authentication requirements.',
          bangla:
            'Optional field/endpoint যোগ = non-breaking। Field remove/rename/type change = breaking = নতুন version।',
        },
      ],
      practice:
        'Add v1 and v2 of a Products API where v2 includes `sku` and `stock`. Document the migration path for v1 consumers.',
      difficulty: 'senior',
    },
    {
      id: 'error-response-format',
      topic: 'Error Response Format',
      english:
        'Consistent error responses are the mark of a professional API. RFC 7807 Problem Details (`application/problem+json`) is the standard: `type`, `title`, `status`, `detail`, `instance`, plus extensions like `errors` for validation. ASP.NET Core provides `ProblemDetails` and `ValidationProblemDetails` natively. Never leak stack traces, connection strings, or internal paths to clients.',
      bangla:
        'Professional API-তে সব error একই format-এ আসে। RFC 7807 Problem Details standard: `type`, `title`, `status`, `detail`, `instance` — validation-এ `errors` dictionary। ASP.NET Core-এ `ProblemDetails` built-in। Stack trace, connection string, internal path client-এ কখনো পাঠাবেন না।',
      details: `
### RFC 7807 Problem Details fields

| Field | Purpose | Example |
| :--- | :--- | :--- |
| **type** | URI identifying error category | \`https://api.example.com/errors/not-found\` |
| **title** | Short human-readable summary | \`Resource not found\` |
| **status** | HTTP status code | \`404\` |
| **detail** | Specific explanation | \`User 42 does not exist\` |
| **instance** | URI for this occurrence | \`/api/v1/users/42\` |
| **traceId** | Correlation with server logs | \`0HMV9...\` |

### Status code quick reference

| Code | When to use |
| :--- | :--- |
| **400** | Malformed request / validation failure |
| **401** | Missing or invalid authentication |
| **403** | Authenticated but not permitted |
| **404** | Resource does not exist |
| **409** | Conflict (duplicate, concurrency) |
| **422** | Semantic validation failure |
| **429** | Rate limit exceeded |
| **500** | Unexpected server error (no internals in body) |
      `,
      code: `// Global exception handler — consistent ProblemDetails everywhere
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct)
    {
        var (status, title) = exception switch
        {
            NotFoundException => (404, "Not Found"),
            ValidationException => (400, "Validation failed"),
            UnauthorizedAccessException => (403, "Forbidden"),
            _ => (500, "An unexpected error occurred")
        };

        var problem = new ProblemDetails
        {
            Type = $"https://httpstatuses.com/{status}",
            Title = title,
            Status = status,
            Detail = status == 500 ? null : exception.Message,
            Instance = context.Request.Path
        };
        problem.Extensions["traceId"] = context.TraceIdentifier;

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem, ct);
        return true;
    }
}

// Validation errors — field-level detail
[HttpPost]
public IActionResult Create(CreateUserDto dto)
{
    if (!ModelState.IsValid)
        return ValidationProblem(ModelState); // 400 + errors dict

    // ...
}

// Manual NotFound with ProblemDetails
[HttpGet("{id:int}")]
public async Task<ActionResult<UserDto>> Get(int id, CancellationToken ct)
{
    var user = await _users.GetByIdAsync(id, ct);
    if (user is null)
    {
        return NotFound(new ProblemDetails
        {
            Title = "User not found",
            Status = 404,
            Detail = $"No user with id {id}",
            Extensions = { ["traceId"] = HttpContext.TraceIdentifier }
        });
    }
    return Ok(user);
}`,
      codeExplanation: {
        en: '- `IExceptionHandler` (.NET 8+) maps exception types to status codes centrally.\n- `ValidationProblem(ModelState)` returns RFC 7807 with per-field `errors`.\n- `traceId` links client-visible errors to server logs for support tickets.',
        bn: '- `IExceptionHandler` সব exception এক জায়গায় map করে।\n- `ValidationProblem` field-level `errors` dictionary দেয়।\n- `traceId` দিয়ে client error আর server log match করা যায়।',
      },
      commonMistakes: [
        {
          en: 'Returning different JSON shapes per endpoint — `{ error: "..." }` vs `{ message: "..." }` vs raw strings.',
          bn: 'প্রতিটি endpoint-এ আলাদা error format — client handle করতে পারে না; ProblemDetails একরূপ রাখুন।',
        },
        {
          en: 'Sending stack traces or SQL errors to clients in Production.',
          bn: 'Production-এ stack trace/SQL error client-এ পাঠানো — security risk ও unprofessional।',
        },
        {
          en: 'Using 500 for validation failures instead of 400/422 with field details.',
          bn: 'Validation fail-এ 500 দেওয়া — 400/422 + field error দিন।',
        },
      ],
      bestPractices: [
        {
          en: 'Register a global exception handler as early middleware; return ProblemDetails for all unhandled errors.',
          bn: 'Global exception handler প্রথম middleware-এ রাখুন; সব unhandled error ProblemDetails format-এ।',
        },
        {
          en: 'Include traceId in every error response; log the full exception server-side only.',
          bn: 'প্রতিটি error-এ traceId দিন; full exception শুধু server log-এ।',
        },
        {
          en: 'Use 401 for missing/invalid auth, 403 for insufficient permissions — do not conflate them.',
          bn: '401 = login লাগবে, 403 = login আছে কিন্তু permission নেই — দুটো আলাদা রাখুন।',
        },
      ],
      interviewQs: [
        {
          q: 'What is the best error response format?',
          a: 'RFC 7807 Problem Details (application/problem+json). Fields: type, title, status, detail, instance, plus extensions like errors for validation and traceId for log correlation. ASP.NET Core implements this with ProblemDetails. Consistent format across all endpoints is more important than the exact field names — inconsistency is the top complaint from API consumers.',
          bangla:
            'RFC 7807 ProblemDetails — type, title, status, detail, traceId। Stack trace client-এ কখনো নয়।',
        },
        {
          q: 'When should you use 401 vs 403?',
          a: '401 Unauthorized: the client has not authenticated or the token is invalid/expired — prompt re-login. 403 Forbidden: the client is authenticated but lacks permission for this resource or action. Returning 404 instead of 403 to hide resource existence is a valid security pattern but should be a deliberate choice.',
          bangla:
            '401 = কে তুমি? login করো। 403 = চিনি, কিন্তু permission নেই।',
        },
        {
          q: 'How do you handle validation errors in Web API?',
          a: 'Use Data Annotations or FluentValidation on DTOs. When ModelState is invalid, return ValidationProblem(ModelState) which produces a 400 response with an errors dictionary keyed by field name. For business-rule validation inside services, throw a custom ValidationException caught by global handler and mapped to 400 or 422. Never return 200 with an error flag in the body.',
          bangla:
            'ModelState invalid হলে ValidationProblem() — 400 + field-level errors। 200-এ error flag দেবেন না।',
        },
      ],
      practice:
        'Implement a global exception handler that returns ProblemDetails with traceId for NotFound, Validation, and unexpected errors.',
      difficulty: 'mid',
    },
  ],
  revisionSummary: `
- **REST**: Nouns in URLs, verbs in HTTP methods; predictable and cache-friendly.
- **OpenAPI**: Machine-readable contract → Swagger UI, SDKs, contract tests.
- **Versioning**: URL path for public APIs; only bump on breaking changes; deprecate with Sunset headers.
- **Errors**: RFC 7807 ProblemDetails everywhere; traceId for support; never leak internals.
  `,
  summary:
    'API design is a contract with your consumers. REST conventions, OpenAPI documentation, careful versioning, and consistent ProblemDetails errors separate hobby APIs from production-grade platforms.',
  interviewQuestions: [
    {
      q: 'What are the principles of RESTful API design?',
      a: 'Stateless requests, resource nouns, semantic HTTP methods, cacheable responses, uniform interface, and consistent error/status semantics. Design for predictability so clients can integrate without reading every line of your code.',
      bangla:
        'Stateless, noun URLs, HTTP method semantics, consistent errors — predictable API = maintainable API।',
    },
    {
      q: 'What is the purpose of Swagger/OpenAPI?',
      a: 'A machine-readable contract enabling interactive docs, client SDK generation, mock servers, and CI contract testing. The spec should be version-controlled and reviewed like application code.',
      bangla:
        'Contract → SDK, docs, mock, contract test। Spec version control-এ রাখুন।',
    },
    {
      q: 'How do you handle API versioning?',
      a: 'URL path versioning for public APIs; support multiple versions concurrently; deprecate with Sunset headers; only version breaking changes.',
      bangla:
        'Breaking change = নতুন version। Sunset header দিয়ে পুরনো version retire করুন।',
    },
    {
      q: 'What is the best error response format?',
      a: 'RFC 7807 ProblemDetails with type, title, status, detail, traceId, and field-level errors for validation. Never expose stack traces in production.',
      bangla:
        'ProblemDetails standard — traceId দিন, stack trace client-এ পাঠাবেন না।',
    },
  ],
  quickRevision: {
    concepts: [
      'REST: nouns + HTTP verbs',
      'OpenAPI contract & Swagger UI',
      'URL path versioning',
      'RFC 7807 ProblemDetails',
    ],
    questions: [
      'REST vs RPC — when to use each?',
      '401 vs 403?',
      'Breaking vs non-breaking change?',
    ],
    mistakes: [
      'Verbs in URLs (/createUser)',
      'Swagger UI open in Production',
      'Inconsistent error JSON shapes',
    ],
    scenarios: [
      'Design versioned user API with v1/v2',
      'Add global ProblemDetails handler',
    ],
  },
};
