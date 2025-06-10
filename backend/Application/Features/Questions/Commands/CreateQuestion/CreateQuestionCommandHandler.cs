using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommandHandler: IRequestHandler<CreateQuestionCommand, Question>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateQuestionCommandHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Question> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        request.CreatedBy = userId;
        switch (request.Difficulty){
            case DifficultyLevel.Easy:
                request.Point = 1;
                break;
            case DifficultyLevel.Medium:
                request.Point = 2;
                break;
            case DifficultyLevel.Hard:
                request.Point = 3;
                break;
            default:
                request.Point = 1; // Default point for unspecified difficulty
                break;
        }

        var question = new Question{
            QuestionText = request.QuestionText,
            Description = request.Description,
            Options = request.Options,
            CorrectOption = request.CorrectOption,
            Grade = request.Grade,
            CourseName = request.CourseName,
            Difficulty = request.Difficulty,
            QuestionType = request.QuestionType,
            Tags = request.Tags,
            Hint = request.Hint,
            Explanation = request.Explanation,
            CreatedBy = request.CreatedBy,
            Stream = request.Stream,
            CreatedAt = DateTime.Now,
            Report = null,
            Point = request.Point,
            TotalCorrectAnswers=0,
        };
        var newQuestion = await _questionRepository.CreateAsync(question);
        return newQuestion;
    }
}