using backend.Application.Contracts.Persistence;
using Domain.Enums;
using MediatR;

public class VerifyTeacherCommandHandler : IRequestHandler<VerifyTeacherCommand, VerifyTeacherResponseDto>
{
    private readonly IAdminRepository _adminRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITeacherRepository _teacherRepository;

    public VerifyTeacherCommandHandler(
        IAdminRepository adminRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        ICurrentUserService currentUserService,
        ITeacherRepository teacherRepository)
    {
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _currentUserService = currentUserService;
        _teacherRepository = teacherRepository;
    }

    public async Task<VerifyTeacherResponseDto> Handle(VerifyTeacherCommand request, CancellationToken cancellationToken)
    {
        var currentAdmin = await _adminRepository.GetByIdAsync(_currentUserService.UserId.ToString());
        Console.WriteLine($"Current admin: {currentAdmin.Id}");
        if (currentAdmin == null)
            throw new UnauthorizedAccessException("Only Admins can Verify Teachers.");
        var teacher = await _teacherRepository.GetByIdAsync(request.TeacherId);
        if (teacher == null)
            throw new Exception("Teacher not found");

        teacher.IsVerified = true;
        teacher.VerifiedBy = _currentUserService.UserId;
        teacher.VerifiedAt = DateTime.UtcNow;

        teacher.VerificationStatus = VerificationStatus.Approved;

        await _teacherRepository.UpdateAsync(teacher);

        return new VerifyTeacherResponseDto
        {
            TeacherId = teacher.Id,
            Message = "Teacher verified successfully",
            Status = "Success",
            VerifiedAt = DateTime.UtcNow
        };
    }
}