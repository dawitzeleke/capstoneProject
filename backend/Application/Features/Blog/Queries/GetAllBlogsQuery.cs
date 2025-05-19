using MediatR;

public class GetAllBlogsQuery : IRequest<List<BlogDto>>
{
    public string? SearchTerm { get; set; }
    public string? Tag { get; set; }
    public string? SortBy { get; set; }
    public string? OrderBy { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}