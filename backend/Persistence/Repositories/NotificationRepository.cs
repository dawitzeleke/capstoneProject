
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using MongoDB.Driver;

public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
{

    private readonly IMongoCollection<Notification> _notifications;
    public NotificationRepository(MongoDbContext dbContext) : base(dbContext)
    {
        _notifications = dbContext.GetCollection<Notification>(typeof(Notification).Name);
    }
    
    public async Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(string userId)
    {
        return await _notifications.Find(notification => notification.UserId == userId).ToListAsync();
    }
    public async Task<IEnumerable<Notification>> GetUnreadNotificationsByUserIdAsync(string userId)
    {
        return await _notifications.Find(notification => notification.UserId == userId && !notification.IsRead).ToListAsync();
    }
}