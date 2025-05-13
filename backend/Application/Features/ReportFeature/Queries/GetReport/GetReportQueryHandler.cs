using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Domain.Entities;

namespace backend.Application.Features.ReportFeature.Queries.GetReport;

public class GetReportQueryHandler:IRequestHandler<GetReportQuery, Report>
{
    private readonly IReportRepository _reportRepository;

    public GetReportQueryHandler(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<Report> Handle(GetReportQuery request, CancellationToken cancellationToken)
    {
        var report = await _reportRepository.GetByIdAsync(request.Id);
        return report;
    }
}