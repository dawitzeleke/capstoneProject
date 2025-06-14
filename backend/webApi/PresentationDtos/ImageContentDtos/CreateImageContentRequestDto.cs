using Microsoft.AspNetCore.Http;
namespace backend.webApi.Dtos.ImageContentDtos;

public class CreateImageContentRequestDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public IFormFile Image { get; set; }
    public string[] Tags { get; set; }
}