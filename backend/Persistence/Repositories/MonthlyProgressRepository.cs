using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using MongoDB.Driver;
namespace backend.Persistence.Repositories;

public class MonthlyProgressRepository : GenericRepository<MonthlyProgress>, IMonthlyProgressRepository
{
    private readonly IMongoCollection<MonthlyProgress> _monthlyProgress;
    public MonthlyProgressRepository(MongoDbContext context) : base(context)
    {
        _monthlyProgress = context.GetCollection<MonthlyProgress>(typeof(MonthlyProgress).Name);
    }
    public async Task<MonthlyProgress> GetByStudentIdAndMonthAsync(string studentId, string monthYear)
    {
        var filter = Builders<MonthlyProgress>.Filter.And(
            Builders<MonthlyProgress>.Filter.Eq(mp => mp.StudentId, studentId),
            Builders<MonthlyProgress>.Filter.Eq(mp => mp.Month, monthYear)
        );

        return await _monthlyProgress.Find(filter).FirstOrDefaultAsync();
    }
    public async Task<MonthlyProgress> GetByStudentIdAsync(string studentId)
    {
        var filter = Builders<MonthlyProgress>.Filter.Eq(mp => mp.StudentId, studentId);
        return await _monthlyProgress.Find(filter).FirstOrDefaultAsync();
    }

}
