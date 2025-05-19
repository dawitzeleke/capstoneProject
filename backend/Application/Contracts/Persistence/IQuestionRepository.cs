using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Contracts.Persistence;
public interface IQuestionRepository:IGenericRepository<Question>{
    Task<int> GetQuestionFeedbacks(string id);
    Task<List<Question>> GetFilteredQuestions(QuestionFilterDto filter);
    Task<List<Question>> GetQuestionByIdList(IEnumerable<string> questionIds);
}