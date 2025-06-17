using FluentValidation;
using backend.Application.Features.VideoContents.Commands.CreateVideoContent;

public class CreateVideoContentCommandValidator : AbstractValidator<CreateVideoContentCommand>
{
    public CreateVideoContentCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");

        RuleFor(x => x.Thumbnail)
            .Must(IsValidUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.Thumbnail))
            .WithMessage("Thumbnail must be a valid URL if provided.");

        RuleFor(x => x.VideoStream)
            .NotNull().WithMessage("Video file is required.");

        RuleFor(x => x.Tags)
            .NotNull().WithMessage("Tags are required.")
            .Must(tags => tags.Length <= 10).WithMessage("Maximum 10 tags are allowed.");

        RuleForEach(x => x.Tags)
            .NotEmpty().WithMessage("Each tag must be non-empty.")
            .MaximumLength(30).WithMessage("Each tag must not exceed 30 characters.");

        RuleFor(x => x.CreatedBy)
            .NotEmpty().WithMessage("CreatedBy is required.");
    }

    private bool IsValidUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return true; // Allow empty/null thumbnail
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
