using backend.Domain.Enums;

namespace backend.Application.Dtos.ImageContentDtos;

public class ImageContentFilterDto
{

    public string CreatorId { get; set; }
    public ContentStatusEnum? Status { get; set; }

}