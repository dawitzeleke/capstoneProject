using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

public class GetStudentSettingsQueryHandler : IRequestHandler<GetStudentSettingsQuery, StudentSettingsDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFollowRepository _followRepository;
    private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
    private readonly IMonthlyProgressRepository _monthlyProgressRepository;

    public GetStudentSettingsQueryHandler(
        IStudentRepository studentRepository,
        ICurrentUserService currentUserService,
        IFollowRepository followRepository,
        IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository,
        IMonthlyProgressRepository monthlyProgressRepository)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
        _followRepository = followRepository;
        _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
        _monthlyProgressRepository = monthlyProgressRepository;
    }

    public async Task<StudentSettingsDto> Handle(GetStudentSettingsQuery request, CancellationToken cancellationToken)
    {

        var student = await _studentRepository.GetByIdAsync(_currentUserService.UserId);
        if (student == null)
        {
            throw new Exception("Student not found");
        }

        var totalStudents = await _studentRepository.CountAsync();
        var solvedQuestions = await _studentSolvedQuestionsRepository.GetSolvedQuestions(_currentUserService.UserId);
        Console.WriteLine(solvedQuestions);
        var monthlyProgress = await _monthlyProgressRepository.GetByStudentIdAsync(_currentUserService.UserId);
        Console.WriteLine(monthlyProgress);
        var activeDays = 0;

        if (monthlyProgress != null && monthlyProgress.Questions != null)
        {
            foreach (var dayQuestions in monthlyProgress.Questions)
            {
                if (dayQuestions != null && dayQuestions.Count > 0)
                {
                    activeDays++;
                }
            }
        }

        var follow = await _followRepository.GetByStudentIdAsync(_currentUserService.UserId);
        Console.WriteLine("Student Settings Query Handler");

        return new StudentSettingsDto
        {
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            PhoneNumber = student.PhoneNumber,
            ProfilePictureUrl = student.ProfilePictureUrl,
            ProgressLevel = student.ProgressLevel,
            CompletedQuestions = student.CompletedQuestions ?? new List<string>(),
            Badges = student.Badges ?? new List<string>(),
            Grade = student.Grade,
            School = student.School,
            FollowingCount = follow?.Count ?? 0,
            SavedQuestionsCount = student.SavedQuestions?.Count ?? 0,
            Points = student.TotalPoints,
            Leaderborad = totalStudents,
            QuestionsDone = solvedQuestions?.Count ?? 0,
            ActiveDays = activeDays
        };


    }
}
