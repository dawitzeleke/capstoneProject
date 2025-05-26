using Xunit;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Application.Dtos.AuthDtos;
using backend.Domain.Entities;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Application.Contracts.Persistence;
using FluentAssertions;
using backend.Application.Contracts.Persistence;

public class SignUpTeacherCommandHandlerTests
{
    private readonly Mock<ITeacherRepository> _teacherRepo = new();
    private readonly Mock<IStudentRepository> _studentRepo = new();
    private readonly Mock<IAdminRepository> _adminRepo = new();
    private readonly Mock<IJwtTokenGenerator> _jwtGenerator = new();
    private readonly Mock<IPasswordHasher<Teacher>> _passwordHasher = new();

    private readonly SignUpTeacherCommandHandler _handler;

    public SignUpTeacherCommandHandlerTests()
    {
        _handler = new SignUpTeacherCommandHandler(
            _teacherRepo.Object,
            _studentRepo.Object,
            _adminRepo.Object,
            _jwtGenerator.Object,
            _passwordHasher.Object
        );
    }

    [Fact]
    public async Task Handle_ValidRequest_ReturnsAuthResponse()
    {
        // Arrange
        var command = new SignUpTeacherCommand
        {
            Email = "teacher@example.com",
            Password = "StrongPass123!",
            FirstName = "Alice",
            LastName = "Smith",
            PhoneNumber = "1234567890"
        };

        _teacherRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync((Teacher)null);
        _studentRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync((Student)null);
        _adminRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync((Admin)null);

        _teacherRepo.Setup(x => x.GetByPhoneAsync(command.PhoneNumber)).ReturnsAsync((Teacher)null);
        _studentRepo.Setup(x => x.GetByPhoneAsync(command.PhoneNumber)).ReturnsAsync((Student)null);
        _adminRepo.Setup(x => x.GetByPhoneAsync(command.PhoneNumber)).ReturnsAsync((Admin)null);

        _passwordHasher.Setup(h => h.HashPassword(It.IsAny<Teacher>(), command.Password)).Returns("hashed-password");

        _jwtGenerator.Setup(t => t.GenerateToken(It.IsAny<string>(), command.Email, UserRole.Teacher.ToString()))
            .Returns("jwt-token");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(command.Email);
        result.Role.Should().Be(UserRole.Teacher);
        result.Token.Should().Be("jwt-token");

        _teacherRepo.Verify(x => x.CreateAsync(It.Is<Teacher>(t => t.Email == command.Email)), Times.Once);
    }

    [Fact]
    public async Task Handle_EmailAlreadyExists_ThrowsException()
    {
        // Arrange
        var command = new SignUpTeacherCommand
        {
            Email = "existing@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890"
        };

        _teacherRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync(new Teacher());

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_PhoneNumberAlreadyExists_ThrowsException()
    {
        // Arrange
        var command = new SignUpTeacherCommand
        {
            Email = "unique@example.com",
            Password = "Password123!",
            FirstName = "Jane",
            LastName = "Doe",
            PhoneNumber = "1234567890"
        };

        _teacherRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync((Teacher)null);
        _studentRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync((Student)null);
        _adminRepo.Setup(x => x.GetByEmailAsync(command.Email)).ReturnsAsync((Admin)null);

        _teacherRepo.Setup(x => x.GetByPhoneAsync(command.PhoneNumber)).ReturnsAsync(new Teacher());

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
    }
}
