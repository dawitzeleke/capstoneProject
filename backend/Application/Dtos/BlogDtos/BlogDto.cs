public class BlogDto
{
    public string Id { get; set; }
    public string CreatedBy { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ContentFilePath { get; set; }

    public List<string> LikedBy { get; set; }
    public List<string> SavedBy { get; set; }
    public DateTime? CreatedAt { get; set; }

    public List<string> Tags { get; set; }
}