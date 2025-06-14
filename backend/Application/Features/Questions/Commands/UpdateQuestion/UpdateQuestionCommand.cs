using MediatR;
using backend.Domain.Enums;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Features.Questions.Commands.UpdateQuestion;

public class UpdateQuestionCommand : IRequest<Question>
{
    public string Id { get; set; }
    public string? Question { get; set; }
    public string? Description { get; set; }
    public string? CorrectOption { get; set; }
    public string? Category { get; set; }
    public DifficultyLevel? Difficulty { get; set; }
    public string[]? Options { get; set; }
    public int? Grade { get; set; }
    public QuestionTypeEnum? QuestionType { get; set; }
    public string? Explanation { get; set; }
    public string? Hint { get; set; }
    public string[]? Tags { get; set; }
    public StreamEnum? Stream { get; set; }
    public int? Chapter { get; set; }
    public int? Point { get; set; }
    public ContentStatusEnum? Status { get; set; }
}