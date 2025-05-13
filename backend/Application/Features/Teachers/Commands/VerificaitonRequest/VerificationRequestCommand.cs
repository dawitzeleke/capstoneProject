using MediatR;
using Microsoft.AspNetCore.Http;

public class VerificationRequestCommand : IRequest<bool>
{
    public IFormFile LicenseDocument { get; set; }
    public IFormFile GraduationDocument { get; set; }
    public string SchoolName { get; set; }
    public string NationalId { get; set; }
}