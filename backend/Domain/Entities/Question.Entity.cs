using backend.Domain.Common;
using backend.Domain.Enums; 

namespace backend.Domain.Entities;

public class Question : ContentEntity
{
    public string QuestionText { get; set; }
    public string Description { get; set; }
    public string CourseName { get; set; }
    public int Point { get; set; }
    public string[] Options { get; set; }
    public string CorrectOption { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public int Grade { get; set; }
    public int[] Feedbacks { get; set;}
    public QuestionTypeEnum QuestionType { get; set; }
    public int TotalCorrectAnswers { get; set; }
    public string Explanation { get; set; }
    public string Hint { get; set; }
    public string Report { get; set;}
}