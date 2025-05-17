using AutoMapper;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

public class UpdateTeacherSettingsCommandHandler : IRequestHandler<UpdateTeacherSettingsCommand, bool>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IAdminRepository _adminRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IMapper _mapper;

    public UpdateTeacherSettingsCommandHandler(
        ITeacherRepository teacherRepository,
        IStudentRepository studentRepository,
        IAdminRepository adminRepository,
        IMapper mapper,
        ICurrentUserService currentUserService,
        ICloudinaryService cloudinaryService)
    {
        _teacherRepository = teacherRepository;
        _studentRepository = studentRepository;
        _adminRepository = adminRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<bool> Handle(UpdateTeacherSettingsCommand request, CancellationToken cancellationToken)
    {
        var teacher = await _teacherRepository.GetByIdAsync(_currentUserService.UserId);
        
        if (!string.IsNullOrWhiteSpace(request.UserName))
        {
            var existingTeacher = await _teacherRepository.GetByUserNameAsync(request.UserName);
            if (existingTeacher != null && existingTeacher.Id != teacher.Id)
                throw new Exception("Username already exists");

            var existingStudent = await _studentRepository.GetByUserNameAsync(request.UserName);
            if (existingStudent != null)
                throw new Exception("Username already exists");
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var emailTaken =
                await _teacherRepository.GetByEmailAsync(request.Email) is { Id: var id } && id != teacher.Id ||
                await _studentRepository.GetByEmailAsync(request.Email) != null ||
                await _adminRepository.GetByEmailAsync(request.Email) != null;

            if (emailTaken)
                throw new Exception("Email already exists");
        }

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            var phoneTaken =
                await _teacherRepository.GetByPhoneAsync(request.PhoneNumber) is { Id: var id } && id != teacher.Id ||
                await _studentRepository.GetByPhoneAsync(request.PhoneNumber) != null ||
                await _adminRepository.GetByPhoneAsync(request.PhoneNumber) != null;

            if (phoneTaken)
                throw new Exception("Phone number already exists");
        }

        if (request.RemoveProfilePicture && !string.IsNullOrEmpty(teacher.ProfilePicturePublicId))
        {
            await _cloudinaryService.Delete(teacher.ProfilePicturePublicId);
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

        if (!string.IsNullOrWhiteSpace(request.FirstName)) teacher.FirstName = request.FirstName;
        if (!string.IsNullOrWhiteSpace(request.LastName)) teacher.LastName = request.LastName;
        if (!string.IsNullOrWhiteSpace(request.Email)) teacher.Email = request.Email;
        if (!string.IsNullOrWhiteSpace(request.UserName) ) teacher.UserName = request.UserName;
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber)) teacher.PhoneNumber = request.PhoneNumber;

        await _teacherRepository.UpdateAsync(teacher);
        return true;
    }
}
