using MediatR;

public class UnFollowTeacherCommand : IRequest<bool>
{
    public string TeacherId { get; set; }

}