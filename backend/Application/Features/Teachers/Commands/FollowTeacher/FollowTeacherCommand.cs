using MediatR;

public class FollowTeacherCommand : IRequest<bool>
{
    public string StudentId { get; set; }
    public string TeacherId { get; set; }

}