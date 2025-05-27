using backend.Domain.Enums;

namespace backend.WebApi.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string userId, string title, string message, string relatedContentId = null, NotificationType type = NotificationType.TaskDown);
    }
} 