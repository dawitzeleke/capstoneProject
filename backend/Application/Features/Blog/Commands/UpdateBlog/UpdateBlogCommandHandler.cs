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

        // Handle file upload
        if (request.ContentFile != null)
        {
            // Delete old file if it exists
            if (!string.IsNullOrWhiteSpace(blog.ContentFilePublicId))
            {
                var deleted = await _cloudinaryService.Delete(blog.ContentFilePublicId);
                if (!deleted)
                    throw new Exception("Failed to delete old content file from Cloudinary.");
            }

            // Upload new file
            var uploadResult = await _cloudinaryService.UploadFileAsync(request.ContentFile, "blog");

            if (uploadResult == null || string.IsNullOrWhiteSpace(uploadResult.Url))
                throw new Exception("File upload to Cloudinary failed.");

            blog.ContentFilePath = uploadResult.Url;
            blog.ContentFilePublicId = uploadResult.PublicId;
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
            ContentFilePath = updatedBlog.ContentFilePath,
            Tags = updatedBlog.Tags,
            CreatedAt = updatedBlog.CreatedAt,
        };
    }
}
