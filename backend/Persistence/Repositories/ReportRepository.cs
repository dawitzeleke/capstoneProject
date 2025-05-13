using MongoDB.Driver;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Persistence.DatabaseContext;
namespace backend.Persistence.Repositories;

public class ReportRepository : GenericRepository<Report>, IReportRepository
{
    private readonly IMongoCollection<Report> _reports;
    public ReportRepository(MongoDbContext context) : base(context)
    {
        _reports= context.GetCollection<Report>(typeof(Report).Name);
    }

}