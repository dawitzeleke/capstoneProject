using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using backend.Domain.Entities;
using backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;
using backend.Application.Features.StudentProgresses.Queries.GetStudentProgress;
using backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;
using Microsoft.AspNetCore.Authorization;
using backend.Application.Features.Students.Queries.GetStudentPerformance;
using backend.webApi.PresentationDtos;

namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class StudentProgressController : ControllerBase
{
    private readonly IMediator _mediator;

    public StudentProgressController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetStudentProgress()
    {
        var studentProgress = await _mediator.Send(new GetStudentProgressQuery() {});
        if (studentProgress == null)
        {
            return NotFound();
        }
        return Ok(studentProgress);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateStudentProgress([FromBody] UpdateStudentProgressCommand studentProgress)
    {
        var response = await _mediator.Send(studentProgress);
        if (response == null)
        {
            return NotFound(new ApiResponse(false,"Student progress not found or update failed",null));
        }
        return Ok(new ApiResponse(true, "Student progress updated successfully", response));
    }
    [Authorize]
    [HttpGet("performance")]
    public async Task<IActionResult> GetStudentPerformance()
    {
        var studentPerformance = await _mediator.Send(new GetStudentPerformanceQuery());
        if (studentPerformance == null)
        {
            return NotFound();
        }
        return Ok(studentPerformance);
    }
}
