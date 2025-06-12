using MediatR;
using backend.Domain.Entities;
using backend.Application.Dtos.ReportDtos;
using backend.Application.Dtos.ReportDtos;
namespace backend.Application.Features.ReportFeature.Queries.GetReports;

public class GetReportsQuery : IRequest<List<GetReportResponseDto>>
{
    public ReportFilterDto Filter { get; set; }
    public GetReportsQuery(ReportFilterDto filter)
    {
        Filter = filter;
    }
}