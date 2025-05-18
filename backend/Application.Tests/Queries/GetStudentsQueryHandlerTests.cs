using Xunit;
using Moq;
using backend.Application.Contracts.Persistence;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using backend.Domain.Entities;

public class GetStudentsQueryHandlerTests
{
    private readonly Mock<IStudentRepository> _studentRepositoryMock;
    private readonly GetstudentsQueryHandler _handler;

    public GetStudentsQueryHandlerTests()
    {
        _studentRepositoryMock = new Mock<IStudentRepository>();
        _handler = new GetstudentsQueryHandler(_studentRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnStudentDtos_WhenStudentsExist()
    {
        
        var students = new List<Student>
        {
            new Student { Id = "1", FirstName = "John", LastName = "Doe", Email = "john@example.com" }
        };

        _studentRepositoryMock.Setup(r => r.GetStudentsAsync(null, 1, 10))
            .ReturnsAsync(students);

        var query = new GetStudentsQuery { PageNumber = 1, PageSize = 10 };

      
        var result = await _handler.Handle(query, CancellationToken.None);

        
        Assert.Single(result);
        Assert.Equal("John", result[0].FirstName);
    }
}
