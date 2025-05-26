namespace backend.Application.Dtos.StudentDtos;

public class StudentPerformanceDto
{
    public string StudentId { get; set; }
    public int SolvedQuestions { get; set; }
    public int TotalAttempts { get; set; }
    public double SuccessRate { get; set; }
} 