using backend.Domain.Enums;

namespace backend.Application.Features.StudentProgresses.Queries;

public static class DivisionHelper
{
    public static DivisionEnums GetDivisionByPoints(int points)
        {
            return points switch
            {
                <= 99 => DivisionEnums.Beginner,
                <= 299 => DivisionEnums.Learner,
                <= 599 => DivisionEnums.Explorer,
                <= 999 => DivisionEnums.Achiever,
                <= 1499 => DivisionEnums.Rising_Star,
                <= 2499 => DivisionEnums.Thinker,
                <= 3999 => DivisionEnums.Champion,
                <= 5999 => DivisionEnums.Mastermind,
                <= 7999 => DivisionEnums.Grandmaster,
                _ => DivisionEnums.Legend
            };
        }
}