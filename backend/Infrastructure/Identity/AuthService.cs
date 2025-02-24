using System.Threading.Tasks;
using backend.Application.Contracts.Identity;
using backend.Application.Features.Identity.DTOs;
using backend.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.Infrastructure.Identity
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(UserManager<User> userManager, IJwtTokenGenerator jwtTokenGenerator)
        {
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterUserDto request)
        {
            // Check if user already exists
            if (await _userManager.FindByEmailAsync(request.Email) != null)
                return new AuthResponseDto { Success = false, Message = "User already exists" };

            // Create new user
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                UserName = request.UserName ?? request.Email,
                PhoneNumber = request.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return new AuthResponseDto { Success = false, Message = "Registration failed" };

            // Generate JWT Token
            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponseDto { Success = true, Token = token, Email = user.Email };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginUserDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return new AuthResponseDto { Success = false, Message = "Invalid credentials" };

            var token = _jwtTokenGenerator.GenerateToken(user);
            return new AuthResponseDto { Success = true, Token = token, Email = user.Email };
        }
    }
}
