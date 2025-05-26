using FluentValidation;
using backend.Application.Features.ReportFeature.Commands.CreateReport;

namespace Application.Features.ReportFeature.Validators
{
    public class CreateReportValidator : AbstractValidator<CreateReportCommand>
    {
        public CreateReportValidator()
        {
            RuleFor(x => x.ContentId)
                .NotEmpty().WithMessage("content is required");
               
            RuleFor(x => x.ReportType)
                .IsInEnum().WithMessage("Invalid report type");
            
            RuleFor(x => x.ContentType)
                .IsInEnum().WithMessage("Invalid content type");
          
        }
    }
} 