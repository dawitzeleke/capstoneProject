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

}
