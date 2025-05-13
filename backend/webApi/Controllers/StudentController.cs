using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/students")]
public class StudentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StudentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings([FromQuery] string email)
    {
        var query = new GetStudentSettingsQuery { Email = email };
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

}