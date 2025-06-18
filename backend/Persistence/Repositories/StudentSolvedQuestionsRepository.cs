using MongoDB.Driver;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Dtos.PaginationDtos;
using backend.Persistence.DatabaseContext;
using backend.Application.Features.Students.Queries.GetSavedQuestions;

namespace backend.Persistence.Repositories;

public class StudentSolvedQuestionsRepository: GenericRepository<StudentSolvedQuestions>, IStudentSolvedQuestionsRepository
{
    private readonly IMongoCollection<StudentSolvedQuestions> _studentSolvedQuestions;

    public StudentSolvedQuestionsRepository(MongoDbContext context ): base(context)
    {
        _studentSolvedQuestions = context.GetCollection<StudentSolvedQuestions>(typeof(StudentSolvedQuestions).Name);

        CreateIndexes();
    }

    private void CreateIndexes()
    {
        // Compound index for queries combining Grade, Stream, and CourseName
        var compoundIndex = new CreateIndexModel<StudentSolvedQuestions>(
            Builders<StudentSolvedQuestions>.IndexKeys
                .Ascending(x => x.StudentId)
                .Ascending(x => x.SolveCount),
            new CreateIndexOptions { Background = true }
        );

        // Create indexes (MongoDB skips if they already exist)
        _studentSolvedQuestions.Indexes.CreateMany(new[] {compoundIndex});
    }

    public async Task<List<StudentSolvedQuestions>> GetSolvedQuestions(string studentId, PaginationDto pagination = null)     
    {
        var query = _studentSolvedQuestions.AsQueryable();
        if (!string.IsNullOrEmpty(studentId))
        {
            return null;
        }
        query = query.Where(q => q.StudentId == studentId);
        if (pagination!=null && pagination.LastSolveCount.HasValue && !string.IsNullOrEmpty(pagination.LastId))
        {
            var lastObjectId = pagination.LastId;
            query = query.Where(q => q.SolveCount >= pagination.LastSolveCount ||
            (q.SolveCount == pagination.LastSolveCount.Value && q.Id.CompareTo(lastObjectId) > 0));
        }
        var solvedQuestions = await _studentSolvedQuestions
            .Find(q => q.StudentId == studentId)
            .SortBy(q => q.SolveCount)
            .ThenBy(q => q.Id)
            .Limit(pagination?.Limit ?? 20)
            .ToListAsync();
        return solvedQuestions;
    }

    public async Task<List<string>> GetSolvedQuestionIds(QuestionFilterDto filter, int? amount = null)
    {
        var query = _studentSolvedQuestions.AsQueryable();

        if (!string.IsNullOrEmpty(filter.StudentId)){
            query = query.Where(q =>q.StudentId == filter.StudentId);
        }
        if (filter.Grade.HasValue)
            query = query.Where(q => q.Grade == filter.Grade);

        if (filter.Stream.HasValue)
            query = query.Where(q => q.Stream == filter.Stream);

        if (!string.IsNullOrEmpty(filter.CourseName))
            query = query.Where(q => q.CourseName == filter.CourseName);
        
        if (!string.IsNullOrEmpty(filter.CreatorId)){
             query = query.Where(q => q.UpdatedBy == filter.CreatorId);
        }

        var orderedQuery = query.OrderBy(q => q.SolveCount)
            .Select(q => q.QuestionId);

        // Apply amount limit only if specified
        var questionIds = amount.HasValue 
            ? orderedQuery.Take(amount.Value).ToList()
            : orderedQuery.ToList();

        return questionIds;
    }

    public async Task<bool> UpdateSolvedQuestions(List<StudentSolvedQuestions> solvedQuestions, string studentId, int value)
    {
        if (solvedQuestions == null || !solvedQuestions.Any())
            return false;
        var tasks = new List<Task>();

        foreach (var attempt in solvedQuestions)
        {
            var filter = Builders<StudentSolvedQuestions>.Filter.And(
                Builders<StudentSolvedQuestions>.Filter.Eq(a => a.StudentId, studentId),
                Builders<StudentSolvedQuestions>.Filter.Eq(a => a.QuestionId, attempt.QuestionId)
            );

            var update = Builders<StudentSolvedQuestions>.Update.Inc(a => a.SolveCount, value);

            tasks.Add(_studentSolvedQuestions.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true }));
        }

        await Task.WhenAll(tasks);
        return true;

    }
   
   

    public async Task<bool> InsertManyAsync(List<StudentSolvedQuestions> solvedQuestions)
    {
        if (solvedQuestions == null || !solvedQuestions.Any())
            return false;
        
        

        await _studentSolvedQuestions.InsertManyAsync(solvedQuestions);
        return true;
    }
    

}