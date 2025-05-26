using Xunit;
using Moq;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Http;
using System.IO;
using FluentAssertions;
using backend.Application.Dtos.CloudinaryDtos;
public class UpdateAdminProfileCommandHandlerTests
{
    private readonly Mock<IAdminRepository> _adminRepo = new();
    private readonly Mock<IStudentRepository> _studentRepo = new();
    private readonly Mock<ITeacherRepository> _teacherRepo = new();
    private readonly Mock<ICloudinaryService> _cloudinary = new();
    private readonly Mock<ICurrentUserService> _currentUser = new();

    private readonly UpdateAdminProfileCommandHandler _handler;

    public UpdateAdminProfileCommandHandlerTests()
    {
        _handler = new UpdateAdminProfileCommandHandler(
            _studentRepo.Object,
            null!, 
            _currentUser.Object,
            _cloudinary.Object,
            _teacherRepo.Object,
            _adminRepo.Object
        );
    }

    [Fact]
    public async Task Handle_ValidRequest_UpdatesProfile()
    {
        
        var admin = new Admin
        {
            Id = "admin123",
            Email = "old@example.com",
            PhoneNumber = "0000"
        };

        _currentUser.Setup(x => x.UserId).Returns(admin.Id);
        _adminRepo.Setup(x => x.GetByIdAsync(admin.Id)).ReturnsAsync(admin);
        _adminRepo.Setup(x => x.UpdateAsync(It.IsAny<Admin>())).ReturnsAsync(admin);

        var command = new UpdateAdminProfileCommand
        {
            FirstName = "New",
            LastName = "Name",
            Email = "new@example.com",
            PhoneNumber = "1234567890"
        };

      
        var result = await _handler.Handle(command, CancellationToken.None);

     
        result.FirstName.Should().Be("New");
        result.Email.Should().Be("new@example.com");
        _adminRepo.Verify(x => x.UpdateAsync(It.Is<Admin>(a => a.FirstName == "New")), Times.Once);
    }

    [Fact]
    public async Task Handle_DuplicateEmail_ThrowsException()
    {
      
        var admin = new Admin { Id = "admin1", Email = "a@a.com" };
        var existingStudent = new Student { Id = "s1", Email = "conflict@example.com" };

        _currentUser.Setup(x => x.UserId).Returns(admin.Id);
        _adminRepo.Setup(x => x.GetByIdAsync(admin.Id)).ReturnsAsync(admin);
        _studentRepo.Setup(x => x.GetByEmailAsync("conflict@example.com")).ReturnsAsync(existingStudent);

        var command = new UpdateAdminProfileCommand { Email = "conflict@example.com" };

       
        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_RemoveProfilePicture_DeletesCloudinaryFile()
    {
        var admin = new Admin
        {
            Id = "admin1",
            ProfilePicturePublicId = "cloud-id",
            ProfilePictureUrl = "url"
        };

        _currentUser.Setup(x => x.UserId).Returns(admin.Id);
        _adminRepo.Setup(x => x.GetByIdAsync(admin.Id)).ReturnsAsync(admin);
        _adminRepo.Setup(x => x.UpdateAsync(It.IsAny<Admin>())).ReturnsAsync(admin);

        var command = new UpdateAdminProfileCommand { RemoveProfilePicture = true };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _cloudinary.Verify(x => x.Delete("cloud-id"), Times.Once);
        result.ProfilePictureUrl.Should().BeNull();
    }

    [Fact]
    public async Task Handle_UploadProfilePicture_DeletesOldAndUploadsNew()
    {
        var admin = new Admin
        {
            Id = "admin1",
            ProfilePicturePublicId = "old-id"
        };

        var mockFile = new Mock<IFormFile>();
        var fileStream = new MemoryStream();
        var fileName = "test.jpg";

        mockFile.Setup(f => f.FileName).Returns(fileName);
        mockFile.Setup(f => f.Length).Returns(1000);
        mockFile.Setup(f => f.OpenReadStream()).Returns(fileStream);

        _currentUser.Setup(x => x.UserId).Returns(admin.Id);
        _adminRepo.Setup(x => x.GetByIdAsync(admin.Id)).ReturnsAsync(admin);
        _adminRepo.Setup(x => x.UpdateAsync(It.IsAny<Admin>())).ReturnsAsync(admin);

        _cloudinary.Setup(x => x.UploadFileAsync(It.IsAny<IFormFile>(), "ProfilePictures"))
            .ReturnsAsync(new UploadResponse
            {
                Url = "https://cloud.com/new.jpg",
                PublicId = "new-id"
            });

        var command = new UpdateAdminProfileCommand { ProfilePicture = mockFile.Object };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.ProfilePictureUrl.Should().Be("https://cloud.com/new.jpg");
        _cloudinary.Verify(x => x.Delete("old-id"), Times.Once);
        _cloudinary.Verify(x => x.UploadFileAsync(mockFile.Object, "ProfilePictures"), Times.Once);
    }

    [Fact]
    public async Task Handle_AdminNotFound_ThrowsException()
    {
        _currentUser.Setup(x => x.UserId).Returns("bad-id");
        _adminRepo.Setup(x => x.GetByIdAsync("bad-id")).ReturnsAsync((Admin)null);

        var command = new UpdateAdminProfileCommand { FirstName = "Any" };

        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
    }
}
