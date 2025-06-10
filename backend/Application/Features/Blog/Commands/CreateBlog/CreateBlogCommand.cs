using MediatR;
using Microsoft.AspNetCore.Http;

public class CreateBlogCommand : IRequest<BlogDto>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public IFormFile ContentFile { get; set; }
    public List<string> Tags { get; set; }

}