using MediatR;
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

    // [HttpPut("settings")]
    // public async Task<IActionResult> UpdateSettings([FromBody] UpdateStudentSettingsCommand command)
    // {
    //     var result = await _mediator.Send(command);
    //     return result ? Ok() : BadRequest("Update failed");
    // }
}