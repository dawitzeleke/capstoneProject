using backend.Application.Contracts.Persistence;

public interface IBlogRepository : IGenericRepository<Blog>
{
    Task<bool> LikeBlogAsync(string blogId, string userId);
    Task<int> GetBlogFeedbacks(string id);
    Task<int> CountAsync();
}