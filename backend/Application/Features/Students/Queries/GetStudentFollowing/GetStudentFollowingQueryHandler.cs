using backend.Application.Contracts.Persistence;
using MediatR;

public class GetStudentFollowingQueryHandler : IRequestHandler<GetStudentFollowingQuery, List<TeacherDto>>
{
    private readonly IFollowRepository _followRepository;
    private readonly ITeacherRepository _teacherRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentFollowingQueryHandler(IFollowRepository followRepository, ITeacherRepository teacherRepository, ICurrentUserService currentUserService)
    {
        _followRepository = followRepository;
        _teacherRepository = teacherRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<TeacherDto>> Handle(GetStudentFollowingQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId;
        var follows = await _followRepository.GetByStudentIdAsync(studentId);
        var teacherIds = follows.Select(f => f.TeacherId).Distinct().ToList();

        var teachers = await _teacherRepository.GetByIdsAsync(teacherIds);

        return teachers.Select(t => new TeacherDto
        {
            Id = t.Id,
            FirstName = t.FirstName,
            LastName = t.LastName,
            Email = t.Email,
            PhoneNumber = t.PhoneNumber,
            ProfilePictureUrl = t.ProfilePictureUrl,
            Subjects = t.Subjects,
            IsVerified = t.IsVerified,
        }).ToList();
    }
}