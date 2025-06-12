using MediatR;
namespace backend.Application.Features.Questions.Commands.RemoveRelatedBlog;

public class RemoveRelatedBlogCommand : IRequest<bool>
{
    public string QuestionId { get; set; }
    public string BlogId { get; set; }
}