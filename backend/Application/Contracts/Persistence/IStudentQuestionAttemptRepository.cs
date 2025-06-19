using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Contracts.Persistence;

public interface IStudentQuestionAttemptsRepository:IGenericRepository<StudentQuestionAttempts>
{
    Task<List<string>> GetAttemptedQuestionIds(QuestionFilterDto filter, int? amount=null);
    Task<List<string>> GetAttemptedQuestionIds(string studentId);
    // Task<bool> UpdateOrCreateAttemptedQuestion(List<string> attemptedIds, string studentId);
    Task<bool> InsertManyAsync(List<StudentQuestionAttempts> attemptedQuestions);
    Task<List<StudentQuestionAttempts>> GetAttemptedQuestions(string studentId);
    Task RemoveManyAsync(List<StudentQuestionAttempts> attemptedQuestions);
    Task<bool> UpdateAttemptedQuestions(List<StudentQuestionAttempts> attemptedQuestions, string studentId, int value);
    // Task<> RemoveManyAsync(List<string> attemptedIds, string studentId);
}