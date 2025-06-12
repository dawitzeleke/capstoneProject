using backend.Application.Contracts.Persistence;
using backend.Domain.Enums;
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using MongoDB.Driver;

public class LikeRepository : GenericRepository<Like>, ILikeRepository
{
    private readonly IMongoCollection<Like> _likes;

    public LikeRepository(MongoDbContext context) : base(context)
    {
        _likes = context.GetCollection<Like>(typeof(Like).Name);
    }

    public async Task<Like> GetByUserAndContentAsync(string userId, string contentId, ContentTypeEnum contentType)
    {
        return await _likes.Find(x => x.UserId == userId && x.ContentId == contentId && x.ContentType == contentType).FirstOrDefaultAsync();
    }
    public async Task<int> CountByContentAsync(string contentId, ContentTypeEnum contentType)
    {
        return (int)await _likes.CountDocumentsAsync(x => x.ContentId == contentId && x.ContentType == contentType);
    }
}