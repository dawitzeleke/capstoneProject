using backend.Domain.Entities;
using backend.Application.Dtos.PaginationDtos;
using backend.Application.Dtos.VideoContentDto;

namespace backend.Application.Contracts.Persistence;

public interface IVideoContentRepository:IGenericRepository<VideoContent>
{
    Task<List<VideoContent>> GetVideoContentByIdList(IEnumerable<string> videoIds);
    // Task<bool> AddTagtoVideoContent(string id, string[] newTags);
    // Task<null> AddVideoView(string id);
    Task<List<VideoContent>> GetFilteredVideoContents(VideoContentFilterDto filter, PaginationDto pagination);

}