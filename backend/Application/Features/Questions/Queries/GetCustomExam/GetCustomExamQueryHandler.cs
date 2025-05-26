using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;
using backend.Domain.Entities;
using backend.Domain.Common;

namespace backend.Application.Features.Questions.Queries.GetCustomExam;

public class GetCustomExamQueryHandler : IRequestHandler<GetCustomExamQuery, PaginatedList<Question>>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
    private readonly ICurrentUserService _currentUserService;


    public GetCustomExamQueryHandler(IQuestionRepository questionRepository
        , IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository, ICurrentUserService currentUserService)
    {
        _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
        _currentUserService = currentUserService;
        _questionRepository = questionRepository;
    }

    public async Task<PaginatedList<Question>> Handle(GetCustomExamQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId.ToString();
        // get solved questionIDs
        var filter = new QuestionFilterDto
        {
            Grade = request.Grade,
            CourseName = request.CourseName,
            DifficultyLevel = request.DifficultyLevel
        };
        List<string> solved_questionIds = null;
        if (!string.IsNullOrEmpty(studentId))
        {
            solved_questionIds = await _studentSolvedQuestionsRepository.GetSolvedQuestionIds(filter);
        }
        // get questons using the filter
        var result = await _questionRepository.GetFilteredQuestions(filter,request.Pagination,solved_questionIds);
        return result;
              
    }
}