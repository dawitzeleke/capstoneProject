using MongoDB.Driver;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
using backend.Application.Dtos.QuestionDtos;
using backend.Domain.Enums;
using backend.Domain.Common;
using backend.Application.Dtos.PaginationDtos;
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


    public async Task<PaginatedList<Question>> GetFilteredQuestions(QuestionFilterDto filter,PaginationDto pagination, List<string> solvedQuestionIds = null){
        var query = _questions.AsQueryable(); 
           
        if (filter.Grade.HasValue)
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

        if (solvedQuestionIds != null && solvedQuestionIds.Any())
            {
                query = query.Where(q => !solvedQuestionIds.Contains(q.Id));
            }

        var results = query
            .Take(pagination.Limit +1)
            .ToList();
        
        var paginatedResult = new PaginatedList<Question>(null);

        // Set Items and HasMore
        paginatedResult.Items = results.Take(pagination.Limit).ToList();
        paginatedResult.HasMore = results.Count > pagination.Limit;
        
        return paginatedResult;
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

    public async Task<int> CountAsync()
    {
        return (int)await _questions.CountDocumentsAsync(_ => true);
    }
}