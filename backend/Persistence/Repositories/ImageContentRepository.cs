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
}

// profile
// 