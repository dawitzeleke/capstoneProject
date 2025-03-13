using MediatR;
using MongoDB.Driver;
using System.Reflection;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Persistence;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddPersistenceServices(builder.Configuration);

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateQuestionCommandHandler).Assembly));
// builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

var app = builder.Build();

// Validate MongoDB connection
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // Resolve the IMongoDatabase service
        var mongoDatabase = services.GetRequiredService<IMongoDatabase>();

        // Ping the MongoDB server to validate the connection
        mongoDatabase.RunCommandAsync((Command<object>)"{ping:1}").Wait();
        Console.WriteLine("MongoDB connection successful.");
    }
    catch (Exception ex)
    {
        // Log the error and stop the application if the connection fails
        Console.WriteLine("MongoDB connection failed: " + ex.Message);
        // throw new InvalidOperationException("MongoDB connection failed", ex);
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
