using backend.Domain.Common;
using backend.Domain.Enums; 

namespace backend.Domain.Entities;

public class Question : ContentEntity
{
    public string QuestionText { get; set; }
    public string Description { get; set; }
    public string CourseName { get; set; }
    public string[] Options { get; set; }
    public string CorrectOption { get; set; }
    public int Grade { get; set; }
    public int Chapter { get; set; }
    public QuestionTypeEnum QuestionType { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public StreamEnum? Stream { get; set;} 
    public string Explanation { get; set; }
    public string Hint { get; set; }
    public string[] Tags { get; set; }
    public string[] RelatedBlog { get; set;}
    public string Report { get; set;}
    public int Point { get; set; }
    public int TotalCorrectAnswers { get; set;}
    public HashSet<string> Likes { get; set; }
}