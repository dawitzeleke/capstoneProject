using backend.Domain.Entities;

namespace backend.Application.Contracts.Services;

public interface ILeaderboardNotifier
{
    Task NotifyDivisionLeadersAsync(List<Student> leaders);
    Task NotifyUserRankAsync(string userId, int rank);
}