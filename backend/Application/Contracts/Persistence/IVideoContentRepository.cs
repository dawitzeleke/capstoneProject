using backend.Domain.Entities;
namespace backend.Application.Contracts.Persistence;

public interface IVideoContentRepository:IGenericRepository<VideoContent>
{
    Task<List<VideoContent>> GetVideoContentByIdList(IEnumerable<string> videoIds);
    // Task<bool> AddTagtoVideoContent(string id, string[] newTags);
    // Task<null> AddVideoView(string id);

}