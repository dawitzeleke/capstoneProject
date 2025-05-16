using AutoMapper;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using MediatR;

public class UpdateStudentSettingsCommandHandler : IRequestHandler<UpdateStudentSettingsCommand, bool>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IStudentRepository _studentRepository;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IMapper _mapper;

    public UpdateStudentSettingsCommandHandler(
        IStudentRepository studentRepository,
        IMapper mapper,
        ICurrentUserService currentUserService,
        ICloudinaryService cloudinaryService)
    {
        _studentRepository = studentRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<bool> Handle(UpdateStudentSettingsCommand request, CancellationToken cancellationToken)
    {
        var student = await _studentRepository.GetByIdAsync(_currentUserService.UserId);
        if (student == null)
            throw new Exception("Student not found");

        Console.WriteLine($"Student found: {student.Id}");

        if (!string.IsNullOrWhiteSpace(request.UserName))
        {
            var existingUser = await _studentRepository.GetByUserNameAsync(request.UserName);
            if (existingUser != null && existingUser.Id != student.Id)
                throw new Exception("Username already exists");
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var existingUser = await _studentRepository.GetByEmailAsync(request.Email);
            if (existingUser != null && existingUser.Id != student.Id)
                throw new Exception("Email already exists");
        }

        if (request.RemoveProfilePicture)
        {
            if (!string.IsNullOrEmpty(student.ProfilePicturePublicId))
            {
                await _cloudinaryService.Delete(student.ProfilePicturePublicId);
            }

            student.ProfilePictureUrl = null;
            student.ProfilePicturePublicId = null;
        }

        if (request.ProfilePicture != null)
        {
            if (!string.IsNullOrEmpty(student.ProfilePicturePublicId))
            {
                await _cloudinaryService.Delete(student.ProfilePicturePublicId);
            }

            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ProfilePicture, "ProfilePictures");

            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("Failed to upload profile picture");

            student.ProfilePictureUrl = uploadResult.Url;
            student.ProfilePicturePublicId = uploadResult.PublicId;
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
            student.FirstName = request.FirstName;

        if (!string.IsNullOrWhiteSpace(request.LastName))
            student.LastName = request.LastName;

        if (!string.IsNullOrWhiteSpace(request.Email))
            student.Email = request.Email;

        if (!string.IsNullOrWhiteSpace(request.UserName))
            student.UserName = request.UserName;

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            student.PhoneNumber = request.PhoneNumber;

        if (!string.IsNullOrWhiteSpace(request.ProgressLevel))
            student.ProgressLevel = request.ProgressLevel;

        if (request.Grade.HasValue)
            student.Grade = request.Grade.Value;

        Console.WriteLine($"Mapping completed for student: {student.Id}");

        await _studentRepository.UpdateAsync(student);

        Console.WriteLine(student.ProfilePictureUrl);

        return true;
    }
}
