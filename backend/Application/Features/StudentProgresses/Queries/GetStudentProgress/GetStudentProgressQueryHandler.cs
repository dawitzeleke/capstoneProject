using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;


namespace backend.Application.Features.StudentProgresses.Queries.GetStudentProgress;

public class GetStudentProgressQueryHandler : IRequestHandler<GetStudentProgressQuery, List<object>>
{
    private readonly IStudentProgressRepository _studentProgressRepository;
    private readonly IMonthlyProgressRepository _monthlyProgressRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentProgressQueryHandler(IStudentProgressRepository studentProgressRepository, IMonthlyProgressRepository monthlyProgressRepository,
        ICurrentUserService currentUserService)
    {
        _studentProgressRepository = studentProgressRepository;
        _monthlyProgressRepository = monthlyProgressRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<object>> Handle(GetStudentProgressQuery request, CancellationToken cancellationToken)
    {
        var result = new List<object>();
        var studentId = _currentUserService.UserId.ToString();
        var studentProgress = await _studentProgressRepository.GetStudentProgress(studentId);
        if (studentProgress == null)
        {
            return result;
        }

        foreach (var progress in studentProgress.Progresses)
        {
            var monthly_progress = await _monthlyProgressRepository.GetByIdAsync(progress.Value);
            var response_data = new {
                month = monthly_progress.Month.Split(" ")[0],
                year = monthly_progress.Month.Split(" ")[1],
                days_in_month = monthly_progress.Questions.Count,
                heatmap = monthly_progress.Questions.Select(daily => daily.Count).ToArray()
            };
            result.Add(response_data);
        }
        return result;
    }
}
