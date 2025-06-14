using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Application.Services;
using backend.Domain.Entities;
using backend.Application.Dtos.QuestionDtos;
using backend.Application.Contracts.Persistence;
using Microsoft.AspNetCore.Authorization;

namespace backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionRecommendationController : ControllerBase
{
    private readonly QuestionRecommendationService _recommendationService;
    private readonly IQuestionRecommendationRepository _recommendationRepository;

    public QuestionRecommendationController(
        QuestionRecommendationService recommendationService,
        IQuestionRecommendationRepository recommendationRepository)
    {
        _recommendationService = recommendationService;
        _recommendationRepository = recommendationRepository;
    }

    [Authorize(Roles = "Student")]
    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<List<Question>>> GetRecommendations(
        string studentId,
        [FromQuery] string courseName = null,
        [FromQuery] int limit = 5)
    {
        try
        {
            var recommendations = await _recommendationService.GetRecommendations(studentId, courseName, limit);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error getting recommendations: {ex.Message}");
        }
    }

    [HttpGet("student/{studentId}/history")]
    public async Task<ActionResult<List<QuestionRecommendation>>> GetRecommendationHistory(
        string studentId,
        [FromQuery] int limit = 5)
    {
        try
        {
            var history = await _recommendationRepository.GetStudentRecommendations(studentId, limit);
            return Ok(history);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error getting recommendation history: {ex.Message}");
        }
    }

    [HttpPut("recommendation/{recommendationId}/status")]
    public async Task<IActionResult> UpdateRecommendationStatus(
        string recommendationId,
        [FromBody] RecommendationStatusUpdateDto status)
    {
        try
        {
            await _recommendationRepository.UpdateRecommendationStatus(
                recommendationId,
                status.IsViewed,
                status.IsAttempted,
                status.IsSolved);

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error updating recommendation status: {ex.Message}");
        }
    }

    [HttpDelete("student/{studentId}/old")]
    public async Task<IActionResult> DeleteOldRecommendations(
        string studentId,
        [FromQuery] int daysToKeep = 7)
    {
        try
        {
            await _recommendationRepository.DeleteOldRecommendations(studentId, daysToKeep);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error deleting old recommendations: {ex.Message}");
        }
    }
}

public class RecommendationStatusUpdateDto
{
    public bool IsViewed { get; set; }
    public bool IsAttempted { get; set; }
    public bool IsSolved { get; set; }
} 