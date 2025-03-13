using MediatR;
using backend.Domain.Enums; 

namespace backend.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommand: IRequest<bool>
{
    public string QuestionText { get; set; }
    public string Description { get; set; }
    public string[] Options { get; set; }
    public string CorrectOption { get; set; }
    public string CourseName { get; set; }
    public int Point { get; set; }
    public int Grade { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public QuestionTypeEnum QuestionType { get; set; }
    public string CreatedBy { get; set; }
}