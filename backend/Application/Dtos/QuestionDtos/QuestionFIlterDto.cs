using backend.Domain.Enums;

namespace backend.Application.Dtos.QuestionDtos;

public class QuestionFilterDto
{
    public int? Grade { get; set; }
    public StreamEnum? Stream { get; set; }
    public string? CourseName { get; set; }
    public string? CreatorId { get; set; }
    public string? StudentId { get; set; }
    public DifficultyLevel? DifficultyLevel { get; set; }
    public ContentStatusEnum? Status { get; set; }
}