using MediatR;
using backend.Domain.Enums;
using backend.Domain.Entities;
using backend.Application.Dtos.StudentDtos;


namespace backend.Application.Features.Students.Queries.GetLeaderStudent;

public class GetLeaderStudentsQuery: IRequest<List<Student>>
{
    public DivisionEnums Division { get; set; } = DivisionEnums.Beginner; // Default to Beginner divisions
    public int TopCount { get; set; } = 30; // Default to top 10 students

}