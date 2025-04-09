using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Common;
using backend.Domain.Entities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SignUpTeacherCommandHandler : IRequestHandler<SignUpTeacherCommand, AuthResponseDto>
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Teacher> _passwordHasher;

    public SignUpTeacherCommandHandler(
        ITeacherRepository teacherRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<Teacher> passwordHasher)  
    {
        _teacherRepository = teacherRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignUpTeacherCommand request, CancellationToken cancellationToken)
    {
        
        var existingTeacher = await _teacherRepository.GetByEmailAsync(request.Email);
        if (existingTeacher != null)
        {
            throw new Exception("Teacher with this email already exists");
        }
        
       
        var newTeacher = new Teacher
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.Now,
        };
        Console.WriteLine($"Teacher created:{request.Email}");
        newTeacher.PasswordHash = _passwordHasher.HashPassword(newTeacher, request.Password);

      
        await _teacherRepository.CreateAsync(newTeacher);
        Console.WriteLine($"Teacher created:{newTeacher.Id}");
        Console.WriteLine($"Teacher created:{newTeacher.Email}");

        var token = _jwtTokenGenerator.GenerateToken(newTeacher.Id, newTeacher.Email);

        return new AuthResponseDto
        {
            Token = token,
            Email = newTeacher.Email,
            Role = UserRole.Teacher
        };
    }
}
