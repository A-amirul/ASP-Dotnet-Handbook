export const securityContent = {
  id: 'security',
  title: 'Security Best Practices',
  description: 'Implement secure coding practices in .NET applications',
  sections: [
    {
      id: 'authentication-authorization',
      title: 'Authentication & Authorization',
      content: `Implement proper authentication and role-based authorization.`,
      subsections: [
        {
          title: 'JWT Authentication Setup',
          code: `public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"])),
                ValidateIssuer = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _config["Jwt:Audience"],
                ValidateLifetime = true
            };
        });
}`,
        },
        {
          title: 'Role-Based Authorization',
          code: `[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok();
    }
    
    [Authorize(Policy = "AdminOrManager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        return Ok(await _userService.UpdateUserAsync(id, dto));
    }
}`,
        },
      ],
      tips: [
        'Never store passwords in plain text',
        'Use strong hashing algorithms (bcrypt, Argon2)',
        'Implement JWT with short expiration times',
        'Use refresh tokens for long-lived sessions',
      ],
    },
    {
      id: 'input-validation',
      title: 'Input Validation & Sanitization',
      content: `Always validate and sanitize user input to prevent injection attacks.`,
      subsections: [
        {
          title: 'Data Annotations Validation',
          code: `public class CreateUserDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)")]
    public string Password { get; set; }
}

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        return Ok(await _userService.CreateUserAsync(dto));
    }
}`,
        },
        {
          title: 'Fluent Validation',
          code: `public class CreateUserValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .Must(BeUniqueEmail).WithMessage("Email already exists");
        
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches(@"[A-Z]").WithMessage("Must contain uppercase")
            .Matches(@"[0-9]").WithMessage("Must contain digit");
    }
    
    private bool BeUniqueEmail(string email)
    {
        return !_userRepository.EmailExists(email);
    }
}`,
        },
      ],
      tips: [
        'Validate on both client and server',
        'Use parameterized queries to prevent SQL injection',
        'Sanitize output to prevent XSS attacks',
        'Implement CSRF protection',
      ],
    },
    {
      id: 'secure-coding',
      title: 'Secure Coding Practices',
      content: `Follow secure coding patterns to prevent common vulnerabilities.`,
      subsections: [
        {
          title: 'SQL Injection Prevention',
          code: `// BAD: String concatenation (vulnerable)
string query = $"SELECT * FROM Users WHERE Id = {userId}";
var user = _context.Users.FromSqlRaw(query).FirstOrDefault();

// GOOD: Parameterized queries
var user = _context.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE Id = {userId}")
    .FirstOrDefault();

// GOOD: LINQ (safest)
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Id == userId);`,
        },
        {
          title: 'Secure Password Hashing',
          code: `public class PasswordHasher
{
    private const int WorkFactor = 12;
    
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    }
    
    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}

// Usage
var hashedPassword = _passwordHasher.HashPassword("userPassword");
var isValid = _passwordHasher.VerifyPassword("userPassword", hashedPassword);`,
        },
        {
          title: 'Secure Secret Management',
          code: `// Development (appsettings.Development.json)
{
  "Jwt": {
    "SecretKey": "development-secret-key"
  }
}

// Production (User Secrets or Environment Variables)
// Use Azure Key Vault or AWS Secrets Manager
public void ConfigureServices(IServiceCollection services)
{
    var keyVaultUrl = new Uri(_config["KeyVault:Url"]);
    
    var credential = new DefaultAzureCredential();
    services.AddAzureAppConfiguration();
    services.AddAzureKeyVault(keyVaultUrl, credential);
}`,
        },
      ],
      tips: [
        'Use LINQ instead of raw SQL',
        'Hash passwords with bcrypt or Argon2',
        'Store secrets in environment variables or vaults',
        'Implement rate limiting on login endpoints',
      ],
    },
    {
      id: 'cors-headers',
      title: 'CORS & Security Headers',
      content: `Configure CORS and security headers to protect against attacks.`,
      subsections: [
        {
          title: 'CORS Configuration',
          code: `public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin", builder =>
        {
            builder.WithOrigins("https://example.com")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });
}

public void Configure(IApplicationBuilder app)
{
    app.UseCors("AllowSpecificOrigin");
}`,
        },
        {
          title: 'Security Headers',
          code: `public void Configure(IApplicationBuilder app)
{
    app.Use(async (context, next) =>
    {
        // Prevent clickjacking
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        
        // Enable XSS protection
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        
        // Prevent MIME type sniffing
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        
        // Content Security Policy
        context.Response.Headers.Add("Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline'");
        
        await next();
    });
}`,
        },
      ],
      tips: [
        'Only allow necessary origins',
        'Disable credentials in CORS if not needed',
        'Add X-Frame-Options header',
        'Implement Content-Security-Policy',
      ],
    },
  ],
  interviewQuestions: [
    'How do you prevent SQL injection attacks?',
    'Explain the difference between authentication and authorization.',
    'What is CORS and why is it important?',
    'How should you store passwords?',
    'What are JWT tokens and how do they work?',
    'How would you implement rate limiting?',
  ],
};
