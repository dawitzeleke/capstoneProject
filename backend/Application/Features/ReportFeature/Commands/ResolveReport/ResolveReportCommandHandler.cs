using backend.Application.Contracts.Persistence;

using backend.Domain.Entities;
using backend.Domain.Enums;
using MediatR;

namespace backend.Application.Features.ReportFeature.Commands.ResolveReport;

public class ResolveReportCommandHandler : IRequestHandler<ResolveReportCommand, bool>
{
    private readonly IReportRepository _reportRepository;
    private readonly IImageContentRepository _imageRepository;
    private readonly IVideoContentRepository _videoRepository;
    private readonly IQuestionRepository _questionRepository;

    public ResolveReportCommandHandler(IReportRepository reportRepository, IImageContentRepository imageRepository,
        IVideoContentRepository videoRepository, IQuestionRepository questionRepository)
    {
        _reportRepository = reportRepository;
        _imageRepository = imageRepository;
        _videoRepository = videoRepository;
        _questionRepository = questionRepository;

    }

    public async Task<bool> Handle(ResolveReportCommand request, CancellationToken cancellationToken)
    {
        var report = await _reportRepository.GetByIdAsync(request.ReportId);
        if (report == null) return false;

        if (request.Resolution==ReportResolutionType.ContentRemoved)
        {
            //  there will be a feature to ban or increase the inappropriate content posting count
            if (report.ContentType == ContentTypeEnum.Image)
            {
                var image = await _imageRepository.GetByIdAsync(report.ContentId);
                if (image != null)
                {
                    await _imageRepository.DeleteAsync(image);
                }
            }
            else if (report.ContentType == ContentTypeEnum.Video)
            {
                var video = await _videoRepository.GetByIdAsync(report.ContentId);
                if (video != null)
                {
                    await _videoRepository.DeleteAsync(video);
                }
            }
            else if (report.ContentType == ContentTypeEnum.Question)
            {
                var question = await _questionRepository.GetByIdAsync(report.ContentId);
                if (question != null)
                {
                    await _questionRepository.DeleteAsync(question);
                }
            }
        }
        else if (request.Resolution == ReportResolutionType.SentForEditing)
        {
            // 
            // or notify the user about the ban.
        }
        else if (request.Resolution == ReportResolutionType.NoIssueFound)
        {
            _reportRepository.DeleteAsync(report);
            if(report.ContentType == ContentTypeEnum.Image)
            {
                var image = await _imageRepository.GetByIdAsync(report.ContentId);
                if (image != null)
                {
                    image.Report = null;
                    await _imageRepository.UpdateAsync(image);
                }
            }
            else if (report.ContentType == ContentTypeEnum.Video)
            {
                var video = await _videoRepository.GetByIdAsync(report.ContentId);
                if (video != null)
                {
                    video.Report = null;
                    await _videoRepository.UpdateAsync(video);
                }
            }
            else if (report.ContentType == ContentTypeEnum.Question)
            {
                var question = await _questionRepository.GetByIdAsync(report.ContentId);
                if (question != null)
                {
                    question.Report = null;
                    await _questionRepository.UpdateAsync(question);
                }
            }
        }


        report.IsResolved = true;
        report.ResolvedBy = request.ResolvedBy;

        await _reportRepository.UpdateAsync(report);
        return true;
    }
}