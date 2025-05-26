using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using MongoDB.Driver;

namespace backend.Persistence.Repositories;

public class StudentProgressRepository : GenericRepository<StudentProgress>, IStudentProgressRepository
{
    private readonly IMongoCollection<StudentProgress> _studentProgress;
    public StudentProgressRepository(MongoDbContext context) : base(context)
    {
        _studentProgress = context.GetCollection<StudentProgress>(typeof(StudentProgress).Name);
    }

    public async Task<StudentProgress> GetStudentProgress(string studentId)
    {
        var studentProgress = await _studentProgress.Find(x => x.StudentId == studentId).FirstOrDefaultAsync();
        return studentProgress;
    }
}