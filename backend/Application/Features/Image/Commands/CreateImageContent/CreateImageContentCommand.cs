using MediatR;
using backend.Domain.Entities;

namespace backend.Application.Features.Image.Commands.CreateImageContent;

public class CreateImageContentCommand : IRequest<ImageContent>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public Stream ImageStream { get; set; }
    public string[] Tags { get; set; }
    public string CreatedBy { get; set; }
}