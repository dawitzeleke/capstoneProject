using MediatR;
using backend.Domain.Entities;

namespace backend.Application.Features.Image.Queries.GetAllImageContents;
public class GetAllImageContentsQuery : IRequest<IReadOnlyList<ImageContent>>
{
}