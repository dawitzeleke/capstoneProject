using backend.Domain.Entities;
namespace backend.Application.Contracts.Persistence;

public interface IVideoContentRepository:IGenericRepository<VideoContent>
{
    // Task<bool> AddTagtoVideoContent(string id, string[] newTags);
    // Task<null> AddVideoView(string id);

}