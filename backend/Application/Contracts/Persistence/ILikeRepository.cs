using backend.Application.Contracts.Persistence;
using backend.Domain.Enums;

public interface ILikeRepository : IGenericRepository<Like>
{
    Task<Like> GetByUserAndContentAsync(string userId, string contentId, ContentTypeEnum contentType);
    Task<int> CountByContentAsync(string contentId, ContentTypeEnum contentType);
}