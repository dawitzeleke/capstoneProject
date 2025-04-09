using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Common;
using backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SignUpStudentCommandHandler : IRequestHandler<SignUpStudentCommand, AuthResponseDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Student> _passwordHasher;

    public SignUpStudentCommandHandler(
        IStudentRepository studentRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<Student> passwordHasher)  
    {
        _studentRepository = studentRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignUpStudentCommand request, CancellationToken cancellationToken)
    {
        
        var existingStudent = await _studentRepository.GetByEmailAsync(request.Email);
        if (existingStudent != null)
        {
            throw new Exception("Student with this email already exists");
        }
        
       
        var newStudent = new Student
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Grade = request.Grade,
            CreatedAt = DateTime.Now,
        };
        Console.WriteLine($"Student created:{request.Email}");
        newStudent.PasswordHash = _passwordHasher.HashPassword(newStudent, request.Password);

      
        await _studentRepository.CreateAsync(newStudent);
        Console.WriteLine($"Student created:{newStudent.Id}");
        Console.WriteLine($"Student created:{newStudent.Email}");

        var token = _jwtTokenGenerator.GenerateToken(newStudent.Id, newStudent.Email);

        return new AuthResponseDto
        {
            Token = token,
            Email = newStudent.Email,
            Role = UserRole.Student
        };
    }
}
