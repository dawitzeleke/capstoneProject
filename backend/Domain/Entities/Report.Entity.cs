using backend.Domain.Common;
using backend.Domain.Enums;
namespace backend.Domain.Entities;


public class Report:BaseEntity
{
    public string ContentId { get; set; }
    public ICollection<SingleReport> Reports { get; set; } = new List<SingleReport>();
    public bool IsResolved { get; set; }
    public string? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public ContentTypeEnum ContentType { get; set; }

}

public class SingleReport
{
    public string ReportedBy { get; set; }
    public ReportType ReportType { get; set; }
}