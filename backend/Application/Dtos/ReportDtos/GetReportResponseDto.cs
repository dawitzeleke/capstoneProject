using backend.Domain.Entities;
using backend.Domain.Enums;

namespace backend.Application.Dtos.ReportDtos;
public class GetReportResponseDto
{
    public string Id { get; set; }
    public string ContentId { get; set;}
    public ContentTypeEnum ContentType { get; set; }
    public bool IsResolved { get; set; }
    public string? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public List<SingleReport> Reports { get; set; } = new List<SingleReport>();
    public int TotalReports => Reports.Count;
    public Question? Question { get; set; }
    public ImageContent? ImageContent { get; set; }
    public VideoContent? VideoContent { get; set; }
}