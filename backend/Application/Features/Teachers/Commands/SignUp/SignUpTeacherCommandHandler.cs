using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SignUpTeacherCommandHandler : IRequestHandler<SignUpTeacherCommand, AuthResponseDto>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IAdminRepository _adminRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Teacher> _passwordHasher;

    public SignUpTeacherCommandHandler(
        ITeacherRepository teacherRepository,
        IStudentRepository studentRepository,
        IAdminRepository adminRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<Teacher> passwordHasher)  
    {
        _teacherRepository = teacherRepository;
        _studentRepository = studentRepository;
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignUpTeacherCommand request, CancellationToken cancellationToken)
    {
        if (await _teacherRepository.GetByEmailAsync(request.Email) != null ||
            await _studentRepository.GetByEmailAsync(request.Email) != null ||
            await _adminRepository.GetByEmailAsync(request.Email) != null)
        {
            throw new Exception("Email already exists");
        }

        
        if (await _teacherRepository.GetByPhoneAsync(request.PhoneNumber) != null ||
            await _studentRepository.GetByPhoneAsync(request.PhoneNumber) != null ||
            await _adminRepository.GetByPhoneAsync(request.PhoneNumber) != null)
        {
            throw new Exception("Phone number already exists");
        }

        var newTeacher = new Teacher
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
        };

        newTeacher.PasswordHash = _passwordHasher.HashPassword(newTeacher, request.Password);
        await _teacherRepository.CreateAsync(newTeacher);

        var token = _jwtTokenGenerator.GenerateToken(newTeacher.Id, newTeacher.Email, UserRole.Teacher.ToString());

        return new AuthResponseDto
        {
            Id = newTeacher.Id,
            FirstName = newTeacher.FirstName,
            LastName = newTeacher.LastName,
            Token = token,
            Email = newTeacher.Email,
            Role = UserRole.Teacher,
            ProfilePictureUrl = newTeacher.ProfilePictureUrl
        };
    }
}
