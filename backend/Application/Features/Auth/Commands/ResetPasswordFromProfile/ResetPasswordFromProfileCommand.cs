using MediatR;

public class ResetPasswordFromProfileCommand : IRequest<Unit>
{
    public string OldPassword{ get; set; }
    public string NewPassword { get; set; }
}
