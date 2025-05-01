using MediatR;
using backend.Domain.Entities;
namespace backend.Application.Features.Image.Queries.GetImageContent;
public class GetImageContentQuery : IRequest<ImageContent>
{
    public string Id { get; set; }
}