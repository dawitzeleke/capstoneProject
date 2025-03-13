using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommandHandler: IRequestHandler<CreateQuestionCommand, bool>
{
    private readonly IQuestionRepository _questionRepository;

    public CreateQuestionCommandHandler(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<bool> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = new Question{
            QuestionText = request.QuestionText,
            Description = request.Description,
            Options = request.Options,
            CorrectOption = request.CorrectOption,
            CreatedAt = DateTime.Now,
            Grade = request.Grade,
            totalCorrectAnswers=0,
            CourseName = request.CourseName,
            Point = request.Point,
            Difficulty = request.Difficulty,
            Feedbacks = [],
            QuestionType = request.QuestionType,
            CreatedBy = request.CreatedBy,
        };
        // System.Console.WriteLine(question);
        await _questionRepository.CreateAsync(question);
        return true;
    }
}