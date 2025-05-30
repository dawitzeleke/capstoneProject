using MediatR;
using backend.Domain.Entities;
using backend.Application.Contracts.Persistence;
using backend.Domain.Enums;
using backend.Application.Dtos.ReportDtos;
using backend.Application.Contracts.Persistence;

namespace backend.Application.Features.ReportFeature.Queries.GetReports;
public class GetReportsQueryHandler : IRequestHandler<GetReportsQuery, List<GetReportResponseDto>>
{
    private readonly IReportRepository _reportRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly IImageContentRepository _imageRepository;
    private readonly IVideoContentRepository _videoRepository;

    public GetReportsQueryHandler(IReportRepository reportRepository, IQuestionRepository questionRepository, 
                                  IImageContentRepository imageRepository, 
                                  IVideoContentRepository videoRepository)
    {
        _questionRepository = questionRepository;
        _imageRepository = imageRepository;
        _videoRepository = videoRepository;
        _reportRepository = reportRepository;

    }

    public async Task<List<GetReportResponseDto>> Handle(GetReportsQuery request, CancellationToken cancellationToken)
    {
        
        var reports = await _reportRepository.GetAllAsync();
        var questionReports = reports.Where(r => r.ContentType == ContentTypeEnum.Question).ToList();
        var imageReports = reports.Where(r => r.ContentType == ContentTypeEnum.Image).ToList();
        var videoReports = reports.Where(r => r.ContentType == ContentTypeEnum.Video).ToList();

        var QuestionIds = questionReports.Select(r => r.ContentId).ToList();
        var imagesIds = imageReports.Select(r => r.ContentId).ToList();
        var videosIds = videoReports.Select(r => r.ContentId).ToList();


        var Questions = await _questionRepository.GetQuestionByIdList(QuestionIds);
        var QuestionMap = Questions.ToDictionary(q => q.Id, q => q);

        var Images = await _imageRepository.GetImageContentByIdList(imagesIds);
        var ImageMap = Images.ToDictionary(i => i.Id, i => i);

        var Videos = await _videoRepository.GetVideoContentByIdList(videosIds);
        var VideoMap = Videos.ToDictionary(v => v.Id, v => v);

        var response = reports.Select(report =>
        {
            var newResponse = new GetReportResponseDto
            {
                Id = report.Id,
                ContentId = report.ContentId,
                ContentType = report.ContentType,
                IsResolved = report.IsResolved,
                ResolvedBy = report.ResolvedBy,
                ResolvedAt = report.ResolvedAt,
                Reports = report.Reports.Select(r => new SingleReport
                {
                    ReportedBy = r.ReportedBy,
                    ReportType = r.ReportType
                }).ToList()

            };

            if (report.ContentType == ContentTypeEnum.Question && QuestionMap.TryGetValue(report.ContentId, out var question))
            {
                newResponse.Question = question;
            }
            else if (report.ContentType == ContentTypeEnum.Image && ImageMap.TryGetValue(report.ContentId, out var image))
            {
                newResponse.ImageContent = image;
            }
            else if (report.ContentType == ContentTypeEnum.Video && VideoMap.TryGetValue(report.ContentId, out var video))
            {
                newResponse.VideoContent = video;
            }
            return newResponse;
        }).ToList();
        
        //  return the response sorted by total reports
        return response.OrderByDescending(r => r.TotalReports).ToList();
    }
}