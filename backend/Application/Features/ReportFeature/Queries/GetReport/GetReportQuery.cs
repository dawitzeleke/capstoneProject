using MediatR;
using backend.Domain.Entities;


namespace backend.Application.Features.ReportFeature.Queries.GetReport;

public class GetReportQuery : IRequest<Report>
{
    public string Id { get; set; }
}