using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;


namespace backend.Application.Features.Questions.Commands.UpdateQuestion;

public class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, GetQuestionDetailDto>
{
    private readonly IQuestionRepository _questionRepository;

    public UpdateQuestionCommandHandler(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<GetQuestionDetailDto> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.Id);
        if (question == null)
        {
            // throw new NotFoundException(nameof(Question), request.Id);
            return null;
        }

        var updated = await _questionRepository.UpdateAsync(question);
        if (updated == null)
        {
            // throw new ApplicationException();
            return null;
        }
        return new GetQuestionDetailDto
        {
            Id = updated.Id,
            QuestionText = updated.QuestionText,
            Point = updated.Point,
            CourseName = updated.CourseName,
            CorrectOption = updated.CorrectOption,
            Options = updated.Options,
            Description = updated.Description,
            Difficulty = updated.Difficulty,
            Grade = updated.Grade,
            Feedbacks = updated.Feedbacks,
            QuestionType = updated.QuestionType,
            TotalCorrectAnswers = updated.TotalCorrectAnswers,
            // CreatedBy = updated.CreatedBy,
        };
    }
}