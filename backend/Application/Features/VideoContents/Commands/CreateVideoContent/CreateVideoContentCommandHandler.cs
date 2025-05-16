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

    public CreateVideoContentCommandHandler(ICloudinaryService cloudinary, IVideoContentRepository videoContentRepository)
    {
        _cloudinaryService=cloudinary;
        _videoContentRepository=videoContentRepository;
    }

    public async Task<VideoContent> Handle(CreateVideoContentCommand request,CancellationToken cancellationToken){
       
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
            CreatedBy = request.CreatedBy,
            CreatedAt = DateTime.UtcNow,
        };
        var response= await _videoContentRepository.CreateAsync(videoContent);
        return response;

    }
}