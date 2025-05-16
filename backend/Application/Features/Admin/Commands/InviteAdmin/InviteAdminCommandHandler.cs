using Application.Dtos.AuthDtos;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;

public class InviteAdminCommandHandler : IRequestHandler<InviteAdminCommand, AuthResponseDto>
{
    private readonly IAdminRepository _adminRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IEmailService _emailService;
    private readonly ICurrentUserService _currentUserService;

    public InviteAdminCommandHandler(
        IAdminRepository adminRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IEmailService emailService,
        ICurrentUserService currentUserService)
    {
        _adminRepository = adminRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _currentUserService = currentUserService;
    }

    public async Task<AuthResponseDto> Handle(InviteAdminCommand request, CancellationToken cancellationToken){
        var superAdmin = await _adminRepository.GetByIdAsync(_currentUserService.UserId.ToString());
        Console.WriteLine($"Current admin: {superAdmin.Id}");
      
        var existingAdmin = await _adminRepository.GetByEmailAsync(request.Email);
        if (existingAdmin != null)
            throw new Exception("Admin with this email already exists");

      
        var newAdmin = new Admin
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = null
        };

        await _adminRepository.CreateAsync(newAdmin);

        Console.WriteLine($"New admin created: {newAdmin.Id}");
        var token = _jwtTokenGenerator.GeneratePasswordSetupToken(newAdmin.Id, newAdmin.Email);
        var link = $"https://yourfrontend.com/set-password?token={token}";

        await _emailService.SendEmailAsync(newAdmin.Email, "Set Your Password",
            $"Hi {newAdmin.FirstName}, click here to set your password: {link}");

        return new AuthResponseDto
        {
            Email = newAdmin.Email,
            Token = token,
            Role = UserRole.Admin
        };
    }
}
