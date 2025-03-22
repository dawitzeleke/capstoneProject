using Application.Contracts.Persistence;
using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

public class SignInQueryHandler : IRequestHandler<SignInQuery, AuthResponseDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Student> _passwordHasher;

    public SignInQueryHandler(
        IStudentRepository studentRepository, 
        IJwtTokenGenerator jwtTokenGenerator, 
        IPasswordHasher<Student> passwordHasher)
    {
        _studentRepository = studentRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignInQuery request, CancellationToken cancellationToken)
    {   
        // Fetch user by email
        var user = await _studentRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Verify password
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result != PasswordVerificationResult.Success)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Generate JWT token
        string token = _jwtTokenGenerator.GenerateToken(user.Id, user.Email);
        
        return new AuthResponseDto 
        { 
            Email = user.Email, 
            Token = token 
        };
    }
}
