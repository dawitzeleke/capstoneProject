
using backend.Application.Contracts.Persistence;
using backend.Application.Contracts.Services;
using Domain.Enums;
using MediatR;

public class VerificationRequestCommandHandler : IRequestHandler<VerificationRequestCommand, bool>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly ITeacherRepository _teacherRepository;

    private readonly ICloudinaryService _cloudinaryService;

    public VerificationRequestCommandHandler(ICurrentUserService currentUserService, ITeacherRepository teacherRepository, ICloudinaryService cloudinaryService)
    {
        _teacherRepository = teacherRepository;
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<bool> Handle(VerificationRequestCommand request, CancellationToken cancellationToken)
    {
        var teacher = await _teacherRepository.GetByIdAsync(_currentUserService.UserId);
        const string teacherLicenseFolder = "TeacherLicense";
        const string teacherGraduationFolder = "TeacherGraduation";
        if (teacher == null)
            throw new Exception("Teacher not found");

        if (teacher.VerificationStatus == VerificationStatus.Pending)
            throw new Exception("Verification request already sent");
        if (teacher.VerificationStatus == VerificationStatus.Approved)
            throw new Exception("Teacher already verified");
        var UploadTeacherLicense = await _cloudinaryService.UploadFileAsync(request.LicenseDocument, teacherLicenseFolder);
        if (UploadTeacherLicense == null)
            throw new Exception("Failed to upload license document");
        var UploadTeacherGraduation = await _cloudinaryService.UploadFileAsync(request.GraduationDocument, teacherGraduationFolder);
        if (UploadTeacherGraduation == null)
            throw new Exception("Failed to upload graduation document");

        teacher.VerificationStatus = VerificationStatus.Pending;
        teacher.VerificationRequestDate = DateTime.UtcNow;
        teacher.LicenseDocumentUrl = UploadTeacherLicense.Url;
        teacher.GraduationDocumentUrl = UploadTeacherGraduation.Url;  

        await _teacherRepository.UpdateAsync(teacher);
        return true;
    }
}