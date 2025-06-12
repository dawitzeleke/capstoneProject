using backend.Domain.Enums;
using MediatR;

public class SaveBlogCommandHandler : IRequestHandler<SaveBlogCommand, SaveBlogResponse>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ISaveRepository _saveRepository;
    private readonly ICurrentUserService _currentUserService;

    public SaveBlogCommandHandler(
        IBlogRepository blogRepository,
        ISaveRepository saveRepository,
        ICurrentUserService currentUserService)
    {
        _blogRepository = blogRepository;
        _saveRepository = saveRepository;
        _currentUserService = currentUserService;
    }

    public async Task<SaveBlogResponse> Handle(SaveBlogCommand request, CancellationToken cancellationToken)
    {
        var blog = await _blogRepository.GetByIdAsync(request.BlogId);
        if (blog == null)
        {
            return new SaveBlogResponse
            {
                Success = false,
                Error = "Blog not found",
                BlogId = request.BlogId
            };
        }

        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new SaveBlogResponse
            {
                Success = false,
                Error = "Unauthorized",
                BlogId = request.BlogId
            };
        }

        // Check if already saved
        var existingSave = await _saveRepository.GetByUserAndContentAsync(userId, request.BlogId, ContentTypeEnum.Blog);

        bool saved;
        if (existingSave != null)
        {
            // Unsave: remove the save entry
            await _saveRepository.DeleteAsync(existingSave);
            saved = false;
        }
        else
        {
            // Save: create a new save entry
            var newSave = new Save
            {
                UserId = userId,
                ContentId = request.BlogId,
                ContentType = ContentTypeEnum.Blog,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _saveRepository.CreateAsync(newSave);
            saved = true;
        }

        // Get the updated save count for this blog
        var saveCount = await _saveRepository.CountByContentAsync(request.BlogId, ContentTypeEnum.Blog);

        return new SaveBlogResponse
        {
            Success = true,
            Saved = saved,
            SaveCount = saveCount,
            BlogId = request.BlogId
        };
    }
}