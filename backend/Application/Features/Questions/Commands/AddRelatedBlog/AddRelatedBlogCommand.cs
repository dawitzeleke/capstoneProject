using MediatR;

public class AddRelatedBlogCommand : IRequest<bool>
{
    public string QuestionId { get; set; }
    public string BlogId { get; set; }
}