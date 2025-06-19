using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.webApi.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(role) && !string.IsNullOrEmpty(userId))
            {
                if (role == "Student")
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Students");
                else if (role == "Teacher")
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Teachers");

                await Groups.AddToGroupAsync(Context.ConnectionId, userId); // for personal updates
            }



            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task NotifyTeacher(string teacherId, string message)
        {
            if (string.IsNullOrEmpty(teacherId) || string.IsNullOrEmpty(message))
                return;

            await Clients.User(teacherId).SendAsync("ReceiveNotification", message);
        }
    }
        
} 