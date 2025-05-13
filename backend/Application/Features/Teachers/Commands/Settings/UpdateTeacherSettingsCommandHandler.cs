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
        var userName = await _teacherRepository.GetByUserNameAsync(request.UserName);
        if (userName != null)
            throw new Exception("Username already exists");

        if (request.ProfilePicture != null)
        {
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ProfilePicture, "ProfilePictures");

            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("Failed to upload profile picture");

            teacher.ProfilePictureUrl = uploadResult.Url;
            teacher.ProfilePicturePublicId = uploadResult.PublicId;
        }

        _mapper.Map(request, teacher); 

        await _teacherRepository.UpdateAsync(teacher);
        return true;
    }
}
