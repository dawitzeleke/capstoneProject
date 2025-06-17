using backend.Application.Contracts.Services;
using backend.Infrastructure.Services.HubServices;
using backend.WebApi.Hubs;


namespace backend.webApi.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services)
    {
        services.AddScoped<ILeaderboardNotifier, SignalRLeaderBoardNotifierService<LeaderBoardHub>>();

        return services;
    }
}