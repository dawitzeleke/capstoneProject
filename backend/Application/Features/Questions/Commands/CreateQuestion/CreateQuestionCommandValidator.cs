using FluentValidation;
using backend.Application.Features.Questions.Commands.CreateQuestion;
using backend.Domain.Enums;

namespace backend.Application.Features.Questions.Commands.CreateQuestion;
public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommand>
{
    public CreateQuestionCommandValidator()
    {
        RuleFor(x => x.QuestionText)
            .NotEmpty().WithMessage("Question text is required.")
            .MaximumLength(500).WithMessage("Question text must not exceed 500 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.Options)
            .NotNull().WithMessage("Options are required.")
            .Must(options => options.Length >= 2)
            .WithMessage("At least two options are required.");

        RuleFor(x => x.CorrectOption)
            .NotEmpty().WithMessage("Correct option is required.")
            .Must((command, correctOption) => command.Options != null && command.Options.Contains(correctOption))
            .WithMessage("Correct option must be one of the provided options.");

        RuleFor(x => x.CourseName)
            .NotEmpty().WithMessage("Course name is required.");

        RuleFor(x => x.Grade)
            .InclusiveBetween(9, 12).WithMessage("Grade must be between 1 and 12.");

        RuleFor(x => x.Difficulty)
            .IsInEnum().WithMessage("Invalid difficulty level.");

        RuleFor(x => x.Stream)
            .IsInEnum().WithMessage("Invalid stream.");
    }
}
