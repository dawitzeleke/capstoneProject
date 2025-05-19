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

    public StudentQuestionAttemptsRepository(MongoDbContext context ): base(context)
    {
        _studentQuestionAttempt = context.GetCollection<StudentQuestionAttempts>(typeof(StudentQuestionAttempts).Name);
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
        _studentQuestionAttempt.Indexes.CreateMany(new[] {compoundIndex});
    }

    public async Task<List<string>> GetAttemptedQuestions(QuestionFilterDto filter, int amount)
    {
        var query = _studentQuestionAttempt.AsQueryable();

        if (!string.IsNullOrEmpty(filter.StudentId))
        {
            query = query.Where(q => q.StudentId == filter.StudentId);
        }
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

        var questionIds = query.OrderByDescending(q => q.AttemptCount)
            .Select(q => q.QuestionId)
            .Take(amount)
            .ToList();

        return questionIds;
    }   
}