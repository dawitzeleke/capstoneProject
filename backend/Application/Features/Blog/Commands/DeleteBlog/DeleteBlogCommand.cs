using MediatR;

public class DeleteBlogCommand : IRequest<bool>
{
    public string Id { get; set; }
}