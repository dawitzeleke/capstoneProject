using MediatR;
using backend.Domain.Entities;
using backend.Domain.Enums;
using backend.Domain.Common;
using backend.Application.Contracts.Persistence;


namespace backend.Application.Features.ReportFeature.Commands.CreateReport;
public class CreateReportCommandHandler : IRequestHandler<CreateReportCommand, Report>
{
    private readonly IReportRepository _reportRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly IVideoContentRepository _videoRepository;
    private readonly IImageContentRepository _imageRepository;

    public CreateReportCommandHandler(IReportRepository reportRepository,IQuestionRepository questionRepository,
        IVideoContentRepository videoRepository,IImageContentRepository imageRepository)
    {
        _reportRepository = reportRepository;
        _questionRepository = questionRepository;
        _videoRepository = videoRepository;
        _imageRepository = imageRepository;
    }

    public async Task<Report> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        var reportid="";
        if(request.ContentType==ContentTypeEnum.Question){
            var content = await _questionRepository.GetByIdAsync(request.ContentId);
            if (content==null){
                return null;
            }
            reportid = content.Report;
        }
        else if(request.ContentType == ContentTypeEnum.Video){
            var content = await _videoRepository.GetByIdAsync(request.ContentId);
            
            if (content==null){
                return null;
            }
            reportid = content.Report;
        }
        else if(request.ContentType==ContentTypeEnum.Image){
            var content = await _imageRepository.GetByIdAsync(request.ContentId);
            if (content==null){
                return null;
            }
            reportid = content.Report;
        }
        
        if (reportid!= null){

            var report = await _reportRepository.GetByIdAsync(reportid);
            if (report == null)
            {
                return null;
            }
            report.Reports.Add(new SingleReport
            {
                ReportedBy = request.ReportedBy,
                ReportType = request.ReportType
            });
            report.UpdatedAt = DateTime.UtcNow;
            var result = await _reportRepository.UpdateAsync(report);
            return result;
        }
        else{
            var report = new Report
            {
                ContentId = request.ContentId,
                Reports = new List<SingleReport>
                {
                    new SingleReport
                    {
                        ReportedBy = request.ReportedBy,
                        ReportType = request.ReportType
                    }
                },
                IsResolved = false,
                ResolvedBy = null,
                ResolvedAt = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ContentType = request.ContentType
            };

            var result = await _reportRepository.CreateAsync(report);
            if (result == null)
            {
                return null;
            }
            if (request.ContentType == ContentTypeEnum.Image)
            {
                var image = await _imageRepository.GetByIdAsync(request.ContentId);
                if (image != null)
                {
                    image.Report = result.Id;
                    await _imageRepository.UpdateAsync(image);
                }
            }
            else if (request.ContentType == ContentTypeEnum.Video)
            {
                var video = await _videoRepository.GetByIdAsync(request.ContentId);
                if (video != null)
                {
                    video.Report = result.Id;
                    await _videoRepository.UpdateAsync(video);
                }
            }
            else if (request.ContentType == ContentTypeEnum.Question)
            {
                var question = await _questionRepository.GetByIdAsync(request.ContentId);
                if (question != null)
                {
                    question.Report = result.Id;
                    await _questionRepository.UpdateAsync(question);
                }
            }
            return result;
        }
        return null;
    }
    
}