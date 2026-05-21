export const apiDocsContent = {
  id: 'apidocs',
  title: 'API Design & Documentation',
  description: 'Design clean, well-documented REST and GraphQL APIs',
  sections: [
    {
      id: 'rest-api-design',
      title: 'REST API Design Best Practices',
      content: `Design RESTful APIs that are intuitive and maintainable.`,
      subsections: [
        {
          title: 'RESTful Endpoints',
          code: `// Resource-based endpoints
GET    /api/v1/users              // List users
POST   /api/v1/users              // Create user
GET    /api/v1/users/{id}         // Get user
PUT    /api/v1/users/{id}         // Update user
DELETE /api/v1/users/{id}         // Delete user

// Sub-resources
GET    /api/v1/users/{id}/orders           // Get user's orders
POST   /api/v1/users/{id}/orders           // Create order for user
GET    /api/v1/users/{id}/orders/{orderId} // Get specific order

// Query parameters for filtering
GET    /api/v1/users?status=active&role=admin
GET    /api/v1/users?skip=10&take=20       // Pagination
GET    /api/v1/users?sortBy=name&sortDirection=asc`,
        },
        {
          title: 'Proper HTTP Status Codes',
          code: `[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        // 200 OK - Successful retrieval
        return Ok(await _userService.GetAllAsync());
    }
    
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        // 201 Created - Resource successfully created
        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetUserById), 
            new { id = user.Id }, user);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        // 204 No Content - Successful update with no response body
        await _userService.UpdateAsync(id, dto);
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        // 204 No Content - Successful deletion
        await _userService.DeleteAsync(id);
        return NoContent();
    }
}`,
        },
        {
          title: 'Error Response Format',
          code: `public class ErrorResponse
{
    public string Code { get; set; }
    public string Message { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }
    public string TraceId { get; set; }
}

[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        
        if (user == null)
        {
            // 404 Not Found
            return NotFound(new ErrorResponse
            {
                Code = "USER_NOT_FOUND",
                Message = $"User with ID {id} was not found",
                TraceId = HttpContext.TraceIdentifier
            });
        }
        
        return Ok(user);
    }
}`,
        },
      ],
      tips: [
        'Use nouns for resources, not verbs',
        'Use proper HTTP methods (GET, POST, PUT, DELETE)',
        'Return appropriate status codes',
        'Use consistent response formats',
      ],
    },
    {
      id: 'api-versioning',
      title: 'API Versioning',
      content: `Handle multiple API versions gracefully.`,
      subsections: [
        {
          title: 'URL Path Versioning',
          code: `[ApiController]
[Route("api/v1/[controller]")]
public class UsersV1Controller : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        return Ok(await _userService.GetByIdAsync(id));
    }
}

[ApiController]
[Route("api/v2/[controller]")]
public class UsersV2Controller : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDtoV2>> GetUser(int id)
    {
        // V2 might return additional fields
        return Ok(await _userService.GetByIdWithDetailsAsync(id));
    }
}`,
        },
        {
          title: 'API Version Header',
          code: `[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    [ApiVersion("1.0")]
    public async Task<ActionResult<UserDto>> GetUserV1(int id)
    {
        return Ok(await _userService.GetByIdAsync(id));
    }
    
    [HttpGet("{id}")]
    [ApiVersion("2.0")]
    public async Task<ActionResult<UserDtoV2>> GetUserV2(int id)
    {
        return Ok(await _userService.GetByIdWithDetailsAsync(id));
    }
}

// Request: GET /api/users/1
// Header: API-Version: 2.0`,
        },
      ],
      tips: [
        'Plan versioning strategy early',
        'Support multiple versions',
        'Deprecate old versions gradually',
        'Document breaking changes',
      ],
    },
    {
      id: 'swagger-documentation',
      title: 'Swagger/OpenAPI Documentation',
      content: `Document APIs with Swagger for easy consumption.`,
      subsections: [
        {
          title: 'Swagger Configuration',
          code: `public void ConfigureServices(IServiceCollection services)
{
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo 
        { 
            Title = "My API", 
            Version = "v1",
            Description = "API for managing users and orders"
        });
        
        // Add XML comments support
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        c.IncludeXmlComments(xmlPath);
        
        // Add JWT authentication
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });
    });
}`,
        },
        {
          title: 'Documenting Endpoints',
          code: `[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    /// <summary>
    /// Get a user by ID
    /// </summary>
    /// <param name="id">The user ID</param>
    /// <returns>The user details</returns>
    /// <response code="200">User found and returned</response>
    /// <response code="404">User not found</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet("{id}")]
    [Authorize]
    [ProduceResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProduceResponseType(StatusCodes.Status404NotFound)]
    [ProduceResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDto>> GetUserById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }
    
    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="createUserDto">User data</param>
    /// <returns>Created user</returns>
    /// <response code="201">User created successfully</response>
    /// <response code="400">Invalid input</response>
    [HttpPost]
    [ProduceResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProduceResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
    {
        var user = await _userService.CreateAsync(createUserDto);
        return CreatedAtAction(nameof(GetUserById), 
            new { id = user.Id }, user);
    }
}`,
        },
      ],
      tips: [
        'Use XML comments for documentation',
        'Include response code examples',
        'Document all parameters and returns',
        'Update documentation with API changes',
      ],
    },
    {
      id: 'rate-limiting',
      title: 'Rate Limiting & Throttling',
      content: `Protect APIs from abuse with rate limiting.`,
      subsections: [
        {
          title: 'Rate Limiting Middleware',
          code: `public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;
    private const int RequestsPerMinute = 60;
    
    public RateLimitingMiddleware(RequestDelegate next, 
        IDistributedCache cache)
    {
        _next = next;
        _cache = cache;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = context.Connection.RemoteIpAddress?.ToString();
        var cacheKey = $"rate-limit:{clientId}";
        
        var requestCount = await _cache.GetAsync(cacheKey);
        var count = requestCount == null ? 1 : 
            BitConverter.ToInt32(requestCount, 0) + 1;
        
        if (count > RequestsPerMinute)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsync("Rate limit exceeded");
            return;
        }
        
        var cacheOptions = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(1));
        
        await _cache.SetAsync(cacheKey, 
            BitConverter.GetBytes(count), cacheOptions);
        
        await _next(context);
    }
}`,
        },
      ],
      tips: [
        'Implement per-user rate limiting',
        'Use Redis for distributed rate limiting',
        'Return 429 Too Many Requests status',
        'Include rate limit info in response headers',
      ],
    },
  ],
  interviewQuestions: [
    {
      q: 'What are the principles of RESTful API design?',
      a: "REST has six architectural constraints: stateless (each request contains all context — no server-side session), client-server separation (UI and data storage concerns are decoupled), uniform interface (resources addressed by URI, manipulated via standard HTTP verbs, self-descriptive messages), layered system (clients cannot tell if they're talking to origin or intermediary), cacheable (responses declare their cacheability), and optionally code-on-demand (server can send executable code). In practice: use resource nouns not action verbs, map CRUD to GET/POST/PUT/PATCH/DELETE, return consistent error shapes, version your contract, and use HTTP status codes semantically rather than always returning 200.",
      bangla: "URL noun হবে (resource এর নাম), action HTTP method এ express হবে — Stateless, Cacheable, Uniform Interface এই তিনটি সবচেয়ে গুরুত্বপূর্ণ।"
    },
    {
      q: 'When should you use different HTTP status codes?',
      a: "2xx success: 200 OK (GET/PUT with body), 201 Created (POST that creates a resource — include Location header), 204 No Content (PUT/DELETE with no response body). 3xx redirects: 301 Moved Permanently, 304 Not Modified (ETag cache hit). 4xx client errors: 400 Bad Request (validation failure — include field-level errors), 401 Unauthorized (no valid credentials — trigger re-login), 403 Forbidden (authenticated but lacks permission), 404 Not Found (resource doesn't exist), 409 Conflict (optimistic concurrency clash), 422 Unprocessable Entity (semantic validation failure), 429 Too Many Requests (rate limit exceeded — include Retry-After header). 5xx server errors: 500 Internal Server Error (unexpected exception — never expose stack traces), 503 Service Unavailable (circuit breaker open or maintenance mode).",
      bangla: "201 Created (POST), 204 No Content (DELETE/PUT), 400 validation, 401 login লাগবে, 403 permission নেই, 429 rate limit — এগুলো মুখস্থ রাখুন।"
    },
    {
      q: 'How do you handle API versioning?',
      a: "Three main strategies: URL path versioning (/api/v1/users) is explicit and easily cacheable — preferred for public APIs. Header versioning (API-Version: 2.0) keeps URLs clean but is harder to test in a browser and breaks HTTP caching. Query string versioning (?version=2) is simple but pollutes URLs. Best practices: never break existing contracts — additive changes (new fields, new endpoints) are non-breaking; breaking changes (removing fields, changing types) require a new version. Deprecate old versions with sunset headers rather than abrupt removal. In ASP.NET Core, use the Asp.Versioning.Mvc NuGet package with MapToApiVersion attributes for clean multi-version support without duplicate controllers.",
      bangla: "URL path versioning সবচেয়ে explicit (/api/v1) — breaking change মানেই নতুন version, পুরনো কাজ করতে থাকবে। Sunset header দিয়ে deprecate করুন।"
    },
    {
      q: 'What is the purpose of Swagger/OpenAPI?',
      a: "OpenAPI is a machine-readable contract for your API — it describes every endpoint, request model, response schema, authentication scheme, and status code in a standard JSON/YAML format. Swagger UI generates interactive documentation from that contract so consumers can explore and test endpoints without writing a single line of client code. In ASP.NET Core with Swashbuckle, XML comments on controllers and ProducesResponseType attributes feed directly into the generated spec. This contract-first approach enables automatic client SDK generation (NSwag, AutoRest), API gateway configuration, mock servers for frontend parallel development, and contract testing to catch breaking changes before deployment.",
      bangla: "Machine-readable API contract — auto SDK generate, interactive docs, mock server, contract testing সব এখান থেকে। Spec version control এ থাকলে breaking change ধরা যায়।"
    },
    {
      q: 'How would you implement rate limiting?',
      a: "ASP.NET Core 7+ ships with built-in rate limiting middleware (Microsoft.AspNetCore.RateLimiting). Configure policies: Fixed Window (N requests per time window — simple but allows bursts at window boundary), Sliding Window (smooths burst problem by tracking a rolling window), Token Bucket (steady refill rate with burst capacity — best for most APIs), Concurrency Limiter (caps simultaneous in-flight requests — useful for CPU-bound operations). For distributed scenarios, replace the in-memory limiter with a Redis-backed implementation using RedisRateLimiting. Always return 429 Too Many Requests with a Retry-After header. Apply different limits per client (API key, IP, user tier) using partitioned limiters. Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining) improve client developer experience.",
      bangla: "Token Bucket সবচেয়ে ভালো, distributed হলে Redis-backed limiter — 429 + Retry-After header return করুন, per-client partitioned limiter ব্যবহার করুন।"
    },
    {
      q: 'What is the best error response format?',
      a: "Use RFC 7807 Problem Details (application/problem+json) — it's a standard that ASP.NET Core's ProblemDetails class implements natively. Structure: { type (URI identifying the error class), title (human-readable summary), status (HTTP status code), detail (specific message for this occurrence), instance (URI identifying this specific request), extensions (domain-specific fields like errors dict for validation). For validation errors, include a field-level errors dictionary: { errors: { fieldName: [\"message1\"] } }. Always include a traceId for correlation with server logs. Never expose exception stack traces, connection strings, or internal system details in error responses. Use consistent casing (camelCase) and format across all endpoints — inconsistency is the most common API design complaint from consumers.",
      bangla: "RFC 7807 ProblemDetails — type, title, status, detail, traceId — stack trace কখনো client এ পাঠাবেন না। সব endpoint এ consistent format।"
    },
  ],
};
