using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Application.Contracts.Services;

public interface ILeaderboardNotifier
{
    Task NotifyDivisionLeadersAsync( Dictionary<DivisionEnums, List<Student>> leaders);
    Task NotifyUserRankAsync(string userId, int rank);
}