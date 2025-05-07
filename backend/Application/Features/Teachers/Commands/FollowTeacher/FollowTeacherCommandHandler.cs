using backend.Application.Contracts.Persistence;
using MediatR;

public class FollowTeacherCommandHandler : IRequestHandler<FollowTeacherCommand, bool>
{
    private readonly IFollowRepository _followRepository;
    private readonly ITeacherRepository _teacherRepository;

    public FollowTeacherCommandHandler(IFollowRepository followRepository, ITeacherRepository teacherRepository)
    {
        _followRepository = followRepository;
        _teacherRepository = teacherRepository;
    }

    public async Task<bool> Handle(FollowTeacherCommand request, CancellationToken cancellationToken)
    {
        var existingFollow = await _followRepository.IsFollowing(request.StudentId, request.TeacherId);
        if (existingFollow)
        {
            throw new Exception("You are already following this teacher");
        }
        
        var newFollow = new Follow
        {
            StudentId = request.StudentId,
            TeacherId = request.TeacherId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        

        await _followRepository.CreateAsync(newFollow);

        return true;
        // await _teacherRepository.IncrementFollowerCountAsync(request.TeacherId);

        
    }
}
