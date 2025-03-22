
using Application.Dtos.AuthDtos;
using MediatR;

public class SignInQuery : IRequest<AuthResponseDto>
{
    public string Email { get; set; }
    public string Password { get; set; }
}