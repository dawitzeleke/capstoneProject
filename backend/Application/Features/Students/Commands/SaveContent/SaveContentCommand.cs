using MediatR;
using backend.Domain.Enums; 

namespace backend.Application.Features.Students.Commands.SaveContent;

public class SaveContentCommand : IRequest<bool>
{
    public string ContentId { get; set; }
    public ContentTypeEnum ContentType { get; set; }
}