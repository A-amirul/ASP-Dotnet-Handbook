export const patternsContent = {
  id: 'patterns',
  title: 'Advanced Patterns & Design',
  description: 'Master advanced design patterns used in enterprise .NET applications',
  sections: [
    {
      id: 'dependency-injection',
      title: 'Dependency Injection & Service Lifetimes',
      content: `DI is the backbone of modern .NET applications. Understand service lifetimes.`,
      subsections: [
        {
          title: 'Service Lifetimes',
          code: `public void ConfigureServices(IServiceCollection services)
{
    // Transient: New instance every time
    // Use for: Stateless services, utilities
    services.AddTransient<IRepository, Repository>();
    
    // Scoped: One instance per request
    // Use for: DbContext, request-specific data
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<DbContext>();
    
    // Singleton: One instance for application lifetime
    // Use for: Caching, configuration, logging
    services.AddSingleton<ICacheService, MemoryCacheService>();
}`,
        },
        {
          title: 'Factory Pattern with DI',
          code: `public interface IRepositoryFactory
{
    IRepository Create(string entityType);
}

public class RepositoryFactory : IRepositoryFactory
{
    private readonly IServiceProvider _serviceProvider;
    
    public RepositoryFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    public IRepository Create(string entityType)
    {
        return entityType.ToLower() switch
        {
            "user" => _serviceProvider.GetRequiredService<IUserRepository>(),
            "product" => _serviceProvider.GetRequiredService<IProductRepository>(),
            _ => throw new InvalidOperationException($"Unknown type: {entityType}")
        };
    }
}`,
        },
      ],
      tips: [
        'Use Transient for stateless services',
        'Use Scoped for per-request data',
        'Use Singleton for expensive-to-create services',
        'Avoid Service Locator pattern',
      ],
    },
    {
      id: 'mediator-pattern',
      title: 'Mediator Pattern with MediatR',
      content: `MediatR simplifies request/response handling and decouples components.`,
      subsections: [
        {
          title: 'Basic MediatR Setup',
          code: `// Command definition
public record CreateUserCommand(string Name, string Email) 
    : IRequest<UserResponse>;

// Command handler
public class CreateUserCommandHandler 
    : IRequestHandler<CreateUserCommand, UserResponse>
{
    private readonly IUserRepository _repository;
    private readonly IPublisher _publisher;
    
    public CreateUserCommandHandler(IUserRepository repository, 
        IPublisher publisher)
    {
        _repository = repository;
        _publisher = publisher;
    }
    
    public async Task<UserResponse> Handle(CreateUserCommand request, 
        CancellationToken cancellationToken)
    {
        var user = new User { Name = request.Name, Email = request.Email };
        await _repository.AddAsync(user);
        
        // Publish domain event
        await _publisher.Publish(new UserCreatedEvent(user.Id, user.Name),
            cancellationToken);
        
        return new UserResponse { Id = user.Id, Name = user.Name };
    }
}

// Query definition
public record GetUserQuery(int UserId) : IRequest<UserResponse>;

// Query handler
public class GetUserQueryHandler 
    : IRequestHandler<GetUserQuery, UserResponse>
{
    private readonly IUserRepository _repository;
    
    public async Task<UserResponse> Handle(GetUserQuery request, 
        CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(request.UserId);
        return new UserResponse { Id = user.Id, Name = user.Name };
    }
}`,
        },
        {
          title: 'Using MediatR in Controllers',
          code: `[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var result = await _mediator.Send(new GetUserQuery(id));
        return Ok(result);
    }
}`,
        },
      ],
      tips: [
        'Use Commands for mutations',
        'Use Queries for reads',
        'Publish domain events for side effects',
        'Keep handlers focused and testable',
      ],
    },
    {
      id: 'specification-pattern',
      title: 'Specification Pattern',
      content: `Encapsulate domain logic with specifications for reusable queries.`,
      subsections: [
        {
          title: 'Implementing Specifications',
          code: `public abstract class Specification<T>
{
    public Expression<Func<T, bool>> Criteria { get; protected set; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();
    
    protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }
}

public class ActiveUsersSpecification : Specification<User>
{
    public ActiveUsersSpecification()
    {
        Criteria = u => u.IsActive;
        AddInclude(u => u.Orders);
        AddInclude(u => u.Payments);
    }
}

public class UserByEmailSpecification : Specification<User>
{
    public UserByEmailSpecification(string email)
    {
        Criteria = u => u.Email == email;
    }
}`,
        },
        {
          title: 'Repository with Specifications',
          code: `public class SpecificationRepository<T> : IRepository<T> where T : Entity
{
    private readonly DbContext _context;
    
    public async Task<IReadOnlyList<T>> GetAsync(Specification<T> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }
    
    private IQueryable<T> ApplySpecification(Specification<T> spec)
    {
        var query = _context.Set<T>().AsQueryable();
        
        if (spec.Criteria != null)
            query = query.Where(spec.Criteria);
        
        return spec.Includes.Aggregate(query, 
            (current, include) => current.Include(include));
    }
}

// Usage
var activeUsers = await _repository.GetAsync(new ActiveUsersSpecification());`,
        },
      ],
      tips: [
        'Encapsulate query logic in specifications',
        'Keep specifications DRY and reusable',
        'Combine multiple specifications when needed',
        'Use with Repository pattern',
      ],
    },
    {
      id: 'unit-of-work',
      title: 'Unit of Work Pattern',
      content: `Manage database transactions across multiple repositories.`,
      subsections: [
        {
          title: 'Implementing Unit of Work',
          code: `public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IOrderRepository Orders { get; }
    IProductRepository Products { get; }
    
    Task<int> SaveChangesAsync();
    Task<bool> BeginTransactionAsync();
    Task<bool> CommitAsync();
    Task<bool> RollbackAsync();
}

public class UnitOfWork : IUnitOfWork
{
    private readonly DbContext _context;
    private IDbContextTransaction _transaction;
    
    public IUserRepository Users { get; }
    public IOrderRepository Orders { get; }
    public IProductRepository Products { get; }
    
    public UnitOfWork(DbContext context, 
        IUserRepository users, 
        IOrderRepository orders,
        IProductRepository products)
    {
        _context = context;
        Users = users;
        Orders = orders;
        Products = products;
    }
    
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
    
    public async Task<bool> BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
        return true;
    }
    
    public async Task<bool> CommitAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            await _transaction.CommitAsync();
            return true;
        }
        catch
        {
            await _transaction.RollbackAsync();
            return false;
        }
    }
}`,
        },
      ],
      tips: [
        'Use for multi-repository transactions',
        'Implement proper error handling',
        'Always dispose UnitOfWork properly',
        'Use async methods for better scalability',
      ],
    },
  ],
  interviewQuestions: [
    'What are service lifetimes in dependency injection?',
    'Explain the Mediator pattern and when to use it.',
    'What is the Specification pattern and its benefits?',
    'How does Unit of Work pattern manage transactions?',
    'What is the difference between a Repository and a Specification?',
    'When would you use the Factory pattern?',
  ],
};
