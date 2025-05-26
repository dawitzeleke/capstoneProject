namespace backend.Application.Dtos.PaginationDtos;

public class PaginationDto
{
    public int Limit { get; set; } = 20;

    public int? LastSolveCount { get; set; }
    public string? LastId { get; set; }
}
