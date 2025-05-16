
using MediatR;

public class GetStudentFollowingQuery : IRequest<List<TeacherDto>>
{
    public string StudentId { get; set; }
}