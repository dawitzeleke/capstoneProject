using backend.Application.Contracts.Persistence;
using MediatR;

public class GeStudentDivisionQueryHandler : IRequestHandler<GetStudentDivisionQuery, StudentDivisionDto>
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public GeStudentDivisionQueryHandler(IStudentRepository studentRepository, ICurrentUserService currentUserService)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<StudentDivisionDto> Handle(GetStudentDivisionQuery request, CancellationToken cancellationToken)
    {
        var studentId = _currentUserService.UserId;
        var student = await _studentRepository.GetByIdAsync(studentId);

        Dictionary<string, string> divisions = new Dictionary<string, string>
        {
            { "Beginner", "5" },
            { "Learner", "7" },
            { "Explorer", "9" },
            { "Achiever", "11" },
            { "Rising_Star", "13" },
            { "Thinker", "15" },
            { "Champion", "17" },
            { "Mastermind", "19" },
            { "Grandmaster", "21" },
            { "Legend", "23" }
        }; 

        if (student == null)
        {
            throw new Exception("Student not found");
        }

        return new StudentDivisionDto
        {
            NumberOfQuestions = divisions[student.Division.ToString()],
            Division = student.Division
        };
    }
}