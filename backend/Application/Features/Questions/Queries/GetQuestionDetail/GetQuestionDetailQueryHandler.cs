using MediatR;
using System.Threading;
using System.Threading.Tasks;

using backend.Application.Dtos.QuestionDtos;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.Questions.Queries.GetQuestionDetail;
public class GetQuestionDetailQueryHandler: IRequestHandler<GetQuestionDetailQuery, GetQuestionDetailDto>
{
    private readonly IQuestionRepository _questionRepository;

    public GetQuestionDetailQueryHandler(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<GetQuestionDetailDto> Handle(GetQuestionDetailQuery request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.Id);
        if (question == null)
        {
            // throw new NotFoundException(nameof(Question), request.Id);
            return null;
        }

        var questionDetailDto = new GetQuestionDetailDto
        {
            Id = question.Id,
            QuestionText= question.QuestionText,
            Description = question.Description,
            Feedbacks = question.Feedbacks,
            CourseName = question.CourseName,
            QuestionType = question.QuestionType,
            Options = question.Options,
            CorrectOption = question.CorrectOption,
            Grade = question.Grade,
            Difficulty = question.Difficulty,
            Point = question.Point,
            CreatedBy = question.CreatedBy,
            totalCorrectAnswers= question.totalCorrectAnswers
        };
        return questionDetailDto;
    }   
}