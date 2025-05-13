using backend.Domain.Common;
namespace backend.Domain.Entities;

public class ImageContent:ContentEntity
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string ImageUrl { get; set; }
    public string PublicId { get; set; }
    public string[] Tags { get; set; }
    public string[] Feedbacks { get; set; }
}