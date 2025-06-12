using backend.Domain.Common;
using backend.Domain.Enums;

public class Save : BaseEntity
{
    public string UserId { get; set; }
    public ContentTypeEnum ContentType { get; set; }
    public string ContentId { get; set; }
}