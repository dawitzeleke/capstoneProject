using MediatR;
namespace backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;

public class UpdateStudentProgressCommand : IRequest<bool>
{
    public string StudentId { get; set; }
    public HashSet<string> Questions { get; set; } // question ids
}