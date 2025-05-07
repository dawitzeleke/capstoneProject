using MediatR;
using backend.Domain.Entities;

namespace backend.Application.Features.VideoContents.Commands.CreateVideoContent;

public class CreateVideoContentCommand : IRequest<VideoContent>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Thumbnail{ get; set; }
    public Stream? VideoStream { get; set; }
    public string[] Tags { get; set; }
    public string CreatedBy { get; set; }

}