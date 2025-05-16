using MediatR;

public class UnFollowTeacherCommand : IRequest<bool>
{
    public string StudentId { get; set; }
    public string TeacherId { get; set; }

}