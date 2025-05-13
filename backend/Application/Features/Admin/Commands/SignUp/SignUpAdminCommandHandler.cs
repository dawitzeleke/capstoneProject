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

public class SignUpAdminCommandHandler : IRequestHandler<SignUpAdminCommand, AuthResponseDto>
{
    private readonly IAdminRepository _adminRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<Admin> _passwordHasher;

    public SignUpAdminCommandHandler(
        IAdminRepository adminRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<Admin> passwordHasher)  
    {
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> Handle(SignUpAdminCommand request, CancellationToken cancellationToken)
    {
        
        var existingAdmin = await _adminRepository.GetByEmailAsync(request.Email);
        if (existingAdmin != null)
        {
            throw new Exception("Admin with this email already exists");
        }
        
       
        var newAdmin = new Admin
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.Now,
        };
        Console.WriteLine($"Admin created:{request.Email}");
        newAdmin.PasswordHash = _passwordHasher.HashPassword(newAdmin, request.Password);

      
        await _adminRepository.CreateAsync(newAdmin);
        Console.WriteLine($"Admin created:{newAdmin.Id}");
        Console.WriteLine($"Admin created:{newAdmin.Email}");

        var token = _jwtTokenGenerator.GenerateToken(newAdmin.Id, newAdmin.Email);

        return new AuthResponseDto
        {
            Token = token,
            Email = newAdmin.Email,
            Role = UserRole.Admin
        };
    }
}
