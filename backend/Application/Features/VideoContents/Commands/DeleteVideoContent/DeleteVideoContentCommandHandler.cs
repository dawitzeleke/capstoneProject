using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using MediatR;
namespace backend.Application.Features.VideoContents.Commands.DeleteVideoContent;

public class DeleteVideoContentCommandHandler : IRequestHandler<DeleteVideoContentCommand, bool>
{
    private readonly IVideoContentRepository _videoContentRepository;
    private readonly ICloudinaryService _cloudinaryService;

    public DeleteVideoContentCommandHandler(IVideoContentRepository videoContentRepository,  ICloudinaryService cloudinaryService)
    {
        _videoContentRepository = videoContentRepository;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<bool> Handle(DeleteVideoContentCommand request, CancellationToken cancellationToken)
    {
      
     
        return true;
    }
}