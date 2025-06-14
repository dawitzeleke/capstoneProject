using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
namespace backend.Application.Features.Image.Commands.CreateImageContent;

public class CreateImageContentCommandHandler : IRequestHandler<CreateImageContentCommand, ImageContent>
{
    private readonly IImageContentRepository _imageContentRepository;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ICurrentUserService _currentUserService;

    public CreateImageContentCommandHandler(IImageContentRepository imageContentRepository, ICloudinaryService cloudinaryService, ICurrentUserService currentUserService)
    {
        _imageContentRepository = imageContentRepository;
        _cloudinaryService = cloudinaryService;
        _currentUserService = currentUserService;
    }

    public async Task<ImageContent> Handle(CreateImageContentCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        
        var upload_response = await _cloudinaryService.UploadImageAsync(request.ImageStream);
        var imageContent = new ImageContent
        {
            Title = request.Title,
            Description = request.Description,
            ImageUrl = upload_response.Url,
            Tags = request.Tags,
            CreatedBy = userId,
        };

       var result = await _imageContentRepository.CreateAsync(imageContent);
        return result;
    }
}