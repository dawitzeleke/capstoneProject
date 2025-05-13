using MediatR;
using Microsoft.AspNetCore.Http;

public class UpdateTeacherSettingsCommand : IRequest<bool>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? UserName { get; set; }
    public IFormFile? ProfilePicture { get; set; }
    
    public bool RemoveProfilePicture { get; set; }
}   