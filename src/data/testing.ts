export const testingData = {
  id: 'testing',
  title: 'Testing Strategy for Senior Engineers',
  description: 'What to test, what to mock, and how seniors use xUnit, Testcontainers, and the test pyramid.',
  sections: [
    {
      topic: 'Pyramid, AAA, unit vs integration vs e2e',
      difficulty: 'senior',
      english: 'Unit tests are fast, isolated, and test domain rules. Integration tests spin real collaborators (SQL, HTTP pipeline) and catch EF translation bugs. E2E tests a user journey and are few because they are slow and flaky. AAA: Arrange, Act, Assert — one act per test. Coverage % is a lagging indicator; seniors cover money paths and regressions from incidents, not getters.',
      bangla: 'ইউনিট দ্রুত, ইন্টিগ্রেশন EF/SQL ধরে, E2E কম। কাভারেজ % নয় — মানি পাথ ও রিগ্রেশন।',
      details: `
| Layer | Example | Mock? |
| :--- | :--- | :--- |
| Unit | Discount calculator | Yes, IO |
| Integration | EF query, API + TestServer | Real DB |
| E2E | Browser checkout | Almost nothing |
      `,
      commonMistakes: ['Mocking IQueryable.', '100% coverage on Program.cs.', 'Testing the mock instead of the system.'],
      bestPractices: ['Name tests Scenario_Expected.', 'One reason to fail.', 'Regression test for every production bug.'],
      interviewQs: [
        {
          q: 'What do you not unit test?',
          a: 'EF LINQ translation, serializer configuration, and thin mappings. Those need a real provider. I also do not test framework code. I unit test invariants and branching policy.',
          bangla: 'EF অনুবাদ ইউনিট টেস্ট নয় — ইন্টিগ্রেশন।',
          difficulty: 'senior',
        },
      ],
      practice: 'Write a unit test for a money calculation and an integration test for a query.',
      code: `[Fact]
public void Discount_Over500_AppliesTenPercent()
{
    var calc = new CartCalculator();
    var total = calc.Total(subtotal: 600m);
    Assert.Equal(570m, total); // 10% off, no shipping in this example
}`,
    },
    {
      topic: 'xUnit, Moq, FluentAssertions, doubles',
      difficulty: 'mid',
      english: 'xUnit: [Fact], [Theory], IClassFixture for shared setup, IAsyncLifetime for async init. Moq: Setup/Verify — verify only what matters. Test doubles: fake (in-memory), stub (canned), mock (behavior assert), spy, dummy. Prefer fakes over mocks for repositories when the fake is small.',
      bangla: 'Fact/Theory। মক কম, ফেইক বেশি। Verify শুধু গুরুত্বপূর্ণ কল।',
      details: `
Do not mock HttpMessageHandler poorly — use a fake handler or WireMock. Time: inject IClock.
      `,
      commonMistakes: ['VerifyAll() noise.', 'Sharing DbContext between tests without isolation.'],
      bestPractices: ['Theories for edge cases.', 'CancellationToken in SUT signatures so tests can pass TestContext token.'],
      interviewQs: [
        {
          q: 'Mock vs fake?',
          a: 'A mock asserts interactions (Times.Once). A fake is a working lightweight implementation (in-memory repo). Seniors use fakes for state and mocks for "did we call the gateway once with this idempotency key."',
          bangla: 'মক ইন্টারঅ্যাকশন, ফেইক কাজ করে এমন হালকা ইমপ্লিমেন্টেশন।',
          difficulty: 'senior',
        },
      ],
      practice: 'Replace a mocked repository with an in-memory fake for a service test.',
      code: `var gateway = new Mock<IPaymentGateway>();
gateway.Setup(g => g.ChargeAsync(It.IsAny<Money>(), "k1", It.IsAny<CancellationToken>()))
    .ReturnsAsync(ChargeResult.Ok);
var sut = new CheckoutService(gateway.Object, new FakeOrders());
await sut.PayAsync(cmd, "k1", CancellationToken.None);
gateway.Verify(g => g.ChargeAsync(It.IsAny<Money>(), "k1", It.IsAny<CancellationToken>()), Times.Once);`,
    },
    {
      topic: 'EF, HttpClient, Testcontainers, async tests',
      difficulty: 'expert',
      english: 'Use Testcontainers or SQLite with caveats (SQL Server dialect differs). WebApplicationFactory for the HTTP pipeline. Never .Result in tests — await. Testing async: always pass CancellationToken; assert cancel path. Snapshot SQL with EF logging in a focused test if a query regressed.',
      bangla: 'Testcontainers সত্যিকারের SQL। WebApplicationFactory পাইপলাইন। টেস্টেও await।',
      details: `
In-memory EF provider is not SQL Server — it lies. Prefer dockerized SQL for anything with SQL functions, transactions, or concurrency tokens.
      `,
      commonMistakes: ['In-memory provider for production SQL features.', 'One giant fixture that all tests mutate.'],
      bestPractices: ['Respawn or unique DB per class.', 'Seed explicitly in Arrange.'],
      interviewQs: [
        {
          q: 'How do you test EF Core queries?',
          a: 'Integration test against a real engine (Testcontainers). Arrange seed data, Act query, Assert DTO shape and SQL if needed via logging. I do not mock DbSet. For domain logic, keep it off IQueryable.',
          bangla: 'আসল SQL ইঞ্জিন। DbSet মক নয়।',
          difficulty: 'expert',
        },
      ],
      practice: 'Add a WebApplicationFactory test that POSTs /orders and expects 201.',
      code: `public class OrdersApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    public OrdersApiTests(WebApplicationFactory<Program> f) => _client = f.CreateClient();

    [Fact]
    public async Task Create_Returns201()
    {
        var res = await _client.PostAsJsonAsync("/orders", new { sku = "A", qty = 1 });
        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
    }
}`,
    },
  ],
  quickRevision: {
    concepts: [
      'Pyramid',
      'AAA',
      'Do not mock IQueryable',
      'Fact vs Theory',
      'Fake vs mock',
      'IClock',
      'WebApplicationFactory',
      'Testcontainers',
      'In-memory EF lies',
      'Regression tests from incidents',
    ],
    questions: [
      'What not to unit test?',
      'Mock vs fake?',
      'How to test EF?',
      'How to test HttpClient?',
      'Coverage traps?',
      'How to test cancellation?',
      'Shared fixture isolation?',
      'When e2e?',
      'How to test auth policies?',
      'Flaky tests — what do you do?',
    ],
    mistakes: [
      'Mock IQueryable',
      'In-memory EF for SQL Server features',
      '.Result in tests',
      'Testing mocks',
      'No regression test after outage',
    ],
    scenarios: [
      'CI green, prod SQL fails',
      'Flaky e2e blocking release',
      'Team worships 100% coverage',
      'Need to test a migration',
      'Policy authorization bug',
    ],
  },
  revisionSummary: `
- Test the money path for real. Mock at the edges, not IQueryable.
- Every incident deserves a regression test.
  `,
  summary: 'সিনিয়র টেস্টিং মানে ঝুঁকি কমানো — মক থিয়েটার নয়।',
};
