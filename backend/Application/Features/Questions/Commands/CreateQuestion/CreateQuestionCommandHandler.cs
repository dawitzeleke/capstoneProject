using MediatR;
using AutoMapper;
using System;
using System.Threading;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommandHandler: IRequestHandler<CreateQuestionCommand, bool>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IMapper _mapper;

    public CreateQuestionCommandHandler(IQuestionRepository questionRepository, IMapper mapper)
    {
        _questionRepository = questionRepository;
        _mapper = mapper;
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
            CorrectAnswers=0,
            CourseName = request.CourseName,
            Points = request.Points,
            Difficulty = request.Difficulty,
            Feedbacks = [],
            QuestionType = request.QuestionType,
            CreatedBy = request.CreatedBy,
        };
        await _questionRepository.CreateAsync(question);
        return true;
    }
}