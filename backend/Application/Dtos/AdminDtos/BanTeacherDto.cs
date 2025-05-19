public class BanTeacherDto
{
    public string TeacherId { get; set; }
    public DateTime BannedAt { get; set; }
    public string Message { get; set; }
    public DateTime? BannedUntil { get; set; }
}