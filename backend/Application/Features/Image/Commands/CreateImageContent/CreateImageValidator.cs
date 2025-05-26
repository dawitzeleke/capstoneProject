using FluentValidation;
using backend.Application.Features.Image.Commands.CreateImageContent;

namespace Application.Features.Image.Validators
{
    public class CreateImageValidator : AbstractValidator<CreateImageContentCommand>
    {
        public CreateImageValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Image title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

            RuleFor(x =>x.ImageStream)
                .NotNull().WithMessage("Image stream is required")
                .Must(stream => stream.Length > 0).WithMessage("Image stream cannot be empty");

          
            RuleFor(x => x.CreatedBy)
                .NotEmpty().WithMessage("Teacher ID is required");

            RuleFor(x => x.Tags)
                .Must(tags => tags.Length <= 10)
                .WithMessage("Maximum 10 tags are allowed");

            // RuleFor(x => x.FileSize)
            //     .GreaterThan(0).WithMessage("File size must be greater than 0")
            //     .LessThanOrEqualTo(10 * 1024 * 1024) // 10MB
            //     .WithMessage("File size cannot exceed 10MB");
        }
    }
} 