using backend.Application.Contracts.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

public class GetAdminProfileQueryHandler : IRequestHandler<GetAdminProfileQuery, AdminProfileDto>
{
    private readonly IAdminRepository _adminRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetAdminProfileQueryHandler(IAdminRepository adminRepository, ICurrentUserService currentUserService)
    {
        _adminRepository = adminRepository;
        _currentUserService = currentUserService;
    }

    public async Task<AdminProfileDto> Handle(GetAdminProfileQuery request, CancellationToken cancellationToken)
    {

        var admin = await _adminRepository.GetByIdAsync(_currentUserService.UserId.ToString())
                       ?? throw new Exception("Admin profile not found.");

        return new AdminProfileDto
        {
            Id = admin.Id,
            FirstName = admin.FirstName,
            LastName = admin.LastName,
            UserName = admin.UserName,
            PhoneNumber = admin.PhoneNumber,
            Email = admin.Email,
            ProfilePictureUrl = admin.ProfilePictureUrl,
            VerifiedTeacherIds = admin.VerifiedTeacherIds,
            BannedUserIds = admin.BannedUserIds,
            RemovedContentIds = admin.RemovedContentIds,
            TotalModerationActions = admin.TotalModerationActions,
            RegistrationDate = admin.RegistrationDate,
        };
    }
}
