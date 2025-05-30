using backend.Domain.Enums;
namespace backend.Application.Dtos.ReportDtos;

public class ReportFilterDto
{
    public ContentTypeEnum[]? ContentTypes { get; set; }
}