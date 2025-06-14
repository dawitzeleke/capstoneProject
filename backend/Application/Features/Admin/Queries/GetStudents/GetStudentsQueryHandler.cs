using backend.Application.Contracts.Persistence;
using Domain.Entities;
using MediatR;
using backend.Application.Dtos.StudentDtos;

public class GetstudentsQueryHandler : IRequestHandler<GetStudentsQuery, List<StudentDto>>
{
    private readonly IStudentRepository _studentRepository;

    public GetstudentsQueryHandler(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<List<StudentDto>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await _studentRepository.GetStudentsAsync(
            request.SearchTerm,
            request.PageNumber,
            request.PageSize
        );

        var studentDtos = students.Select(t => new StudentDto
        {
            Id = t.Id,
            FirstName = t.FirstName,
            LastName = t.LastName,
            Email = t.Email,
            UserName = t.UserName,
            PhoneNumber = t.PhoneNumber,
            ProfilePictureUrl = t.ProfilePictureUrl,
            ProgressLevel = t.ProgressLevel,
            CompletedQuestions = t.CompletedQuestions,
            Badges = t.Badges,
            Grade = t.Grade
        }).ToList();

        return studentDtos;
    }
}
