using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Application.Contracts.Persistence;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Application.Features.Questions.Queries.GetQuestionDetail;
using backend.Application.Features.Questions.Queries.GetQuestionList;
using backend.Application.Features.Questions.Commands.DeleteQuestion;
using backend.Application.Features.Questions.Commands.UpdateQuestion;
using backend.Application.Features.Students.Commands.SaveQuestion;
using backend.Application.Features.Questions.Queries.GetCustomExam;
using backend.Application.Dtos.PaginationDtos;
using backend.webApi.PresentationDtos;
using backend.Domain.Enums;


namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class QuestionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public QuestionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllQuestions(
        [FromQuery] int? grade,
        [FromQuery] StreamEnum? stream,
        [FromQuery] string? courseName,
        [FromQuery] int? limit, 
        [FromQuery] int? lastSolveCount,
        [FromQuery] string? lastId,
        [FromQuery] DifficultyLevel? DifficultyLevel = null)
    {
        var query = new GetQuestionListQuery
            {
                Grade = grade,
                Stream = stream,
                CourseName = courseName,
                DifficultyLevel = DifficultyLevel, // Default difficulty level if not provided
                Pagination = new PaginationDto
                {
                    Limit = limit?? 20, // Default limit if not provided
                    LastSolveCount = lastSolveCount,
                    LastId = lastId
                }
            };
        var questions = await _mediator.Send(query);
        Console.WriteLine($"Questions count: {questions?.Items?.Count ?? 0}");
        if (questions == null || questions.Items ==null || questions.Items.Count == 0)
        {
            return NotFound(ApiResponse.ErrorResponse("No questions found"));
        }
        return Ok(ApiResponse.SuccessResponse(questions, "Questions retrieved successfully"));
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestionById(string id)
    {
        var question = await _mediator.Send(new GetQuestionDetailQuery { Id = id });
        if (question == null)
        {
            return NotFound(new ApiResponse(false, "Question not found", null));
        }
        return Ok(new ApiResponse(true, "Question retrieved successfully", question));
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuestion([FromForm] CreateQuestionCommand question)
    {
        var response = await _mediator.Send(question);
        if (response == null)
        {
            return BadRequest(new ApiResponse(false, "Failed to create question", null));
        }
        return Ok(new ApiResponse(true, "Question created successfully", response));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateQuestion([FromBody] UpdateQuestionCommand question)
    {
        var response = await _mediator.Send(question);
        if (response == null)
        {
            return NotFound();
        }
        return Ok(question);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteQuestion(DeleteQuestionCommand request)
    {
        var response = await _mediator.Send(request);
        if (response)
        {
            return Ok();
        }
        return NotFound();
    }

    [HttpGet("custom-exam")]
    public async Task<IActionResult> GetCustomExam(
        [FromQuery] int? grade,
        [FromQuery] DifficultyLevel? difficultyLevel,
        [FromQuery] string? courseName)
    {
        var filter = new GetCustomExamQuery
            {
                Grade = grade,
                DifficultyLevel = difficultyLevel,
                CourseName = courseName,
            };
        var questions = await _mediator.Send(filter);
        return Ok(questions);
    }   
    
}