using MediatR;

public class SearchTeacherByNameQuery : IRequest<List<TeacherDto>>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
} 