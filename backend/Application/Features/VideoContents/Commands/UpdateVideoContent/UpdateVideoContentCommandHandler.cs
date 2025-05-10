using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Services;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.VideoContents.Commands.UpdateVideoContent;

public class UpdateVideoContentCommandHandler : IRequestHandler<UpdateVideoContentCommand,VideoContent>
{
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IVideoContentRepository _videoContentRepository;

    public UpdateVideoContentCommandHandler(ICloudinaryService cloudinary,IVideoContentRepository videoContentRepository)
    {
        _cloudinaryService=cloudinary;
        _videoContentRepository=videoContentRepository;
    }

    public async Task<VideoContent> Handle(UpdateVideoContentCommand updateContent,CancellationToken cancellationToken)
    {
        var videoContent = await _videoContentRepository.GetByIdAsync(updateContent.Id);
        if (videoContent == null)
        {
            return null;
        }

        var content = new VideoContent{
            Id= updateContent.Id,
            Title = updateContent.Title ?? videoContent.Title,
            ThumbnailId = videoContent.ThumbnailId,
            VideoUrl = videoContent.VideoUrl,
            CreatedBy = videoContent.CreatedBy,
            CreatedAt = videoContent.CreatedAt,
            UpdatedAt = DateTime.UtcNow,
            Feedbacks = videoContent.Feedbacks,
            PublicId = videoContent.PublicId,
            Description = updateContent.Description ?? videoContent.Description,
            Tags = updateContent.Tags ?? videoContent.Tags
        };
        var response = await _videoContentRepository.UpdateAsync(content);
        if (response==null)
        {
            return null;
        }
        return response;
    }
}