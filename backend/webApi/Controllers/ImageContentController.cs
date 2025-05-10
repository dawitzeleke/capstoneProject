using MediatR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.webApi.Dtos.ImageContentDtos;
using backend.Application.Features.Image.Commands.CreateImageContent;
using backend.Application.Contracts.Persistence;
using backend.Application.Features.Image.Commands.CreateImageContent;
using backend.Application.Features.Image.Queries.GetAllImageContents;
using backend.Application.Features.Image.Queries.GetImageContent;
namespace backend.webApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ImageContentController : ControllerBase
{
    private readonly IMediator _mediator;
    public ImageContentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllImageContents()
    {
        var imageContents = await _mediator.Send(new GetAllImageContentsQuery());
        if (imageContents == null)
        {
            return NotFound("No image contents found");
        }
        return Ok(imageContents);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetImageContentById(string id)
    {
        var imageContent = await _mediator.Send(new GetImageContentQuery { Id = id });
        if (imageContent == null)
        {
            return NotFound($"Image content with  not found");
        }
        return Ok(imageContent);
    }

    [HttpPost]
    public async Task<IActionResult> CreateImageContent([FromForm] CreateImageContentRequestDto request)
    {
        if (request.Image == null)  
        {
            return BadRequest("Image is required");
        }
        var imageStream = request.Image.OpenReadStream();
        var new_image= new CreateImageContentCommand
        {
            CreatedBy = request.CreatedBy,
            Title = request.Title,
            Description = request.Description,
            ImageStream = imageStream,
            Tags = request.Tags
        };
        var response = await _mediator.Send(new_image);
        if (response == null)
        {
            return BadRequest("Failed to create image content");
        }
        return Ok(response);
    }


}