
public interface INotificationRepository
{
    Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(string userId);
    Task<IEnumerable<Notification>> GetUnreadNotificationsByUserIdAsync(string userId);

}   