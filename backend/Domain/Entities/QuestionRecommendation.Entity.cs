using backend.Domain.Common;
using backend.Domain.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Domain.Entities;

public class QuestionRecommendation : BaseEntity
{
    public string StudentId { get; set; }
    public string QuestionId { get; set; }
    public double Score { get; set; }  // Recommendation score (0-1)
    public string CourseName { get; set; }
    public int Grade { get; set; }
    public int Chapter { get; set; }
    public QuestionTypeEnum QuestionType { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    
    
    public bool IsViewed { get; set; }
    public bool IsAttempted { get; set; }
    public bool IsSolved { get; set; }
} 