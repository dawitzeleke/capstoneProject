using backend.Application.Contracts.Persistence;
using MediatR;

public class GetStudentSettingsQueryHandler : IRequestHandler<GetStudentSettingsQuery, StudentSettingsDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetStudentSettingsQueryHandler(
        IStudentRepository studentRepository,
        ICurrentUserService currentUserService)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<StudentSettingsDto> Handle(GetStudentSettingsQuery request, CancellationToken cancellationToken)
    {
        
        var student = await _studentRepository.GetByIdAsync(_currentUserService.UserId);
        
        return new StudentSettingsDto
        {
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            PhoneNumber = student.PhoneNumber,
            ProfilePictureUrl = student.ProfilePictureUrl,
            ProgressLevel = student.ProgressLevel,
            CompletedQuestions = student.CompletedQuestions,
            Badges = student.Badges,
            Grade = student.Grade,
            School = student.School,
        };
      
    }
}
