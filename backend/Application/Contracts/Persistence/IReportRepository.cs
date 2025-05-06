using backend.Domain.Entities;
namespace backend.Application.Contracts.Persistence;

public interface IReportRepository : IGenericRepository<Report>
{
    // Task<Report> GetByContentIdAsync(string contentId);
    // Task<IReadOnlyList<Report>> GetAllReportsAsync();
    // Task<bool> IsContentReportedAsync(string contentId);
    // Task<bool> IsUserReportedAsync(string userId);
    // Task<bool> IsUserReportedContentAsync(string userId, string contentId);
}