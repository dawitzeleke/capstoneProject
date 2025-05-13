using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.ReportFeature.Queries.GetReports;
public class GetReportsQueryHandler : IRequestHandler<GetReportsQuery, List<Report>>
{
    private readonly IReportRepository _reportRepository;

    public GetReportsQueryHandler(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<List<Report>> Handle(GetReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await _reportRepository.GetAllAsync();
        return reports.ToList();
    }
}