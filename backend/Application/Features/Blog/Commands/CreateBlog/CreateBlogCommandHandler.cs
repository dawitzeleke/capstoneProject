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

        string imageUrl = null;
        string videoUrl = null;

        // Handle image upload
        if (request.ImageFile != null)
        {
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ImageFile, "blog/images");
            if (uploadResult == null || string.IsNullOrEmpty(uploadResult.Url))
                throw new Exception("Image upload to Cloudinary failed.");
            imageUrl = uploadResult.Url;
        }

        // Handle video upload
        if (request.VideoFile != null)
        {
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.VideoFile, "blog/videos");
            if (uploadResult == null || string.IsNullOrEmpty(uploadResult.Url))
                throw new Exception("Video upload to Cloudinary failed.");
            videoUrl = uploadResult.Url;
        }
        
        
        var blog = new Blog
        {
            Title = request.Title,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            LikedBy = new List<string>(),
            SavedBy = new List<string>(),
            CreatedBy = userId,
            Description = request.Description,
            Tags = request.Tags,
            ImageUrl = imageUrl,
            VideoUrl = videoUrl
        };

        var createdBlog = await _blogRepository.CreateAsync(blog);

        return new BlogDto
        {
            Id = createdBlog.Id,
            CreatedBy = userId,
            Description = createdBlog.Description,
            Title = createdBlog.Title,
            Tags = createdBlog.Tags,
            CreatedAt = createdBlog.CreatedAt,
            ImageUrl = createdBlog.ImageUrl,
            VideoUrl = createdBlog.VideoUrl
        };
    }
}