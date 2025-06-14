using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Common;
using backend.Domain.Entities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SignInQueryHandler : IRequestHandler<SignInQuery, AuthResponseDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ITeacherRepository _teacherRepository;
    private readonly IAdminRepository _adminRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Student> _studentPasswordHasher;
    private readonly IPasswordHasher<Teacher> _teacherPasswordHasher;
    private readonly IPasswordHasher<Admin> _adminPasswordHasher;

    public SignInQueryHandler(
        IStudentRepository studentRepository,
        ITeacherRepository teacherRepository,
        IAdminRepository adminRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<Student> studentPasswordHasher,
        IPasswordHasher<Teacher> teacherPasswordHasher,
        IPasswordHasher<Admin> adminPasswordHasher)
    {
        _studentRepository = studentRepository;
        _teacherRepository = teacherRepository;
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _studentPasswordHasher = studentPasswordHasher;
        _teacherPasswordHasher = teacherPasswordHasher;
        _adminPasswordHasher = adminPasswordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignInQuery request, CancellationToken cancellationToken)
    {
        // 1. Try Student
        var student = await _studentRepository.GetByEmailAsync(request.Email);
        if (student != null)
        {
            var result = _studentPasswordHasher.VerifyHashedPassword(student, student.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Success)
            {
                return new AuthResponseDto
                {
                    Email = student.Email,
                    Token = _jwtTokenGenerator.GenerateToken(student.Id, student.Email, UserRole.Student.ToString()),
                    Role = UserRole.Student,
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    ProfilePictureUrl = student.ProfilePictureUrl,
                    Id = student.Id
                };
            }
        }

        // 2. Try Teacher
        var teacher = await _teacherRepository.GetByEmailAsync(request.Email);
        if (teacher != null)
        {
            var result = _teacherPasswordHasher.VerifyHashedPassword(teacher, teacher.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Success)
            {
                return new AuthResponseDto
                {
                    Email = teacher.Email,
                    Token = _jwtTokenGenerator.GenerateToken(teacher.Id, teacher.Email, UserRole.Teacher.ToString()),
                    Role = UserRole.Teacher,
                    FirstName = teacher.FirstName,
                    LastName = teacher.LastName,
                    ProfilePictureUrl = teacher.ProfilePictureUrl,
                    Id = teacher.Id
                };
            }
        }

        // 3. Try Admin
        var admin = await _adminRepository.GetByEmailAsync(request.Email);
        if (admin != null)
        {
            var result = _adminPasswordHasher.VerifyHashedPassword(admin, admin.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Success)
            {
                var role = admin.IsSuperAdmin ? UserRole.SuperAdmin : UserRole.Admin;
                return new AuthResponseDto
                {
                    Email = admin.Email,
                    Token = _jwtTokenGenerator.GenerateToken(admin.Id, admin.Email, role.ToString()),
                    Role = role,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    ProfilePictureUrl = admin.ProfilePictureUrl,
                    Id = admin.Id
                };
            }
        }

    
        throw new UnauthorizedAccessException("Invalid credentials.");
}
}
