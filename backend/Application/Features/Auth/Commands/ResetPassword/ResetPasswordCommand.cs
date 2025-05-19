using MediatR;

public class ResetPasswordCommand : IRequest<Unit>
{
    public string Email { get; set; }
    public string Code { get; set; }
    public string NewPassword { get; set; }
}
