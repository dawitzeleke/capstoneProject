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
    private readonly ITeacherRepository _teacherRepository;
    private readonly IAdminRepository _adminRepository;
    private readonly IMapper _mapper;

    public UpdateStudentSettingsCommandHandler(
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

    public async Task<bool> Handle(UpdateStudentSettingsCommand request, CancellationToken cancellationToken)
{
    var student = await _studentRepository.GetByIdAsync(_currentUserService.UserId);
    if (student == null)
        throw new Exception("Student not found");

    Console.WriteLine($"Student found: {student.Id}");

    // Username uniqueness check
    if (!string.IsNullOrWhiteSpace(request.UserName))
    {
        var existingStudent = await _studentRepository.GetByUserNameAsync(request.UserName);
        var existingTeacher = await _teacherRepository.GetByUserNameAsync(request.UserName);

        if ((existingStudent != null && existingStudent.Id != student.Id) || existingTeacher != null)
        {
            throw new Exception("Username already exists");
        }
    }

    // Email uniqueness check
    if (!string.IsNullOrWhiteSpace(request.Email))
    {
        var emailTakenByStudent = await _studentRepository.GetByEmailAsync(request.Email);
        var emailTakenByTeacher = await _teacherRepository.GetByEmailAsync(request.Email);
        var emailTakenByAdmin = await _adminRepository.GetByEmailAsync(request.Email);

        if ((emailTakenByStudent != null && emailTakenByStudent.Id != student.Id) ||
            emailTakenByTeacher != null || emailTakenByAdmin != null)
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

        if ((phoneTakenByStudent != null && phoneTakenByStudent.Id != student.Id) ||
            phoneTakenByTeacher != null || phoneTakenByAdmin != null)
        {
            throw new Exception("Phone number already exists");
        }
    }

    // Basic info updates
    if (!string.IsNullOrWhiteSpace(request.FirstName)) student.FirstName = request.FirstName;
    if (!string.IsNullOrWhiteSpace(request.LastName)) student.LastName = request.LastName;
    if (!string.IsNullOrWhiteSpace(request.Email)) student.Email = request.Email;
    if (!string.IsNullOrWhiteSpace(request.UserName)) student.UserName = request.UserName;
    if (!string.IsNullOrWhiteSpace(request.PhoneNumber)) student.PhoneNumber = request.PhoneNumber;
    if (!string.IsNullOrWhiteSpace(request.ProgressLevel)) student.ProgressLevel = request.ProgressLevel;
    if (!string.IsNullOrWhiteSpace(request.School)) student.School = request.School;
    if (request.Grade.HasValue) student.Grade = request.Grade.Value;

    // Remove existing profile picture if requested
    if (request.RemoveProfilePicture && !string.IsNullOrEmpty(student.ProfilePicturePublicId))
    {
        await _cloudinaryService.Delete(student.ProfilePicturePublicId);
        student.ProfilePictureUrl = null;
        student.ProfilePicturePublicId = null;
    }

    // Upload new profile picture if provided
    if (request.ProfilePicture != null)
    {
        try
        {
            Console.WriteLine($"Uploading profile picture for student ID: {student.Id}");
            Console.WriteLine($"File name: {request.ProfilePicture.FileName}, Size: {request.ProfilePicture.Length}");

            if (!string.IsNullOrEmpty(student.ProfilePicturePublicId))
                await _cloudinaryService.Delete(student.ProfilePicturePublicId);

            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ProfilePicture, "ProfilePictures");

            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("Failed to upload profile picture.");

            student.ProfilePictureUrl = uploadResult.Url;
            student.ProfilePicturePublicId = uploadResult.PublicId;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while uploading the profile picture.", ex);
        }
    }

    await _studentRepository.UpdateAsync(student);
    return true;
}


}
