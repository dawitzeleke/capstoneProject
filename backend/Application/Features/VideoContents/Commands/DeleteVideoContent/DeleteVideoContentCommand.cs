using MediatR;
namespace backend.Application.Features.VideoContents.Commands.DeleteVideoContent;

public class DeleteVideoContentCommand: IRequest<bool>
{
    public string Id { get; set; }
    public string DeletedBy { get; set; }
}
