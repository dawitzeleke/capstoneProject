using MediatR;

public class SendResetCodeCommand : IRequest<Unit>
{
    public string Email { get; set; }
}
