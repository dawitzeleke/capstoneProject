using MediatR;
using Microsoft.AspNetCore.Http;

public class UpdateAdminProfileCommand : IRequest<AdminProfileDto>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserName { get; set; }        
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    
    
    public IFormFile? ProfilePicture { get; set; }
    public bool RemoveProfilePicture { get; set; } = false;

    public List<string>? VerifiedTeacherIds { get; set; }
    public List<string>? BannedUserIds { get; set; }
    public List<string>? RemovedContentIds { get; set; }
}
