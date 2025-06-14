using backend.Application.Contracts.Persistence;
using MediatR;

public class SearchTeacherByNameQueryHandler : IRequestHandler<SearchTeacherByNameQuery, List<TeacherDto>>
{
    private readonly ITeacherRepository _teacherRepository;

    public SearchTeacherByNameQueryHandler(ITeacherRepository teacherRepository)
    {
        _teacherRepository = teacherRepository;
    }

    public async Task<List<TeacherDto>> Handle(SearchTeacherByNameQuery request, CancellationToken cancellationToken)
    {
        var teachers = await _teacherRepository.GetTeachersAsync(
            request.SearchTerm,
            request.PageNumber,
            request.PageSize
        );

        return teachers.Select(t => new TeacherDto
        {
            Id = t.Id,
            FirstName = t.FirstName,
            LastName = t.LastName,
            Email = t.Email,
            PhoneNumber = t.PhoneNumber,
            ProfilePictureUrl = t.ProfilePictureUrl,
            IsVerified = t.IsVerified,
            UserName = t.UserName,
            Subjects = t.Subjects
        }).ToList();
    }
} 