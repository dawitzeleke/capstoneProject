using backend.Domain.Enums;
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using MongoDB.Driver;

public class SaveRepository : GenericRepository<Save>, ISaveRepository
{
    private readonly IMongoCollection<Save> _saves;

    public SaveRepository(MongoDbContext context) : base(context)
    {
        _saves = context.GetCollection<Save>(typeof(Save).Name);
    }

    public async Task<Save> GetByUserAndContentAsync(string userId, string contentId, ContentTypeEnum contentType)
    {
        return await _saves.Find(x => x.UserId == userId && x.ContentId == contentId && x.ContentType == contentType).FirstOrDefaultAsync();
    }

    public async Task<int> CountByContentAsync(string contentId, ContentTypeEnum contentType)
    {
        return (int)await _saves.CountDocumentsAsync(x => x.ContentId == contentId && x.ContentType == contentType);
    }
}