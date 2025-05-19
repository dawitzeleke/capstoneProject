using MediatR;

public class VerifyResetCodeQuery : IRequest<bool>
{
    public string Email { get; set; }
    public string Code { get; set; }
}
