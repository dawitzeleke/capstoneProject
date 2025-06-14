using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Application.Contracts.Persistence;
using MongoDB.Driver;
using backend.Application.Dtos.QuestionDtos;

namespace backend.Application.Services;

public class QuestionRecommendationService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IStudentSolvedQuestionsRepository _solvedQuestionsRepository;
    private readonly IStudentQuestionAttemptsRepository _attemptsRepository;
    private readonly IQuestionRecommendationRepository _recommendationRepository;

    private static readonly string[] ValidSubjects = new[]
    {
        "Biology",
        "English",
        "Mathematics",
        "Geography",
        "History",
        "Economics"
    };

    public QuestionRecommendationService(
        IQuestionRepository questionRepository,
        IStudentSolvedQuestionsRepository solvedQuestionsRepository,
        IStudentQuestionAttemptsRepository attemptsRepository,
        IQuestionRecommendationRepository recommendationRepository)
    {
        _questionRepository = questionRepository;
        _solvedQuestionsRepository = solvedQuestionsRepository;
        _attemptsRepository = attemptsRepository;
        _recommendationRepository = recommendationRepository;
    }

    public async Task<List<Question>> GetRecommendations(
        string studentId, 
        string subject = null, 
        int limit = 5)
    {
        // Validate subject if provided
        if (!string.IsNullOrEmpty(subject) && !ValidSubjects.Contains(subject))
        {
            throw new ArgumentException($"Invalid subject. Must be one of: {string.Join(", ", ValidSubjects)}");
        }

        // Get student's solved and attempted questions
        var solvedQuestions = await _solvedQuestionsRepository.GetSolvedQuestionIds(new QuestionFilterDto { StudentId = studentId }) ?? new List<string>();
        var attemptedQuestions = await _attemptsRepository.GetAttemptedQuestionIds(new QuestionFilterDto { StudentId = studentId }) ?? new List<string>();

        // Get all questions (filtered by subject if specified)
        var questions = await _questionRepository.GetAllAsync();
        if (questions == null || !questions.Any())
        {
            return new List<Question>();
        }

        if (!string.IsNullOrEmpty(subject))
        {
            questions = questions.Where(q => q.CourseName == subject).ToList();
            if (!questions.Any())
            {
                return new List<Question>();
            }
        }

        // Calculate student's performance metrics
        var performanceMetrics = await CalculatePerformanceMetrics(studentId, subject, questions);

        // Generate recommendations
        var recommendations = new List<(Question Question, double Score)>();
        foreach (var question in questions)
        {
            if (solvedQuestions.Contains(question.Id))
                continue;

            var score = CalculateRecommendationScore(question, performanceMetrics, attemptedQuestions);
            recommendations.Add((question, score));
        }

        // Sort by score and take top recommendations
        return recommendations
            .OrderByDescending(r => r.Score)
            .Take(limit)
            .Select(r => r.Question)
            .ToList();
    }

    private async Task<StudentPerformanceMetrics> CalculatePerformanceMetrics(
        string studentId, 
        string subject,
        IReadOnlyList<Question> allQuestions)
    {
        var solvedQuestions = await _solvedQuestionsRepository.GetSolvedQuestions(studentId) ?? new List<StudentSolvedQuestions>();
        var attemptedQuestions = await _attemptsRepository.GetAttemptedQuestions(studentId) ?? new List<StudentQuestionAttempts>();

        // Create a dictionary to map question IDs to their types and subjects
        var questionTypes = allQuestions.ToDictionary(q => q.Id, q => q.QuestionType);
        var questionSubjects = allQuestions.ToDictionary(q => q.Id, q => q.CourseName);

        var metrics = new StudentPerformanceMetrics
        {
            AverageScore = solvedQuestions.Any() ? solvedQuestions.Average(q => q.Grade) : 0,
            PreferredDifficulty = DeterminePreferredDifficulty(solvedQuestions),
            PreferredQuestionTypes = DeterminePreferredQuestionTypes(solvedQuestions, questionTypes),
            PreferredSubjects = DeterminePreferredSubjects(solvedQuestions, questionSubjects),
            CourseProgress = CalculateCourseProgress(solvedQuestions, subject),
            SuccessRateByType = CalculateSuccessRateByType(solvedQuestions, attemptedQuestions, questionTypes),
            SuccessRateBySubject = CalculateSuccessRateBySubject(solvedQuestions, attemptedQuestions, questionSubjects)
        };

        return metrics;
    }

    private double CalculateRecommendationScore(Question question, StudentPerformanceMetrics metrics, List<string> attemptedQuestions)
    {
        double score = 0;

        // Difficulty matching (25% weight)
        var difficultyScore = CalculateDifficultyScore(question.Difficulty, metrics.PreferredDifficulty);
        score += difficultyScore * 0.25;

        // Question type preference (15% weight)
        var typeScore = metrics.PreferredQuestionTypes.Contains(question.QuestionType) ? 1.0 : 0.5;
        score += typeScore * 0.15;

        // Subject preference (20% weight)
        var subjectScore = metrics.PreferredSubjects.Contains(question.CourseName) ? 1.0 : 0.5;
        score += subjectScore * 0.20;

        // Course progress alignment (15% weight)
        var progressScore = CalculateProgressScore(question, metrics.CourseProgress);
        score += progressScore * 0.15;

        // Success rate with question type (10% weight)
        var successRateScore = metrics.SuccessRateByType.GetValueOrDefault(question.QuestionType, 0.5);
        score += successRateScore * 0.10;

        // Success rate with subject (10% weight)
        var subjectSuccessRate = metrics.SuccessRateBySubject.GetValueOrDefault(question.CourseName, 0.5);
        score += subjectSuccessRate * 0.10;

        // Attempt history (5% weight)
        var attemptScore = attemptedQuestions.Contains(question.Id) ? 0.7 : 1.0;
        score += attemptScore * 0.05;

        return score;
    }

    private double CalculateDifficultyScore(DifficultyLevel questionDifficulty, DifficultyLevel preferredDifficulty)
    {
        var difficultyDiff = Math.Abs((int)questionDifficulty - (int)preferredDifficulty);
        return Math.Max(0, 1 - (difficultyDiff * 0.3));
    }

    private double CalculateProgressScore(Question question, Dictionary<string, double> courseProgress)
    {
        if (!courseProgress.ContainsKey(question.CourseName))
            return 0.5;

        var progress = courseProgress[question.CourseName];
        var chapterProgress = (question.Chapter / 10.0) * 100; // Assuming 10 chapters per course

        return Math.Max(0, 1 - Math.Abs(progress - chapterProgress) / 100);
    }

    private DifficultyLevel DeterminePreferredDifficulty(List<StudentSolvedQuestions> solvedQuestions)
    {
        if (!solvedQuestions.Any())
            return DifficultyLevel.Medium;

        var difficultyScores = solvedQuestions
            .GroupBy(q => q.Difficulty)
            .Select(g => new { Difficulty = g.Key, Score = g.Average(q => q.Grade) })
            .OrderByDescending(x => x.Score)
            .ToList();

        return difficultyScores.FirstOrDefault()?.Difficulty ?? DifficultyLevel.Medium;
    }

    private List<QuestionTypeEnum> DeterminePreferredQuestionTypes(
        List<StudentSolvedQuestions> solvedQuestions,
        Dictionary<string, QuestionTypeEnum> questionTypes)
    {
        if (!solvedQuestions.Any())
            return new List<QuestionTypeEnum> { QuestionTypeEnum.MultipleChoice, QuestionTypeEnum.TrueFalse };

        return solvedQuestions
            .Where(q => questionTypes.ContainsKey(q.QuestionId))
            .GroupBy(q => questionTypes[q.QuestionId])
            .Select(g => new { Type = g.Key, Score = g.Average(q => q.Grade) })
            .OrderByDescending(x => x.Score)
            .Take(2)
            .Select(x => x.Type)
            .ToList();
    }

    private List<string> DeterminePreferredSubjects(
        List<StudentSolvedQuestions> solvedQuestions,
        Dictionary<string, string> questionSubjects)
    {
        if (!solvedQuestions.Any())
            return new List<string> { "Mathematics", "English" }; // Default subjects

        return solvedQuestions
            .Where(q => questionSubjects.ContainsKey(q.QuestionId))
            .GroupBy(q => questionSubjects[q.QuestionId])
            .Select(g => new { Subject = g.Key, Score = g.Average(q => q.Grade) })
            .OrderByDescending(x => x.Score)
            .Take(2)
            .Select(x => x.Subject)
            .ToList();
    }

    private Dictionary<string, double> CalculateCourseProgress(List<StudentSolvedQuestions> solvedQuestions, string subject)
    {
        var progress = new Dictionary<string, double>();
        var courseQuestions = solvedQuestions
            .Where(q => string.IsNullOrEmpty(subject) || q.CourseName == subject)
            .GroupBy(q => q.CourseName);

        foreach (var course in courseQuestions)
        {
            var totalQuestions = course.Count();
            var solvedCount = course.Count(q => q.SolveCount > 0);
            progress[course.Key] = (double)solvedCount / totalQuestions * 100;
        }

        return progress;
    }

    private Dictionary<QuestionTypeEnum, double> CalculateSuccessRateByType(
        List<StudentSolvedQuestions> solvedQuestions,
        List<StudentQuestionAttempts> attemptedQuestions,
        Dictionary<string, QuestionTypeEnum> questionTypes)
    {
        var successRates = new Dictionary<QuestionTypeEnum, double>();

        foreach (var type in Enum.GetValues(typeof(QuestionTypeEnum)).Cast<QuestionTypeEnum>())
        {
            var solved = solvedQuestions.Count(q => questionTypes.ContainsKey(q.QuestionId) && questionTypes[q.QuestionId] == type);
            var attempted = attemptedQuestions.Count(q => questionTypes.ContainsKey(q.QuestionId) && questionTypes[q.QuestionId] == type);

            successRates[type] = attempted > 0 ? (double)solved / attempted : 0.5;
        }

        return successRates;
    }

    private Dictionary<string, double> CalculateSuccessRateBySubject(
        List<StudentSolvedQuestions> solvedQuestions,
        List<StudentQuestionAttempts> attemptedQuestions,
        Dictionary<string, string> questionSubjects)
    {
        var successRates = new Dictionary<string, double>();

        foreach (var subject in ValidSubjects)
        {
            var solved = solvedQuestions.Count(q => questionSubjects.ContainsKey(q.QuestionId) && questionSubjects[q.QuestionId] == subject);
            var attempted = attemptedQuestions.Count(q => questionSubjects.ContainsKey(q.QuestionId) && questionSubjects[q.QuestionId] == subject);

            successRates[subject] = attempted > 0 ? (double)solved / attempted : 0.5;
        }

        return successRates;
    }
}

public class StudentPerformanceMetrics
{
    public double AverageScore { get; set; }
    public DifficultyLevel PreferredDifficulty { get; set; }
    public List<QuestionTypeEnum> PreferredQuestionTypes { get; set; }
    public List<string> PreferredSubjects { get; set; }
    public Dictionary<string, double> CourseProgress { get; set; }
    public Dictionary<QuestionTypeEnum, double> SuccessRateByType { get; set; }
    public Dictionary<string, double> SuccessRateBySubject { get; set; }
} 