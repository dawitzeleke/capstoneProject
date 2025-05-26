using backend.Application.Contracts.Persistence;

public interface IBlogRepository : IGenericRepository<Blog>
{
    Task<int> GetBlogFeedbacks(string id);
    Task<int> CountAsync();
}