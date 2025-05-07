using backend.Persistence.Repositories;
using backend.Application.Contracts.Persistence;
using MongoDB.Driver;
using backend.Persistence.DatabaseContext;

public class FollowRepository : GenericRepository<Follow>, IFollowRepository
{

    private readonly IMongoCollection<Follow> _follows;
    public FollowRepository(MongoDbContext dbContext) : base(dbContext)
    {
        _follows = dbContext.GetCollection<Follow>(typeof(Follow).Name);
    }



    public async Task<bool> IsFollowing(string studentId, string teacherId)
    {
        var filter = Builders<Follow>.Filter.And(
            Builders<Follow>.Filter.Eq(f => f.StudentId, studentId),
            Builders<Follow>.Filter.Eq(f => f.TeacherId, teacherId)
        );

        var count = await _follows.CountDocumentsAsync(filter);
        return count > 0;
    }
    
    public async Task<bool> UnFollow(string studentId, string teacherId)
    {
        var filter = Builders<Follow>.Filter.And(
            Builders<Follow>.Filter.Eq(f => f.StudentId, studentId),
            Builders<Follow>.Filter.Eq(f => f.TeacherId, teacherId)
        );

        var result = await _follows.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }
}