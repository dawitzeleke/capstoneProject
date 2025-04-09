using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;
public interface IQuestionRepository:IGenericRepository<Question>{
    Task<int> GetQuestionFeedbacks(string id);
}