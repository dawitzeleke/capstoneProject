using FluentValidation;
using backend.Application.Dtos.PaginationDtos;
using backend.Domain.Enums;
using backend.Application.Features.Questions.Queries.GetCustomExam;

namespace backend.Application.Features.Questions.Queries.GetCustomExam;
public class GetCustomExamQueryValidator : AbstractValidator<GetCustomExamQuery>
    {
        public GetCustomExamQueryValidator()
        {
            RuleFor(x => x.Grade)
                .InclusiveBetween(1, 12)
                .When(x => x.Grade.HasValue)
                .WithMessage("Grade must be between 1 and 12.");

            RuleFor(x => x.CourseName)
                .MaximumLength(100)
                .When(x => !string.IsNullOrEmpty(x.CourseName));

            RuleFor(x => x.DifficultyLevel)
                .IsInEnum()
                .When(x => x.DifficultyLevel.HasValue);
        }
    }