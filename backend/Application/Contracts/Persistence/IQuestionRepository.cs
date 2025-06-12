using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Dtos.PaginationDtos;
using backend.Domain.Common;

namespace backend.Application.Contracts.Persistence;

public interface IQuestionRepository : IGenericRepository<Question>
{
    // Task<int> GetQuestionFeedbacks(string id);
    Task<PaginatedList<Question>> GetFilteredQuestions(QuestionFilterDto filter,PaginationDto pagination,List<string> solvedQuestionIds = null);
    Task<List<Question>> GetQuestionByIdList(IEnumerable<string> questionIds);
    Task<int> CountAsync();
    Task<bool> ToggleLike(string questionId, string userId); 
    Task<bool> AddRelatedBlog(string questionId, string blogId);
    Task<bool> RemoveRelatedBlog(string questionId, string blogId);
    Task<bool> UpdateTotalCorrectAnswers(List<string> questionIds, int value);
}