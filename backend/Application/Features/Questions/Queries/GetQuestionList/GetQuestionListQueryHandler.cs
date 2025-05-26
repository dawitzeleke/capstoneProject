using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Dtos.PaginationDtos;
using backend.Domain.Entities;
using backend.Domain.Common;

namespace backend.Application.Features.Questions.Queries.GetQuestionList;

public class GetQuestionListQueryHandler : IRequestHandler<GetQuestionListQuery, PaginatedList<Question>>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
    private readonly IStudentQuestionAttemptsRepository _studentQuestionAttemptsRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly Random _random;

    public GetQuestionListQueryHandler(IQuestionRepository questionRepository, IStudentQuestionAttemptsRepository studentQuestionAttemptsRepository, IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
        _studentQuestionAttemptsRepository = studentQuestionAttemptsRepository;
        _currentUserService = currentUserService;
        _random = new Random();
    }

  

    public async Task<PaginatedList<Question>> Handle(GetQuestionListQuery request, CancellationToken cancellationToken)
    {
        
        var solveCount = 4;
        var unsolvedCount = 10;
        var attemptedCount = 6;
        var questionFilter = new QuestionFilterDto
            {
                StudentId = request.StudentId,
                Grade = request.Grade,
                Stream = request.Stream,
                CourseName = request.CourseName,
                CreatorId = request.CreatorId,
                DifficultyLevel = request.DifficultyLevel
            };
        
        var userId = _currentUserService.UserId.ToString();
        List<string> solved_questionIds = null;
        if (!string.IsNullOrEmpty(userId))
        {
            questionFilter.StudentId = userId;
            // Get solved questionIDs
            solved_questionIds = await _studentSolvedQuestionsRepository.GetSolvedQuestionIds(questionFilter,solveCount);

        }
        var filteredQuestions = await _questionRepository.GetFilteredQuestions(questionFilter,request.Pagination);

        if (string.IsNullOrEmpty(request.StudentId))
        {
            return filteredQuestions;
        }
        // return cusomized question list for the student
       

       

        // Get solved questionIDs and get those questions
        var solvedQuestions = await _questionRepository.GetQuestionByIdList(solved_questionIds);

        // Get attempted questionIDs and get those questions
        var attempted_questionIds = await _studentQuestionAttemptsRepository.GetAttemptedQuestionIds(questionFilter,attemptedCount);
        var attemptedQuestions = await _questionRepository.GetQuestionByIdList(attempted_questionIds);
        
        
        var selectedUnsolved = filteredQuestions.Items.OrderBy(_ => _random.Next()).Take(unsolvedCount).ToList();

        // Combine and shuffle the final list
        var mixedQuestions = solvedQuestions
            .Concat(selectedUnsolved)
            .Concat(attemptedQuestions)
            .OrderBy(_ => _random.Next())
            .ToList();

        return new PaginatedList<Question>(mixedQuestions.Take(request.Pagination.Limit).ToList(),filteredQuestions.NextCursor, mixedQuestions.Count > request.Pagination.Limit);
        
    }
}