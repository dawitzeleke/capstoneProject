using MediatR;

public class LikeBlogCommand : IRequest<bool>
{
    public string BlogId { get; set; }
}