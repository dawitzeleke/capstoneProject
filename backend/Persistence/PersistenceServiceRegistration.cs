﻿using Application.Contracts.Persistence;
using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using backend.Persistence.Repositories;
using backend.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using backend.Domain.Common;
using backend.Domain.Entities;
using Domain.Entities;
using backend.Application.Mappings;
using backend.Application.Services;

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
            
            client.GetDatabase(settings.Value.DatabaseName).RunCommandAsync((Command<object>)"{ping:1}").Wait();
            

            return client.GetDatabase(settings.Value.DatabaseName);
        });
        services.AddSingleton<MongoDbContext>();

        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        services.AddScoped<ITeacherRepository, TeacherRepository>();
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IAdminRepository, AdminRepository>();

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher<Student>, PasswordHasher<Student>>();
        services.AddScoped<IPasswordHasher<Teacher>, PasswordHasher<Teacher>>();
        services.AddScoped<IPasswordHasher<Admin>, PasswordHasher<Admin>>();
        
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddScoped<IFollowRepository, FollowRepository>();
        services.AddScoped<IVideoContentRepository, VideoContentRepository>();
        services.AddScoped<IImageContentRepository, ImageContentRepository>();
        services.AddScoped<IReportRepository, ReportRepository>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IUserActivityRepository, UserActivityRepository>();
        services.AddScoped<IBlogRepository, BlogRepository>();
        
        services.AddScoped<IStudentProgressRepository, StudentProgressRepository>();
        services.AddScoped<IMonthlyProgressRepository, MonthlyProgressRepository>();
        services.AddScoped<IStudentSolvedQuestionsRepository, StudentSolvedQuestionsRepository>();
        services.AddScoped<IStudentQuestionAttemptsRepository, StudentQuestionAttemptsRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<ISaveRepository, SaveRepository>();
        services.AddScoped<IQuestionRecommendationRepository, QuestionRecommendationRepository>();
        services.AddScoped<QuestionRecommendationService>();

        return services;
    }
}