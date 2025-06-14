using MongoDB.Driver;
using backend.Persistence.DatabaseContext;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Application.Dtos.VideoContentDto;
using backend.Application.Dtos.PaginationDtos;

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

    public async Task<List<VideoContent>> GetFilteredVideoContents(VideoContentFilterDto filter, PaginationDto pagination)
    {
        var query = _videoContents.AsQueryable();
        if (filter.CreatorId!="" && filter.CreatorId != null)
        {
            query = query.Where(ic => ic.UpdatedBy == filter.CreatorId);
        }
        if(pagination.Limit != null)
        {
            query = query.Take(pagination.Limit);
        }else
        {
            query = query.Take(10); 
        }
        if (filter.Status.HasValue)
        {
            query = query.Where(ic => ic.Status == filter.Status);
        }
        var results = query.ToList();
        if (results == null || !results.Any())
        {
            return new List<VideoContent>();
        }
        return results;
    }
    

}