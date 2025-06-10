using MediatR;

public class LikeBlogCommandHandler : IRequestHandler<LikeBlogCommand, bool>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ICurrentUserService _currentUserService;

    public LikeBlogCommandHandler(IBlogRepository blogRepository, ICurrentUserService currentUserService)
    {
        _blogRepository = blogRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(LikeBlogCommand request, CancellationToken cancellationToken)
    {
        var blog = await _blogRepository.GetByIdAsync(request.BlogId);
        if (blog == null)
        {
            return false; 
        }

        var userId = _currentUserService.UserId;
        if (blog.LikedBy.Contains(userId))
        {
            blog.LikedBy.Remove(userId);
        }
        else
        {
            blog.LikedBy.Add(userId);
        }

        await _blogRepository.UpdateAsync(blog);
        return true;
    }
}