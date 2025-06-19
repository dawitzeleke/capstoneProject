using MongoDB.Driver;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Persistence.DatabaseContext;
using backend.Domain.Enums;

namespace backend.Persistence.Repositories;

public class StudentQuestionAttemptsRepository : GenericRepository<StudentQuestionAttempts>, IStudentQuestionAttemptsRepository
{
    private readonly IMongoCollection<StudentQuestionAttempts> _studentQuestionAttempt;

    public StudentQuestionAttemptsRepository(MongoDbContext context) : base(context)
    {
        _studentQuestionAttempt = context.GetCollection<StudentQuestionAttempts>(typeof(StudentQuestionAttempts).Name);
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        // Compound index for queries combining Grade, Stream, and CourseName
        var compoundIndex = new CreateIndexModel<StudentQuestionAttempts>(
            Builders<StudentQuestionAttempts>.IndexKeys
                .Ascending(x => x.StudentId)
                .Descending(x => x.AttemptCount),
            new CreateIndexOptions { Background = true }
        );

        // Create indexes (MongoDB skips if they already exist)
        _studentQuestionAttempt.Indexes.CreateMany(new[] { compoundIndex });
    }

    public async Task<List<StudentQuestionAttempts>> GetAttemptedQuestions(string studentId)
    {
        var attemptQuestions = await _studentQuestionAttempt
            .Find(q => q.StudentId == studentId)
            .ToListAsync();
        return attemptQuestions;
    }

    public async Task<List<string>> GetAttemptedQuestionIds(QuestionFilterDto filter, int? amount = null)
    {
        var query = _studentQuestionAttempt.AsQueryable();

        if (!string.IsNullOrEmpty(filter.StudentId))
        {
            query = query.Where(q => q.StudentId == filter.StudentId);
        }
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

        var orderedQuery = query.OrderByDescending(q => q.AttemptCount)
            .Select(q => q.QuestionId);

        // Apply amount limit only if specified
        var questionIds = amount.HasValue
            ? orderedQuery.Take(amount.Value).ToList()
            : orderedQuery.ToList();

        return questionIds;
    }

    public async Task<bool> InsertManyAsync(List<StudentQuestionAttempts> attemptedQuestions)
    {
        if (attemptedQuestions == null || !attemptedQuestions.Any())
            return false;

        await _studentQuestionAttempt.InsertManyAsync(attemptedQuestions);
        return true;
    }

    public async Task RemoveManyAsync(List<StudentQuestionAttempts> attemptedQuestions)
    {
        if (attemptedQuestions == null || !attemptedQuestions.Any())
            return;
        var attemptIds = attemptedQuestions.Select(a => a.Id).ToList();
        var filter = Builders<StudentQuestionAttempts>.Filter.In(a => a.Id, attemptIds);

        await _studentQuestionAttempt.DeleteManyAsync(filter);
    }

    public async Task<bool> UpdateAttemptedQuestions(List<StudentQuestionAttempts> attemptedQuestions, string studentId, int value)
    {
        if (attemptedQuestions == null || !attemptedQuestions.Any())
            return false;
        var tasks = new List<Task>();

        foreach (var attempt in attemptedQuestions)
        {
            var filter = Builders<StudentQuestionAttempts>.Filter.And(
                Builders<StudentQuestionAttempts>.Filter.Eq(a => a.StudentId, studentId),
                Builders<StudentQuestionAttempts>.Filter.Eq(a => a.QuestionId, attempt.QuestionId)
            );

            var update = Builders<StudentQuestionAttempts>.Update.Inc(a => a.AttemptCount, value);

            tasks.Add(_studentQuestionAttempt.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true }));
        }

        await Task.WhenAll(tasks);
        return true;

    }
    public async Task<List<string>> GetAttemptedQuestionIds(string studentId)
    {
        var result = await _studentQuestionAttempt
            .Find(q => q.StudentId == studentId)
            .Project(q => q.QuestionId)
            .ToListAsync();
        return result;
    }
}