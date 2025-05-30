using MongoDB.Driver;
using backend.Persistence.DatabaseContext;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;

namespace backend.Persistence.Repositories;

public class ImageContentRepository : GenericRepository<ImageContent>, IImageContentRepository
{
    private readonly IMongoCollection<ImageContent> _imageContents;
    public ImageContentRepository(MongoDbContext context) : base(context)
    {
        _imageContents = context.GetCollection<ImageContent>(typeof(ImageContent).Name);
    }

    public async Task<List<ImageContent>> GetImageContentByIdList(IEnumerable<string> imageIds)
    {
        var ids = imageIds.ToList(); // Materialize once
        if (!ids.Any())
        {
            return new List<ImageContent>();
        }

        var filter = Builders<ImageContent>.Filter.In(ic => ic.Id, ids);
        return await _imageContents.Find(filter).ToListAsync();
    }
}
