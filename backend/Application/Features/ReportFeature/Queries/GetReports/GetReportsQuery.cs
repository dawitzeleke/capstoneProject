using MediatR;
using backend.Domain.Entities;
namespace backend.Application.Features.ReportFeature.Queries.GetReports;

public class GetReportsQuery : IRequest<List<Report>>
{
}