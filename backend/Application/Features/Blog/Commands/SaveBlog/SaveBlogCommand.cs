using MediatR;

public class SaveBlogCommand : IRequest<SaveBlogResponse>
{
    public string BlogId { get; set; }
}