using backend.Application.Contracts.Services;
using MediatR;

public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogDto>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ICloudinaryService _cloudinaryService;

    public CreateBlogCommandHandler(IBlogRepository blogRepository,
        ICurrentUserService currentUserService,
        ICloudinaryService cloudinaryService)
    {
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
        _blogRepository = blogRepository;
    }

    public async Task<BlogDto> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException("User ID is missing from token.");

        string uploadedContentUrl = null;

        if (request.ContentFile != null)
        {
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ContentFile, "blog");

            if (uploadResult == null || string.IsNullOrEmpty(uploadResult.Url))
                throw new Exception("File upload to Cloudinary failed.");

            uploadedContentUrl = uploadResult.Url;
        }

        var blog = new Blog
        {
            Title = request.Title,
            ContentFilePath = uploadedContentUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            LikedBy = new List<string>(),
            SavedBy = new List<string>(),
            CreatedBy = userId,
            Description = request.Description,
            Tags = request.Tags,
        };

        var createdBlog = await _blogRepository.CreateAsync(blog);

        return new BlogDto
        {
            Id = createdBlog.Id,
            CreatedBy = userId,
            Description = createdBlog.Description,
            Title = createdBlog.Title,
            ContentFilePath = createdBlog.ContentFilePath,
            Tags = createdBlog.Tags,
            CreatedAt = createdBlog.CreatedAt,
        };
    }

}