using MediatR;
using backend.Domain.Entities;
using backend.Application.Dtos.PaginationDtos;
using backend.Domain.Common;
using backend.Domain.Enums;


namespace backend.Application.Features.Questions.Queries.GetQuestionList;

public class GetQuestionListQuery : IRequest<PaginatedList<Question>>
{
    public int? Grade { get; set; }
    public StreamEnum? Stream { get; set; }
    public string? CourseName { get; set; }
    public string? CreatorId { get; set; }
    public string? StudentId { get; set; }
    public DifficultyLevel? DifficultyLevel { get; set; }
    // Pagination
    public PaginationDto Pagination { get; set; } = new PaginationDto();

}