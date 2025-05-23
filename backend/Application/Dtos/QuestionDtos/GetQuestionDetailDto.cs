using backend.Domain.Enums;
namespace backend.Application.Dtos.QuestionDtos;

public class GetQuestionDetailDto
    {
        public string Id { get; set; }
        public string QuestionText { get; set; }
        public string Description { get; set; }
        public string CourseName { get; set; }
        public QuestionTypeEnum QuestionType { get; set; }
        public string[] Options { get; set; }
        public string CorrectOption { get; set; }
        public int Grade { get; set; }
        public DifficultyLevel Difficulty { get; set; }
        public int Point { get; set; }
        public int TotalCorrectAnswers { get; set; }
        public int[] Feedbacks { get; set;}
        public string CreatedBy { get; set; }
        public string Report { get; set; }
    }
    