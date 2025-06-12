public class LikeBlogResponse
{
    public bool Success { get; set; }
    public bool? Liked { get; set; }
    public int? LikeCount { get; set; }
    public string? BlogId { get; set; }
    public string? Error { get; set; }
}