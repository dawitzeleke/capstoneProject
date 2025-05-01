using MediatR;
using backend.Domain.Entities;

namespace backend.Application.Features.VideoContents.Queries.GetVideoContentList;

public class GetVideoContentListQuery : IRequest<IReadOnlyList<VideoContent>>
{
}