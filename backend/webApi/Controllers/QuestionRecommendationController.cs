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
    private readonly ICurrentUserService _currentUserService;

    public QuestionRecommendationController(
        QuestionRecommendationService recommendationService,
        IQuestionRecommendationRepository recommendationRepository,
        ICurrentUserService currentUserService)
    {
        _recommendationService = recommendationService;
        _recommendationRepository = recommendationRepository;
        _currentUserService = currentUserService;
    }

    [Authorize(Roles ="Student")]
    [HttpGet("recommend")]
    public async Task<IActionResult> Recommend(string courseName = null, int limit = 5)
    {
        var studentId = _currentUserService.UserId;
        var questions = await _recommendationService.GetRecommendations(studentId, courseName, limit);
        return Ok(questions);
    }
}
