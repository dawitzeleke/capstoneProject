using backend.Application.Contracts.Persistence;
using backend.Domain.Enums;

public interface ISaveRepository : IGenericRepository<Save>
{
    Task<Save> GetByUserAndContentAsync(string userId, string contentId, ContentTypeEnum contentType);
    Task<int> CountByContentAsync(string contentId, ContentTypeEnum contentType);
}