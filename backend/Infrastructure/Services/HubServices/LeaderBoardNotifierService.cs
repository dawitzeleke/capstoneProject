using Microsoft.AspNetCore.SignalR;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Infrastructure.Services.HubServices;

public class SignalRLeaderBoardNotifierService<THub> : ILeaderboardNotifier where THub : Hub
{
    private readonly IHubContext<THub> _hubContext;
    public SignalRLeaderBoardNotifierService(IHubContext<THub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyDivisionLeadersAsync(Dictionary<DivisionEnums, List<Student>> leaders)
    {
        if (leaders == null || !leaders.Any())
            return;

        await _hubContext.Clients.Group("DivisionLeaders").SendAsync("ReceiveDivisionLeaders", leaders);
    }

    public async Task NotifyUserRankAsync(string userId, int rank)
    {
        if (string.IsNullOrEmpty(userId))
            return;

        await _hubContext.Clients.User(userId).SendAsync("ReceiveUserRank", rank);
    }

}