using backend.Domain.Enums;
using MediatR;

public class LikeBlogCommandHandler : IRequestHandler<LikeBlogCommand, LikeBlogResponse>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ILikeRepository _likeRepository;
    private readonly ICurrentUserService _currentUserService;

    public LikeBlogCommandHandler(
        IBlogRepository blogRepository,
        ILikeRepository likeRepository,
        ICurrentUserService currentUserService)
    {
        _blogRepository = blogRepository;
        _likeRepository = likeRepository;
        _currentUserService = currentUserService;
    }

    public async Task<LikeBlogResponse> Handle(LikeBlogCommand request, CancellationToken cancellationToken)
    {
        var blog = await _blogRepository.GetByIdAsync(request.BlogId);
        if (blog == null)
        {
            return new LikeBlogResponse
            {
                Success = false,
                Error = "Blog not found",
                BlogId = request.BlogId
            };
        }

        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new LikeBlogResponse
            {
                Success = false,
                Error = "Unauthorized",
                BlogId = request.BlogId
            };
        }

        // Check if the user already liked this blog
        var existingLike = await _likeRepository.GetByUserAndContentAsync(userId, request.BlogId, ContentTypeEnum.Blog);

        bool liked;
        if (existingLike != null)
        {
            // Unlike: remove the like entry
            await _likeRepository.DeleteAsync(existingLike);
            liked = false;
        }
        else
        {
            // Like: create a new like entry
            var newLike = new Like
            {
                UserId = userId,
                ContentId = request.BlogId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _likeRepository.CreateAsync(newLike);
            liked = true;
        }

        // Get the updated like count for this blog
        var likeCount = await _likeRepository.CountByContentAsync(request.BlogId, ContentTypeEnum.Blog);

        return new LikeBlogResponse
        {
            Success = true,
            Liked = liked,
            LikeCount = likeCount,
            BlogId = request.BlogId
        };
    }
}