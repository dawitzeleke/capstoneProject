using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Dtos.PaginationDtos;

namespace backend.Application.Contracts.Persistence;

public interface IStudentSolvedQuestionsRepository : IGenericRepository<StudentSolvedQuestions>
{
    Task<List<string>> GetSolvedQuestionIds(QuestionFilterDto filter, int? amount = null);
    Task<bool> UpdateSolvedQuestions(List<StudentSolvedQuestions> solvedQuestions, 
            string studentId, int value);
    Task<bool> InsertManyAsync(List<StudentSolvedQuestions> solvedQuestions);
    Task<List<StudentSolvedQuestions>> GetSolvedQuestions(string studentId,PaginationDto pagination = null);
}