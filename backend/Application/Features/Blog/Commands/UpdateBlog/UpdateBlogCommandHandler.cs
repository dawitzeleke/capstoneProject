using backend.Application.Contracts.Services;
using MediatR;

public class UpdateBlogCommandHandler : IRequestHandler<UpdateBlogCommand, BlogDto>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ICloudinaryService _cloudinaryService;

    public UpdateBlogCommandHandler(
        IBlogRepository blogRepository,
        ICurrentUserService currentUserService,
        ICloudinaryService cloudinaryService)
    {
        _blogRepository = blogRepository;
        _currentUserService = currentUserService;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<BlogDto> Handle(UpdateBlogCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException("User ID is missing from token.");

        var blog = await _blogRepository.GetByIdAsync(request.Id);

        if (blog == null)
            throw new Exception($"Blog with ID {request.Id} not found.");

        // Handle image file upload
        if (request.ImageFile != null)
        {
            // Delete old image if public ID exists
            if (!string.IsNullOrWhiteSpace(blog.ImagePublicId))
            {
                await _cloudinaryService.Delete(blog.ImagePublicId);
            }
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ImageFile, "blog/images");
            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("Image upload to Cloudinary failed.");
            blog.ImageUrl = uploadResult.Url;
            blog.ImagePublicId = uploadResult.PublicId;
        }

        // Handle video file upload
        if (request.VideoFile != null)
        {
            // Delete old video if public ID exists
            if (!string.IsNullOrWhiteSpace(blog.VideoPublicId))
            {
                await _cloudinaryService.Delete(blog.VideoPublicId);
            }
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.VideoFile, "blog/videos");
            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("Video upload to Cloudinary failed.");
            blog.VideoUrl = uploadResult.Url;
            blog.VideoPublicId = uploadResult.PublicId;
        }

        
        // Update other fields
        blog.Title = request.Title;
        blog.Description = request.Description;
        blog.UpdatedAt = DateTime.UtcNow;
        blog.Tags = request.Tags;

        var updatedBlog = await _blogRepository.UpdateAsync(blog);

        return new BlogDto
        {
            Id = updatedBlog.Id,
            CreatedBy = userId,
            Description = updatedBlog.Description,
            Title = updatedBlog.Title,
            Tags = updatedBlog.Tags,
            CreatedAt = updatedBlog.CreatedAt,
            ImageUrl = updatedBlog.ImageUrl,
            VideoUrl = updatedBlog.VideoUrl
        };
    }
}
