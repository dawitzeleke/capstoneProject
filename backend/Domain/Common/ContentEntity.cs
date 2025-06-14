using backend.Domain.Common;
using backend.Domain.Enums;

namespace backend.Domain.Common;

public abstract class ContentEntity: BaseEntity
{
    public ContentTypeEnum type { get; set; }
    public string CreatedBy { get; set; }
    public ContentStatusEnum Status { get; set; }
}