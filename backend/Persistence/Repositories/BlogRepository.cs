using backend.Persistence.DatabaseContext;
using backend.Persistence.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

public class BlogRepository : GenericRepository<Blog>, IBlogRepository
{
    private readonly IMongoCollection<Blog> _blogs;

    public BlogRepository(MongoDbContext context) : base(context)
    {
        _blogs = context.GetCollection<Blog>(typeof(Blog).Name);
    }
    public async Task<int> GetBlogFeedbacks(string id)
    {
        var blog = await _blogs.Find(x => x.Id == id).FirstOrDefaultAsync();
        if (blog != null)
        {
            return blog.LikedBy.Count + blog.SavedBy.Count;
        }
        return 0;
    }
    public async Task<int> CountAsync()
    {
        return (int)await _blogs.CountDocumentsAsync(new BsonDocument());
    }

}      