using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SignUpStudentCommandHandler : IRequestHandler<SignUpStudentCommand, AuthResponseDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ITeacherRepository _teacherRepository;
    private readonly IAdminRepository _adminRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Student> _passwordHasher;

    public SignUpStudentCommandHandler(
        IStudentRepository studentRepository,
        ITeacherRepository teacherRepository,
        IAdminRepository adminRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<Student> passwordHasher)
    {
        _studentRepository = studentRepository;
        _teacherRepository = teacherRepository;
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignUpStudentCommand request, CancellationToken cancellationToken)
    {
        if ((await _studentRepository.GetByEmailAsync(request.Email)) != null ||
            (await _teacherRepository.GetByEmailAsync(request.Email)) != null ||
            (await _adminRepository.GetByEmailAsync(request.Email)) != null)  
        {
            throw new Exception("A user with this email already exists.");
        }

        if ((await _studentRepository.GetByPhoneAsync(request.PhoneNumber)) != null ||
            (await _teacherRepository.GetByPhoneAsync(request.PhoneNumber)) != null ||
            (await _adminRepository.GetByPhoneAsync(request.PhoneNumber)) != null)
        {
            throw new Exception("A user with this phone number already exists.");
        }

        var newStudent = new Student
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Grade = request.Grade,
            Stream = request.Stream,
            CreatedAt = DateTime.UtcNow,
        };

        newStudent.PasswordHash = _passwordHasher.HashPassword(newStudent, request.Password);

        await _studentRepository.CreateAsync(newStudent);

        var token = _jwtTokenGenerator.GenerateToken(newStudent.Id, newStudent.Email, UserRole.Student.ToString());

        return new AuthResponseDto
        {
            Id = newStudent.Id,
            FirstName = newStudent.FirstName,
            LastName = newStudent.LastName,
            Token = token,
            Email = newStudent.Email,
            Role = UserRole.Student,
            ProfilePictureUrl = newStudent.ProfilePictureUrl
        };
    }
}