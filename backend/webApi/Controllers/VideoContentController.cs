using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MediatR;
using backend.Application.Contracts.Persistence;
using backend.Application.Features.VideoContents.Commands.CreateVideoContent;
using backend.Application.Features.VideoContents.Queries.GetVideoContentList;
using backend.webApi.Dtos.VideoContentDtos;
using backend.Application.Features.Image.Commands.CreateImageContent;
using backend.Application.Features.VideoContents.Commands.UpdateVideoContent;
using Microsoft.AspNetCore.Authorization;


namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class VideoContentController : ControllerBase
{
    private readonly IMediator _mediator;

    public VideoContentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVideoContents()
    {
        var videoContents = await _mediator.Send(new GetVideoContentListQuery(){});
        return Ok(videoContents);
    }

    // [HttpGet("{id}")]
    [Authorize(Roles = "Teacher")]
    [HttpPost]
    public async Task<IActionResult> CreateVideoContent([FromForm] CreateVideoContentRequestDto request)
    {
        if (request.Video == null)
        {
            return BadRequest("Video is required");
        }
        var videoStream= request.Video.OpenReadStream();
        string thumbnailId= "";
        if (request.Thumbnail != null)
        {
            var thumbnailStream = request.Thumbnail.OpenReadStream();
            var imageUpload= await _mediator.Send(new CreateImageContentCommand
            {
                ImageStream = thumbnailStream,
            });
            thumbnailId = imageUpload.Id;
        }

        

        var new_video_command = new CreateVideoContentCommand
        {
            Title = request.Title,
            Description = request.Description,
            VideoStream = videoStream,
            Thumbnail = thumbnailId,
            Tags = request.Tags
        };
        var response= await _mediator.Send(new_video_command);
        if (response == null)
        {
            return BadRequest("Failed to create video content");
        }
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVideoContent(string id,[FromBody] UpdateVideoContentCommand request)
    {
        request.Id = id;
        var response= await _mediator.Send(request);
        if (response == null)
        {
            return NotFound();
        }
        return Ok(response);
    }
}