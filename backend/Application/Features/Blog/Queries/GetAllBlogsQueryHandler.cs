using MediatR;

public class GetAllBlogsQueryHandler : IRequestHandler<GetAllBlogsQuery, List<BlogDto>>
{
    private readonly IBlogRepository _blogRepository;

    public GetAllBlogsQueryHandler(IBlogRepository blogRepository)
    {
        _blogRepository = blogRepository;
    }

    public async Task<List<BlogDto>> Handle(GetAllBlogsQuery request, CancellationToken cancellationToken)
    {

        var blogs = await _blogRepository.GetAllAsync();
        return blogs.Select(blog => new BlogDto
        {
            Id = blog.Id,
            CreatedBy = blog.CreatedBy,
            Description = blog.Description,
            Title = blog.Title,
            ImageUrl = blog.ImageUrl,
            VideoUrl = blog.VideoUrl,
            Tags = blog.Tags,
            CreatedAt = blog.CreatedAt,
        }).ToList();
    }
}