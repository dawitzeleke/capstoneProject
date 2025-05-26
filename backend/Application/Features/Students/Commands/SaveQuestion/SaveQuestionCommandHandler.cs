using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;

namespace backend.Application.Features.Students.Commands.SaveQuestion;

public class SaveQuestionCommandHandler : IRequestHandler<SaveQuestionCommand, bool>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public SaveQuestionCommandHandler(IQuestionRepository questionRepository, IStudentRepository studentRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(SaveQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.QuestionId);
        if (question == null)
        {
            return false;
        }

        var studentId = _currentUserService.UserId.ToString();
        var student = await _studentRepository.GetByIdAsync(studentId);
        if (student == null)
        {
            return false;
        }
        var response = await _studentRepository.SaveQuestionAsync(studentId, request.QuestionId);
        return response;
    }
}