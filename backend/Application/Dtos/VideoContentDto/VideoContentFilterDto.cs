using backend.Domain.Enums;

namespace backend.Application.Dtos.VideoContentDto;

public class VideoContentFilterDto
{
    public string? CreatorId { get; set; }
    public ContentStatusEnum? Status { get; set; }
}