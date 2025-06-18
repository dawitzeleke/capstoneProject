using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Application.Features.Students.Commands.SaveQuestion;
using backend.Application.Features.Students.Commands.SaveContent;
using backend.Application.Features.Students.Queries.GetSavedQuestions;
using backend.Domain.Enums;
using backend.webApi.PresentationDtos;
using backend.Application.Features.Students.Queries.GetLeaderStudent;
using backend.Application.Features.Students.Queries.GetStudentRank;
using backend.Application.Features.Students.Queries.GetLeaderStudent;
using backend.Application.Features.Students.Queries.GetStudentDetail;

[ApiController]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StudentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpGet("detail")]
    public async Task<IActionResult> GetStudentInformation()
    {
        var result = await _mediator.Send(new GetStudentDetailQuery());
        if (result == null)
        {
            return NotFound(ApiResponse.ErrorResponse("Student not found"));
        }
        return Ok(ApiResponse.SuccessResponse(result, "Student information retrieved successfully"));
    }
    

    [Authorize(Roles = "Student")]
    [HttpPatch("settings")]
    public async Task<IActionResult> UpdateSettings([FromForm] UpdateStudentSettingsCommand command)
    {
        var result = await _mediator.Send(command);
        return result ? Ok("Student Updated Succefully") : BadRequest("Update failed");
    }

    [Authorize(Roles = "Student")]
    [HttpGet("get-following")]
    public async Task<IActionResult> GetFollowing()
    {
        var result = await _mediator.Send(new GetStudentFollowingQuery { });
        return Ok(result);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("saved-question/")]
    public async Task<IActionResult> GetSavedQuestions()
    {
        var result = await _mediator.Send(new GetSavedQuestionsQuery());
        return Ok(result);
    }

    // add save question
    [Authorize(Roles = "Student")]
    [HttpPost("save-question")]
    public async Task<IActionResult> SaveQuestion([FromBody] SaveQuestionCommand command)
    {
        var result = await _mediator.Send(command);
        return result ? Ok("Question Saved Successfully") : BadRequest("Save failed");
    }

    // add save Image and video content
    [Authorize(Roles = "Student")]
    [HttpPost("save-content")]
    public async Task<IActionResult> SaveContent([FromBody] SaveContentCommand command)
    {
        var result = await _mediator.Send(command);
        return result ? Ok("Content Saved Successfully") : BadRequest("Save failed");
    }

    [Authorize(Roles = "Student")]
    [HttpGet("rank")]
    public async Task<IActionResult> GetStudentRank()
    {
        var result = await _mediator.Send(new GetStudentRankQuery());
        if (result == null)
        {
            return NotFound(ApiResponse.ErrorResponse("Student rank not found"));
        }

        return Ok(ApiResponse.SuccessResponse(result, "Student rank retrieved successfully"));
    }

    [HttpGet("leader-students")]
    public async Task<IActionResult> GetLeaderStudents([FromQuery] DivisionEnums division = DivisionEnums.Beginner, [FromQuery] int topN = 10)
    {
        var result = await _mediator.Send(new GetLeaderStudentsQuery { TopCount = topN, Division = division });
        if (result == null || !result.Any())
        {
            return NotFound(ApiResponse.ErrorResponse("No leader students found"));
        }
        return Ok(ApiResponse.SuccessResponse(result, "Leader students retrieved successfully"));
    }

    [Authorize(Roles = "Student")]
    [HttpGet("student-division")]
    public async Task<IActionResult> GetStudentDivision()
    {
        var result = await _mediator.Send(new GetStudentDivisionQuery());
        if (result == null)
        {
            return NotFound(ApiResponse.ErrorResponse("Student division not found"));
        }
        return Ok(ApiResponse.SuccessResponse(result, "Student division retrieved successfully"));
    }

}