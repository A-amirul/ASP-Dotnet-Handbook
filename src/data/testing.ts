export const testingContent = {
  id: 'testing',
  title: 'Unit Testing & Test-Driven Development',
  description: 'Master testing frameworks and TDD principles for .NET applications',
  sections: [
    {
      id: 'unit-testing-basics',
      title: 'Unit Testing Fundamentals',
      content: `Unit testing is the foundation of reliable code. In .NET, you'll primarily use xUnit, NUnit, or MSTest.`,
      subsections: [
        {
          title: 'Arrange-Act-Assert Pattern',
          code: `[Fact]
public void Add_TwoPositiveNumbers_ReturnsSum()
{
    // Arrange
    var calculator = new Calculator();
    
    // Act
    var result = calculator.Add(2, 3);
    
    // Assert
    Assert.Equal(5, result);
}`,
        },
        {
          title: 'Using xUnit with Theory',
          code: `[Theory]
[InlineData(2, 3, 5)]
[InlineData(1, 1, 2)]
[InlineData(0, 0, 0)]
public void Add_MultipleInputs_ReturnsCorrectSum(int a, int b, int expected)
{
    var calculator = new Calculator();
    var result = calculator.Add(a, b);
    Assert.Equal(expected, result);
}`,
        },
      ],
      tips: [
        'Test one thing per test method',
        'Use descriptive test names that explain the scenario',
        'Keep tests isolated and independent',
        'Mock external dependencies',
      ],
    },
    {
      id: 'mocking-dependencies',
      title: 'Mocking Dependencies with Moq',
      content: `Moq is the most popular mocking library for .NET. Use it to isolate units under test.`,
      subsections: [
        {
          title: 'Setting Up Mocks',
          code: `[Fact]
public void GetUser_WithValidId_ReturnUser()
{
    // Arrange
    var mockRepository = new Mock<IUserRepository>();
    var user = new User { Id = 1, Name = "John" };
    mockRepository.Setup(r => r.GetUserById(1))
        .ReturnsAsync(user);
    
    var service = new UserService(mockRepository.Object);
    
    // Act
    var result = await service.GetUserAsync(1);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("John", result.Name);
    mockRepository.Verify(r => r.GetUserById(1), Times.Once);
}`,
        },
        {
          title: 'Mocking Async Methods',
          code: `var mock = new Mock<IDataService>();
mock.Setup(m => m.GetDataAsync(It.IsAny<int>()))
    .ReturnsAsync(new Data { Id = 1, Value = "test" });

mock.Setup(m => m.DeleteAsync(It.IsAny<int>()))
    .Returns(Task.CompletedTask);`,
        },
      ],
      tips: [
        'Mock interfaces, not concrete classes',
        'Use It.IsAny<T>() for flexible matching',
        'Verify critical calls with Verify()',
        'Use Strict mock mode for strict verification',
      ],
    },
    {
      id: 'integration-testing',
      title: 'Integration Testing',
      content: `Integration tests verify that multiple components work together correctly.`,
      subsections: [
        {
          title: 'Testing with WebApplicationFactory',
          code: `public class UserControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    
    public UserControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }
    
    [Fact]
    public async Task GetUser_WithValidId_ReturnsOk()
    {
        var client = _factory.CreateClient();
        
        var response = await client.GetAsync("/api/users/1");
        
        Assert.True(response.IsSuccessStatusCode);
    }
}`,
        },
        {
          title: 'Custom Web Application Factory',
          code: `public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(IUserRepository));
            
            services.Remove(descriptor);
            
            services.AddScoped<IUserRepository>(_ => 
                new MockUserRepository());
        });
    }
}`,
        },
      ],
      tips: [
        'Use WebApplicationFactory for in-memory testing',
        'Override ConfigureWebHost to customize test setup',
        'Test actual database with SQLite in-memory',
        'Clean up database state between tests',
      ],
    },
    {
      id: 'test-driven-development',
      title: 'Test-Driven Development (TDD)',
      content: `TDD follows the Red-Green-Refactor cycle: write failing test, make it pass, then refactor.`,
      subsections: [
        {
          title: 'Red-Green-Refactor Example',
          code: `// RED: Write test that fails
[Fact]
public void ValidateEmail_WithInvalidEmail_ReturnsFalse()
{
    var validator = new EmailValidator();
    Assert.False(validator.IsValid("invalid-email"));
}

// GREEN: Write minimum code to pass
public class EmailValidator
{
    public bool IsValid(string email) => 
        email.Contains("@") && email.Contains(".");
}

// REFACTOR: Improve implementation
public class EmailValidator
{
    private readonly string _emailPattern = @"^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
    
    public bool IsValid(string email) => 
        Regex.IsMatch(email, _emailPattern);
}`,
        },
      ],
      tips: [
        'Start with failing tests',
        'Write minimum code to pass',
        'Refactor for clarity and performance',
        'Keep test-to-code ratio 1:1 or higher',
      ],
    },
  ],
  interviewQuestions: [
    'Explain the difference between unit and integration tests.',
    'What is the AAA pattern in testing?',
    'How do you test async methods in C#?',
    'What is the difference between Times.Once, Times.AtLeast, and Times.Never in Moq?',
    'Describe TDD and its benefits.',
    'How do you handle database state in integration tests?',
  ],
};
