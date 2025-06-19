using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Services
{
    public class QuestionRecommendationService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IStudentSolvedQuestionsRepository _studentSolvedQuestionsRepository;
        private readonly IStudentQuestionAttemptsRepository _studentQuestionAttemptRepository;

        public QuestionRecommendationService(
            IQuestionRepository questionRepository,
            IStudentSolvedQuestionsRepository studentSolvedQuestionsRepository,
            IStudentQuestionAttemptsRepository studentQuestionAttemptRepository)
        {
            _questionRepository = questionRepository;
            _studentSolvedQuestionsRepository = studentSolvedQuestionsRepository;
            _studentQuestionAttemptRepository = studentQuestionAttemptRepository;
        }

        public async Task<List<Question>> GetRecommendations(string studentId, string courseName = null, int limit = 5)
        {
            // 1. Get all questions (optionally filter by course)
            var allQuestions = await _questionRepository.GetAllAsync();
            if (!string.IsNullOrWhiteSpace(courseName))
                allQuestions = allQuestions.Where(q => q.CourseName == courseName).ToList();

            // 2. Get student's solved and attempted question IDs
            var solvedQuestionIds = await _studentSolvedQuestionsRepository.GetSolvedQuestionIds(studentId) ?? new List<string>();
            var attemptedQuestionIds = await _studentQuestionAttemptRepository.GetAttemptedQuestionIds(studentId) ?? new List<string>();

            // 3. Get tags from solved and attempted questions
            var solvedTags = allQuestions
                .Where(q => solvedQuestionIds.Contains(q.Id))
                .SelectMany(q => q.Tags ?? Array.Empty<string>())
                .ToList();

            var attemptedTags = allQuestions
                .Where(q => attemptedQuestionIds.Contains(q.Id))
                .SelectMany(q => q.Tags ?? Array.Empty<string>())
                .ToList();

            var allActivityTags = solvedTags.Concat(attemptedTags).ToList();

            // 4. Count tag frequency for creative diversity
            var tagFrequency = allActivityTags
                .GroupBy(tag => tag)
                .ToDictionary(g => g.Key, g => g.Count());

            // 5. Score each question
            var recommendations = allQuestions
                .Where(q => !solvedQuestionIds.Contains(q.Id)) 
                .Select(q =>
                {
                    var tagOverlap = (q.Tags ?? Array.Empty<string>()).Intersect(allActivityTags).Count();
                    var solvedOverlap = (q.Tags ?? Array.Empty<string>()).Intersect(solvedTags).Count();
                    var attemptedOverlap = (q.Tags ?? Array.Empty<string>()).Intersect(attemptedTags).Count();

                    // Creative: Boost for less-seen tags
                    var diversityBoost = (q.Tags ?? Array.Empty<string>())
                        .Where(tag => !tagFrequency.ContainsKey(tag) || tagFrequency[tag] <= 1)
                        .Any() ? 0.5 : 0.0;

                    // Score: overlap + solved weight + attempted weight + diversity
                    double score = tagOverlap + (solvedOverlap * 0.3) + (attemptedOverlap * 0.7) + diversityBoost;

                    return new { Question = q, Score = score };
                })
                .OrderByDescending(x => x.Score)
                .ThenBy(x => Guid.NewGuid()) // Shuffle for questions with same score
                .Take(limit)
                .Select(x => x.Question)
                .ToList();

            return recommendations;
        }
    }
}