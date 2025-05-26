using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Application.Features.Students.Commands.SaveContent;

public class SaveContentCommandHandler : IRequestHandler<SaveContentCommand, bool>
{
    private readonly IVideoContentRepository _videoContentRepository;
    private readonly IImageContentRepository _imageContentRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public SaveContentCommandHandler(IVideoContentRepository videoContentRepository, IImageContentRepository imageContentRepository, IStudentRepository studentRepository, ICurrentUserService currentUserService)
    {
        _videoContentRepository = videoContentRepository;
        _imageContentRepository = imageContentRepository;
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(SaveContentCommand request, CancellationToken cancellationToken)
    {
        if (request.ContentType == ContentTypeEnum.Video)
        {
            var videoContent = await _videoContentRepository.GetByIdAsync(request.ContentId);
            if (videoContent == null)
            {
                return false;
            }
        }else if (request.ContentType == ContentTypeEnum.Image)
        {
            var imageContent = await _imageContentRepository.GetByIdAsync(request.ContentId);
            if (imageContent == null)
            {
                return false;
            }
        }

        var studentId = _currentUserService.UserId.ToString();
        var student = await _studentRepository.GetByIdAsync(studentId);
        if (student == null)
        {
            return false;
        }
        
        var response = await _studentRepository.SaveContentAsync(studentId, request.ContentId);
        return response;
    }
}