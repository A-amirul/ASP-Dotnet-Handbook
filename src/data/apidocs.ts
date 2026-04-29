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
    'What are the principles of RESTful API design?',
    'When should you use different HTTP status codes?',
    'How do you handle API versioning?',
    'What is the purpose of Swagger/OpenAPI?',
    'How would you implement rate limiting?',
    'What is the best error response format?',
  ],
};
