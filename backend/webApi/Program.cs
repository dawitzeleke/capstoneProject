using MediatR;
using MongoDB.Driver;
using System.Reflection;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Persistence;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;
using backend.Infrastructure;
using backend.webApi.ExceptionHandlerMiddleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load("../.env");


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c=>{
    c.SwaggerDoc("v1", new OpenApiInfo{ Title = "API",Version = "v1"});
    c.AddSecurityDefinition("Bearer",new OpenApiSecurityScheme{
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Enter valid JWT token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference{ Type = ReferenceType.SecurityScheme, Id = "Bearer"},
                Scheme = "Bearer",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });

});

builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddInfrastructureServices();

// builder.Services.AddScoped<AuthService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// builder.WebHost.ConfigureKestrel(options =>
// {
//     options.ListenAnyIP(80);
// });

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateQuestionCommandHandler).Assembly));
// builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8081", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

});

builder.Services.AddHttpContextAccessor();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]))
    };
});

var app = builder.Build();

// register the exception handler
app.UseMiddleware<ExceptionHandlerMiddleware>();

// Validate MongoDB connection
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        //E Resolve the IMongoDatabase service
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
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
var port = Environment.GetEnvironmentVariable("PORT") ?? "5019";
app.Urls.Add($"http://0.0.0.0:{port}");
app.Run();
