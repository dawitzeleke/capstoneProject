using Microsoft.AspNetCore.SignalR;
using backend.webApi.Hubs;
using backend.Application.Contracts.Services;
using backend.Domain.Enums;
using backend.WebApi.Services;

namespace backend.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationAsync(string userId, string title, string message, string relatedContentId = null, NotificationType type = NotificationType.TaskDown)
        {
            var notification = new
            {
                Title = title,
                Message = message,
                RelatedContentId = relatedContentId,
                Type = type,
                CreatedAt = DateTime.UtcNow
            };

            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notification);
        }
    }
} 