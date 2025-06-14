using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Services;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.CloudinaryDtos;

namespace backend.Application.Features.VideoContents.Commands.CreateVideoContent;

public class CreateVideoContentCommandHandler: IRequestHandler<CreateVideoContentCommand,VideoContent>
{
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IVideoContentRepository _videoContentRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateVideoContentCommandHandler(ICloudinaryService cloudinary, IVideoContentRepository videoContentRepository,
        ICurrentUserService currentUserService)
    {
        _cloudinaryService = cloudinary;
        _videoContentRepository = videoContentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<VideoContent> Handle(CreateVideoContentCommand request,CancellationToken cancellationToken){

        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        
        var uploadResponse = await _cloudinaryService.UploadVideoAsync(request.VideoStream);
        if (uploadResponse.Url == null)
        {
            return null;
        }
        
        var videoContent = new VideoContent
        {
            Title = request.Title,
            Description = request.Description,
            ThumbnailId = request.Thumbnail,
            VideoUrl = uploadResponse.Url,
            Tags = request.Tags,
            PublicId = uploadResponse.PublicId,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow,
        };
        var response= await _videoContentRepository.CreateAsync(videoContent);
        return response;

    }
}