using backend.Application.Contracts.Services;
using MediatR;

public class DeleteBlogCommandHandler : IRequestHandler<DeleteBlogCommand, bool>
{
    private readonly IBlogRepository _blogRepository;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteBlogCommandHandler(IBlogRepository blogRepository, ICurrentUserService currentUserService, ICloudinaryService fileService)
    {
        _blogRepository = blogRepository;
        _currentUserService = currentUserService;
        _cloudinaryService = fileService;
    }

    public async Task<bool> Handle(DeleteBlogCommand request, CancellationToken cancellationToken)
    {
        var blog = await _blogRepository.GetByIdAsync(request.Id);
        if (blog == null)
            return false;

        if (blog.CreatedBy != _currentUserService.UserId)
            return false;

        if (blog.ContentFilePublicId != null)
        {
            var deleted = await _cloudinaryService.Delete(blog.ContentFilePublicId);
            if (!deleted)
                throw new Exception("Failed to delete old content file from Cloudinary.");
        }
        await _blogRepository.DeleteAsync(blog);

        return true;
    }
}