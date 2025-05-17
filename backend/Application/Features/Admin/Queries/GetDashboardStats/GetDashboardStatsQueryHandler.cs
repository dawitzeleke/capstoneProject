using backend.Application.Contracts.Persistence;
using MediatR;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IStudentRepository _studentRepo;
    private readonly ITeacherRepository _teacherRepo;
    private readonly IAdminRepository _adminRepo;
    private readonly IQuestionRepository _questionRepo;
    private readonly IUserActivityRepository _userActivityRepo;

    public GetDashboardStatsQueryHandler(
        IStudentRepository studentRepo,
        ITeacherRepository teacherRepo,
        IAdminRepository adminRepo,
        IQuestionRepository questionRepo,
        IUserActivityRepository userActivityRepo)
    {
        _studentRepo = studentRepo;
        _teacherRepo = teacherRepo;
        _adminRepo = adminRepo;
        _questionRepo = questionRepo;
        _userActivityRepo = userActivityRepo;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        // still the report feature left
        return new DashboardStatsDto
        {
            TotalStudents = await _studentRepo.CountAsync(),
            TotalTeachers = await _teacherRepo.CountAsync(),
            TotalAdmins = await _adminRepo.CountAsync(),
            TotalQuestions = await _questionRepo.CountAsync(),
            ActiveUsersToday = await _userActivityRepo.CountActiveUsersTodayAsync()
        };
    }
}
