using MediatR;

public class GetTeachersQuery : IRequest<List<TeacherDto>>
{
    public string? SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}