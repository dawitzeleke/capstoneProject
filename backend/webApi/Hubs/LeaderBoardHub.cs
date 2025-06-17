using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace backend.WebApi.Hubs;

[Authorize]
public class LeaderBoardHub : Hub
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

    public async Task JoinLeaderboardGroup()
    {
        // Add the current connection to the "LeaderboardPage" group
        await Groups.AddToGroupAsync(Context.ConnectionId, "LeaderboardPage");
    }

    // Method for clients to leave the leaderboard group
    public async Task LeaveLeaderboardGroup()
    {
        // Remove the current connection from the "LeaderboardPage" group
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "LeaderboardPage");
    }
}