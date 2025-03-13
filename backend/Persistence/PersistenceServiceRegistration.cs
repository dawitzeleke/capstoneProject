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
             // Validate the connection to MongoDB by pinging the server
            try
            {
                client.GetDatabase(settings.Value.DatabaseName).RunCommandAsync((Command<object>)"{ping:1}").Wait();
                Console.WriteLine("MongoDB connection successful.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("MongoDB connection failed: " + ex.Message);
                throw new InvalidOperationException("MongoDB connection failed", ex);
            }
        
            return client.GetDatabase(settings.Value.DatabaseName);
        });
        services.AddSingleton<MongoDbContext>();

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        return services;
    }
}