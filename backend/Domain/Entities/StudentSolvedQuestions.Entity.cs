using backend.Domain.Common;
namespace backend.Domain.Entities;

public class StudentSolvedQuestions : QuestionAttempt
{
    public int SolveCount { get; set; }
}