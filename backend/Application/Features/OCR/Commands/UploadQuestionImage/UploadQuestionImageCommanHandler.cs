using MediatR;
using backend.Application.Contracts.Services;
namespace backend.Application.Features.OCR.Command.UploadQuestionImage;
 
public class UploadQuestionImageHandler : IRequestHandler<UploadQuestionImageCommand, string>
{
    private readonly IOcrService _ocrService;
    // private readonly IQuestionSplitterService _questionSplitterService;

    public UploadQuestionImageHandler(IOcrService ocrService)
    {
        _ocrService = ocrService;
        // _questionSplitterService = questionSplitterService;
    }

    public async Task<string> Handle(UploadQuestionImageCommand request, CancellationToken cancellationToken)
    {
        var rawText = await _ocrService.ExtractTextAsync(request.ImageStream);
        if (string.IsNullOrEmpty(rawText))
        {
            throw new Exception("No text detected in the image.");
        }

        Console.WriteLine($"Extracted Text: {rawText}");
        return rawText;
        // split the detction api result 
        // var questions = await _questionSplitterService.SplitQuestionsAsync(rawText);

        // return questions;
    }
}
