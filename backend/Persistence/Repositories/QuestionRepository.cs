using MongoDB.Driver;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using backend.Application.Dtos.QuestionDtos;
using backend.Domain.Enums;

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

    public async Task<List<Question>> GetFilteredQuestions(QuestionFilterDto filter){
        var query = _questions.AsQueryable(); 
           
        if (!filter.Grade.HasValue)
        {
            query = query.Where(q => q.Grade == filter.Grade);
        }

        if (filter.Stream.HasValue)
        {
            query = query.Where(q => q.Stream == filter.Stream);
        }

        if (!string.IsNullOrEmpty(filter.CourseName))
        {
            query = query.Where(q => q.CourseName == filter.CourseName);
        }

        Console.WriteLine("Filter: " + filter.CourseName);
        var questions = query.ToList();
        Console.WriteLine("Questions: " + questions.Count);

        return questions;
    }

    public async Task<List<Question>> GetQuestionByIdList(IEnumerable<string> questionIds)
    {
        var ids = questionIds.ToList(); // Materialize once
        if (!ids.Any())
        {
            return new List<Question>();
        }
        
        var filter = Builders<Question>.Filter.In(q => q.Id, ids);
        return await _questions.Find(filter).ToListAsync();
    }
}