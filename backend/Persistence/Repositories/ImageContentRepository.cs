using MongoDB.Driver;
using backend.Persistence.DatabaseContext;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using backend.Application.Dtos.PaginationDtos;
using backend.Application.Dtos.ImageContentDtos;

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

    public async Task<List<ImageContent>> GetFilteredImageContents(ImageContentFilterDto filter, PaginationDto pagination)
    {
        var query = _imageContents.AsQueryable();
        if (filter.CreatorId!="" && filter.CreatorId != null)
        {
            query = query.Where(ic => ic.UpdatedBy == filter.CreatorId);
        }
        if(pagination.Limit!= null)
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
        var results =query.ToList();
        return results;
    }
}
