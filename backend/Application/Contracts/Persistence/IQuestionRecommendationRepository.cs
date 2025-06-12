using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Domain.Entities;

namespace backend.Application.Contracts.Persistence;

public interface IQuestionRecommendationRepository : IGenericRepository<QuestionRecommendation>
{
    Task<List<QuestionRecommendation>> GetStudentRecommendations(string studentId, int limit = 5);
    Task UpdateRecommendationStatus(string recommendationId, bool isViewed, bool isAttempted, bool isSolved);
    Task DeleteOldRecommendations(string studentId, int daysToKeep = 7);
} 