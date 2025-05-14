
using backend.Application.Contracts.Persistence;
using MediatR;

public class BannTeacherCommandHandler : IRequestHandler<BanTeacherCommand, BanTeacherDto>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly ITeacherRepository _teacherRepository;
    private readonly IAdminRepository _adminRepository;

    public BannTeacherCommandHandler(ITeacherRepository teacherRepository, ICurrentUserService currentUserService, IAdminRepository adminRepository)
    {
        _teacherRepository = teacherRepository;
        _currentUserService = currentUserService;
        _adminRepository = adminRepository;
    }

    public async Task<BanTeacherDto> Handle(BanTeacherCommand request, CancellationToken cancellationToken)
    {
        var admin = await _adminRepository.GetByIdAsync(_currentUserService.UserId);
        if (admin == null)
        {
            throw new Exception("Unauthorized access");
        }
        
        var teacher = await _teacherRepository.GetByIdAsync(request.TeacherId);
        if (teacher == null)
        {
            throw new Exception("Teacher not found");
        }

        teacher.Status = StatusTypeEnum.Banned;
        teacher.BanDetails = new BanInfo
        {
            BannedAt = DateTime.UtcNow,
            BannedUntil = request.BannedUntil,
            Message = request.Reason,
            BannedBy = admin.Id
        };

        await _teacherRepository.UpdateAsync(teacher);

        return new BanTeacherDto
        {
            TeacherId = teacher.Id,
            BannedAt = DateTime.UtcNow,
            Message = request.Reason,
            BannedUntil = request.BannedUntil
        };
    }
}