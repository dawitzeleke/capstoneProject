using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Image.Queries.GetImageContent;
public class GetImageContentQueryHandler : IRequestHandler<GetImageContentQuery, ImageContent>
{
    private readonly IImageContentRepository _imageContentRepository;

    public GetImageContentQueryHandler(IImageContentRepository imageContentRepository)
    {
        _imageContentRepository = imageContentRepository;
    }

    public async Task<ImageContent> Handle(GetImageContentQuery request, CancellationToken cancellationToken)
    {
        var imageContent = await _imageContentRepository.GetByIdAsync(request.Id);
        Console.WriteLine($"GetImageContentQueryHandler: {imageContent}");
        if (imageContent == null)
        {
           return null;
        }
        return imageContent;
    }
}
