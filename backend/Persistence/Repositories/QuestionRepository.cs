using MongoDB.Driver;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using MongoDB.Bson;

namespace backend.Persistence.Repositories;

public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
{
    private readonly IMongoCollection<Question> _questions;
    public QuestionRepository(MongoDbContext context) : base(context)
    {
        _questions = context.GetCollection<Question>(typeof(Question).Name);
    }

    public async Task<int> GetQuestionFeedbacks(string id)
    {
        var question = await _questions.Find(x => x.Id == id).FirstOrDefaultAsync();
        return 0;
    }
    public async Task<int> CountAsync()
    {
        return (int)await _questions.CountDocumentsAsync(new BsonDocument());
    }
}