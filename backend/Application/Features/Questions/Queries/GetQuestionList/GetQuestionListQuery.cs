using MediatR;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Domain.Enums;

namespace backend.Application.Features.Questions.Queries.GetQuestionList;

public class GetQuestionListQuery : IRequest<List<Question>>
{
    public int? Grade { get; set; }
    public StreamEnum? Stream { get; set; }
    public string? CourseName { get; set; }
    public string? CreatorId { get; set; }
    public string? StudentId { get; set; }
    
}