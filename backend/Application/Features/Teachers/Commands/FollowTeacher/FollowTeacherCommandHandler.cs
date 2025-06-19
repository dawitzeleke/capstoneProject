using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using MediatR;

public class FollowTeacherCommandHandler : IRequestHandler<FollowTeacherCommand, bool>
{
    private readonly IFollowRepository _followRepository;
    private readonly ITeacherRepository _teacherRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFollowNotifierService _followNotifierService;

    public FollowTeacherCommandHandler(IFollowRepository followRepository, ITeacherRepository teacherRepository)
    {
        _followRepository = followRepository;
        _teacherRepository = teacherRepository;
    }

    public async Task<bool> Handle(FollowTeacherCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;
        var existingFollow = await _followRepository.IsFollowing(currentUserId, request.TeacherId);
        if (existingFollow)
        {
            throw new Exception("You are already following this teacher");
        }
        
        var newFollow = new Follow
        {
            FollowerId = currentUserId,
            TeacherId = request.TeacherId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        

        await _followRepository.CreateAsync(newFollow);
        await _followNotifierService.NotifyFollowAsync(request.TeacherId, currentUserId);
        return true;
    }
}
