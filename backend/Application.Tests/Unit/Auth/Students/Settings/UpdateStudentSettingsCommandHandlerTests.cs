using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using Domain.Entities;
using Moq;
using Xunit;

public class UpdateStudentSettingsCommandHandlerTests
{
    private readonly Mock<IStudentRepository> _studentRepoMock = new();
    private readonly Mock<ITeacherRepository> _teacherRepoMock = new();
    private readonly Mock<IAdminRepository> _adminRepoMock = new();
    private readonly Mock<ICurrentUserService> _currentUserServiceMock = new();
    private readonly Mock<ICloudinaryService> _cloudinaryServiceMock = new();
    private readonly Mock<IMapper> _mapperMock = new();

    private readonly UpdateStudentSettingsCommandHandler _handler;

    public UpdateStudentSettingsCommandHandlerTests()
    {
        _handler = new UpdateStudentSettingsCommandHandler(
            _studentRepoMock.Object,
            _mapperMock.Object,
            _currentUserServiceMock.Object,
            _cloudinaryServiceMock.Object,
            _teacherRepoMock.Object,
            _adminRepoMock.Object
        );
    }

    [Fact]
    public async Task Handle_ValidUpdateRequest_ShouldUpdateStudentAndReturnTrue()
    {
        // Arrange
        var studentId = "student-123";
        _currentUserServiceMock.Setup(s => s.UserId).Returns(studentId);

        var existingStudent = new Student
        {
            Id = studentId,
            UserName = "oldUsername",
            Email = "old@example.com",
            PhoneNumber = "0911223344",
            FirstName = "OldFirst",
            LastName = "OldLast",
            ProgressLevel = "Beginner",
            School = "Old School",
            Grade = 9
        };

        _studentRepoMock.Setup(r => r.GetByIdAsync(studentId))
            .ReturnsAsync(existingStudent);

        _studentRepoMock.Setup(r => r.GetByUserNameAsync(It.IsAny<string>())).ReturnsAsync((Student)null);
        _teacherRepoMock.Setup(r => r.GetByUserNameAsync(It.IsAny<string>())).ReturnsAsync((Teacher)null);

        _studentRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((Student)null);
        _teacherRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((Teacher)null);
        _adminRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((Admin)null);

        _studentRepoMock.Setup(r => r.GetByPhoneAsync(It.IsAny<string>())).ReturnsAsync((Student)null);
        _teacherRepoMock.Setup(r => r.GetByPhoneAsync(It.IsAny<string>())).ReturnsAsync((Teacher)null);
        _adminRepoMock.Setup(r => r.GetByPhoneAsync(It.IsAny<string>())).ReturnsAsync((Admin)null);

        var command = new UpdateStudentSettingsCommand
        {
            FirstName = "NewFirst",
            LastName = "NewLast",
            Email = "new@example.com",
            UserName = "newUsername",
            PhoneNumber = "0911555666",
            ProgressLevel = "Intermediate",
            School = "New School",
            Grade = 10
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result);

        _studentRepoMock.Verify(r => r.UpdateAsync(It.Is<Student>(s =>
            s.FirstName == "NewFirst" &&
            s.LastName == "NewLast" &&
            s.Email == "new@example.com" &&
            s.UserName == "newUsername" &&
            s.PhoneNumber == "0911555666" &&
            s.ProgressLevel == "Intermediate" &&
            s.School == "New School" &&
            s.Grade == 10
        )), Times.Once);
    }
}
