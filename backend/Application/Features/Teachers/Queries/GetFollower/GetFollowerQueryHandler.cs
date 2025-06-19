using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Features.Teachers.Queries.GetFollower;

public class GetFollowerQueryHandler : IRequestHandler<GetFollowerQuery, List<Student>>
{
    private readonly IFollowRepository _followRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IStudentRepository _studentRepository;

    public GetFollowerQueryHandler(IFollowRepository teacherRepository, ICurrentUserService currentUserService, IStudentRepository studentRepository)
    {
        _followRepository = teacherRepository;
        _currentUserService = currentUserService;
        _studentRepository = studentRepository;
    }

    public async Task<List<Student>> Handle(GetFollowerQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        var followers = await _followRepository.GetFollowersAsync(userId);
        var students = await _studentRepository.GetStudentByIdListAsync(followers);
        if (students == null || students.Count == 0)
        {
            return new List<Student>();
        }
        return students;
    }
}