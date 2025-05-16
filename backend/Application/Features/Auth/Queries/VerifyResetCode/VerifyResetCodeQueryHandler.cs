using backend.Application.Contracts.Persistence;
using MediatR;

public class VerifyResetCodeQueryHandler : IRequestHandler<VerifyResetCodeQuery, bool>
{
    private readonly IStudentRepository _studentRepo;
    private readonly ITeacherRepository _teacherRepo;
    private readonly IAdminRepository _adminRepo;

    public VerifyResetCodeQueryHandler(
        IStudentRepository studentRepo,
        ITeacherRepository teacherRepo,
        IAdminRepository adminRepo)
    {
        _studentRepo = studentRepo;
        _teacherRepo = teacherRepo;
        _adminRepo = adminRepo;
    }

    public async Task<bool> Handle(VerifyResetCodeQuery request, CancellationToken cancellationToken)
    {
        var student = await _studentRepo.GetByEmailAsync(request.Email);
        if (student != null)
            return student.PasswordResetCode == request.Code &&
                   student.PasswordResetCodeExpiresAt > DateTime.UtcNow;

        var teacher = await _teacherRepo.GetByEmailAsync(request.Email);
        if (teacher != null)
            return teacher.PasswordResetCode == request.Code &&
                   teacher.PasswordResetCodeExpiresAt > DateTime.UtcNow;

        var admin = await _adminRepo.GetByEmailAsync(request.Email);
        if (admin != null)
            return admin.PasswordResetCode == request.Code &&
                   admin.PasswordResetCodeExpiresAt > DateTime.UtcNow;

        return false;
    }
}
