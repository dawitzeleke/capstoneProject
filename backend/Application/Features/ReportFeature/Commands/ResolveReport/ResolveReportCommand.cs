using MediatR;
using backend.Domain.Entities;
using backend.Domain.Enums;
namespace backend.Application.Features.ReportFeature.Commands.ResolveReport;

public class ResolveReportCommand : IRequest<bool>
{
    public string ReportId { get; set; }
    public string ResolvedBy { get; set; }
    public ReportResolutionType Resolution { get; set; }
}

