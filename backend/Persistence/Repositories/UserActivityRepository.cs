using backend.Persistence.DatabaseContext;

using backend.Persistence.Repositories;
using MongoDB.Driver;

public class UserActivityRepository : GenericRepository<UserActivity>, IUserActivityRepository
{
    private readonly IMongoCollection<UserActivity> _userActivities;

    public UserActivityRepository(MongoDbContext context) : base(context)
    {
        _userActivities = context.GetCollection<UserActivity>(typeof(UserActivity).Name);
    }
    public async Task<UserActivity> GetByUserIdAsync(string userId)
    {
        return await _userActivities.Find(userActivity => userActivity.UserId == userId).FirstOrDefaultAsync();
    }
    public async Task TrackAsync(string userId, string role)
    {
        var userActivity = new UserActivity
        {
            UserId = userId.ToString(),
            Role = role,
            LastActive = DateTime.UtcNow
        };

        await _userActivities.ReplaceOneAsync(
            activity => activity.UserId == userId.ToString(),
            userActivity,
            new ReplaceOptions { IsUpsert = true }
        );
    }
    public async Task<int> CountActiveUsersTodayAsync()
    {
        var startOfDay = DateTime.UtcNow.Date;
        var endOfDay = startOfDay.AddDays(1);

        var filter = Builders<UserActivity>.Filter.And(
            Builders<UserActivity>.Filter.Gte(activity => activity.LastActive, startOfDay),
            Builders<UserActivity>.Filter.Lt(activity => activity.LastActive, endOfDay)
        );

        return (int)await _userActivities.CountDocumentsAsync(filter);
    }
}