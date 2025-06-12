using MediatR;
using backend.Domain.Enums;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;


namespace backend.Application.Features.Questions.Commands.UpdateQuestion;

public class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, Question>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateQuestionCommandHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Question> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.Id);

        if (question == null)
        {
            // throw new NotFoundException(nameof(Question), request.Id);
            return null;
        }
        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        if (question.CreatedBy != userId)
        {
            throw new UnauthorizedAccessException("You are not authorized to update this question.");
        }

        switch (request.Difficulty)
        {
            case DifficultyLevel.Easy:
                request.Point = 1;
                break;
            case DifficultyLevel.Medium:
                request.Point = 2;
                break;
            case DifficultyLevel.Hard:
                request.Point = 3;
                break;
        }

        question.QuestionText = request.Question ?? question.QuestionText;
        question.Description = request.Description ?? question.Description;
        question.CorrectOption = request.CorrectOption ?? question.CorrectOption;
        question.Difficulty = request.Difficulty ?? question.Difficulty;
        question.Options = request.Options ?? question.Options;
        question.Grade = request.Grade ?? question.Grade;
        question.QuestionType = request.QuestionType ?? question.QuestionType;
        question.Explanation = request.Explanation ?? question.Explanation;
        question.Hint = request.Hint ?? question.Hint;
        question.Tags = request.Tags ?? question.Tags;
        question.Stream = request.Stream ?? question.Stream;
        question.Chapter = request.Chapter ?? question.Chapter;
        question.Point = request.Point ?? question.Point;

        var updated = await _questionRepository.UpdateAsync(question);
        if (updated == null)
        {
            return null;
        }
        return updated;       
        
    }
}