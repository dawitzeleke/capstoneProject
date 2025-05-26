using MediatR;
using backend.Domain.Entities;
using backend.Domain.Enums;
namespace backend.Application.Features.ReportFeature.Commands.CreateReport;
public class CreateReportCommand : IRequest<Report>
{
    public ContentTypeEnum ContentType {get; set;}
    public string ContentId { get; set; }
    public ReportType ReportType { get; set; }
}