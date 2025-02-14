using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Persistence;

public static class PersistenceServiceRegistration
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoDbSettings>(configuration.GetSection("DatabaseConfiguration"));
        services.AddSingleton<IMongoClient>(sp =>
        {
            var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>();
            return new MongoClient(settings.Value.ConnectionString);
        });
        services.AddSingleton<IMongoDatabase>(sp =>
        {
            var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>();
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(settings.Value.DatabaseName);
        });
        services.AddSingleton<MongoDbContext>();

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IStudentRepository, StudentRepository>();
        return services;
    }
}