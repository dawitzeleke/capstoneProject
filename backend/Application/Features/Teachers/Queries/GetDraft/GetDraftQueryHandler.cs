using MediatR;
using backend.Application.Dtos.ImageContentDtos;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Dtos.VideoContentDto;
using backend.Application.Dtos.PaginationDtos;
using backend.Domain.Enums;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Teachers.Queries.GetDraft;

public class GetDraftQueryHandler : IRequestHandler<GetDraftQuery, List<object>>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IImageContentRepository _imageRepository;
    private readonly IVideoContentRepository _videoRepository;
    private readonly ICurrentUserService _currentUserService;
    
    public GetDraftQueryHandler(IQuestionRepository questionRepository, 
                                IImageContentRepository imageRepository, 
                                IVideoContentRepository videoRepository,
                                ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _imageRepository = imageRepository;
        _videoRepository = videoRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<object>> Handle(GetDraftQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId?.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        var pagination = new PaginationDto
        {
            Limit = request.totalCount > 0 ? request.totalCount : 10
        };

        switch (request.contentType)
        {
            case ContentTypeEnum.Question:
                var filter = new QuestionFilterDto
                {
                    Status = ContentStatusEnum.Draft,
                };
                var questions = await _questionRepository.GetFilteredQuestions(filter, pagination);
                return questions.Items.Cast<object>().ToList();
            case ContentTypeEnum.Image:
                var images = await _imageRepository.GetFilteredImageContents(
                    new ImageContentFilterDto
                    {
                        Status = ContentStatusEnum.Draft,
                        CreatorId = userId
                    },
                    pagination);
                return images.Cast<object>().ToList();
            case ContentTypeEnum.Video:
                var videos = await _videoRepository.GetFilteredVideoContents(
                    new VideoContentFilterDto
                    {
                        Status = ContentStatusEnum.Draft,
                        CreatorId = userId
                    }, 
                    pagination);
                return videos.Cast<object>().ToList();
            default:
                throw new ArgumentException("Invalid content type");
        }        
        
    }
}