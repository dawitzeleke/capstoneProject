using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Dtos.StudentDtos;

namespace backend.Application.Features.Students.Queries.GetStudentPerformance;

public class GetStudentPerformanceQueryHandler : IRequestHandler<GetStudentPerformanceQuery, List<StudentPerformanceDto>>
{
    private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
    private readonly IStudentQuestionAttemptsRepository _studentQuestionAttemptsRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentPerformanceQueryHandler(IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository, IStudentQuestionAttemptsRepository studentQuestionAttemptsRepository, ICurrentUserService currentUserService)
    {
        _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
        _studentQuestionAttemptsRepository = studentQuestionAttemptsRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<StudentPerformanceDto>> Handle(GetStudentPerformanceQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId.ToString();
        if (string.IsNullOrEmpty(studentId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        var filter = new QuestionFilterDto
        {
            StudentId = studentId,
            // Add any other filters you need here
        };
        var solvedQuestionIds = await _studentSolvedQuestionsRepository.GetSolvedQuestionIds(filter);
        var attemptedQuestionIds = await _studentQuestionAttemptsRepository.GetAttemptedQuestionIds(filter);

        var solvedQuestionsCount = solvedQuestionIds.Count;
        var attemptedQuestionsCount = attemptedQuestionIds.Count;
        var totalAttempts = solvedQuestionsCount + attemptedQuestionsCount;
        var successRate = totalAttempts > 0 ? (double)solvedQuestionsCount / totalAttempts * 100 : 0;

        return new List<StudentPerformanceDto>
        {
            new StudentPerformanceDto
            {
                StudentId = studentId,
                SolvedQuestions = solvedQuestionsCount,
                TotalAttempts = totalAttempts,
                SuccessRate = successRate
            }
        };
    }
}