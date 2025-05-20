using Xunit;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using backend.Application.Contracts.Persistence;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Application.Dtos.AuthDtos;
using Application.Contracts.Persistence;
using System;
using FluentAssertions;
using backend.Domain.Entities;

public class SignInQueryHandlerTests
{
    private readonly Mock<IStudentRepository> _studentRepo = new();
    private readonly Mock<ITeacherRepository> _teacherRepo = new();
    private readonly Mock<IAdminRepository> _adminRepo = new();
    private readonly Mock<IJwtTokenGenerator> _tokenGenerator = new();
    private readonly Mock<IPasswordHasher<Student>> _studentHasher = new();
    private readonly Mock<IPasswordHasher<Teacher>> _teacherHasher = new();
    private readonly Mock<IPasswordHasher<Admin>> _adminHasher = new();

    private readonly SignInQueryHandler _handler;

    public SignInQueryHandlerTests()
    {
        _handler = new SignInQueryHandler(
            _studentRepo.Object,
            _teacherRepo.Object,
            _adminRepo.Object,
            _tokenGenerator.Object,
            _studentHasher.Object,
            _teacherHasher.Object,
            _adminHasher.Object
        );
    }

    [Fact]
    public async Task Handle_ShouldReturnStudentToken_WhenStudentLoginIsValid()
    {
        // Arrange
        var student = new Student { Id = "1", Email = "student@example.com", PasswordHash = "hashed" };
        var query = new SignInQuery { Email = student.Email, Password = "password" };

        _studentRepo.Setup(r => r.GetByEmailAsync(student.Email)).ReturnsAsync(student);
        _studentHasher.Setup(h => h.VerifyHashedPassword(student, student.PasswordHash, query.Password))
            .Returns(PasswordVerificationResult.Success);
        _tokenGenerator.Setup(t => t.GenerateToken(student.Id, student.Email, "Student")).Returns("student-token");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Email.Should().Be(student.Email);
        result.Role.Should().Be(UserRole.Student);
        result.Token.Should().Be("student-token");
    }

    [Fact]
    public async Task Handle_ShouldReturnTeacherToken_WhenTeacherLoginIsValid()
    {
        // Arrange
        var teacher = new Teacher { Id = "2", Email = "teacher@example.com", PasswordHash = "hashed" };
        var query = new SignInQuery { Email = teacher.Email, Password = "password" };

        _studentRepo.Setup(r => r.GetByEmailAsync(teacher.Email)).ReturnsAsync((Student)null);
        _teacherRepo.Setup(r => r.GetByEmailAsync(teacher.Email)).ReturnsAsync(teacher);
        _teacherHasher.Setup(h => h.VerifyHashedPassword(teacher, teacher.PasswordHash, query.Password))
            .Returns(PasswordVerificationResult.Success);
        _tokenGenerator.Setup(t => t.GenerateToken(teacher.Id, teacher.Email, "Teacher")).Returns("teacher-token");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Email.Should().Be(teacher.Email);
        result.Role.Should().Be(UserRole.Teacher);
        result.Token.Should().Be("teacher-token");
    }

    [Fact]
    public async Task Handle_ShouldReturnAdminToken_WhenAdminLoginIsValid()
    {
        // Arrange
        var admin = new Admin { Id = "3", Email = "admin@example.com", PasswordHash = "hashed", IsSuperAdmin = false };
        var query = new SignInQuery { Email = admin.Email, Password = "password" };

        _studentRepo.Setup(r => r.GetByEmailAsync(admin.Email)).ReturnsAsync((Student)null);
        _teacherRepo.Setup(r => r.GetByEmailAsync(admin.Email)).ReturnsAsync((Teacher)null);
        _adminRepo.Setup(r => r.GetByEmailAsync(admin.Email)).ReturnsAsync(admin);
        _adminHasher.Setup(h => h.VerifyHashedPassword(admin, admin.PasswordHash, query.Password))
            .Returns(PasswordVerificationResult.Success);
        _tokenGenerator.Setup(t => t.GenerateToken(admin.Id, admin.Email, "Admin")).Returns("admin-token");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Email.Should().Be(admin.Email);
        result.Role.Should().Be(UserRole.Admin);
        result.Token.Should().Be("admin-token");
    }

    [Fact]
    public async Task Handle_ShouldReturnSuperAdminToken_WhenSuperAdminLoginIsValid()
    {
        // Arrange
        var admin = new Admin { Id = "4", Email = "super@example.com", PasswordHash = "hashed", IsSuperAdmin = true };
        var query = new SignInQuery { Email = admin.Email, Password = "password" };

        _studentRepo.Setup(r => r.GetByEmailAsync(admin.Email)).ReturnsAsync((Student)null);
        _teacherRepo.Setup(r => r.GetByEmailAsync(admin.Email)).ReturnsAsync((Teacher)null);
        _adminRepo.Setup(r => r.GetByEmailAsync(admin.Email)).ReturnsAsync(admin);
        _adminHasher.Setup(h => h.VerifyHashedPassword(admin, admin.PasswordHash, query.Password))
            .Returns(PasswordVerificationResult.Success);
        _tokenGenerator.Setup(t => t.GenerateToken(admin.Id, admin.Email, "SuperAdmin")).Returns("super-token");

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Email.Should().Be(admin.Email);
        result.Role.Should().Be(UserRole.SuperAdmin);
        result.Token.Should().Be("super-token");
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenPasswordInvalid()
    {
        // Arrange
        var student = new Student { Id = "1", Email = "student@example.com", PasswordHash = "hashed" };
        var query = new SignInQuery { Email = student.Email, Password = "wrong-password" };

        _studentRepo.Setup(r => r.GetByEmailAsync(student.Email)).ReturnsAsync(student);
        _studentHasher.Setup(h => h.VerifyHashedPassword(student, student.PasswordHash, query.Password))
            .Returns(PasswordVerificationResult.Failed);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _handler.Handle(query, CancellationToken.None));
    }
}
