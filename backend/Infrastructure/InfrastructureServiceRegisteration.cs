using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using backend.Infrastructure.Services;
using backend.Application.Contracts.Services;

namespace backend.Infrastructure;

public static class InfrastructureServiceRegisteration
{
   public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<ICloudinaryService>(_ => 
        {
            var cloud_name= Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
            var api_key = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
            var api_secret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");
            return new CloudinaryService(cloud_name, api_key, api_secret);
        });
        return services;
    }
}