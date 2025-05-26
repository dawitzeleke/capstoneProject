using MediatR;
namespace backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;

public class UpdateStudentProgressCommand : IRequest<bool>
{
    public string StudentId { get; set; }
    public HashSet<string> CorrectQuestions { get; set; } // question ids
    public HashSet<string> AttemptedQuestions { get; set; } // question ids
}