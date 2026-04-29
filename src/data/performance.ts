export const performanceContent = {
  id: 'performance',
  title: 'Performance Optimization & Profiling',
  description: 'Learn to identify and eliminate bottlenecks in .NET applications',
  sections: [
    {
      id: 'profiling-tools',
      title: 'Profiling Tools & Techniques',
      content: `Profiling helps identify where your application spends time and resources.`,
      subsections: [
        {
          title: 'Using Stopwatch for Manual Profiling',
          code: `var stopwatch = Stopwatch.StartNew();

// Code to measure
var result = ExpensiveOperation();

stopwatch.Stop();
Console.WriteLine($"Time taken: {stopwatch.ElapsedMilliseconds}ms");`,
        },
        {
          title: 'Memory Profiling',
          code: `// Track memory before and after
long memBefore = GC.GetTotalMemory(true);

var largeList = Enumerable.Range(1, 1000000).ToList();

long memAfter = GC.GetTotalMemory(false);
Console.WriteLine($"Memory used: {(memAfter - memBefore) / 1024 / 1024}MB");

// Force cleanup
GC.Collect();
GC.WaitForPendingFinalizers();`,
        },
      ],
      tips: [
        'Use BenchmarkDotNet for accurate measurements',
        'Profile in Release mode, not Debug',
        'Always warm up before measuring',
        'Take multiple measurements and calculate averages',
      ],
    },
    {
      id: 'caching-strategies',
      title: 'Caching Strategies',
      content: `Caching reduces database calls and improves response times significantly.`,
      subsections: [
        {
          title: 'In-Memory Caching',
          code: `public class UserService
{
    private readonly IMemoryCache _cache;
    private readonly IUserRepository _repository;
    
    public UserService(IMemoryCache cache, IUserRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }
    
    public async Task<User> GetUserAsync(int id)
    {
        var cacheKey = $"user_{id}";
        
        if (!_cache.TryGetValue(cacheKey, out User user))
        {
            user = await _repository.GetUserByIdAsync(id);
            
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(30));
            
            _cache.Set(cacheKey, user, cacheOptions);
        }
        
        return user;
    }
}`,
        },
        {
          title: 'Distributed Caching with Redis',
          code: `public class CachedUserRepository : IUserRepository
{
    private readonly IUserRepository _innerRepository;
    private readonly IDistributedCache _cache;
    
    public async Task<User> GetUserByIdAsync(int id)
    {
        var cacheKey = $"user_{id}";
        var cachedUser = await _cache.GetStringAsync(cacheKey);
        
        if (!string.IsNullOrEmpty(cachedUser))
        {
            return JsonSerializer.Deserialize<User>(cachedUser);
        }
        
        var user = await _innerRepository.GetUserByIdAsync(id);
        
        var options = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromHours(1));
        
        await _cache.SetStringAsync(cacheKey, 
            JsonSerializer.Serialize(user), options);
        
        return user;
    }
}`,
        },
      ],
      tips: [
        'Use IMemoryCache for single-server applications',
        'Use Redis for distributed systems',
        'Set appropriate TTL values',
        'Implement cache invalidation strategies',
      ],
    },
    {
      id: 'query-optimization',
      title: 'Database Query Optimization',
      content: `Optimize queries to reduce database round-trips and improve performance.`,
      subsections: [
        {
          title: 'N+1 Query Problem',
          code: `// BAD: N+1 queries
var orders = await _context.Orders.ToListAsync();
foreach (var order in orders)
{
    order.Customer = await _context.Customers
        .FirstOrDefaultAsync(c => c.Id == order.CustomerId);
}

// GOOD: Single query with eager loading
var orders = await _context.Orders
    .Include(o => o.Customer)
    .ToListAsync();`,
        },
        {
          title: 'Projection to Reduce Data Transfer',
          code: `// BAD: Load entire entity
var users = await _context.Users.ToListAsync();

// GOOD: Project only needed fields
var userSummaries = await _context.Users
    .Select(u => new UserSummary 
    { 
        Id = u.Id, 
        Name = u.Name, 
        Email = u.Email 
    })
    .ToListAsync();`,
        },
        {
          title: 'Batch Operations',
          code: `// BAD: Multiple roundtrips
foreach (var user in users)
{
    user.IsActive = false;
    await _context.SaveChangesAsync();
}

// GOOD: Single batch operation
foreach (var user in users)
{
    user.IsActive = false;
}
await _context.SaveChangesAsync();`,
        },
      ],
      tips: [
        'Use Include() to load related data',
        'Use Select() to project only needed columns',
        'Use AsNoTracking() for read-only queries',
        'Use batch operations for multiple changes',
      ],
    },
    {
      id: 'async-programming',
      title: 'Async/Await Best Practices',
      content: `Proper async programming improves scalability and responsiveness.`,
      subsections: [
        {
          title: 'Async All The Way',
          code: `// BAD: Blocking calls
public User GetUser(int id)
{
    return _repository.GetUserAsync(id).Result; // Deadlock risk!
}

// GOOD: Async all the way
public async Task<User> GetUserAsync(int id)
{
    return await _repository.GetUserAsync(id);
}`,
        },
        {
          title: 'Parallel Async Operations',
          code: `// Bad: Sequential
var user = await _userService.GetUserAsync(userId);
var orders = await _orderService.GetOrdersAsync(userId);
var payments = await _paymentService.GetPaymentsAsync(userId);

// Good: Parallel execution
var (user, orders, payments) = await (
    _userService.GetUserAsync(userId),
    _orderService.GetOrdersAsync(userId),
    _paymentService.GetPaymentsAsync(userId)
).ToTuple();

// Or using Task.WhenAll
await Task.WhenAll(
    GetUserAsync(userId),
    GetOrdersAsync(userId),
    GetPaymentsAsync(userId)
);`,
        },
      ],
      tips: [
        'Use async/await throughout the call stack',
        'Avoid Task.Result and Task.Wait()',
        'Use Task.WhenAll() for parallel operations',
        'Configure HttpClient timeout appropriately',
      ],
    },
  ],
  interviewQuestions: [
    'What tools do you use to profile .NET applications?',
    'Explain the N+1 query problem and how to solve it.',
    'When would you use IMemoryCache vs Redis?',
    'What is the difference between synchronous and asynchronous code in terms of scalability?',
    'How do you handle cache invalidation?',
    'What are the dangers of using Task.Result?',
  ],
};
