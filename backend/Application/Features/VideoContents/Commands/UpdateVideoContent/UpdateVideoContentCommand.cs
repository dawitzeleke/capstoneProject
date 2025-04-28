using MediatR;
using backend.Domain.Entities;
namespace backend.Application.Features.VideoContents.Commands.UpdateVideoContent;

public class UpdateVideoContentCommand : IRequest<VideoContent>
{
    public string Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string[]? Tags { get; set; }
}