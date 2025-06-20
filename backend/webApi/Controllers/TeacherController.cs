using backend.Application.Features.Teachers.Queries.GetFollower;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TeachersController : ControllerBase
{
    private readonly IMediator _mediator;

    public TeachersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("follow")]
    public async Task<IActionResult> FollowTeacher([FromBody] FollowTeacherCommand request)
    {
        var result = await _mediator.Send(request);
        if (!result)
            return Conflict("You already follow this teacher.");

        return Ok("Successfully followed the teacher.");
    }

    [HttpDelete("unfollow")]
    public async Task<IActionResult> UnfollowTeacher([FromBody] UnFollowTeacherCommand request)
    {
        var result = await _mediator.Send(request);
        if (!result)
            return NotFound("You are not following this teacher.");

        return Ok("Successfully unfollowed the teacher.");
    }

    [Authorize(Roles = "Teacher")]
    [HttpGet("followers")]
    public async Task<IActionResult> GetFollowers([FromQuery] GetFollowerQuery query)
    {
        var result = await _mediator.Send(query);
        if (result == null || !result.Any())
            return NotFound("No followers found for this teacher.");
        return Ok(result);
    }

    [Authorize]
    [HttpPost("verification-request")]
    public async Task<IActionResult> VerificationRequest([FromForm] VerificationRequestCommand request)
    {
        var result = await _mediator.Send(request);
        if (!result)
            return BadRequest("Failed to send verification request.");

        return Ok("Verification request sent successfully.");
    }

    [Authorize(Roles = "Teacher")]
    [HttpPatch("settings")]
    public async Task<IActionResult> UpdateSettings([FromForm] UpdateTeacherSettingsCommand request)
    {
        var result = await _mediator.Send(request);
        if (!result)
            return BadRequest("Failed to update settings.");

        return Ok("Settings updated successfully.");
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchByName([FromQuery] SearchTeacherByNameQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    
}