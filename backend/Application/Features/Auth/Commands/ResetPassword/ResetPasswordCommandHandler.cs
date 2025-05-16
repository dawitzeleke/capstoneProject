using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>
{
    private readonly IStudentRepository _studentRepo;
    private readonly ITeacherRepository _teacherRepo;
    private readonly IAdminRepository _adminRepo;
    private readonly IPasswordHasher<Student> _studentHasher;
    private readonly IPasswordHasher<Teacher> _teacherHasher;
    private readonly IPasswordHasher<Admin> _adminHasher;

    public ResetPasswordCommandHandler(
        IStudentRepository studentRepo,
        ITeacherRepository teacherRepo,
        IAdminRepository adminRepo,
        IPasswordHasher<Student> studentHasher,
        IPasswordHasher<Teacher> teacherHasher,
        IPasswordHasher<Admin> adminHasher)
    {
        _studentRepo = studentRepo;
        _teacherRepo = teacherRepo;
        _adminRepo = adminRepo;
        _studentHasher = studentHasher;
        _teacherHasher = teacherHasher;
        _adminHasher = adminHasher;
    }

    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        // 1. Handle Student
        var student = await _studentRepo.GetByEmailAsync(request.Email);
        if (student != null)
        {
            if (student.PasswordResetCode == request.Code && student.PasswordResetCodeExpiresAt > DateTime.UtcNow)
            {

                student.PasswordHash = _studentHasher.HashPassword(student, request.NewPassword);
                student.PasswordResetCode = null;
                student.PasswordResetCodeExpiresAt = null;

                await _studentRepo.UpdateAsync(student);
                return Unit.Value;
            }
        }

        // 2. Handle Teacher
        var teacher = await _teacherRepo.GetByEmailAsync(request.Email);
        if (teacher != null)
        {
            if (teacher.PasswordResetCode == request.Code && teacher.PasswordResetCodeExpiresAt > DateTime.UtcNow)
            {

                teacher.PasswordHash = _teacherHasher.HashPassword(teacher, request.NewPassword);
                teacher.PasswordResetCode = null;
                teacher.PasswordResetCodeExpiresAt = null;

                await _teacherRepo.UpdateAsync(teacher);
                return Unit.Value;
            }
        }

        // 3. Handle Admin
        var admin = await _adminRepo.GetByEmailAsync(request.Email);
        if (admin != null)
        {

            if (admin.PasswordResetCode == request.Code && admin.PasswordResetCodeExpiresAt > DateTime.UtcNow)
            {

                var newPasswordHash = _adminHasher.HashPassword(admin, request.NewPassword);

                admin.PasswordHash = newPasswordHash;
                admin.PasswordResetCode = null;
                admin.PasswordResetCodeExpiresAt = null;

                await _adminRepo.UpdateAsync(admin);
                return Unit.Value;
            }
        }

        throw new Exception("Invalid or expired reset code.");
    }
}
