using backend.Application.Contracts.Persistence;
using MediatR;

public class SendResetCodeCommandHandler : IRequestHandler<SendResetCodeCommand, Unit>
{
    private readonly IStudentRepository _studentRepo;
    private readonly ITeacherRepository _teacherRepo;
    private readonly IAdminRepository _adminRepo;
    private readonly IEmailService _emailService;

    public SendResetCodeCommandHandler(
        IStudentRepository studentRepo,
        ITeacherRepository teacherRepo,
        IAdminRepository adminRepo,
        IEmailService emailService)
    {
        _studentRepo = studentRepo;
        _teacherRepo = teacherRepo;
        _adminRepo = adminRepo;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(SendResetCodeCommand request, CancellationToken cancellationToken)
    {
        var code = new Random().Next(100000, 999999).ToString();
        var expiration = DateTime.UtcNow.AddMinutes(15);

        var student = await _studentRepo.GetByEmailAsync(request.Email);
        if (student != null)
        {
            student.PasswordResetCode = code;
            student.PasswordResetCodeExpiresAt = expiration;
            await _studentRepo.UpdateAsync(student);
            await _emailService.SendEmailAsync(student.Email, "Reset Code", $"Your reset code is: {code}");
            return Unit.Value;
        }

        // Check Teacher
        var teacher = await _teacherRepo.GetByEmailAsync(request.Email);
        if (teacher != null)
        {
            teacher.PasswordResetCode = code;
            teacher.PasswordResetCodeExpiresAt = expiration;
            await _teacherRepo.UpdateAsync(teacher);
            await _emailService.SendEmailAsync(teacher.Email, "Reset Code", $"Your reset code is: {code}");
            return Unit.Value;
        }

        // Check Admin
        var admin = await _adminRepo.GetByEmailAsync(request.Email);
        if (admin != null)
        {
            admin.PasswordResetCode = code;
            admin.PasswordResetCodeExpiresAt = expiration;
            await _adminRepo.UpdateAsync(admin);
            await _emailService.SendEmailAsync(admin.Email, "Reset Code", $"Your reset code is: {code}");
            return Unit.Value;
        }

        throw new Exception("Email not found");
    }
}
