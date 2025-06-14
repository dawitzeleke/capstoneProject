using Microsoft.AspNetCore.Http;
namespace backend.webApi.Dtos.VideoContentDtos;

public class CreateVideoContentRequestDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public IFormFile? Thumbnail{ get; set; }
    public IFormFile Video { get; set; }
    public string[] Tags { get; set; }
}