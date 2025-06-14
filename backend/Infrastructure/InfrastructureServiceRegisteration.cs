using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using backend.Infrastructure.Services;
using backend.Application.Contracts.Services;
// using backend.Infrastructure.Services.OCR;
using Microsoft.Extensions.Configuration;

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

        //  OCR Service
        // services.AddScoped<IOcrService>(_ =>
        // {
        //     Console.WriteLine("trying to add ocr service");
        //     var credentialsPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");
        //     if (credentialsPath == null)
        //     {
        //         Console.WriteLine("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
        //         return null;
        //     }
        //     return new OcrService(credentialsPath);
        // });

        // Register OCR.Space Service
        // services.AddHttpClient(); // registers IHttpClientFactory

        // services.AddScoped<IOcrService>(provider =>
        // {
        //     var factory = provider.GetRequiredService<IHttpClientFactory>();
        //     var client = factory.CreateClient();

        //     var apiKey = Environment.GetEnvironmentVariable("OCR_SPACE_API_KEY");
        //     if (string.IsNullOrEmpty(apiKey))
        //     {
        //         throw new InvalidOperationException("OCR_SPACE_API_KEY is not set.");
        //     }

        //     return new OcrSpaceService(client, apiKey);
        // });
        // return services;
    }
}