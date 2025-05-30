using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

public class ResetPasswordFromProfileCommandHandler : IRequestHandler<ResetPasswordFromProfileCommand, Unit>
{
    private readonly IStudentRepository _studentRepo;
    private readonly ITeacherRepository _teacherRepo;
    private readonly IAdminRepository _adminRepo;
    private readonly IPasswordHasher<Student> _studentHasher;
    private readonly IPasswordHasher<Teacher> _teacherHasher;
    private readonly IPasswordHasher<Admin> _adminHasher;
    private readonly ICurrentUserService _currentUserService;

    public ResetPasswordFromProfileCommandHandler(
        IStudentRepository studentRepo,
        ITeacherRepository teacherRepo,
        IAdminRepository adminRepo,
        IPasswordHasher<Student> studentHasher,
        IPasswordHasher<Teacher> teacherHasher,
        IPasswordHasher<Admin> adminHasher,
        ICurrentUserService currentUserService)
    {
        _studentRepo = studentRepo;
        _teacherRepo = teacherRepo;
        _adminRepo = adminRepo;
        _studentHasher = studentHasher;
        _teacherHasher = teacherHasher;
        _adminHasher = adminHasher;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(ResetPasswordFromProfileCommand request, CancellationToken cancellationToken)
    {
        // 1. Handle Student
        var student = await _studentRepo.GetByIdAsync(_currentUserService.UserId);
        if (student != null)
        {
            var result = _studentHasher.VerifyHashedPassword(student, student.PasswordHash, request.OldPassword);
            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Old password is incorrect.");

            student.PasswordHash = _studentHasher.HashPassword(student, request.NewPassword);
            await _studentRepo.UpdateAsync(student);
            return Unit.Value;
        }

        // 2. Handle Teacher
        var teacher = await _teacherRepo.GetByIdAsync(_currentUserService.UserId);
        if (teacher != null)
        {
            var result = _teacherHasher.VerifyHashedPassword(teacher, teacher.PasswordHash, request.OldPassword);
            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Old password is incorrect.");

            teacher.PasswordHash = _teacherHasher.HashPassword(teacher, request.NewPassword);
            await _teacherRepo.UpdateAsync(teacher);
            return Unit.Value;
        }

        // 3. Handle Admin
        var admin = await _adminRepo.GetByIdAsync(_currentUserService.UserId);
        if (admin != null)
        {
            var result = _adminHasher.VerifyHashedPassword(admin, admin.PasswordHash, request.OldPassword);
            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Old password is incorrect.");

            admin.PasswordHash = _adminHasher.HashPassword(admin, request.NewPassword);
            await _adminRepo.UpdateAsync(admin);
            return Unit.Value;
        }

        throw new Exception("Invalid or expired reset code.");
    }
}
