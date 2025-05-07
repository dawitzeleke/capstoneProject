using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Image.Queries.GetAllImageContents;

public class GetAllImageContentsQueryHandler : IRequestHandler<GetAllImageContentsQuery, IReadOnlyList<ImageContent>>
{
    private readonly IImageContentRepository _imageContentRepository;

    public GetAllImageContentsQueryHandler(IImageContentRepository imageContentRepository)
    {
        _imageContentRepository = imageContentRepository;
    }

    public async Task<IReadOnlyList<ImageContent>> Handle(GetAllImageContentsQuery request, CancellationToken cancellationToken)
    {
        var imageContents = await _imageContentRepository.GetAllAsync();
        return imageContents;
    }
}