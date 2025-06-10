public class SaveBlogResponse
{
    public bool Success { get; set; }
    public bool? Saved { get; set; }
    public int? SaveCount { get; set; }
    public string? BlogId { get; set; }
    public string? Error { get; set; }
}