using MediatR;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Features.Questions.Commands.UpdateQuestion;

public class UpdateQuestionCommand : IRequest<GetQuestionDetailDto>
{
    public string Id { get; set; }
    public string? Question { get; set; }
    public string? Description { get; set; }
    public string? Answer { get; set; }
    public string? Category { get; set; }
    public string? Difficulty { get; set; }
    public string? Options { get; set; }
    public string? Point { get; set; }
    public string? Grade { get; set; }
    public string? Feedbacks { get; set; }
    public string? QuestionType { get; set; }
    public string? TotalCorrectAnswers { get; set; }
    public string? Explanation { get; set; }
    public string? Hint { get; set; }
}