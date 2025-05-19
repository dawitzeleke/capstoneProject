using backend.Domain.Common;

public class Notification : BaseEntity
{
    public string CreatedBy { get; set; }
    public string UserId { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public string RelatedContentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; } = false;
    public NotificationType NotificationType { get; set; }
}
