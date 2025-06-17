using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Features.Questions.Queries.GetTeachersQuestion;

public class GetTeachersPostedQuestionQueryHandler : IRequestHandler<GetTeachersPostedQuestionQuery, List<Question>>
{
    private readonly IQuestionRepository _questionRepository;

    private readonly ICurrentUserService _currentUserService;

    public GetTeachersPostedQuestionQueryHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<Question>> Handle(GetTeachersPostedQuestionQuery request, CancellationToken cancellationToken)
    {
        var teacherId = _currentUserService.UserId?.ToString();
        if (string.IsNullOrEmpty(teacherId))
        {
            throw new UnauthorizedAccessException("You are not authorized to view these questions.");
        }
        return await _questionRepository.GetQuestionsByTeacherIdAsync(teacherId);
    }
}