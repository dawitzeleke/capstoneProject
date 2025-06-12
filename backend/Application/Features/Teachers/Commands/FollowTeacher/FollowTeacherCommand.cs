using MediatR;

public class FollowTeacherCommand : IRequest<bool>
{
    public string TeacherId { get; set; }

}