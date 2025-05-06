using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Features.Questions.Queries.GetQuestionList;

public class GetQuestionListQueryHandler : IRequestHandler<GetQuestionListQuery, List<GetQuestionDetailDto>>
{
    private readonly IQuestionRepository _questionRepository;

    public GetQuestionListQueryHandler(IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<List<GetQuestionDetailDto>> Handle(GetQuestionListQuery request, CancellationToken cancellationToken)
    {
        var allQuestions = (await _questionRepository.GetAllAsync()).OrderBy(x => x.CourseName);
        var questionDtos = allQuestions.Select(q => new GetQuestionDetailDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                Description = q.Description,
                Options = q.Options,
                CorrectOption = q.CorrectOption,
                Grade = q.Grade,
                CourseName = q.CourseName,
                Point = q.Point,
                Difficulty = q.Difficulty,
                Feedbacks = q.Feedbacks,
                QuestionType = q.QuestionType,
                CreatedBy = q.CreatedBy,
                Report=q.Report
            }).ToList();

        return questionDtos;
    }
}