using backend.Application.Contracts.Persistence;
using MediatR;

public class UnFollowTeacherCommandHandler : IRequestHandler<UnFollowTeacherCommand, bool>
{
    private readonly IFollowRepository _followRepository;
    private readonly ITeacherRepository _teacherRepository;
    private readonly ICurrentUserService _currentUserService;
    public UnFollowTeacherCommandHandler(IFollowRepository followRepository, ITeacherRepository teacherRepository)
    {
        _followRepository = followRepository;
        _teacherRepository = teacherRepository;
    }

    public async Task<bool> Handle(UnFollowTeacherCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;
        var existingFollow = await _followRepository.IsFollowing(currentUserId, request.TeacherId);
        if (!existingFollow)
        {
            throw new Exception("You are not following this teacher");
        }
         
        return await _followRepository.UnFollow(currentUserId, request.TeacherId);
    }
}
