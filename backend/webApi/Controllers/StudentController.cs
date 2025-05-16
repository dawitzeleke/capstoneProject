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

    [HttpGet("{studentId}/following")]
    public async Task<IActionResult> GetFollowing(string studentId)
    {
        var result = await _mediator.Send(new GetStudentFollowingQuery { StudentId = studentId });
        return Ok(result);
    }
}