using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
namespace backend.Application.Features.Image.Commands.CreateImageContent;

public class CreateImageContentCommandHandler : IRequestHandler<CreateImageContentCommand, ImageContent>
{
    private readonly IImageContentRepository _imageContentRepository;
    private readonly ICloudinaryService _cloudinaryService;

    public CreateImageContentCommandHandler(IImageContentRepository imageContentRepository, ICloudinaryService cloudinaryService)
    {
        _imageContentRepository = imageContentRepository;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<ImageContent> Handle(CreateImageContentCommand request, CancellationToken cancellationToken)
    {
        var upload_response = await _cloudinaryService.UploadImageAsync(request.ImageStream);
        var imageContent = new ImageContent
        {
            Title = request.Title,
            Description = request.Description,
            ImageUrl = upload_response.Url,
            Tags = request.Tags,
            CreatedBy = request.CreatedBy
        };

       var result = await _imageContentRepository.CreateAsync(imageContent);
        return result;
    }
}