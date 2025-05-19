using Microsoft.AspNetCore.Http;

public class TeacherDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string ProfilePictureUrl { get; set; }
    public bool IsVerified { get; set; }
    public string UserName { get; set; }
    // public VerificationStatus VerificationStatus { get; set; }
    // public string LicenseDocumentUrl { get; set; }
    public List<string> Subjects { get; set; }
}