using MediatR;
using Microsoft.AspNetCore.Http;

public class UpdateBlogCommand : IRequest<BlogDto>
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public IFormFile ContentFile { get; set; }
    public List<string> Tags { get; set; }
}