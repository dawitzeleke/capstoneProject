using MediatR;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Commands.AddRelatedBlog;
public class AddRelatedBlogCommandHandler : IRequestHandler<AddRelatedBlogCommand, bool>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public AddRelatedBlogCommandHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AddRelatedBlogCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("user need to login");
        }

        var question = await _questionRepository.GetByIdAsync(request.QuestionId);
        if (question == null)
        {
            return false; // Question not found
        }
        if (question.CreatedBy != userId)
        {
            throw new UnauthorizedAccessException("You are not authorized to add a related blog to this question.");
        }

        var response = await _questionRepository.AddRelatedBlog(request.QuestionId, request.BlogId);
        return response;
    }
}