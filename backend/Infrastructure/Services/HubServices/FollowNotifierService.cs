using backend.Application.Contracts.Services;
using Microsoft.AspNetCore.SignalR;

namespace backend.Infrastructure.Services.HubServices;

public class FollowNotifierService<THub> : IFollowNotifierService where THub : Hub
{
    private readonly IHubContext<THub> _hubContext;

    public FollowNotifierService(IHubContext<THub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyFollowAsync(string followerId, string followedId)
    {
        if (string.IsNullOrEmpty(followerId) || string.IsNullOrEmpty(followedId))
            return;

        await _hubContext.Clients.User(followedId).SendAsync("ReceiveFollowNotification", followerId);
    }

    public async Task NotifyUnfollowAsync(string followerId, string followedId)
    {
        if (string.IsNullOrEmpty(followerId) || string.IsNullOrEmpty(followedId))
            return;

        await _hubContext.Clients.User(followedId).SendAsync("ReceiveUnfollowNotification", followerId);
    }

    public async Task NotifyFollowersAsync(string followedId, string message)
    {
        if (string.IsNullOrEmpty(followedId) || string.IsNullOrEmpty(message))
            return;

        await _hubContext.Clients.Group(followedId).SendAsync("ReceiveFollowersNotification", message);
    }
}