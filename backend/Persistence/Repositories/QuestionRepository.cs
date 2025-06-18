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


    public async Task<PaginatedList<Question>> GetFilteredQuestions(QuestionFilterDto filter, PaginationDto pagination, List<string> solvedQuestionIds = null)
    {
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
            .Take(pagination.Limit + 1)
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
        try
        {
            var questions = await _questions.Find(_ => true).ToListAsync();
            var response = questions.Where(q => ids.Contains(q.Id)).ToList();
            return response;

        }
        catch (Exception)
        {
            return new List<Question>();
        }
    }
    public async Task<int> CountAsync()
    {
        return (int)await _questions.CountDocumentsAsync(_ => true);
    }

    public async Task<bool> ToggleLike(string questionId, string userId)
    {
        var question = await _questions.Find(q => q.Id == questionId).FirstOrDefaultAsync();
        if (question == null) return false;

        bool hasLiked = question.Likes.Contains(userId);

        UpdateDefinition<Question> update = hasLiked
            ? Builders<Question>.Update.Pull(q => q.Likes, userId)
            : Builders<Question>.Update.AddToSet(q => q.Likes, userId);

        var result = await _questions.UpdateOneAsync(q => q.Id == questionId, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> AddRelatedBlog(string questionId, string blogId)
    {
        return true;
    }

    public async Task<bool> RemoveRelatedBlog(string questionId, string blogId)
    {
        return true;
    }

    public async Task<bool> UpdateTotalCorrectAnswers(List<string> questionIds, int value)
    {
        if (questionIds == null || !questionIds.Any())
            return false;

        var filter = Builders<Question>.Filter.In(q => q.Id, questionIds);
        var update = Builders<Question>.Update.Inc(q => q.TotalCorrectAnswers, value);

        var result = await _questions.UpdateManyAsync(filter, update);

        return result.ModifiedCount > 0;
    }

    public async Task<List<Question>> GetQuestionsByTeacherIdAsync(string teacherId)
    {
        // list all questions created by a specific teacher and thier status is published
        if (string.IsNullOrEmpty(teacherId))
        {
            return new List<Question>();
        }
        // Assuming the Question entity has a CreatedBy property that stores the teacher's ID
        var filter = Builders<Question>.Filter.And(
            Builders<Question>.Filter.Eq(q => q.CreatedBy, teacherId),
            Builders<Question>.Filter.Eq(q => q.Status, ContentStatusEnum.Published)
        );
        return await _questions.Find(filter).ToListAsync();
    }

}