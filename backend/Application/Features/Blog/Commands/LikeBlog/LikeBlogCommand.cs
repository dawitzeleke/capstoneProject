using MediatR;

public class LikeBlogCommand : IRequest<LikeBlogResponse>
{
    public string BlogId { get; set; }
}