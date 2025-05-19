using AutoMapper;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

public class UpdateAdminProfileCommandHandler : IRequestHandler<UpdateAdminProfileCommand, AdminProfileDto>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IStudentRepository _studentRepository;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ITeacherRepository _teacherRepository;
    private readonly IAdminRepository _adminRepository;
    private readonly IMapper _mapper;

    public UpdateAdminProfileCommandHandler(
        IStudentRepository studentRepository,
        IMapper mapper,
        ICurrentUserService currentUserService,
        ICloudinaryService cloudinaryService,
        ITeacherRepository teacherRepository,
        IAdminRepository adminRepository)
    {
        _studentRepository = studentRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
        _teacherRepository = teacherRepository;
        _adminRepository = adminRepository;
    }

    public async Task<AdminProfileDto> Handle(UpdateAdminProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException("User ID is missing from token.");

        var admin = await _adminRepository.GetByIdAsync(userId);
        if (admin == null)
            throw new Exception($"Admin with ID {userId} does not exist.");

        // Username uniqueness check
        if (!string.IsNullOrWhiteSpace(request.UserName))
        {
            var existingAdmin = await _adminRepository.GetByUserNameAsync(request.UserName);
            if (existingAdmin != null && existingAdmin.Id != admin.Id)
                throw new Exception("Username already exists");
        }

        // Email uniqueness check
        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var emailTakenByStudent = await _studentRepository.GetByEmailAsync(request.Email);
            var emailTakenByTeacher = await _teacherRepository.GetByEmailAsync(request.Email);
            var emailTakenByAdmin = await _adminRepository.GetByEmailAsync(request.Email);

            if ((emailTakenByStudent != null) ||
                (emailTakenByTeacher != null) ||
                (emailTakenByAdmin != null && emailTakenByAdmin.Id != admin.Id))
            {
                throw new Exception("Email already exists");
            }
        }

        // Phone number uniqueness check
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            var phoneTakenByStudent = await _studentRepository.GetByPhoneAsync(request.PhoneNumber);
            var phoneTakenByTeacher = await _teacherRepository.GetByPhoneAsync(request.PhoneNumber);
            var phoneTakenByAdmin = await _adminRepository.GetByPhoneAsync(request.PhoneNumber);

            if ((phoneTakenByStudent != null && phoneTakenByStudent.Id != admin.Id) ||
                phoneTakenByTeacher != null ||
                (phoneTakenByAdmin != null && phoneTakenByAdmin.Id != admin.Id))
            {
                throw new Exception("Phone number already exists");
            }
        }

        // Update basic fields
        if (!string.IsNullOrWhiteSpace(request.FirstName)) admin.FirstName = request.FirstName;
        if (!string.IsNullOrWhiteSpace(request.LastName)) admin.LastName = request.LastName;
        if (!string.IsNullOrWhiteSpace(request.Email)) admin.Email = request.Email;
        if (request.UserName != null) admin.UserName = request.UserName;
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber)) admin.PhoneNumber = request.PhoneNumber;

        // Handle profile picture removal
        if (request.RemoveProfilePicture && !string.IsNullOrEmpty(admin.ProfilePicturePublicId))
        {
            await _cloudinaryService.Delete(admin.ProfilePicturePublicId);
            admin.ProfilePictureUrl = null;
            admin.ProfilePicturePublicId = null;
        }

        // Handle profile picture upload
        if (request.ProfilePicture != null)
        {
            try
            {
                Console.WriteLine($"Uploading profile picture for admin ID: {admin.Id}");
                Console.WriteLine($"File name: {request.ProfilePicture.FileName}, Size: {request.ProfilePicture.Length}");

                if (!string.IsNullOrEmpty(admin.ProfilePicturePublicId))
                    await _cloudinaryService.Delete(admin.ProfilePicturePublicId);

                var uploadResult = await _cloudinaryService.UploadFileAsync(request.ProfilePicture, "ProfilePictures");

                if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                    throw new Exception("Failed to upload profile picture.");

                admin.ProfilePictureUrl = uploadResult.Url;
                admin.ProfilePicturePublicId = uploadResult.PublicId;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while uploading the profile picture.", ex);
            }
        }

        await _adminRepository.UpdateAsync(admin);

        return new AdminProfileDto
        {
            Id = admin.Id,
            FirstName = admin.FirstName,
            LastName = admin.LastName,
            UserName = admin.UserName,
            PhoneNumber = admin.PhoneNumber,
            Email = admin.Email,
            ProfilePictureUrl = admin.ProfilePictureUrl,
            ProfilePicturePublicId = admin.ProfilePicturePublicId,
            VerifiedTeacherIds = request.VerifiedTeacherIds ?? admin.VerifiedTeacherIds,
            BannedUserIds = request.BannedUserIds ?? admin.BannedUserIds,
            RemovedContentIds = request.RemovedContentIds ?? admin.RemovedContentIds,
            TotalModerationActions = admin.TotalModerationActions,
            RegistrationDate = admin.RegistrationDate
        };
    }
}
