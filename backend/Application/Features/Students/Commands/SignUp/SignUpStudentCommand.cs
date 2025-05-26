using Application.Dtos.AuthDtos;
using backend.Domain.Enums;
using MediatR;

public class SignUpStudentCommand : IRequest<AuthResponseDto>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public int Grade { get; set; }
    public StreamEnum Stream { get; set; }
}