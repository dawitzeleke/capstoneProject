using Application.Dtos.AuthDtos;
using MediatR;

public class InviteAdminCommand : IRequest<AuthResponseDto>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
}

