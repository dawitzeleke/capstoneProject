using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Application.Features.Students.Commands.SaveQuestion;
using backend.Application.Features.Students.Commands.SaveContent;
using backend.Application.Features.Students.Queries.GetSavedQuestions;


[ApiController]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StudentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize(Roles = "Student")]
    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var query = new GetStudentSettingsQuery {};
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpPatch("settings")]
    public async Task<IActionResult> UpdateSettings([FromForm] UpdateStudentSettingsCommand command)
    {
        var result = await _mediator.Send(command);
        return result ? Ok("Student Updated Succefully") : BadRequest("Update failed");
    }

    [HttpGet("{studentId}/following")]
    public async Task<IActionResult> GetFollowing(string studentId)
    {
        var result = await _mediator.Send(new GetStudentFollowingQuery { StudentId = studentId });
        return Ok(result);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("save-question/")]
    public async Task<IActionResult> GetSavedQuestions([FromQuery] string studentId)
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

}