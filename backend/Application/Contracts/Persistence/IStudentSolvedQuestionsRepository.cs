using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Contracts.Persistence;

public interface IStudentSolvedQuestionsRepository : IGenericRepository<StudentSolvedQuestions>
{
    Task<List<string>> GetSolvedQuestions(QuestionFilterDto filter,int amount);
}