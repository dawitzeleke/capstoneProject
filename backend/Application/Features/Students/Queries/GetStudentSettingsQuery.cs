
using MediatR;

public class GetStudentSettingsQuery : IRequest<StudentSettingsDto>
{
    public string Email { get; set; }
}