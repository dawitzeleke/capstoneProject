using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Dtos.QuestionDtos;
using backend.Domain.Entities;

namespace backend.Application.Features.Questions.Queries.GetQuestionList;

public class GetQuestionListQueryHandler : IRequestHandler<GetQuestionListQuery, List<Question>>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
    private readonly IStudentQuestionAttemptsRepository _studentQuestionAttemptsRepository;
    private readonly Random _random;

    public GetQuestionListQueryHandler(IQuestionRepository questionRepository, IStudentQuestionAttemptsRepository studentQuestionAttemptsRepository, IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository)
    {
        _questionRepository = questionRepository;
        _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
        _studentQuestionAttemptsRepository = studentQuestionAttemptsRepository;
        _random = new Random();
    }

    public async Task<List<Question>> Handle(GetQuestionListQuery request, CancellationToken cancellationToken)
    {
        var questionFilter = new QuestionFilterDto
            {
                StudentId = request.StudentId,
                Grade = request.Grade,
                Stream = request.Stream,
                CourseName = request.CourseName,
                CreatorId = request.CreatorId
            };
        var allQuestions = await _questionRepository.GetFilteredQuestions(questionFilter);

        if (string.IsNullOrEmpty(request.StudentId))
        {
            return allQuestions;
        }
        // return cusomized question list for the student
       

        var solveCount = 4;
        var unsolvedCount = 10;
        var attemptedCount = 6;

        // Get solved questionIDs and get those questions
        var solved_questionIds = await _studentSolvedQuestionsRepository.GetSolvedQuestions(questionFilter,solveCount);
        var solvedQuestions = await _questionRepository.GetQuestionByIdList(solved_questionIds);

        // Get attempted questionIDs and get those questions
        var attempted_questionIds = await _studentQuestionAttemptsRepository.GetAttemptedQuestions(questionFilter,attemptedCount);
        var attemptedQuestions = await _questionRepository.GetQuestionByIdList(attempted_questionIds);
        
        // get unsolved questions
        var unsolved_questions = allQuestions.Where(q => !solved_questionIds.Contains(q.Id));

        
        
        var selectedUnsolved = unsolved_questions.OrderBy(_ => _random.Next()).Take(unsolvedCount).ToList();

        // Combine and shuffle the final list
        var mixedQuestions = solvedQuestions
            .Concat(selectedUnsolved)
            .Concat(attemptedQuestions)
            .OrderBy(_ => _random.Next())
            .ToList();

        return mixedQuestions;   
    }
}