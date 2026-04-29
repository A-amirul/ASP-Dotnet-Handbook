export const loggingContent = {
  id: 'logging',
  title: 'Logging & Monitoring',
  description: 'Implement comprehensive logging and monitoring strategies',
  sections: [
    {
      id: 'logging-setup',
      title: 'Logging Setup with Serilog',
      content: `Serilog is a popular structured logging framework for .NET applications.`,
      subsections: [
        {
          title: 'Basic Serilog Configuration',
          code: `public static void Main(string[] args)
{
    Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Debug()
        .WriteTo.Console()
        .WriteTo.File("logs/app-.txt", 
            rollingInterval: RollingInterval.Day)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "MyApp")
        .CreateLogger();
    
    try
    {
        CreateHostBuilder(args).Build().Run();
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Application terminated unexpectedly");
    }
    finally
    {
        Log.CloseAndFlush();
    }
}`,
        },
        {
          title: 'Using ILogger in Services',
          code: `public class UserService
{
    private readonly ILogger<UserService> _logger;
    private readonly IUserRepository _repository;
    
    public UserService(ILogger<UserService> logger, 
        IUserRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }
    
    public async Task<User> GetUserAsync(int id)
    {
        _logger.LogInformation("Fetching user with ID: {UserId}", id);
        
        try
        {
            var user = await _repository.GetUserByIdAsync(id);
            _logger.LogInformation("User {UserId} retrieved successfully", id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {UserId}", id);
            throw;
        }
    }
}`,
        },
      ],
      tips: [
        'Use structured logging with named properties',
        'Log at appropriate levels (Info, Warn, Error)',
        'Include context in log messages',
        'Configure different outputs for different environments',
      ],
    },
    {
      id: 'correlation-tracing',
      title: 'Correlation ID & Distributed Tracing',
      content: `Track requests across multiple services using correlation IDs.`,
      subsections: [
        {
          title: 'Correlation ID Middleware',
          code: `public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string CorrelationIdHeader = "X-Correlation-Id";
    
    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    
    public async Task InvokeAsync(HttpContext context, 
        ILogger<CorrelationIdMiddleware> logger)
    {
        var correlationId = context.Request.Headers
            .TryGetValue(CorrelationIdHeader, out var id) 
            ? id.ToString() 
            : Guid.NewGuid().ToString();
        
        context.Items["CorrelationId"] = correlationId;
        context.Response.Headers.Add(CorrelationIdHeader, correlationId);
        
        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }
}

// Register in Startup.cs
public void Configure(IApplicationBuilder app)
{
    app.UseMiddleware<CorrelationIdMiddleware>();
}`,
        },
        {
          title: 'Passing Correlation ID to Services',
          code: `public class HttpClientFactory
{
    private readonly IHttpClientFactory _httpClientFactory;
    
    public HttpClientFactory(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
    
    public HttpClient CreateClientWithCorrelationId(string correlationId)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Correlation-Id", 
            correlationId);
        return client;
    }
}`,
        },
      ],
      tips: [
        'Generate or pass correlation IDs through requests',
        'Include correlation ID in all logs',
        'Pass correlation ID to downstream services',
        'Use correlation ID to trace request flow',
      ],
    },
    {
      id: 'exception-handling',
      title: 'Exception Handling & Logging',
      content: `Implement comprehensive exception handling and logging strategies.`,
      subsections: [
        {
          title: 'Global Exception Middleware',
          code: `public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    
    public ExceptionMiddleware(RequestDelegate next, 
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 
                ex switch
                {
                    NotFoundException => StatusCodes.Status404NotFound,
                    UnauthorizedException => StatusCodes.Status401Unauthorized,
                    ValidationException => StatusCodes.Status400BadRequest,
                    _ => StatusCodes.Status500InternalServerError
                };
            
            var response = new ErrorResponse
            {
                Message = ex.Message,
                StatusCode = context.Response.StatusCode
            };
            
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}`,
        },
        {
          title: 'Custom Exception Classes',
          code: `public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message) { }
}

public class ValidationException : Exception
{
    public Dictionary<string, string[]> Errors { get; }
    
    public ValidationException(Dictionary<string, string[]> errors)
        : base("Validation failed")
    {
        Errors = errors;
    }
}`,
        },
      ],
      tips: [
        'Create custom exception classes for specific scenarios',
        'Log exceptions at the appropriate level',
        'Include context information in exception messages',
        'Return meaningful error responses to clients',
      ],
    },
    {
      id: 'performance-monitoring',
      title: 'Performance Monitoring',
      content: `Monitor application performance with structured logging.`,
      subsections: [
        {
          title: 'Request Timing Middleware',
          code: `public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;
    
    public RequestTimingMiddleware(RequestDelegate next, 
        ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        
        await _next(context);
        
        stopwatch.Stop();
        
        _logger.LogInformation(
            "Request {Method} {Path} completed in {Elapsed}ms",
            context.Request.Method,
            context.Request.Path,
            stopwatch.ElapsedMilliseconds);
        
        if (stopwatch.ElapsedMilliseconds > 1000)
        {
            _logger.LogWarning(
                "Slow request detected: {Method} {Path} took {Elapsed}ms",
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds);
        }
    }
}`,
        },
      ],
      tips: [
        'Log request/response times',
        'Alert on slow requests',
        'Monitor database query performance',
        'Track endpoint-specific metrics',
      ],
    },
  ],
  interviewQuestions: [
    'What is structured logging and why is it important?',
    'How do you implement correlation IDs in microservices?',
    'What logging framework would you use in .NET and why?',
    'How should you handle exceptions in an API?',
    'How do you monitor performance bottlenecks?',
    'What information should you log in production?',
  ],
};
