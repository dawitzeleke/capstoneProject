using MongoDB.Driver;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;
using backend.Persistence.DatabaseContext;

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
    public async Task<List<string>> GetSolvedQuestions(QuestionFilterDto filter,int amount)
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

        var questionIds = query.OrderBy(q => q.SolveCount)
            .Select(q => q.QuestionId)
            .Take(amount)
            .ToList();


        return questionIds;
    } 
}