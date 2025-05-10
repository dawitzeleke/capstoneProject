using backend.Domain.Common;
namespace backend.Domain.Entities;

public class VideoContent : ContentEntity
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string VideoUrl { get; set; }
    public string ThumbnailId { get; set; }
    public string PublicId { get; set; }
    public int Views { get; set; }
    public string[] Tags { get; set; }
    public string[] Feedbacks { get; set; }
}