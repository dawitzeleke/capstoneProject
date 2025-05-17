using backend.Application.Contracts.Persistence;
using Domain.Entities;
using MediatR;

public class GetTeachersQueryHandler : IRequestHandler<GetTeachersQuery, List<TeacherDto>>
{
    private readonly ITeacherRepository _teacherRepository;

    public GetTeachersQueryHandler(ITeacherRepository teacherRepository)
    {
        _teacherRepository = teacherRepository;
    }

    public async Task<List<TeacherDto>> Handle(GetTeachersQuery request, CancellationToken cancellationToken)
    {
        var teachers = await _teacherRepository.GetTeachersAsync(
            request.SearchTerm,
            request.PageNumber,
            request.PageSize
        );

        var teacherDtos = teachers.Select(t => new TeacherDto
        {
            Id = t.Id,
            FirstName = t.FirstName,
            LastName = t.LastName,
            Email = t.Email,
            UserName = t.UserName,
            PhoneNumber = t.PhoneNumber,
            ProfilePictureUrl = t.ProfilePictureUrl,
            IsVerified = t.IsVerified,
            Subjects = t.Subjects
        }).ToList();

        return teacherDtos;
    }
}
