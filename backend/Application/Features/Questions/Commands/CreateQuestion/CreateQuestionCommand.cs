using MediatR;
using backend.Domain.Enums; 
using backend.Domain.Entities;

namespace backend.Application.Features.Questions.Commands.CreateQuestion;

public class CreateQuestionCommand: IRequest<Question>
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
    public StreamEnum Stream { get; set; }
}