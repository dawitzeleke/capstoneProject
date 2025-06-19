using backend.Domain.Common;
using backend.Domain.Enums;
public class Blog : BaseEntity
{
    public string CreatedBy { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public string ContentFilePath { get; set; }
    public string? ContentFilePublicId { get; set; }
    public List<string> LikedBy { get; set; }
    public List<string> SavedBy { get; set; }
    public string VideoPublicId { get; set; }
    public string ImagePublicId { get; set; }

    public List<string> Tags { get; set; }
}