using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;

namespace backend.Application.Features.Students.Queries.GetSavedQuestions;

public class GetSavedQuestionsQueryHandler : IRequestHandler<GetSavedQuestionsQuery, List<Question>>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IQuestionRepository _questionRepository;

    public GetSavedQuestionsQueryHandler(IStudentRepository studentRepository, IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _studentRepository = studentRepository;
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<Question>> Handle(GetSavedQuestionsQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId.ToString();
        var savedQuestionIds = await _studentRepository.GetSavedQuestions(studentId);
        var questions = await _questionRepository.GetQuestionByIdList(savedQuestionIds);
        return questions;
    }
}