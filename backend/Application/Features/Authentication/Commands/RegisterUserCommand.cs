using Core.Entities;
using Core.Interfaces;
using MediatR;
using BCrypt.Net;
using Domain.Entities;
using Domain.Interfaces;

public class RegisterUserCommand : IRequest<string>
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, string>
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public RegisterUserHandler(IUserRepository userRepository, JwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<string> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null) throw new Exception("User already exists");

        var newUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        await _userRepository.AddAsync(newUser);
        return _jwtService.GenerateToken(newUser);
    }
}
