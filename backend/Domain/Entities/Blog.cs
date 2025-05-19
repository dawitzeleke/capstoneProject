using backend.Domain.Common;
public class Blog : BaseEntity
{
    public string CreatedBy { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ContentFilePath { get; set; }
    public string? ContentFilePublicId { get; set; }
    public List<string> LikedBy { get; set; }
    public List<string> SavedBy { get; set; }

    public List<string> Tags { get; set; }
}