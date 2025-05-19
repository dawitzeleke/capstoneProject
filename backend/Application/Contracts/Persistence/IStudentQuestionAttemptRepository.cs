using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Contracts.Persistence;

public interface IStudentQuestionAttemptsRepository:IGenericRepository<StudentQuestionAttempts>
{
    Task<List<string>> GetAttemptedQuestions(QuestionFilterDto filter, int amount);
}