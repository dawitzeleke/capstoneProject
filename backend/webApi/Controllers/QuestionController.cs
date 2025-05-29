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
using backend.Application.Features.Questions.Commands.LikeQuestion;
using backend.Application.Features.Questions.Commands.AddRelatedBlog;
using backend.Application.Features.Questions.Commands.RemoveRelatedBlog;
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
            DifficultyLevel = DifficultyLevel, 
            Pagination = new PaginationDto
            {
                Limit = limit ?? 20, // Default limit if not provided
                LastSolveCount = lastSolveCount,
                LastId = lastId
            }
        };
        var questions = await _mediator.Send(query);
        Console.WriteLine($"Questions count: {questions?.Items?.Count ?? 0}");
        if (questions == null || questions.Items == null || questions.Items.Count == 0)
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

    [Authorize(Roles = "Teacher")]
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

    [Authorize(Roles = "Teacher")]
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

    [Authorize(Roles = "Teacher")]
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



    [Authorize(Roles = "Student")]
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

    [Authorize(Roles = "Student")]
    [HttpPost("{id}/like")]  
    public async Task<IActionResult> LikeQuestion(string questionId)
    {
        var response = await _mediator.Send(new LikeQuestionCommand(questionId));
        if (response)
        {
            return Ok(ApiResponse.SuccessResponse(null, "Question liked successfully"));
        }
        return BadRequest(ApiResponse.ErrorResponse("Failed to like question"));
    }

    [Authorize(Roles = "Teacher")]
    [HttpPost("{id}/related-blog")]
    public async Task<IActionResult> AddRelatedBlog(string id, [FromBody] string blogId)
    {
        var response = await _mediator.Send(new AddRelatedBlogCommand { QuestionId = id, BlogId = blogId });
        if (response)
        {
            return Ok(ApiResponse.SuccessResponse(null, "Related blog added successfully"));
        }
        return BadRequest(ApiResponse.ErrorResponse("Failed to add related blog"));
    }

    [Authorize(Roles = "Teacher")]
    [HttpDelete("{id}/related-blog")]
    public async Task<IActionResult> RemoveRelatedBlog(string id, [FromBody] string blogId)
    {
        var response = await _mediator.Send(new RemoveRelatedBlogCommand { QuestionId = id, BlogId = blogId });
        if (response)
        {
            return Ok(ApiResponse.SuccessResponse(null, "Related blog removed successfully"));
        }
        return BadRequest(ApiResponse.ErrorResponse("Failed to remove related blog"));
    }

    
}