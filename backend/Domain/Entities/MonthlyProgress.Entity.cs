using backend.Domain.Common;

namespace backend.Domain.Entities;

public class MonthlyProgress:BaseEntity
{
    public string Month { get; set; }  // will be puttend in a way that show month and year
    public IReadOnlyList<HashSet<string>> Questions; 

    public MonthlyProgress(string month_year)
    {
        Month = month_year;
        var months_to_number = new Dictionary<string, int>
        {
            {"January", 1},
            {"February", 2},
            {"March", 3},
            {"April", 4},
            {"May", 5},
            {"June", 6},
            {"July", 7},
            {"August", 8},
            {"September", 9},
            {"October", 10},
            {"November", 11},
            {"December", 12}
        };

        Console.WriteLine(month_year);
        var parts = month_year.Split(" ");
        Console.WriteLine(parts[0]);
        var days = DateTime.DaysInMonth(int.Parse(parts[1]),months_to_number[parts[0]]);
        Questions = Enumerable.Range(0, days)
                             .Select(_ => new HashSet<string>())
                             .ToList()
                             .AsReadOnly();
    }
}