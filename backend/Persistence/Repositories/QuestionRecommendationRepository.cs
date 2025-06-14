using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using MongoDB.Driver;

namespace backend.Persistence.Repositories;

public class QuestionRecommendationRepository : GenericRepository<QuestionRecommendation>, IQuestionRecommendationRepository
{
    private readonly IMongoCollection<QuestionRecommendation> _recommendations;

    public QuestionRecommendationRepository(MongoDbContext context) : base(context)
    {
        _recommendations = context.GetCollection<QuestionRecommendation>(typeof(QuestionRecommendation).Name);
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        var compoundIndex = new CreateIndexModel<QuestionRecommendation>(
            Builders<QuestionRecommendation>.IndexKeys
                .Ascending(x => x.StudentId)
                .Descending(x => x.Score)
                .Descending(x => x.CreatedAt),
            new CreateIndexOptions { Background = true }
        );

        _recommendations.Indexes.CreateMany(new[] { compoundIndex });
    }

    public async Task<List<QuestionRecommendation>> GetStudentRecommendations(string studentId, int limit = 5)
    {
        return await _recommendations
            .Find(r => r.StudentId == studentId)
            .SortByDescending(r => r.Score)
            .ThenByDescending(r => r.CreatedAt)
            .Limit(limit)
            .ToListAsync();
    }

    public async Task UpdateRecommendationStatus(string recommendationId, bool isViewed, bool isAttempted, bool isSolved)
    {
        var update = Builders<QuestionRecommendation>.Update
            .Set(r => r.IsViewed, isViewed)
            .Set(r => r.IsAttempted, isAttempted)
            .Set(r => r.IsSolved, isSolved);

        await _recommendations.UpdateOneAsync(r => r.Id == recommendationId, update);
    }

    public async Task DeleteOldRecommendations(string studentId, int daysToKeep = 7)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysToKeep);
        await _recommendations.DeleteManyAsync(r => 
            r.StudentId == studentId && 
            r.CreatedAt < cutoffDate);
    }
} 