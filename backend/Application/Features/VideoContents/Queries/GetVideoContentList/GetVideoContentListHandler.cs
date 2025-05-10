using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.VideoContents.Queries.GetVideoContentList;

public class GetVideoContentListHandler: IRequestHandler<GetVideoContentListQuery, IReadOnlyList<VideoContent>>
{
    private readonly IVideoContentRepository _videoContentRepository;

    public GetVideoContentListHandler(IVideoContentRepository videoContentRepository)
    {
        _videoContentRepository = videoContentRepository;
    }

    public async Task<IReadOnlyList<VideoContent>> Handle(GetVideoContentListQuery request, CancellationToken cancellationToken)
    {
        var videoContents = await _videoContentRepository.GetAllAsync();
        return videoContents;
    }
}