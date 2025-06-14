using MediatR;
using backend.Application.Dtos.StudentDtos;


public class GetStudentsQuery : IRequest<List<StudentDto>>
{
    public string? SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}