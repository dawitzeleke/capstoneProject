using backend.Domain.Enums;
namespace backend.Domain.Common;

public class QuestionAttempt : BaseEntity
{
    public string StudentId { get; set; }
    public string QuestionId { get; set; }
    public string Status { get; set; }
    public string CreatorId {get; set;}
    public string CourseName { get; set; }
    public int? Chapter {get; set;}
    public DateTime LastAttempt { get; set; }
    public int Grade { get; set; }
    public StreamEnum Stream { get; set; }
    public DifficultyLevel Difficulty { get; set; }
}