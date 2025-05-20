using backend.Domain.Common;
namespace backend.Domain.Entities;

public class StudentQuestionAttempts: QuestionAttempt
{
    public int AttemptCount {get; set;}
}