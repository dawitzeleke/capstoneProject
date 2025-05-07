namespace backend.Application.Dtos.CloudinaryDtos;
public class UploadResponse
{
    public string Id{ get; set; }
    public string PublicId { get; set; }
    public string Url { get; set; }
    public string? ThumbnailUr {get; set;}
}