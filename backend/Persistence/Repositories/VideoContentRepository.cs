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

    public async Task<List<VideoContent>> GetVideoContentByIdList(IEnumerable<string> VideoContentIds)
    {
        var ids = VideoContentIds.ToList(); // Materialize once
        if (!ids.Any())
        {
            return new List<VideoContent>();
        }

        var filter = Builders<VideoContent>.Filter.In(q => q.Id, ids);
        return await _videoContents.Find(filter).ToListAsync();
    }
    

}