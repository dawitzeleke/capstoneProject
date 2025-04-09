// using Application.Contracts.Persistence;
// using Application.Dtos;
// using Application.Dtos.AuthDtos;
// using backend.Domain.Common;
// using backend.Domain.Entities;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.Extensions.Configuration;
// using Microsoft.IdentityModel.Tokens;

// namespace Application.Handlers
// {
//     public class AuthService
//     {
//         private readonly IUserRepository _userRepository;
//         private readonly IConfiguration _config;

//         public AuthService(IUserRepository userRepository, IConfiguration config)
//         {
//             _userRepository = userRepository;
//             _config = config;
//         }

//         public async Task<string> SignUpStudent(SignUpStudentDto request, string role)
//         {
//             var existingUser = await _userRepository.GetByEmailAsync(request.Email);
//             if (existingUser != null)
//                 throw new Exception("User already exists.");

//             var passwordHasher = new PasswordHasher<User>();
//             var user = new User
//             {
//                 FirstName = request.FirstName,
//                 LastName = request.LastName,
//                 Email = request.Email,
//                 PasswordHash = passwordHasher.HashPassword(null, request.Password),
//                 PhoneNumber = request.PhoneNumber,
//             };

//             await _userRepository.CreateAsync(user);
//             return GenerateJwtToken(user);
//         }

//         public async Task<string> SignUpTeacher(SignUpTeacherDto request, string role)
//         {
//             var existingUser = await _userRepository.GetByEmailAsync(request.Email);
//             if (existingUser != null)
//                 throw new Exception("User already exists.");

//             var passwordHasher = new PasswordHasher<User>();

//             var user = new User
//             {
//                 FirstName = request.FirstName,
//                 LastName = request.LastName,
//                 Email = request.Email,
//                 PasswordHash = passwordHasher.HashPassword(null, request.Password),
                
//                 Role = role
//             };

//             await _userRepository.CreateAsync(user);
//             return GenerateJwtToken(user);
//         }

//         public async Task<string> Login(AuthRequestDto request)
//         {
//             var user = await _userRepository.GetByEmailAsync(request.Email);
//             if (user == null) throw new Exception("Invalid credentials.");

//             var passwordHasher = new PasswordHasher<User>();
//             var result = passwordHasher.VerifyHashedPassword(null, user.PasswordHash, request.Password);
//             if (result == PasswordVerificationResult.Failed)
//                 throw new Exception("Invalid credentials.");

//             return GenerateJwtToken(user);
//         }

//         private string GenerateJwtToken(User user)
//         {
//             var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
//             var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//             var claims = new[]
//             {
//                 new Claim(ClaimTypes.Email, user.Email),
//                 new Claim(ClaimTypes.Role, user.Role)
//             };

//             var token = new JwtSecurityToken(
//                 _config["Jwt:Issuer"],
//                 _config["Jwt:Issuer"],
//                 claims,
//                 expires: DateTime.UtcNow.AddHours(2),
//                 signingCredentials: credentials
//             );

//             return new JwtSecurityTokenHandler().WriteToken(token);
//         }
//     }
// }
