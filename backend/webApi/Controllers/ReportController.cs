using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Domain.Enums;
using backend.Application.Dtos.ReportDtos;
using backend.Application.Features.ReportFeature.Commands.CreateReport;
using backend.Application.Features.ReportFeature.Queries.GetReport;
using backend.Application.Features.ReportFeature.Queries.GetReports;
namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ReportController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllReports([FromQuery]ContentTypeEnum[] contentTypes = null)
    {
        var filter = new ReportFilterDto();
        
        if (contentTypes != null)
        {
            filter.ContentTypes=contentTypes;
        }
        var reports = await _mediator.Send(new GetReportsQuery(filter));
        return Ok(reports);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReportById(string id)
    {
        var report = await _mediator.Send(new GetReportQuery { Id = id });
        return Ok(report);
    }

    [Authorize(Roles = "Student")]
    [HttpPost]
    public async Task<IActionResult> CreateReport([FromBody] CreateReportCommand report)
    {
        var response = await _mediator.Send(report);
        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> ResolveReport([FromBody] CreateReportCommand report)
    {
        var response = await _mediator.Send(report);
        if (response == null)
        {
            return NotFound();
        }
        return Ok(report);
    }
    
}