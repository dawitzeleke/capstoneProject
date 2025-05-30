using MediatR;
using backend.Application.Contracts.Persistence;
namespace backend.Application.Features.Questions.Commands.RemoveRelatedBlog;

public class RemoveRelatedBlogCommandHandler : IRequestHandler<RemoveRelatedBlogCommand, bool>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public RemoveRelatedBlogCommandHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RemoveRelatedBlogCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var question = await _questionRepository.GetByIdAsync(request.QuestionId);
        if (question == null)
        {
            return false; // Question not found
        }
        if (question.CreatedBy != userId)
        {
            throw new UnauthorizedAccessException("You are not authorized to remove related blogs from this question.");
        }

        var response = await _questionRepository.RemoveRelatedBlog(request.QuestionId, request.BlogId);
        if (!response)
        {
            throw new Exception("Failed to remove related blog from the question.");
        }
        return true; // Successfully removed related blog
    }
}