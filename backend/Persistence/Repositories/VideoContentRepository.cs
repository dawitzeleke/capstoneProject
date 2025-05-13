using MongoDB.Driver;
using backend.Persistence.DatabaseContext;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;

namespace backend.Persistence.Repositories;

public class VideoContentRepository : GenericRepository<VideoContent>, IVideoContentRepository
{
    private readonly IMongoCollection<VideoContent> _videoContents;
    public VideoContentRepository(MongoDbContext context) : base(context)
    {
        _videoContents = context.GetCollection<VideoContent>(typeof(VideoContent).Name);
    }

}