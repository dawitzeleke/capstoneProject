using AutoMapper;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using MediatR;

public class UpdateTeacherSettingsCommandHandler : IRequestHandler<UpdateTeacherSettingsCommand, bool>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IMapper _mapper;

    public UpdateTeacherSettingsCommandHandler(
        ITeacherRepository teacherRepository,
        IMapper mapper,
        ICurrentUserService currentUserService,
        ICloudinaryService cloudinaryService)
    {
        _teacherRepository = teacherRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<bool> Handle(UpdateTeacherSettingsCommand request, CancellationToken cancellationToken)
    {
        var teacher = await _teacherRepository.GetByIdAsync(_currentUserService.UserId);
        if (teacher == null)
            throw new Exception("Teacher not found");

        if (!string.IsNullOrWhiteSpace(request.UserName))
        {
            var existingUser = await _teacherRepository.GetByUserNameAsync(request.UserName);
            if (existingUser != null && existingUser.Id != teacher.Id)
                throw new Exception("Username already exists");
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var existingUser = await _teacherRepository.GetByEmailAsync(request.Email);
            if (existingUser != null && existingUser.Id != teacher.Id)
                throw new Exception("Email already exists");
        }

        if (request.RemoveProfilePicture)
        {
            if (!string.IsNullOrEmpty(teacher.ProfilePicturePublicId))
            {
                await _cloudinaryService.Delete(teacher.ProfilePicturePublicId);
            }

            teacher.ProfilePictureUrl = null;
            teacher.ProfilePicturePublicId = null;
        }

        if (request.ProfilePicture != null)
        {
            if (!string.IsNullOrEmpty(teacher.ProfilePicturePublicId))
            {
                await _cloudinaryService.Delete(teacher.ProfilePicturePublicId);
            }

            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ProfilePicture, "ProfilePictures");

            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("Failed to upload profile picture");

            teacher.ProfilePictureUrl = uploadResult.Url;
            teacher.ProfilePicturePublicId = uploadResult.PublicId;
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
            teacher.FirstName = request.FirstName;

        if (!string.IsNullOrWhiteSpace(request.LastName))
            teacher.LastName = request.LastName;

        if (!string.IsNullOrWhiteSpace(request.Email))
            teacher.Email = request.Email;

        if (!string.IsNullOrWhiteSpace(request.UserName))
            teacher.UserName = request.UserName;

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            teacher.PhoneNumber = request.PhoneNumber;

        await _teacherRepository.UpdateAsync(teacher);
        return true;
    }
}
