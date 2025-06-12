using backend.Domain.Common;

public class Follow : BaseEntity
{
    public string FollowerId { get; set; }
    public string TeacherId { get; set; }
}