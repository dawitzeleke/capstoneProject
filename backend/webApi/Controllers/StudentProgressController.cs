using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using backend.Domain.Entities;
using backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;
using backend.Application.Features.StudentProgresses.Queries.GetStudentProgress;
using backend.Application.Features.StudentProgresses.Commands.UpdateStudentProgress;
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

    [HttpGet("{studentId}")]
    public async Task<IActionResult> GetStudentProgress(string studentId)
    {
        var studentProgress = await _mediator.Send(new GetStudentProgressQuery() {});
        if (studentProgress == null)
        {
            return NotFound();
        }
        return Ok(studentProgress);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateStudentProgress([FromForm] UpdateStudentProgressCommand studentProgress)
    {
        var response = await _mediator.Send(studentProgress);
        if (response == null)
        {
            return NotFound();
        }
        return Ok(response);
    }
}