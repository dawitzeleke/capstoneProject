using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Application.Tests.Unit.Auth.SignUp
{
    public class SignUpStudentCommandHandlerTests
    {
        private readonly Mock<IStudentRepository> _studentRepositoryMock;
        private readonly Mock<ITeacherRepository> _teacherRepositoryMock;
        private readonly Mock<IAdminRepository> _adminRepositoryMock;
        private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
        private readonly Mock<IPasswordHasher<Student>> _passwordHasherMock;
        private readonly SignUpStudentCommandHandler _handler;

        public SignUpStudentCommandHandlerTests()
        {
            _studentRepositoryMock = new Mock<IStudentRepository>();
            _teacherRepositoryMock = new Mock<ITeacherRepository>();
            _adminRepositoryMock = new Mock<IAdminRepository>();
            _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
            _passwordHasherMock = new Mock<IPasswordHasher<Student>>();

            _handler = new SignUpStudentCommandHandler(
                _studentRepositoryMock.Object,
                _teacherRepositoryMock.Object,
                _adminRepositoryMock.Object,
                _jwtTokenGeneratorMock.Object,
                _passwordHasherMock.Object
            );
        }

        [Fact]
        public async Task Handle_ValidRequest_ReturnsAuthResponse()
        {
            // Arrange
            var command = new SignUpStudentCommand
            {
                Email = "test@example.com",
                Password = "Password123!",
                FirstName = "John",
                LastName = "Doe",
                PhoneNumber = "1234567890",
                Grade = 10
            };

            _studentRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync((Student)null);
            _teacherRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync((Teacher)null);
            _adminRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync((Admin)null);

            _studentRepositoryMock.Setup(x => x.GetByPhoneAsync(command.PhoneNumber))
                .ReturnsAsync((Student)null);
            _teacherRepositoryMock.Setup(x => x.GetByPhoneAsync(command.PhoneNumber))
                .ReturnsAsync((Teacher)null);
            _adminRepositoryMock.Setup(x => x.GetByPhoneAsync(command.PhoneNumber))
                .ReturnsAsync((Admin)null);

            _passwordHasherMock.Setup(x => x.HashPassword(It.IsAny<Student>(), command.Password))
                .Returns("hashedPassword");

            _jwtTokenGeneratorMock.Setup(x => x.GenerateToken(It.IsAny<string>(), command.Email, UserRole.Student.ToString()))
                .Returns("jwtToken");

            // Act
            var result = await _handler.Handle(command, default);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(command.Email, result.Email);
            Assert.Equal(UserRole.Student, result.Role);
            Assert.Equal("jwtToken", result.Token);

            _studentRepositoryMock.Verify(x => x.CreateAsync(It.IsAny<Student>()), Times.Once);
        }

        [Fact]
        public async Task Handle_EmailExists_ThrowsException()
        {
            // Arrange
            var command = new SignUpStudentCommand
            {
                Email = "existing@example.com",
                Password = "Password123!",
                FirstName = "John",
                LastName = "Doe",
                PhoneNumber = "1234567890",
                Grade = 10
            };

            _studentRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync(new Student());

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, default));
        }

        [Fact]
        public async Task Handle_PhoneNumberExists_ThrowsException()
        {
            // Arrange
            var command = new SignUpStudentCommand
            {
                Email = "test@example.com",
                Password = "Password123!",
                FirstName = "John",
                LastName = "Doe",
                PhoneNumber = "1234567890",
                Grade = 10
            };

            _studentRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync((Student)null);
            _teacherRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync((Teacher)null);
            _adminRepositoryMock.Setup(x => x.GetByEmailAsync(command.Email))
                .ReturnsAsync((Admin)null);

            _studentRepositoryMock.Setup(x => x.GetByPhoneAsync(command.PhoneNumber))
                .ReturnsAsync(new Student());

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, default));
        }
    }
}
