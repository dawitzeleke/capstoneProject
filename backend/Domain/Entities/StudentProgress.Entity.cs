using backend.Domain.Common;
namespace backend.Domain.Entities;

public class StudentProgress : BaseEntity
{
    public string StudentId { get; set; }
    // Dictionary of month and monthly progress id
    public Dictionary <string, string> Progresses { get; set; } = new Dictionary<string, string>();
}

