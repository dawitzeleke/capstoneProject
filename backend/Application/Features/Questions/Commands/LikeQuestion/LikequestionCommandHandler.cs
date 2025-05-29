using MediatR;
using backend.Application.Contracts.Persistence;
namespace backend.Application.Features.Questions.Commands.LikeQuestion;
public class LikeQuestionCommandHandler : IRequestHandler<LikeQuestionCommand, bool>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public LikeQuestionCommandHandler(IQuestionRepository questionRepository, ICurrentUserService curICurrentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = curICurrentUserService;
    }

    public async Task<bool> Handle(LikeQuestionCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("user need to login");
        }
        var response = await _questionRepository.ToggleLike(request.QuestionId, userId);
        return response;
    }
}