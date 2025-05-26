namespace backend.Domain.Common;

public class PaginatedList<T> where T : class
{
    public List<T> Items { get; set; }
    // Optional: Cursor to be used for the next fetch
    public string? NextCursor { get; set; }
    // Optional: Whether there's more data
    public bool HasMore { get; set; }

    public PaginatedList(List<T> items, string? nextCursor = null, bool hasMore = false)
    {
        Items = items;
        NextCursor = nextCursor;
        HasMore = hasMore;
    }

    
}