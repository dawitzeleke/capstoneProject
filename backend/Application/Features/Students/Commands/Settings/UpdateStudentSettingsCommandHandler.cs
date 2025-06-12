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
        var studentId = _currentUserService.UserId;
        if (string.IsNullOrWhiteSpace(studentId))
            Console.WriteLine("User ID is not available");
            throw new Exception("User ID is not available");

        Console.WriteLine($"Updating student settings for studentId: {studentId}");
        var student = await _studentRepository.GetByIdAsync(studentId);
        if (student == null)
            throw new Exception("Student not found");

        Console.WriteLine($"Student found: {student.Id}");
        if (!string.IsNullOrWhiteSpace(request.UserName))
        {
            var existingStudent = await _studentRepository.GetByUserNameAsync(request.UserName);
            var existingTeacher = await _teacherRepository.GetByUserNameAsync(request.UserName);

            if ((existingStudent != null && existingStudent.Id != student.Id) || existingTeacher != null)
            {
                throw new Exception("Username already exists");
            }
        }

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
        if (!string.IsNullOrWhiteSpace(request.School))
            student.School = request.School;

        if (request.Grade.HasValue)
            student.Grade = request.Grade.Value;
        

        await _studentRepository.UpdateAsync(student);
        return true;
    }

}
