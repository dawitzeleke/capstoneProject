using System.Net.Mime;
using backend.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

public class CreateBlogCommand : IRequest<BlogDto>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public BlogTypeEnum BlogType { get; set; }
    public IFormFile? ContentFile { get; set; }
    public IFormFile? ImageFile { get; set; }    // Added
    public IFormFile? VideoFile { get; set; }    // Added
    public List<string> Tags { get; set; }
}