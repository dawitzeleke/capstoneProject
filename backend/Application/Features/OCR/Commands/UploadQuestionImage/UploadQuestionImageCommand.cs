using MediatR;
namespace backend.Application.Features.OCR.Command.UploadQuestionImage;

public class UploadQuestionImageCommand : IRequest<string>
{
    public Stream ImageStream { get; set; }
}
