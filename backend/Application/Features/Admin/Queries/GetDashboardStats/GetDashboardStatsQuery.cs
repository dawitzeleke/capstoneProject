using MediatR;

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;
