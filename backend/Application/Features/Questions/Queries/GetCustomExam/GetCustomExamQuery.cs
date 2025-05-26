using MediatR;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Domain.Common;
using backend.Application.Dtos.PaginationDtos;


namespace backend.Application.Features.Questions.Queries.GetCustomExam;
public class GetCustomExamQuery : IRequest<PaginatedList<Question>>
{
    public int? Grade { get; set; }
    public string? CourseName { get; set; }
    public DifficultyLevel? DifficultyLevel { get; set; }
    
    public PaginationDto Pagination { get; set; } = new PaginationDto();

}