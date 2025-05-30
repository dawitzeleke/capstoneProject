using backend.Application.Contracts.Persistence;
using MediatR;

public class GetStudentSettingsQueryHandler : IRequestHandler<GetStudentSettingsQuery, StudentSettingsDto>
{
    private readonly IStudentRepository _studentRepository;

    public GetStudentSettingsQueryHandler(
        IStudentRepository studentRepository)  
    {
        _studentRepository = studentRepository;
    }

    public async Task<StudentSettingsDto> Handle(GetStudentSettingsQuery request, CancellationToken cancellationToken)
    {
        
        var student = await _studentRepository.GetByEmailAsync(request.Email);
        if (student == null)
        {
            throw new Exception("Student with this email doesn't exists");
        }
        
       
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
