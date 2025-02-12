using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace backend.Persistence;

public static class PersistenceServiceRegistration
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure MongoDB
        services.AddSingleton<IMongoClient, MongoClient>(sp =>
        {
            var connectionString = configuration.GetConnectionString("ConnectionStrings");
            return new MongoClient(connectionString);
        });

        services.AddScoped<MongoDbContext>();

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        return services;
    }
}